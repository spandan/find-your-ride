import type { ListingStatus, SchoolGroup } from "@/generated/prisma/client";

const LOWER_GRADES = new Set(["K", "k", "0", "1", "2", "3", "4", "5"]);
const UPPER_GRADES = new Set(["6", "7", "8", "9", "10", "11", "12"]);

function normalizeGrade(grade: string): string {
  const trimmed = grade.trim().toUpperCase();
  if (trimmed === "K" || trimmed === "KINDERGARTEN") return "K";
  return trimmed.replace(/^GRADE\s*/i, "");
}

/**
 * Derive school group from children's grades.
 * K–5 = Lower, 6–12 = Upper, both = Mixed (drop-off: Lower · pickup: Upper).
 */
export function deriveSchoolGroup(grades: string[]): SchoolGroup {
  const normalized = grades.map(normalizeGrade);
  const hasLower = normalized.some((g) => LOWER_GRADES.has(g));
  const hasUpper = normalized.some((g) => UPPER_GRADES.has(g));

  if (hasLower && hasUpper) return "MIXED";
  if (hasUpper) return "UPPER";
  if (hasLower) return "LOWER";

  return "LOWER";
}

export function isInactiveStatus(status: ListingStatus): boolean {
  return status === "FOUND_RIDE" || status === "DEACTIVATED";
}

export function isFoundRideStatus(status: ListingStatus): boolean {
  return status === "FOUND_RIDE";
}

export function getMarkerColor(
  schoolGroup: SchoolGroup,
  status: ListingStatus
): string {
  if (status === "FOUND_RIDE" || status === "DEACTIVATED") {
    return "#94a3b8";
  }

  switch (schoolGroup) {
    case "LOWER":
      return "#16a34a";
    case "UPPER":
      return "#dc2626";
    case "MIXED":
      return "#2563eb";
  }
}

export function getMarkerOpacity(status: ListingStatus): number {
  if (status === "FOUND_RIDE") return 0.4;
  if (status === "DEACTIVATED") return 0.3;
  return 1;
}

export function isListingActive(status: ListingStatus): boolean {
  return status === "ACTIVE";
}

export function canShowPersonalInfo(
  listing: { showPersonalInfo: boolean; status: ListingStatus },
  isLoggedIn: boolean
): boolean {
  return isLoggedIn && isListingActive(listing.status) && listing.showPersonalInfo;
}

export function canShowContactInfo(
  listing: { showContactInfo: boolean; status: ListingStatus },
  isLoggedIn: boolean
): boolean {
  return isLoggedIn && isListingActive(listing.status) && listing.showContactInfo;
}

export function getSchoolGroupLabel(schoolGroup: SchoolGroup): string {
  switch (schoolGroup) {
    case "LOWER":
      return "K-5";
    case "UPPER":
      return "6-12";
    case "MIXED":
      return "K-12";
  }
}

export function getSchoolGroupBadgeClass(schoolGroup: SchoolGroup): string {
  switch (schoolGroup) {
    case "LOWER":
      return "bg-green-50 text-green-800 border-green-200";
    case "UPPER":
      return "bg-red-50 text-red-800 border-red-200";
    case "MIXED":
      return "bg-blue-50 text-blue-800 border-blue-200";
  }
}

export function getSchoolGroupDotClass(schoolGroup: SchoolGroup): string {
  switch (schoolGroup) {
    case "LOWER":
      return "bg-green-500";
    case "UPPER":
      return "bg-red-500";
    case "MIXED":
      return "bg-blue-600";
  }
}
