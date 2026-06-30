"use client";

import type { DistanceMiles } from "@/lib/filters";

type EmptyStateProps = {
  distanceMiles: DistanceMiles;
  onExpandRadius: (miles: DistanceMiles) => void;
  onAddFamily: () => void;
};

export function EmptyState({
  distanceMiles,
  onExpandRadius,
  onAddFamily,
}: EmptyStateProps) {
  const expansions = ([1, 2, 5] as const).filter((m) => m > distanceMiles);

  return (
    <div className="card p-5 text-center">
      <p className="text-sm font-semibold text-slate-900">
        No nearby families found within {distanceMiles} mile{distanceMiles === 1 ? "" : "s"}.
      </p>
      <p className="mt-1 text-xs text-slate-500">Try expanding your search radius.</p>
      {expansions.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
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
      )}
      <p className="mt-4 text-xs text-slate-500">Or be the first parent in your area.</p>
      <button type="button" onClick={onAddFamily} className="btn-primary mt-3 w-full">
        Add My Family
      </button>
    </div>
  );
}
