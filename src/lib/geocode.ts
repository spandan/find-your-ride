import type { GeocodeResult } from "./types";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const LOCATIONIQ_URL = "https://us1.locationiq.com/v1/search";
const NOMINATIM_MIN_INTERVAL_MS = 1100;

/** Frisco, TX area — biases geocoding for local street lookups */
export const FRISCO_VIEWBOX = {
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

type GeocodeProvider = "nominatim" | "locationiq";

let lastNominatimRequestAt = 0;
let nominatimQueue: Promise<void> = Promise.resolve();

function getGeocodeProvider(): GeocodeProvider {
  const provider = process.env.GEOCODING_PROVIDER?.trim().toLowerCase();
  if (provider === "locationiq" && process.env.LOCATIONIQ_API_KEY?.trim()) {
    return "locationiq";
  }
  return "nominatim";
}

function scheduleNominatimRequest(): Promise<void> {
  const run = async () => {
    const elapsed = Date.now() - lastNominatimRequestAt;
    const waitMs = NOMINATIM_MIN_INTERVAL_MS - elapsed;
    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
    lastNominatimRequestAt = Date.now();
  };

  const scheduled = nominatimQueue.then(run);
  nominatimQueue = scheduled.catch(() => undefined);
  return scheduled;
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

function parseGeocodeHit(hit: {
  lat: string;
  lon: string;
  display_name?: string;
}): GeocodeResult | null {
  const latitude = parseFloat(hit.lat);
  const longitude = parseFloat(hit.lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }
  return {
    latitude,
    longitude,
    displayName: hit.display_name ?? `${latitude}, ${longitude}`,
  };
}

async function nominatimSearch(
  params: Record<string, string>
): Promise<GeocodeResult | null> {
  await scheduleNominatimRequest();

  const search = new URLSearchParams({
    format: "json",
    limit: "1",
    addressdetails: "1",
    ...params,
  });

  const response = await fetch(`${NOMINATIM_URL}?${search}`, {
    headers: {
      "User-Agent":
        process.env.GEOCODING_USER_AGENT ??
        "SchoolPickupShareMap/1.0 (community school pickup tool)",
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) return null;

  return parseGeocodeHit(results[0]);
}

async function locationIqSearch(
  params: Record<string, string>
): Promise<GeocodeResult | null> {
  const apiKey = process.env.LOCATIONIQ_API_KEY?.trim();
  if (!apiKey) return null;

  const search = new URLSearchParams({
    key: apiKey,
    format: "json",
    limit: "1",
    ...params,
  });

  const response = await fetch(`${LOCATIONIQ_URL}?${search}`, {
    cache: "no-store",
  });

  if (!response.ok) return null;

  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) return null;

  return parseGeocodeHit(results[0]);
}

async function providerSearch(
  params: Record<string, string>
): Promise<GeocodeResult | null> {
  if (getGeocodeProvider() === "locationiq") {
    return locationIqSearch(params);
  }
  return nominatimSearch(params);
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

  return providerSearch(
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

  const structured = await providerSearch(
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
  return providerSearch(
    withViewboxParams(
      { q: query },
      { countrycodes: "us", viewbox: FRISCO_VIEWBOX, bounded: false }
    )
  );
}

export function getActiveGeocodingProvider(): GeocodeProvider {
  return getGeocodeProvider();
}
