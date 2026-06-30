"use server";

import { getCurrentUser } from "@/actions/auth";
import { geocodeLocation } from "@/lib/geocode";
import { deriveSchoolGroup } from "@/lib/school";
import { prisma } from "@/lib/prisma";
import type { CommunityStats, MapListing } from "@/lib/types";

const VISIBLE_STATUSES = ["ACTIVE", "FOUND_RIDE", "DEACTIVATED"] as const;

const listingSelect = {
  id: true,
  parentDisplayName: true,
  contactEmail: true,
  contactPhone: true,
  preferredContactMethod: true,
  schoolId: true,
  schoolName: true,
  schoolGroup: true,
  status: true,
  streetName: true,
  city: true,
  numberOfKids: true,
  pickupTimePreference: true,
  dropoffTimePreference: true,
  sharingIntent: true,
  showPersonalInfo: true,
  showContactInfo: true,
  notes: true,
  displayLatitude: true,
  displayLongitude: true,
  grades: true,
} as const;

function toMapListing(
  row: Awaited<
    ReturnType<
      typeof prisma.familyListing.findMany<{ select: typeof listingSelect }>
    >
  >[number]
): MapListing {
  const { grades, ...listing } = row;
  return {
    ...listing,
    schoolGroup: deriveSchoolGroup(grades),
  };
}

async function resolveSchoolScope(requestedSchoolId?: string): Promise<string | null> {
  const user = await getCurrentUser();
  if (user) return user.schoolId;
  return requestedSchoolId?.trim() || null;
}

export async function getMapListings(
  requestedSchoolId?: string
): Promise<MapListing[]> {
  const schoolId = await resolveSchoolScope(requestedSchoolId);
  if (!schoolId) return [];

  return prisma.familyListing
    .findMany({
      where: {
        status: { in: [...VISIBLE_STATUSES] },
        schoolId,
      },
      select: listingSelect,
    })
    .then((rows) => rows.map(toMapListing));
}

export async function getCommunityStats(
  requestedSchoolId?: string
): Promise<CommunityStats> {
  const schoolId = await resolveSchoolScope(requestedSchoolId);
  if (!schoolId) {
    return { activeFamilies: 0, foundRideFamilies: 0 };
  }

  const [activeFamilies, foundRideFamilies] = await Promise.all([
    prisma.familyListing.count({
      where: { status: "ACTIVE", schoolId },
    }),
    prisma.familyListing.count({
      where: { status: "FOUND_RIDE", schoolId },
    }),
  ]);

  return { activeFamilies, foundRideFamilies };
}

export async function geocodeSearch(
  query: string
): Promise<
  | { success: true; lat: number; lng: number; displayName: string }
  | { success: false; error: string }
> {
  const result = await geocodeLocation(query);
  if (!result) {
    return { success: false, error: "Location not found. Try a different search." };
  }
  return {
    success: true,
    lat: result.latitude,
    lng: result.longitude,
    displayName: result.displayName,
  };
}
