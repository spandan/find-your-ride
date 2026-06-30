"use client";

import { DEFAULT_SCHOOL_NAME } from "@/lib/constants";
import type { DistanceMiles } from "@/lib/filters";

type EmptyStateProps = {
  distanceMiles: DistanceMiles;
  totalListings: number;
  isLoggedIn: boolean;
  onExpandRadius: (miles: DistanceMiles) => void;
  onAddFamily: () => void;
};

export function EmptyState({
  distanceMiles,
  totalListings,
  isLoggedIn,
  onExpandRadius,
  onAddFamily,
}: EmptyStateProps) {
  const isLaunching = totalListings === 0;
  const expansions = ([1, 2, 5] as const).filter((m) => m > distanceMiles);

  if (isLaunching) {
    return (
      <div className="card p-5 text-center">
        <p className="text-sm font-semibold text-slate-900">
          We&apos;re just getting started
        </p>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          Thank you for being among the first families at {DEFAULT_SCHOOL_NAME}.
          {isLoggedIn
            ? " Check back soon as more neighbors join."
            : " Add your family, then check back as the community grows."}
        </p>
        {!isLoggedIn && (
          <button type="button" onClick={onAddFamily} className="btn-primary mt-4 w-full">
            Add My Family
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="card p-5 text-center">
      <p className="text-sm font-semibold text-slate-900">
        No families in this area yet
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Try expanding your search radius to see nearby families.
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
              Search {miles} mi
            </button>
          ))}
        </div>
      )}
      {!isLoggedIn && (
        <button type="button" onClick={onAddFamily} className="btn-subtle mt-4 w-full">
          Add My Family
        </button>
      )}
    </div>
  );
}
