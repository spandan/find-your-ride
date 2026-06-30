"use client";

import type { SchoolGroup } from "@/generated/prisma/client";
import type { ListingStatus } from "@/generated/prisma/client";
import { getMarkerColor, getMarkerOpacity } from "@/lib/school";

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
  highlighted,
  hovered,
}: MapMarkerProps) {
  const color = getMarkerColor(schoolGroup, status);
  const opacity = getMarkerOpacity(status);
  const size = selected ? 20 : hovered ? 18 : 16;

  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-200 ${
        selected ? "scale-110" : hovered ? "scale-105" : ""
      }`}
      style={{ width: 48, height: 48 }}
    >
      {selected && (
        <span
          className="absolute inset-1 animate-ping rounded-full opacity-25"
          style={{ backgroundColor: color }}
        />
      )}
      <span
        className="relative flex items-center justify-center rounded-full bg-white transition-shadow duration-200"
        style={{
          width: size + 14,
          height: size + 14,
          opacity,
          border: "3px solid white",
          boxShadow: selected
            ? `0 0 0 3px #1d4ed8, 0 8px 20px rgb(15 23 42 / 0.28)`
            : highlighted
              ? `0 0 0 2px #93c5fd, 0 4px 14px rgb(15 23 42 / 0.22)`
              : hovered
                ? "0 6px 16px rgb(15 23 42 / 0.24)"
                : "0 3px 10px rgb(15 23 42 / 0.18)",
        }}
      >
        <span
          className="rounded-full transition-all duration-200"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
          }}
        />
      </span>
    </div>
  );
}
