"use client";

import type { PreferredContactMethod } from "@/generated/prisma/client";
import { SAMPLE_SEARCH_ADDRESS } from "@/lib/constants";
import {
  buildDefaultFilters,
  type DistanceMiles,
  type MapFilters,
} from "@/lib/filters";
import type { SchoolOption } from "@/lib/schools";
import { hasMultipleSchools } from "@/lib/schools";

const CONTACT_OPTIONS: { value: PreferredContactMethod; label: string }[] = [
  { value: "PHONE", label: "Phone" },
  { value: "TEXT", label: "Text" },
  { value: "EMAIL", label: "Email" },
  { value: "WHATSAPP", label: "WhatsApp" },
];

const SCHOOL_OPTIONS = [
  { key: "LOWER" as const, label: "Lower School" },
  { key: "UPPER" as const, label: "Upper School" },
  { key: "MIXED" as const, label: "Mixed" },
];

type SidebarProps = {
  searchQuery: string;
  searchError: string | null;
  onSearchQueryChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  schools: SchoolOption[];
  schoolFilterLocked: boolean;
  draftFilters: MapFilters;
  onDraftFiltersChange: (filters: MapFilters) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onClose?: () => void;
  className?: string;
};

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5">
      <p className="text-xs font-semibold text-slate-900">{title}</p>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function DistanceRadios({
  value,
  onChange,
  name,
}: {
  value: DistanceMiles;
  onChange: (miles: DistanceMiles) => void;
  name: string;
}) {
  return (
    <div className="space-y-2">
      {([1, 2, 5] as const).map((miles) => (
        <label
          key={miles}
          className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
        >
          <input
            type="radio"
            name={name}
            checked={value === miles}
            onChange={() => onChange(miles)}
            className="text-blue-800 focus:ring-blue-500"
          />
          {miles} mile{miles === 1 ? "" : "s"}
        </label>
      ))}
    </div>
  );
}

export function Sidebar({
  searchQuery,
  searchError,
  onSearchQueryChange,
  onSearch,
  schools,
  schoolFilterLocked,
  draftFilters,
  onDraftFiltersChange,
  onApplyFilters,
  onResetFilters,
  onClose,
  className = "",
}: SidebarProps) {
  function update(patch: Partial<MapFilters>) {
    onDraftFiltersChange({ ...draftFilters, ...patch });
  }

  return (
    <aside
      className={`filter-panel flex h-full min-h-0 w-full flex-col border-r lg:w-[320px] lg:shrink-0 ${className}`}
    >
      <div className="filter-panel__header flex shrink-0 items-center justify-between border-b px-4 py-3.5">
        <p className="text-xs font-semibold uppercase tracking-wide">
          Filters
        </p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="btn-icon h-8 w-8"
            aria-label="Close filters"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="sidebar-scroll min-h-0 flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
        <FilterSection title="Your address">
          <form onSubmit={onSearch} className="flex flex-col gap-2">
            <input
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder={SAMPLE_SEARCH_ADDRESS}
              className="input-field input-compact w-full"
              aria-label="Search your home address"
            />
            <button type="submit" className="btn-subtle w-full">
              Search
            </button>
          </form>
          {searchError && (
            <p className="mt-2 text-xs text-red-600">{searchError}</p>
          )}
        </FilterSection>

        {hasMultipleSchools(schools) && (
          <FilterSection title="School">
            {schoolFilterLocked ? (
              <p className="text-sm text-slate-700">
                {schools.find((s) => s.id === draftFilters.schoolId)?.name ??
                  "Your school"}
              </p>
            ) : (
              <div className="space-y-2">
                {schools.map((school) => (
                  <label
                    key={school.id}
                    className="flex cursor-pointer items-start gap-2 text-sm text-slate-700"
                  >
                    <input
                      type="radio"
                      name="sidebar-school"
                      checked={draftFilters.schoolId === school.id}
                      onChange={() => update({ schoolId: school.id })}
                      className="mt-0.5 text-blue-800 focus:ring-blue-500"
                    />
                    <span>{school.name}</span>
                  </label>
                ))}
              </div>
            )}
          </FilterSection>
        )}

        <section className="space-y-3">
          <FilterSection title="School Group">
            <div className="space-y-2">
              {SCHOOL_OPTIONS.map(({ key, label }) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={draftFilters.schoolGroups[key]}
                    onChange={() =>
                      update({
                        schoolGroups: {
                          ...draftFilters.schoolGroups,
                          [key]: !draftFilters.schoolGroups[key],
                        },
                      })
                    }
                    className="rounded text-blue-800"
                  />
                  {label}
                </label>
              ))}
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={draftFilters.showFoundRide}
                  onChange={() =>
                    update({ showFoundRide: !draftFilters.showFoundRide })
                  }
                  className="rounded text-blue-800"
                />
                Found Ride
              </label>
            </div>
          </FilterSection>

          <FilterSection title="Distance">
            <DistanceRadios
              name="sidebar-distance"
              value={draftFilters.distanceMiles}
              onChange={(distanceMiles) => update({ distanceMiles })}
            />
          </FilterSection>

          <FilterSection title="Availability">
            <div className="space-y-2">
              {(
                [
                  { key: "pickup" as const, label: "Looking for Pickup" },
                  { key: "dropoff" as const, label: "Looking for Drop-off" },
                  { key: "both" as const, label: "Both" },
                ] as const
              ).map(({ key, label }) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={draftFilters.availability[key]}
                    onChange={() =>
                      update({
                        availability: {
                          ...draftFilters.availability,
                          [key]: !draftFilters.availability[key],
                        },
                      })
                    }
                    className="rounded text-blue-800"
                  />
                  {label}
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Preferred Contact">
            <div className="space-y-2">
              {CONTACT_OPTIONS.map(({ value, label }) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={draftFilters.contactMethods[value]}
                    onChange={() =>
                      update({
                        contactMethods: {
                          ...draftFilters.contactMethods,
                          [value]: !draftFilters.contactMethods[value],
                        },
                      })
                    }
                    className="rounded text-blue-800"
                  />
                  {label}
                </label>
              ))}
            </div>
          </FilterSection>
        </section>
        </div>
      </div>

      <div className="filter-panel__header flex shrink-0 gap-2 border-t p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onResetFilters}
          className="btn-subtle flex-1"
        >
          Reset Filters
        </button>
        <button
          type="button"
          onClick={onApplyFilters}
          className="btn-subtle flex-1 text-slate-800"
        >
          Apply Filters
        </button>
      </div>
    </aside>
  );
}
