"use client";

import { getMarkerColor } from "@/lib/school";
import type { SchoolGroup } from "@/generated/prisma/client";

const LEGEND_ITEMS: { group: SchoolGroup; label: string }[] = [
  { group: "LOWER", label: "Lower School (K–5)" },
  { group: "UPPER", label: "Upper School (6–12)" },
  {
    group: "MIXED",
    label: "Mixed siblings (drop-off Lower · pickup Upper)",
  },
];

export function MapLegend() {
  return (
    <div
      className="map-legend pointer-events-none absolute left-3 top-3 z-10 sm:left-4 sm:top-4"
      aria-label="Map legend"
    >
      <div className="max-w-[13.5rem] rounded-xl border border-slate-200/80 bg-white/95 px-3 py-2.5 shadow-md backdrop-blur-sm sm:max-w-xs">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          Map dots
        </p>
        <ul className="space-y-1.5">
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
    </div>
  );
}
