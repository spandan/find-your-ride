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
    <div className="map-overlay-card flex-col items-stretch gap-0 py-2.5" aria-label="Map legend">
      <ul className="flex flex-col gap-1.5">
        {LEGEND_ITEMS.map(({ group, label }) => (
          <li key={group} className="flex items-center gap-2 text-xs text-slate-700">
            <span
              className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white shadow-sm"
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
