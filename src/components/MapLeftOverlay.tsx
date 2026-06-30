"use client";

import type { CommunityStats } from "@/lib/types";
import { MapLegend } from "./MapLegend";

type MapLeftOverlayProps = {
  stats: CommunityStats | null;
};

export function MapLeftOverlay({ stats }: MapLeftOverlayProps) {
  const showStats =
    stats !== null &&
    (stats.activeFamilies > 0 || stats.foundRideFamilies > 0);

  return (
    <>
      <div className="map-legend-anchor pointer-events-none">
        <MapLegend />
      </div>

      {showStats && (
        <div className="map-stats-anchor pointer-events-none">
          <div className="map-stats-combined">
            <div className="map-stats-combined__item">
              <span className="text-sm" aria-hidden>
                🏡
              </span>
              <div>
                <p className="map-stats-combined__label">Looking</p>
                <p className="map-stats-combined__value">{stats.activeFamilies}</p>
              </div>
            </div>
            <div className="map-stats-combined__divider" aria-hidden />
            <div className="map-stats-combined__item">
              <span className="text-sm" aria-hidden>
                ❤️
              </span>
              <div>
                <p className="map-stats-combined__label">Helped</p>
                <p className="map-stats-combined__value">{stats.foundRideFamilies}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
