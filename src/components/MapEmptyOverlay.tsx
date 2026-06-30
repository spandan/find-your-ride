"use client";

import type { DistanceMiles } from "@/lib/filters";

type MapEmptyOverlayProps = {
  distanceMiles: DistanceMiles;
  onExpandRadius: (miles: DistanceMiles) => void;
  onAddFamily: () => void;
};

export function MapEmptyOverlay({
  distanceMiles,
  onExpandRadius,
  onAddFamily,
}: MapEmptyOverlayProps) {
  const expansions = ([1, 2, 5] as const).filter((m) => m > distanceMiles);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-6">
      <div className="pointer-events-auto max-w-sm rounded-2xl border border-slate-200 bg-white/95 p-6 text-center shadow-lg backdrop-blur-sm">
        <p className="text-sm font-semibold text-slate-900">
          No nearby families were found within your selected distance.
        </p>
        {expansions.length > 0 && (
          <>
            <p className="mt-2 text-xs text-slate-500">Expand search?</p>
            <div className="mt-3 flex justify-center gap-2">
              {expansions.map((miles) => (
                <button
                  key={miles}
                  type="button"
                  onClick={() => onExpandRadius(miles)}
                  className="btn-secondary px-4 py-2 text-xs"
                >
                  {miles} Miles
                </button>
              ))}
            </div>
          </>
        )}
        <p className="mt-4 text-xs text-slate-500">
          Or be the first parent in your neighborhood.
        </p>
        <button
          type="button"
          onClick={onAddFamily}
          className="btn-subtle mt-3 w-full px-4 py-2 text-sm"
        >
          Add My Family
        </button>
      </div>
    </div>
  );
}
