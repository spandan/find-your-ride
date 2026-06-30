"use client";

import type { ListingWithDistance } from "@/lib/filters";
import { formatApproximateLocation } from "@/lib/filters";
import { formatDistance } from "@/lib/location";
import {
  getMarkerColor,
  getSchoolGroupDotClass,
  getSchoolGroupLabel,
  isFoundRideStatus,
} from "@/lib/school";

const CONTACT_SHORT: Record<string, string> = {
  EMAIL: "Email",
  PHONE: "Phone",
  TEXT: "Text",
  WHATSAPP: "WhatsApp",
};

type FamilyCardProps = {
  listing: ListingWithDistance;
  selected: boolean;
  onSelect: () => void;
};

export function FamilyCard({ listing, selected, onSelect }: FamilyCardProps) {
  const foundRide = isFoundRideStatus(listing.status);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`family-card w-full text-left ${selected ? "family-card-selected" : ""}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 h-3 w-3 shrink-0 rounded-full ring-2 ring-white shadow-sm ${getSchoolGroupDotClass(listing.schoolGroup)}`}
          style={
            foundRide
              ? { backgroundColor: getMarkerColor(listing.schoolGroup, listing.status) }
              : undefined
          }
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">
              {getSchoolGroupLabel(listing.schoolGroup)}
            </p>
            <span className="shrink-0 text-xs font-medium text-blue-700">
              {formatDistance(listing.distanceMiles)}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            {formatApproximateLocation(listing)}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600">
            <span className="rounded-md bg-slate-100 px-2 py-0.5">
              {listing.numberOfKids} {listing.numberOfKids === 1 ? "kid" : "kids"}
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5">
              Pickup: {listing.pickupTimePreference}
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5">
              {CONTACT_SHORT[listing.preferredContactMethod]}
            </span>
            {foundRide && (
              <span className="rounded-md bg-slate-200 px-2 py-0.5 text-slate-600">
                Found ride
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
