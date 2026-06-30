"use client";

import { DEFAULT_SCHOOL_NAME } from "@/lib/constants";
import type { DistanceMiles } from "@/lib/filters";

type MapEmptyOverlayProps = {
  distanceMiles: DistanceMiles;
  totalListings: number;
  isLoggedIn: boolean;
  onExpandRadius: (miles: DistanceMiles) => void;
  onAddFamily: () => void;
};

function CommunityIcon() {
  return (
    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-800">
      <svg
        aria-hidden
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
        />
      </svg>
    </div>
  );
}

export function MapEmptyOverlay({
  distanceMiles,
  totalListings,
  isLoggedIn,
  onExpandRadius,
  onAddFamily,
}: MapEmptyOverlayProps) {
  const isLaunching = totalListings === 0;
  const expansions = ([1, 2, 5] as const).filter((m) => m > distanceMiles);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-6">
      <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/95 px-6 py-7 text-center shadow-xl backdrop-blur-sm">
        <CommunityIcon />

        {isLaunching ? (
          <>
            <p className="text-lg font-semibold tracking-tight text-slate-900">
              We&apos;re just getting started
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Thank you for being among the first families to explore ride
              sharing at {DEFAULT_SCHOOL_NAME}. We&apos;re building a trusted
              neighborhood network for school pickups.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {isLoggedIn
                ? "You're on the map — please check back soon as more families join, and feel free to tell other school families you know."
                : "Add your family to help neighbors connect, then check back soon as more families join."}
            </p>
            {!isLoggedIn && (
              <button
                type="button"
                onClick={onAddFamily}
                className="btn-primary mt-6 w-full px-4 py-2.5 text-sm"
              >
                Add My Family
              </button>
            )}
          </>
        ) : (
          <>
            <p className="text-lg font-semibold tracking-tight text-slate-900">
              No families in this area yet
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Other families are on the map, but none within your current search
              radius. Try expanding your search or moving to a nearby
              neighborhood.
            </p>
            {expansions.length > 0 && (
              <div className="mt-5 flex flex-wrap justify-center gap-2">
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
              <button
                type="button"
                onClick={onAddFamily}
                className="btn-subtle mt-5 w-full px-4 py-2 text-sm"
              >
                Add My Family
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
