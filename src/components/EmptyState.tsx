"use client";

import type { DistanceMiles } from "@/lib/filters";

type EmptyStateProps = {
  distanceMiles: DistanceMiles;
  onExpandRadius: (miles: DistanceMiles) => void;
};

export function EmptyState({
  distanceMiles,
  onExpandRadius,
}: EmptyStateProps) {
  const expansions = ([1, 2, 5] as const).filter((m) => m > distanceMiles);

  return (
    <div className="card p-5 text-center">
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
  );
}
