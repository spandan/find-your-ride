/**
 * Parse a time string like "7:45 AM", "15:30", or "3:15 PM" into minutes from midnight.
 */
export function parseTimeToMinutes(timeStr: string): number | null {
  const trimmed = timeStr.trim();
  if (!trimmed) return null;

  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const period = match12[3].toUpperCase();
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    return hours * 60 + minutes;
  }

  return null;
}

export function areTimesCompatible(
  timeA: string,
  timeB: string,
  toleranceMinutes: number
): boolean {
  const minutesA = parseTimeToMinutes(timeA);
  const minutesB = parseTimeToMinutes(timeB);
  if (minutesA === null || minutesB === null) return true;
  return Math.abs(minutesA - minutesB) <= toleranceMinutes;
}
