"use client";

import type { PreferredContactMethod } from "@/generated/prisma/client";
import type { MapListing } from "@/lib/types";
import { displayPhoneNumber, phoneTelHref } from "@/lib/phone";
import {
  canShowContactInfo,
  getMarkerColor,
  isListingActive,
} from "@/lib/school";

const CONTACT_LABELS: Record<PreferredContactMethod, string> = {
  EMAIL: "Email",
  PHONE: "Phone call",
  TEXT: "Text message",
  WHATSAPP: "WhatsApp",
};

type ListingPopupProps = {
  listing: MapListing;
  isLoggedIn: boolean;
  onLogin: () => void;
};

export function ListingPopup({ listing, isLoggedIn, onLogin }: ListingPopupProps) {
  const accent = getMarkerColor(listing.schoolGroup, listing.status);
  const active = isListingActive(listing.status);
  const showContact = canShowContactInfo(listing, isLoggedIn);

  return (
    <div className="listing-popup">
      <div className="listing-popup-accent" style={{ backgroundColor: accent }} />
      <div className="listing-popup-body">
        {!active && (
          <p className="text-sm font-medium text-slate-600">
            {listing.status === "FOUND_RIDE" ? "Found a ride" : "Not currently looking"}
          </p>
        )}

        {showContact ? (
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="meta-label">Preferred Contact</dt>
              <dd className="font-medium text-slate-900">
                {CONTACT_LABELS[listing.preferredContactMethod]}
              </dd>
            </div>
            <div className="space-y-1.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <a
                href={`mailto:${listing.contactEmail}`}
                className="block text-sm font-medium text-blue-800 hover:underline"
              >
                {listing.contactEmail}
              </a>
              {listing.contactPhone && (
                <a
                  href={phoneTelHref(listing.contactPhone)}
                  className="block text-sm font-medium text-blue-800 hover:underline [x-apple-data-detectors:none]"
                >
                  {displayPhoneNumber(listing.contactPhone)}
                </a>
              )}
            </div>
          </dl>
        ) : isLoggedIn && active ? (
          <p className="text-sm leading-relaxed text-slate-600">
            This parent prefers to share contact information after initial communication.
          </p>
        ) : active ? (
          <div className="text-center">
            <p className="text-sm text-slate-600">
              Log in to view contact information for this family.
            </p>
            <button type="button" onClick={onLogin} className="btn-primary mt-3 w-full">
              Login
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
