import type {
  PreferredContactMethod,
  SharingIntent,
} from "@/generated/prisma/client";
import type { MapListing } from "@/lib/types";
import { displayPhoneNumber, phoneTelHref } from "@/lib/phone";

export function getSharingIntentLabel(intent: SharingIntent): string {
  switch (intent) {
    case "PICKUP":
      return "Pickup";
    case "DROPOFF":
      return "Drop-off";
    case "BOTH":
      return "Pickup & drop-off";
  }
}

export function getPreferredContactLabel(method: PreferredContactMethod): string {
  switch (method) {
    case "EMAIL":
      return "Email";
    case "PHONE":
      return "Phone";
    case "TEXT":
      return "Text";
    case "WHATSAPP":
      return "WhatsApp";
  }
}

export function preferredMethodUsesPhone(
  method: PreferredContactMethod
): boolean {
  return method !== "EMAIL";
}

type ListingContactFields = Pick<
  MapListing,
  "contactEmail" | "contactPhone" | "preferredContactMethod"
>;

export function getPreferredContactValue(
  listing: ListingContactFields
): string | null {
  if (listing.preferredContactMethod === "EMAIL") {
    return listing.contactEmail || null;
  }
  return listing.contactPhone || null;
}

export function getPreferredContactHref(
  listing: ListingContactFields
): string | null {
  const value = getPreferredContactValue(listing);
  if (!value) return null;

  if (listing.preferredContactMethod === "EMAIL") {
    return `mailto:${value}`;
  }
  return phoneTelHref(value);
}

export function formatPreferredContactDisplay(
  listing: ListingContactFields
): string | null {
  const value = getPreferredContactValue(listing);
  if (!value) return null;

  if (listing.preferredContactMethod === "EMAIL") {
    return value;
  }
  return displayPhoneNumber(value);
}
