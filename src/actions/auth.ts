"use server";

import { revalidatePath } from "next/cache";
import type { PreferredContactMethod } from "@/generated/prisma/client";
import { recordListingCreated } from "@/lib/analytics";
import {
  AGREEMENT_REQUIRED,
  agreementAcceptanceData,
  hasAcceptedCurrentAgreement,
} from "@/lib/agreement";
import { geocodeStreetAddress } from "@/lib/geocode";
import { blurCoordinates } from "@/lib/location";
import { hashPasscode, validatePasscode, verifyPasscode, assertStoredPasscodeIsHashed } from "@/lib/passcode";
import { prisma } from "@/lib/prisma";
import { getClientIpAddress } from "@/lib/request";
import { RESET_IDENTITY_MISMATCH_MESSAGE, SIGNUP_DUPLICATE_NAME_MESSAGE } from "@/lib/constants";
import { getSchoolById } from "@/actions/schools";
import {
  resolveContactEmail,
  validateSignupContact,
} from "@/lib/contact-validation";
import { deriveSchoolGroup } from "@/lib/school";
import {
  clearSession,
  createSession,
  getSession,
} from "@/lib/session";
import type {
  LoginInput,
  ResetPasscodeInput,
  SessionUser,
  SignupInput,
  UpdateProfileInput,
  UserProfile,
} from "@/lib/types";

function normalizeLoginId(loginId: string): string {
  return loginId.trim().toLowerCase();
}

async function findByLoginId(loginId: string) {
  const normalized = normalizeLoginId(loginId);
  return prisma.familyListing.findFirst({
    where: {
      status: { not: "DELETED" },
      OR: [
        { username: normalized },
        { contactEmail: { equals: normalized, mode: "insensitive" } },
      ],
    },
  });
}

async function findByName(firstName: string, lastName: string) {
  const trimmedFirst = firstName.trim();
  const trimmedLast = lastName.trim();
  if (!trimmedFirst || !trimmedLast) {
    return null;
  }

  return prisma.familyListing.findFirst({
    where: {
      status: { not: "DELETED" },
      firstName: { equals: trimmedFirst, mode: "insensitive" },
      lastName: { equals: trimmedLast, mode: "insensitive" },
    },
  });
}

async function findListingForPasscodeReset(input: {
  firstName: string;
  lastName: string;
  loginId: string;
}) {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const loginId = normalizeLoginId(input.loginId);

  if (!firstName || !lastName || !loginId) {
    return null;
  }

  return prisma.familyListing.findFirst({
    where: {
      status: { not: "DELETED" },
      firstName: { equals: firstName, mode: "insensitive" },
      lastName: { equals: lastName, mode: "insensitive" },
      OR: [
        { username: loginId },
        { contactEmail: { equals: loginId, mode: "insensitive" } },
      ],
    },
  });
}

const agreementSelect = {
  agreementAccepted: true,
  agreementVersion: true,
} as const;

function toSessionUser(
  listing: {
    id: string;
    firstName: string;
    schoolId: string;
    schoolName: string;
    status: SessionUser["status"];
    displayLatitude: number;
    displayLongitude: number;
    agreementAccepted: boolean;
    agreementVersion: string | null;
  }
): SessionUser {
  return {
    listingId: listing.id,
    firstName: listing.firstName,
    schoolId: listing.schoolId,
    schoolName: listing.schoolName,
    status: listing.status,
    displayLatitude: listing.displayLatitude,
    displayLongitude: listing.displayLongitude,
    hasAcceptedAgreement: hasAcceptedCurrentAgreement(listing),
  };
}

async function getAuthenticatedListing() {
  const session = await getSession();
  if (!session) return null;

  const listing = await prisma.familyListing.findUnique({
    where: { id: session.listingId },
    select: {
      id: true,
      firstName: true,
      schoolId: true,
      schoolName: true,
      status: true,
      displayLatitude: true,
      displayLongitude: true,
      ...agreementSelect,
    },
  });

  if (!listing || listing.status === "DELETED") {
    await clearSession();
    return null;
  }

  return listing;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const listing = await getAuthenticatedListing();
  if (!listing) return null;
  return toSessionUser(listing);
}

export async function acceptAgreement(): Promise<
  { success: true } | { success: false; error: string }
> {
  const listing = await getAuthenticatedListing();
  if (!listing) {
    return { success: false, error: "Please log in first." };
  }

  if (hasAcceptedCurrentAgreement(listing)) {
    return { success: true };
  }

  const ipAddress = await getClientIpAddress();

  await prisma.familyListing.update({
    where: { id: listing.id },
    data: {
      ...agreementAcceptanceData(),
      agreementIpAddress: ipAddress,
    },
  });

  revalidatePath("/");
  return { success: true };
}

export async function signup(
  input: SignupInput
): Promise<
  | { success: true; lat: number; lng: number; listingId: string }
  | { success: false; error: string }
> {
  if (AGREEMENT_REQUIRED && !input.agreementAccepted) {
    return {
      success: false,
      error: "You must accept the user agreement to create an account.",
    };
  }

  const passcodeError = validatePasscode(input.passcode);
  if (passcodeError) return { success: false, error: passcodeError };

  if (!input.firstName.trim() || !input.lastName.trim()) {
    return { success: false, error: "First and last name are required." };
  }

  const contactError = validateSignupContact(
    input.preferredContactMethod,
    input.contactEmail,
    input.contactPhone,
    input.loginId
  );
  if (contactError) {
    return { success: false, error: contactError };
  }

  const contactEmail = resolveContactEmail(input.contactEmail, input.loginId);
  if (!contactEmail) {
    return {
      success: false,
      error:
        "Contact email is required. Use your login email or enter a contact email.",
    };
  }

  if (!input.streetName.trim() || !input.city.trim() || !input.state.trim()) {
    return { success: false, error: "Street, city, and state are required." };
  }

  if (!input.loginId.trim()) {
    return { success: false, error: "Username or email is required." };
  }

  if (input.grades.length === 0) {
    return { success: false, error: "Please enter at least one grade." };
  }

  if (!input.schoolId?.trim()) {
    return { success: false, error: "Please select a school." };
  }

  const school = await getSchoolById(input.schoolId.trim());
  if (!school) {
    return { success: false, error: "Please select a valid school." };
  }

  const loginId = normalizeLoginId(input.loginId);
  const existing = await findByLoginId(loginId);
  if (existing) {
    return {
      success: false,
      error: "That username or email is already registered. Try logging in.",
    };
  }

  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const existingName = await findByName(firstName, lastName);
  if (existingName) {
    return { success: false, error: SIGNUP_DUPLICATE_NAME_MESSAGE };
  }

  const state = input.state.trim().toUpperCase();
  const locationQuery = `${input.streetName.trim()}, ${input.city.trim()}, ${state}`;
  const geocoded = await geocodeStreetAddress(
    input.streetName,
    input.city,
    state
  );
  if (!geocoded) {
    return {
      success: false,
      error:
        "Could not find that street in that city. Try the full street name (e.g. Main St) and city (e.g. Frisco).",
    };
  }

  const schoolGroup = deriveSchoolGroup(input.grades);
  const passcodeHash = await hashPasscode(input.passcode);
  assertStoredPasscodeIsHashed(passcodeHash, input.passcode);
  const lastInitial = lastName.charAt(0).toUpperCase();
  const ipAddress = await getClientIpAddress();

  const listing = await prisma.familyListing.create({
    data: {
      firstName,
      lastName,
      username: loginId,
      parentDisplayName: `${firstName} ${lastInitial}.`,
      contactEmail,
      contactPhone: input.contactPhone?.trim() || null,
      preferredContactMethod: input.preferredContactMethod,
      streetName: input.streetName.trim(),
      city: input.city.trim(),
      state,
      locationText: locationQuery,
      latitude: geocoded.latitude,
      longitude: geocoded.longitude,
      displayLatitude: geocoded.latitude,
      displayLongitude: geocoded.longitude,
      locationPrecision: "APPROXIMATE",
      showExactLocation: false,
      showPersonalInfo: input.showPersonalInfo ?? true,
      showContactInfo: input.showContactInfo ?? true,
      numberOfKids: input.grades.length,
      grades: input.grades,
      schoolId: school.id,
      schoolName: school.name,
      schoolGroup,
      sharingIntent: input.sharingIntent ?? "BOTH",
      ...agreementAcceptanceData(),
      agreementIpAddress: ipAddress,
      passcodeHash,
      status: "ACTIVE",
    },
  });

  const blurred = blurCoordinates(
    geocoded.latitude,
    geocoded.longitude,
    listing.id
  );
  await prisma.familyListing.update({
    where: { id: listing.id },
    data: {
      displayLatitude: blurred.latitude,
      displayLongitude: blurred.longitude,
    },
  });

  await recordListingCreated();
  await createSession(listing.id);
  revalidatePath("/");
  return {
    success: true,
    lat: blurred.latitude,
    lng: blurred.longitude,
    listingId: listing.id,
  };
}

export async function login(
  input: LoginInput
): Promise<
  | { success: true; lat: number; lng: number; needsAgreement: boolean }
  | { success: false; error: string }
> {
  const passcodeError = validatePasscode(input.passcode);
  if (passcodeError) return { success: false, error: passcodeError };

  const listing = await findByLoginId(input.loginId);
  if (!listing) {
    return { success: false, error: "Invalid username/email or passcode." };
  }

  const valid = await verifyPasscode(input.passcode, listing.passcodeHash);
  if (!valid) {
    return { success: false, error: "Invalid username/email or passcode." };
  }

  await createSession(listing.id);
  revalidatePath("/");
  return {
    success: true,
    lat: listing.displayLatitude,
    lng: listing.displayLongitude,
    needsAgreement: !hasAcceptedCurrentAgreement(listing),
  };
}

export async function logout(): Promise<void> {
  await clearSession();
  revalidatePath("/");
}

export async function resetPasscode(
  input: ResetPasscodeInput
): Promise<{ success: true } | { success: false; error: string }> {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const loginId = input.loginId.trim();

  if (!firstName || !lastName || !loginId) {
    return {
      success: false,
      error: RESET_IDENTITY_MISMATCH_MESSAGE,
    };
  }

  const passcodeError = validatePasscode(input.newPasscode);
  if (passcodeError) return { success: false, error: passcodeError };

  const listing = await findListingForPasscodeReset({
    firstName,
    lastName,
    loginId,
  });
  if (!listing) {
    return { success: false, error: RESET_IDENTITY_MISMATCH_MESSAGE };
  }

  const passcodeHash = await hashPasscode(input.newPasscode);
  assertStoredPasscodeIsHashed(passcodeHash, input.newPasscode);
  await prisma.familyListing.update({
    where: { id: listing.id },
    data: { passcodeHash },
  });

  await createSession(listing.id);
  revalidatePath("/");
  return { success: true };
}

export async function markFoundMyRide(): Promise<
  { success: true } | { success: false; error: string }
> {
  const listing = await getAuthenticatedListing();
  if (!listing) return { success: false, error: "Please log in first." };
  if (!hasAcceptedCurrentAgreement(listing)) {
    return { success: false, error: "Please accept the user agreement to continue." };
  }

  const fullListing = await prisma.familyListing.findUnique({
    where: { id: listing.id },
  });

  if (!fullListing || fullListing.status === "DELETED") {
    return { success: false, error: "Listing not found." };
  }

  if (fullListing.status === "FOUND_RIDE") {
    return { success: false, error: "Already marked as found ride." };
  }

  if (fullListing.status !== "ACTIVE") {
    return { success: false, error: "Listing is not active." };
  }

  await prisma.familyListing.update({
    where: { id: fullListing.id },
    data: { status: "FOUND_RIDE", foundRideAt: new Date() },
  });

  revalidatePath("/");
  return { success: true };
}

export async function deactivateMyListing(): Promise<
  { success: true } | { success: false; error: string }
> {
  const listing = await getAuthenticatedListing();
  if (!listing) return { success: false, error: "Please log in first." };
  if (!hasAcceptedCurrentAgreement(listing)) {
    return { success: false, error: "Please accept the user agreement to continue." };
  }

  const fullListing = await prisma.familyListing.findUnique({
    where: { id: listing.id },
  });

  if (!fullListing || fullListing.status === "DELETED") {
    return { success: false, error: "Listing not found." };
  }

  if (fullListing.status === "DEACTIVATED") {
    return { success: false, error: "Listing is already deactivated." };
  }

  await prisma.familyListing.update({
    where: { id: fullListing.id },
    data: { status: "DEACTIVATED", deactivatedAt: new Date() },
  });

  revalidatePath("/");
  return { success: true };
}

export async function getMyProfile(): Promise<UserProfile | null> {
  const listing = await getAuthenticatedListing();
  if (!listing) return null;
  if (!hasAcceptedCurrentAgreement(listing)) return null;

  const profile = await prisma.familyListing.findUnique({
    where: { id: listing.id },
    select: {
      firstName: true,
      lastName: true,
      username: true,
      contactEmail: true,
      contactPhone: true,
      preferredContactMethod: true,
      showPersonalInfo: true,
      showContactInfo: true,
      status: true,
    },
  });

  if (!profile || profile.status === "DELETED") {
    await clearSession();
    return null;
  }

  return profile;
}

export async function updateMyProfile(
  input: UpdateProfileInput
): Promise<{ success: true } | { success: false; error: string }> {
  const listing = await getAuthenticatedListing();
  if (!listing) return { success: false, error: "Please log in first." };
  if (!hasAcceptedCurrentAgreement(listing)) {
    return { success: false, error: "Please accept the user agreement to continue." };
  }

  const existing = await prisma.familyListing.findUnique({
    where: { id: listing.id },
    select: { id: true, username: true, status: true },
  });

  if (!existing || existing.status === "DELETED") {
    return { success: false, error: "Listing not found." };
  }

  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  if (!firstName || !lastName) {
    return { success: false, error: "First and last name are required." };
  }

  const contactError = validateSignupContact(
    input.preferredContactMethod,
    input.contactEmail,
    input.contactPhone,
    existing.username
  );
  if (contactError) {
    return { success: false, error: contactError };
  }

  const contactEmail = resolveContactEmail(input.contactEmail, existing.username);
  if (!contactEmail) {
    return {
      success: false,
      error:
        "Contact email is required. Use your login email or enter a contact email.",
    };
  }

  const nameConflict = await prisma.familyListing.findFirst({
    where: {
      status: { not: "DELETED" },
      firstName: { equals: firstName, mode: "insensitive" },
      lastName: { equals: lastName, mode: "insensitive" },
      NOT: { id: existing.id },
    },
  });
  if (nameConflict) {
    return { success: false, error: SIGNUP_DUPLICATE_NAME_MESSAGE };
  }

  const lastInitial = lastName.charAt(0).toUpperCase();
  await prisma.familyListing.update({
    where: { id: existing.id },
    data: {
      firstName,
      lastName,
      parentDisplayName: `${firstName} ${lastInitial}.`,
      contactEmail,
      contactPhone: input.contactPhone?.trim() || null,
      preferredContactMethod: input.preferredContactMethod,
      showPersonalInfo: input.showPersonalInfo,
      showContactInfo: input.showContactInfo,
    },
  });

  revalidatePath("/");
  return { success: true };
}