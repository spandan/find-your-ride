"use client";

import type { MapListing } from "@/lib/types";
import {
  formatPreferredContactDisplay,
  getPreferredContactHref,
  getPreferredContactLabel,
  getSharingIntentLabel,
} from "@/lib/listing-display";
import { canShowContactInfo, getMarkerColor } from "@/lib/school";

type ListingHoverCardProps = {
  listing: MapListing;
};

export function ListingHoverCard({ listing }: ListingHoverCardProps) {
  const accent = getMarkerColor(listing.schoolGroup, listing.status);
  const showContact = canShowContactInfo(listing, true);
  const contactValue = showContact ? formatPreferredContactDisplay(listing) : null;
  const contactHref = showContact ? getPreferredContactHref(listing) : null;

  return (
    <div className="listing-hover-card min-w-[10.5rem]">
      <div className="listing-hover-card__accent" style={{ backgroundColor: accent }} />
      <dl className="space-y-2 px-3 py-2.5 text-xs">
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
        {contactValue && contactHref && (
          <div>
            <a
              href={contactHref}
              className="font-medium text-blue-800 hover:underline [x-apple-data-detectors:none]"
            >
              {contactValue}
            </a>
          </div>
        )}
      </dl>
    </div>
  );
}
