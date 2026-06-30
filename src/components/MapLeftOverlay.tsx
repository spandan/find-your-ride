"use client";

import type { CommunityStats } from "@/lib/types";
import { MapLegend } from "./MapLegend";

type MapLeftOverlayProps = {
  stats: CommunityStats | null;
};

export function MapLeftOverlay({ stats }: MapLeftOverlayProps) {
  const showFamiliesLooking =
    stats !== null &&
    (stats.activeFamilies > 0 || stats.foundRideFamilies > 0);

  return (
    <div className="map-left-stack pointer-events-none absolute z-10 flex flex-col items-start gap-2">
      <MapLegend />
      {showFamiliesLooking && (
        <div className="map-overlay-card">
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
      )}
    </div>
  );
}
