"use client";

import type { CommunityStats } from "@/lib/types";

type MapStatsOverlayProps = {
  stats: CommunityStats | null;
};

export function MapStatsOverlay({ stats }: MapStatsOverlayProps) {
  if (!stats) return null;

  const hasActivity = stats.activeFamilies > 0 || stats.foundRideFamilies > 0;
  if (!hasActivity) return null;

  return (
    <>
      <div className="map-stat-card bottom-3 left-3 sm:bottom-4 sm:left-4">
        <span className="text-base" aria-hidden>
          🏡
        </span>
        <div>
          <p className="text-[10px] font-medium text-slate-500">Families Looking</p>
          <p className="text-lg font-semibold leading-tight text-slate-900">
            {stats.activeFamilies}
          </p>
        </div>
      </div>

      <div className="map-stat-card bottom-3 right-3 sm:bottom-4 sm:right-4">
        <span className="text-base" aria-hidden>
          ❤️
        </span>
        <div>
          <p className="text-[10px] font-medium text-slate-500">Families Helped</p>
          <p className="text-lg font-semibold leading-tight text-slate-900">
            {stats.foundRideFamilies}
          </p>
        </div>
      </div>
    </>
  );
}
