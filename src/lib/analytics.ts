import { prisma } from "@/lib/prisma";

const ANALYTICS_ID = "singleton";

/** TODO: Expose analytics in an admin dashboard */
export async function ensureAnalyticsRecord() {
  await prisma.appAnalytics.upsert({
    where: { id: ANALYTICS_ID },
    create: { id: ANALYTICS_ID },
    update: {},
  });
}

export async function recordListingCreated() {
  await ensureAnalyticsRecord();
  await prisma.appAnalytics.update({
    where: { id: ANALYTICS_ID },
    data: {
      totalListingsCreated: { increment: 1 },
      activeListings: { increment: 1 },
    },
  });
}

export async function recordListingFoundRide() {
  await ensureAnalyticsRecord();
  await prisma.appAnalytics.update({
    where: { id: ANALYTICS_ID },
    data: {
      activeListings: { decrement: 1 },
      foundRideListings: { increment: 1 },
    },
  });
}

export async function recordListingReactivated() {
  await ensureAnalyticsRecord();
  await prisma.appAnalytics.update({
    where: { id: ANALYTICS_ID },
    data: {
      activeListings: { increment: 1 },
      foundRideListings: { decrement: 1 },
    },
  });
}

export async function recordListingDeleted(wasActive: boolean, wasFoundRide: boolean) {
  await ensureAnalyticsRecord();
  const data: {
    deletedListings: { increment: number };
    activeListings?: { decrement: number };
    foundRideListings?: { decrement: number };
  } = {
    deletedListings: { increment: 1 },
  };
  if (wasActive) data.activeListings = { decrement: 1 };
  if (wasFoundRide) data.foundRideListings = { decrement: 1 };
  await prisma.appAnalytics.update({
    where: { id: ANALYTICS_ID },
    data,
  });
}

/** Stored for future admin use — not displayed in MVP */
export async function getStoredAnalytics() {
  await ensureAnalyticsRecord();
  const metrics = await prisma.appAnalytics.findUnique({
    where: { id: ANALYTICS_ID },
  });
  if (!metrics) return null;

  const total = metrics.totalListingsCreated;
  const successfulMatches = metrics.foundRideListings;
  const matchPercentage =
    total > 0 ? Math.round((successfulMatches / total) * 1000) / 10 : 0;

  return { ...metrics, matchPercentage };
}
