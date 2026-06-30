const EARTH_RADIUS_MILES = 3958.8;

/**
 * Slightly blur coordinates for privacy when approximate display is selected.
 * Offset is ~150–400 meters depending on latitude.
 */
export function blurCoordinates(
  latitude: number,
  longitude: number,
  seed?: string
): { latitude: number; longitude: number } {
  const random = seed
    ? seededRandom(seed)
    : () => Math.random();

  const latOffset = (random() - 0.5) * 0.002;
  const lngOffset = (random() - 0.5) * 0.002;

  return {
    latitude: latitude + latOffset,
    longitude: longitude + lngOffset,
  };
}

function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash / 0x7fffffff;
  };
}

/** Haversine distance in miles */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MILES * c;
}

export function formatDistance(miles: number): string {
  if (miles < 0.1) return "< 0.1 mi";
  return `${miles.toFixed(1)} mi`;
}
