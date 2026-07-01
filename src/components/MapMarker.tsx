"use client";

import type { SchoolGroup } from "@/generated/prisma/client";
import type { ListingStatus } from "@/generated/prisma/client";
import { getMarkerColor, getMarkerOpacity, isFoundRideStatus } from "@/lib/school";

const MARKER_SIZE = 12;
const MARKER_SIZE_HOVER = 13;
const MARKER_SIZE_SELECTED = 14;

type MapMarkerProps = {
  schoolGroup: SchoolGroup;
  status: ListingStatus;
  selected: boolean;
  highlighted: boolean;
  hovered: boolean;
};

export function MapMarker({
  schoolGroup,
  status,
  selected,
  hovered,
}: MapMarkerProps) {
  const color = getMarkerColor(schoolGroup, status);
  const opacity = getMarkerOpacity(status);
  const foundRide = isFoundRideStatus(status);
  const size = selected
    ? MARKER_SIZE_SELECTED
    : hovered
      ? MARKER_SIZE_HOVER
      : MARKER_SIZE;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 28, height: 28 }}
    >
      {selected && (
        <span
          className="absolute animate-ping rounded-full opacity-30"
          style={{
            width: size + 6,
            height: size + 6,
            backgroundColor: color,
          }}
        />
      )}
      <span
        className="rounded-full transition-all duration-150"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          opacity,
          boxShadow: selected
            ? "0 0 0 2px #1d4ed8, 0 2px 6px rgb(15 23 42 / 0.35)"
            : foundRide
              ? "0 0 0 2px white, 0 0 0 3px #92400e, 0 1px 4px rgb(15 23 42 / 0.3)"
              : "0 1px 3px rgb(15 23 42 / 0.28)",
        }}
      />
    </div>
  );
}
