"use client";

import { getMarkerColor } from "@/lib/school";
import type { SchoolGroup } from "@/generated/prisma/client";

const LEGEND_ITEMS: { group: SchoolGroup; label: string }[] = [
  { group: "LOWER", label: "K-5" },
  { group: "UPPER", label: "6-12" },
  { group: "MIXED", label: "K-12" },
];

export function MapLegend() {
  return (
    <div className="map-overlay-card map-legend-card" aria-label="Map legend">
      <ul className="flex flex-row flex-wrap gap-x-3 gap-y-1 sm:flex-col sm:gap-1.5">
        {LEGEND_ITEMS.map(({ group, label }) => (
          <li key={group} className="flex items-center gap-2 text-xs text-slate-700">
            <span
              className="h-3 w-3 shrink-0 rounded-full shadow-sm"
              style={{ backgroundColor: getMarkerColor(group, "ACTIVE") }}
              aria-hidden
            />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
