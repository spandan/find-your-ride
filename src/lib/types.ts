import type {
  ListingStatus,
  PreferredContactMethod,
  SchoolGroup,
  SharingIntent,
} from "@/generated/prisma/client";

/** Public map listing — sensitive fields gated by privacy flags + auth */
export type MapListing = {
  id: string;
  parentDisplayName: string;
  contactEmail: string;
  contactPhone: string | null;
  preferredContactMethod: PreferredContactMethod;
  schoolId: string;
  schoolName: string;
  schoolGroup: SchoolGroup;
  status: ListingStatus;
  streetName: string;
  city: string;
  numberOfKids: number;
  pickupTimePreference: string;
  dropoffTimePreference: string;
  sharingIntent: SharingIntent;
  showPersonalInfo: boolean;
  showContactInfo: boolean;
  notes: string | null;
  displayLatitude: number;
  displayLongitude: number;
};

export type CommunityStats = {
  activeFamilies: number;
  foundRideFamilies: number;
};

export type SessionUser = {
  listingId: string;
  firstName: string;
  schoolId: string;
  schoolName: string;
  status: ListingStatus;
  displayLatitude: number;
  displayLongitude: number;
  hasAcceptedAgreement: boolean;
};

export type SignupInput = {
  firstName: string;
  lastName: string;
  contactEmail: string;
  contactPhone?: string;
  preferredContactMethod: PreferredContactMethod;
  grades: string[];
  schoolId: string;
  streetName: string;
  city: string;
  state: string;
  sharingIntent?: SharingIntent;
  showPersonalInfo?: boolean;
  showContactInfo?: boolean;
  loginId: string;
  passcode: string;
  agreementAccepted: boolean;
};

export type LoginInput = {
  loginId: string;
  passcode: string;
};

export type ResetPasscodeInput = {
  firstName: string;
  lastName: string;
  loginId: string;
  newPasscode: string;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  username: string;
  contactEmail: string;
  contactPhone: string | null;
  preferredContactMethod: PreferredContactMethod;
  showPersonalInfo: boolean;
  showContactInfo: boolean;
  status: ListingStatus;
  grades: string[];
  streetName: string;
  city: string;
  state: string;
  sharingIntent: SharingIntent;
};

export type UpdateProfileInput = {
  firstName: string;
  lastName: string;
  contactEmail: string;
  contactPhone?: string;
  preferredContactMethod: PreferredContactMethod;
  showPersonalInfo: boolean;
  showContactInfo: boolean;
  grades: string[];
  streetName: string;
  city: string;
  state: string;
  sharingIntent: SharingIntent;
  reactivate?: boolean;
};

export type GeocodeResult = {
  latitude: number;
  longitude: number;
  displayName: string;
};
