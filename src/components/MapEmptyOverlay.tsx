"use client";

import type { DistanceMiles } from "@/lib/filters";

type MapEmptyOverlayProps = {
  distanceMiles: DistanceMiles;
  onExpandRadius: (miles: DistanceMiles) => void;
};

export function MapEmptyOverlay({
  distanceMiles,
  onExpandRadius,
}: MapEmptyOverlayProps) {
  const expansions = ([1, 2, 5] as const).filter((m) => m > distanceMiles);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-6">
      <div className="pointer-events-auto max-w-sm rounded-2xl border border-slate-200/80 bg-white/95 px-5 py-5 text-center shadow-lg backdrop-blur-sm">
        <p className="text-sm leading-relaxed text-slate-700">
          No families in your search zone yet — try expanding your search radius.
        </p>
        {expansions.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {expansions.map((miles) => (
              <button
                key={miles}
                type="button"
                onClick={() => onExpandRadius(miles)}
                className="btn-secondary px-4 py-2 text-xs"
              >
                Expand to {miles} mi
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
