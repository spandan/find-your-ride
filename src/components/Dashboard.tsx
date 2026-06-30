"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "@/actions/auth";
import { geocodeSearch, getCommunityStats, getMapListings } from "@/actions/listings";
import { getSchools } from "@/actions/schools";
import { DEFAULT_MAP_CENTER, type MapCenter } from "@/lib/constants";
import {
  buildDefaultFilters,
  filterListings,
  type MapFilters,
  zoomForRadius,
} from "@/lib/filters";
import type { SchoolOption } from "@/lib/schools";
import { DEFAULT_SCHOOL_ID } from "@/lib/schools";
import type { CommunityStats, MapListing, SessionUser } from "@/lib/types";
import { AddressSearchBar } from "./AddressSearchBar";
import { AuthModal } from "./AuthModal";
import { HowItWorksModal } from "./HowItWorksModal";
import { MapEmptyOverlay } from "./MapEmptyOverlay";
import { MapCredits } from "./MapCredits";
import { MapLeftOverlay } from "./MapLeftOverlay";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

const MapView = dynamic(
  () => import("./MapView").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-slate-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-800" />
      </div>
    ),
  }
);

type AuthMode = "login" | "signup" | "reset";

function filtersForUser(
  schools: SchoolOption[],
  user: SessionUser | null
): MapFilters {
  const fallbackSchoolId = schools[0]?.id ?? DEFAULT_SCHOOL_ID;
  const schoolId = user?.schoolId ?? fallbackSchoolId;
  return buildDefaultFilters(schoolId);
}

export function Dashboard() {
  const [mapCenter, setMapCenter] = useState<MapCenter>(DEFAULT_MAP_CENTER);
  const [searchOrigin, setSearchOrigin] = useState({
    lat: DEFAULT_MAP_CENTER.lat,
    lng: DEFAULT_MAP_CENTER.lng,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [listings, setListings] = useState<MapListing[]>([]);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<MapFilters>(
    buildDefaultFilters()
  );
  const [draftFilters, setDraftFilters] = useState<MapFilters>(
    buildDefaultFilters()
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  const loadData = useCallback(async (schoolId?: string) => {
    const [schoolList, currentUser] = await Promise.all([
      getSchools(),
      getCurrentUser(),
    ]);
    setSchools(schoolList);

    const nextFilters = filtersForUser(schoolList, currentUser);
    const effectiveSchoolId = schoolId ?? nextFilters.schoolId;

    const [mapResults, communityStats] = await Promise.all([
      getMapListings(effectiveSchoolId),
      getCommunityStats(effectiveSchoolId),
    ]);

    setListings(mapResults);
    setUser(currentUser);
    setStats(communityStats);
    setAppliedFilters({ ...nextFilters, schoolId: effectiveSchoolId });
    setDraftFilters({ ...nextFilters, schoolId: effectiveSchoolId });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredListings = useMemo(
    () => filterListings(listings, searchOrigin, appliedFilters),
    [listings, searchOrigin, appliedFilters]
  );

  const schoolFilterLocked = Boolean(user);

  function handleToggleFilters() {
    setFiltersOpen((open) => !open);
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchError(null);
    if (!searchQuery.trim()) return;

    const result = await geocodeSearch(searchQuery);
    if (!result.success) {
      setSearchError(result.error);
      return;
    }

    const zoom = zoomForRadius(appliedFilters.distanceMiles);
    setSearchOrigin({ lat: result.lat, lng: result.lng });
    setMapCenter({ lat: result.lat, lng: result.lng, zoom });
  }

  async function handleApplyFilters() {
    setAppliedFilters(draftFilters);
    setMapCenter((prev) => ({
      ...prev,
      zoom: zoomForRadius(draftFilters.distanceMiles),
    }));
    setFiltersOpen(false);

    if (!user && draftFilters.schoolId !== appliedFilters.schoolId) {
      const [mapResults, communityStats] = await Promise.all([
        getMapListings(draftFilters.schoolId),
        getCommunityStats(draftFilters.schoolId),
      ]);
      setListings(mapResults);
      setStats(communityStats);
    }
  }

  function handleResetFilters() {
    const next = filtersForUser(schools, user);
    setDraftFilters(next);
    setAppliedFilters(next);
  }

  function handleExpandRadius(miles: MapFilters["distanceMiles"]) {
    const next = { ...appliedFilters, distanceMiles: miles };
    setAppliedFilters(next);
    setDraftFilters(next);
    setMapCenter((prev) => ({ ...prev, zoom: zoomForRadius(miles) }));
  }

  function handleAuthSuccess(coords?: {
    lat: number;
    lng: number;
    listingId?: string;
  }) {
    loadData();
    if (coords) {
      setSearchOrigin({ lat: coords.lat, lng: coords.lng });
      setMapCenter({ lat: coords.lat, lng: coords.lng, zoom: 15 });
      if (coords.listingId) setSelectedId(coords.listingId);
    }
  }

  const showEmptyOverlay = filteredListings.length === 0;

  return (
    <div className="flex h-dvh min-h-dvh flex-col bg-[#F8FAFC]">
      <TopNav
        user={user}
        onHowItWorks={() => setShowHowItWorks(true)}
        onSignup={() => setAuthMode("signup")}
        onLogin={() => setAuthMode("login")}
        onUserChange={loadData}
      />

      <div className="relative flex min-h-0 flex-1">
        {filtersOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 top-14 z-40 bg-slate-900/30"
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
            />
            <div className="fixed top-14 bottom-0 left-0 z-50 flex w-[min(100vw,320px)] flex-col shadow-xl">
              <Sidebar
                schools={schools}
                schoolFilterLocked={schoolFilterLocked}
                draftFilters={draftFilters}
                onDraftFiltersChange={setDraftFilters}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
                onClose={() => setFiltersOpen(false)}
                className="min-h-0 flex-1"
              />
            </div>
          </>
        )}

        <main className="relative min-h-0 min-w-0 flex-1">
          <AddressSearchBar
            searchQuery={searchQuery}
            searchError={searchError}
            onSearchQueryChange={setSearchQuery}
            onSearch={handleSearch}
            onToggleFilters={handleToggleFilters}
            filtersOpen={filtersOpen}
          />
          <MapView
            center={{ lat: mapCenter.lat, lng: mapCenter.lng }}
            zoom={mapCenter.zoom}
            listings={filteredListings}
            selectedId={selectedId}
            isLoggedIn={!!user}
            onSelectListing={setSelectedId}
            onLogin={() => setAuthMode("login")}
          />

          <MapLeftOverlay stats={stats} />
          <MapCredits />

          {showEmptyOverlay && (
            <MapEmptyOverlay
              distanceMiles={appliedFilters.distanceMiles}
              onExpandRadius={handleExpandRadius}
            />
          )}
        </main>
      </div>

      {showHowItWorks && (
        <HowItWorksModal onClose={() => setShowHowItWorks(false)} />
      )}

      {authMode && (
        <AuthModal
          mode={authMode}
          schools={schools}
          onClose={() => setAuthMode(null)}
          onModeChange={setAuthMode}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
