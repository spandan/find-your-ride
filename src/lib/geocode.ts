import type { GeocodeResult } from "./types";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

/** Frisco, TX area — biases geocoding for local street lookups */
const FRISCO_VIEWBOX = {
  west: -96.98,
  south: 33.05,
  east: -96.72,
  north: 33.28,
};

type GeocodeOptions = {
  countrycodes?: string;
  viewbox?: typeof FRISCO_VIEWBOX;
  bounded?: boolean;
};

async function nominatimSearch(
  params: Record<string, string>
): Promise<GeocodeResult | null> {
  const search = new URLSearchParams({
    format: "json",
    limit: "1",
    addressdetails: "1",
    ...params,
  });

  const response = await fetch(`${NOMINATIM_URL}?${search}`, {
    headers: {
      "User-Agent": "SchoolPickupShareMap/1.0 (community school pickup tool)",
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) return null;

  const hit = results[0];
  return {
    latitude: parseFloat(hit.lat),
    longitude: parseFloat(hit.lon),
    displayName: hit.display_name as string,
  };
}

function withViewboxParams(
  base: Record<string, string>,
  options?: GeocodeOptions
): Record<string, string> {
  const params = { ...base };
  if (options?.countrycodes) {
    params.countrycodes = options.countrycodes;
  }
  if (options?.viewbox) {
    const { west, south, east, north } = options.viewbox;
    params.viewbox = `${west},${south},${east},${north}`;
    if (options.bounded) params.bounded = "1";
  }
  return params;
}

/**
 * Geocode a free-text location (map search).
 */
export async function geocodeLocation(
  locationText: string,
  options?: GeocodeOptions
): Promise<GeocodeResult | null> {
  const query = locationText.trim();
  if (!query) return null;

  return nominatimSearch(
    withViewboxParams({ q: query }, { countrycodes: "us", ...options })
  );
}

/**
 * Geocode a home street for signup — structured lookup with TX / Frisco bias.
 */
export async function geocodeStreetAddress(
  streetName: string,
  city: string,
  state: string
): Promise<GeocodeResult | null> {
  const street = streetName.trim();
  const cityName = city.trim();
  const stateCode = state.trim().toUpperCase();
  if (!street || !cityName || !stateCode) return null;

  const structured = await nominatimSearch(
    withViewboxParams(
      {
        street,
        city: cityName,
        state: stateCode,
        country: "United States",
      },
      { countrycodes: "us", viewbox: FRISCO_VIEWBOX, bounded: false }
    )
  );
  if (structured) return structured;

  const query = `${street}, ${cityName}, ${stateCode}, USA`;
  return nominatimSearch(
    withViewboxParams(
      { q: query },
      { countrycodes: "us", viewbox: FRISCO_VIEWBOX, bounded: false }
    )
  );
}

export { FRISCO_VIEWBOX };
