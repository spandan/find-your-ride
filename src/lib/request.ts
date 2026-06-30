import { headers } from "next/headers";

/** Best-effort client IP for audit fields (Railway/proxies set x-forwarded-for). */
export async function getClientIpAddress(): Promise<string | null> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headerList.get("x-real-ip") ?? headerList.get("cf-connecting-ip") ?? null;
}
