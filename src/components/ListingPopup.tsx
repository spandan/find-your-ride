"use client";

import type { MapListing } from "@/lib/types";
import {
  formatPreferredContactDisplay,
  getPreferredContactHref,
  getPreferredContactLabel,
  getSharingIntentLabel,
} from "@/lib/listing-display";
import {
  canShowContactInfo,
  getMarkerColor,
  isListingActive,
} from "@/lib/school";

type ListingPopupProps = {
  listing: MapListing;
  isLoggedIn: boolean;
  onLogin: () => void;
};

export function ListingPopup({ listing, isLoggedIn, onLogin }: ListingPopupProps) {
  const accent = getMarkerColor(listing.schoolGroup, listing.status);
  const active = isListingActive(listing.status);
  const showContact = canShowContactInfo(listing, isLoggedIn);
  const contactValue = formatPreferredContactDisplay(listing);
  const contactHref = getPreferredContactHref(listing);

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
              <dt className="meta-label">Looking for</dt>
              <dd className="font-medium text-slate-900">
                {getSharingIntentLabel(listing.sharingIntent)}
              </dd>
            </div>
            <div>
              <dt className="meta-label">Preferred contact</dt>
              <dd className="font-medium text-slate-900">
                {getPreferredContactLabel(listing.preferredContactMethod)}
              </dd>
            </div>
            {contactValue && contactHref ? (
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <a
                  href={contactHref}
                  className="block text-sm font-medium text-blue-800 hover:underline [x-apple-data-detectors:none]"
                >
                  {contactValue}
                </a>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Contact details not available for this method.
              </p>
            )}
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
