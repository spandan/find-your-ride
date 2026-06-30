import type { PreferredContactMethod, SchoolGroup, SharingIntent } from "@/generated/prisma/client";
import { DEFAULT_SCHOOL_ID } from "@/lib/schools";
import { calculateDistance } from "@/lib/location";
import type { MapListing } from "@/lib/types";

export type MapFilters = {
  schoolId: string;
  schoolGroups: Record<SchoolGroup, boolean>;
  showFoundRide: boolean;
  showDeactivated: boolean;
  availability: {
    pickup: boolean;
    dropoff: boolean;
    both: boolean;
  };
  contactMethods: Record<PreferredContactMethod, boolean>;
};

const BASE_FILTERS: Omit<MapFilters, "schoolId"> = {
  schoolGroups: { LOWER: true, UPPER: true, MIXED: true },
  showFoundRide: true,
  showDeactivated: false,
  availability: { pickup: true, dropoff: true, both: true },
  contactMethods: { EMAIL: true, PHONE: true, TEXT: true, WHATSAPP: true },
};

export function buildDefaultFilters(schoolId: string = DEFAULT_SCHOOL_ID): MapFilters {
  return { ...BASE_FILTERS, schoolId };
}

export const DEFAULT_FILTERS: MapFilters = buildDefaultFilters();

export type ListingWithDistance = MapListing & { distanceMiles: number };

export const SEARCH_MAP_ZOOM = 14;
export const USER_LOCATION_MAP_ZOOM = 14;

export function formatApproximateLocation(listing: MapListing): string {
  if (listing.streetName) {
    return `${listing.streetName} area, ${listing.city}`;
  }
  return `${listing.city} area`;
}

function matchesAvailability(
  intent: SharingIntent,
  availability: MapFilters["availability"]
): boolean {
  const { pickup, dropoff, both } = availability;
  if (!pickup && !dropoff && !both) return true;

  if (intent === "PICKUP" && pickup) return true;
  if (intent === "DROPOFF" && dropoff) return true;
  if (intent === "BOTH" && (both || (pickup && dropoff))) return true;

  return false;
}

export function filterListings(
  listings: MapListing[],
  origin: { lat: number; lng: number },
  filters: MapFilters
): ListingWithDistance[] {
  return listings
    .map((listing) => ({
      ...listing,
      distanceMiles: calculateDistance(
        origin.lat,
        origin.lng,
        listing.displayLatitude,
        listing.displayLongitude
      ),
    }))
    .filter((listing) => {
      if (listing.schoolId !== filters.schoolId) return false;

      if (listing.status === "FOUND_RIDE" && !filters.showFoundRide) return false;
      if (listing.status === "DEACTIVATED" && !filters.showDeactivated) return false;

      if (!filters.schoolGroups[listing.schoolGroup]) return false;

      if (!filters.contactMethods[listing.preferredContactMethod]) return false;

      if (!matchesAvailability(listing.sharingIntent, filters.availability)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => a.distanceMiles - b.distanceMiles);
}
