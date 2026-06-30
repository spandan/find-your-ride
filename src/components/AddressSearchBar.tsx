"use client";

import { SAMPLE_SEARCH_ADDRESS } from "@/lib/constants";

type AddressSearchBarProps = {
  searchQuery: string;
  searchError: string | null;
  onSearchQueryChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onToggleFilters: () => void;
  filtersOpen: boolean;
};

export function AddressSearchBar({
  searchQuery,
  searchError,
  onSearchQueryChange,
  onSearch,
  onToggleFilters,
  filtersOpen,
}: AddressSearchBarProps) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-3 z-20 w-full max-w-xl -translate-x-1/2 px-3 sm:top-4 sm:px-4">
      <form
        onSubmit={onSearch}
        className="pointer-events-auto flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-md sm:gap-2 sm:rounded-3xl sm:p-2"
      >
        <input
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder={SAMPLE_SEARCH_ADDRESS}
          className="input-field input-compact min-w-0 flex-1 rounded-xl border-0 bg-transparent px-3 shadow-none focus:ring-0 sm:rounded-2xl"
          aria-label="Search your home address"
        />
        <button
          type="submit"
          className="btn-subtle shrink-0 rounded-xl px-3 sm:rounded-2xl sm:px-4"
        >
          Search
        </button>
        <button
          type="button"
          onClick={onToggleFilters}
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-none transition-colors hover:border-slate-300 hover:bg-slate-50 sm:h-9 sm:w-9 sm:rounded-2xl ${
            filtersOpen ? "border-blue-200 bg-blue-50 text-blue-800" : ""
          }`}
          aria-label={filtersOpen ? "Close filters" : "Open filters"}
          aria-expanded={filtersOpen}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </form>
      {searchError && (
        <p className="pointer-events-auto mt-2 rounded-2xl border border-red-200 bg-white px-3 py-2 text-xs text-red-600 shadow-sm">
          {searchError}
        </p>
      )}
    </div>
  );
}
