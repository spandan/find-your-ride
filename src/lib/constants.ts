export const DEFAULT_MAP_CENTER = {
  lat: 33.1507,
  lng: -96.8236,
  zoom: 12,
};

/** OpenFreeMap vector style — free, no API key (MapLibre GL) */
export const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

export const DEFAULT_SCHOOL_NAME =
  "Imagine International Academy of North Texas";

export { DEFAULT_SCHOOL_ID, SEED_SCHOOLS } from "@/lib/schools";

/** Example shown in the address search placeholder */
export const SAMPLE_SEARCH_ADDRESS = "123 Main St, Frisco, TX 75034";

export const CONTACT_EMAIL = "info@asterteksolutions.com";

export const RESET_IDENTITY_MISMATCH_MESSAGE = `We couldn't verify your first name, last name, and username or email. Please contact us at ${CONTACT_EMAIL} for help resetting your passcode.`;

export type MapCenter = {
  lat: number;
  lng: number;
  zoom: number;
};

export const SCHOOL_HOURS = {
  LOWER: {
    label: "Lower School (K–5)",
    schedule: {
      weekdays: "M/T/Th/F: 7:30 AM – 3:15 PM",
      wednesday: "Wednesday: 7:30 AM – 11:45 AM",
      pickupDeadline: "3:35 PM M/T/Th/F, 12:05 PM Wednesday",
      gracePeriodEnds: "3:45 PM M/T/Th/F, 12:15 PM Wednesday",
    },
    markerColor: "#22c55e",
  },
  UPPER: {
    label: "Upper School (6–12)",
    note: "Lower School students with Upper School siblings follow the Upper School pickup schedule.",
    schedule: {
      weekdays: "M/T/Th/F: 8:00 AM – 3:45 PM",
      wednesday: "Wednesday: 8:00 AM – 12:15 PM",
      pickupDeadline: "4:05 PM M/T/Th/F, 12:35 PM Wednesday",
      gracePeriodEnds: "4:15 PM M/T/Th/F, 12:45 PM Wednesday",
    },
    markerColor: "#ef4444",
  },
} as const;

export const CONTACT_METHODS = [
  { value: "EMAIL", label: "Email" },
  { value: "PHONE", label: "Phone call" },
  { value: "TEXT", label: "Text message" },
  { value: "WHATSAPP", label: "WhatsApp" },
] as const;

export const LOCATION_TYPES = [
  { value: "INTERSECTION", label: "Intersection" },
  { value: "EXACT", label: "Full address" },
  { value: "APPROXIMATE", label: "Approximate neighborhood" },
] as const;

export const DISTANCE_OPTIONS = [1, 2, 5, 10, 25] as const;

export const TIME_COMPATIBILITY_MINUTES = 15;

export const SAFETY_DISCLAIMER =
  "This tool helps parents find nearby pickup/drop-off partners. Always verify identity independently and coordinate safely. Never share children's personal information with unverified contacts.";

export const FOUND_RIDE_BADGE_LABEL = "✓ Found Ride";

export const FOUND_RIDE_CONFIRMATION =
  "Congratulations! We're glad you found a pickup partner. Your listing will appear as inactive to help other parents know you're no longer looking. You can reactivate it anytime using your passcode.";

export const DELETE_CONFIRMATION =
  "Your listing will be removed from the public map. Thank you for being part of the community.";

export const FOUND_RIDE_POPUP_MESSAGE =
  "This family has already found a pickup partner and is no longer actively looking.";
