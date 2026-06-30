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
    <div className="flex justify-start" aria-label="Map legend">
      <div className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-slate-200/80 bg-white/95 px-2.5 py-2 shadow-md backdrop-blur-sm sm:gap-x-4 sm:px-3">
        {LEGEND_ITEMS.map(({ group, label }) => (
          <span
            key={group}
            className="inline-flex items-center gap-1.5 text-[11px] text-slate-700 sm:text-xs"
          >
            <span
              className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white shadow-sm"
              style={{ backgroundColor: getMarkerColor(group, "ACTIVE") }}
              aria-hidden
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
