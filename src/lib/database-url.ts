/**
 * Resolve DATABASE_URL for Prisma 7 driver adapters.
 * - Railway / production: standard postgresql:// from linked Postgres service
 * - Local dev: prisma+postgres:// from `prisma dev`
 */
export function resolveDatabaseUrl(): string {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  if (!connectionString.startsWith("prisma+postgres://")) {
    return connectionString;
  }

  try {
    const url = new URL(connectionString);
    const apiKey = url.searchParams.get("api_key");
    if (apiKey) {
      const payload = JSON.parse(
        Buffer.from(apiKey, "base64url").toString()
      ) as { databaseUrl?: string };
      if (payload.databaseUrl) {
        return payload.databaseUrl;
      }
    }
  } catch {
    // Fall through to simple replacement
  }

  return connectionString.replace("prisma+postgres://", "postgres://");
}

/** Railway Postgres may require SSL on external URLs. */
export function isRailwayEnvironment(): boolean {
  return Boolean(process.env.RAILWAY_ENVIRONMENT);
}

/** Node `pg` rejects Railway's self-signed cert unless sslmode=no-verify. */
const RAILWAY_SSL_MODE = "no-verify";

export function withDatabaseSsl(connectionString: string): string {
  if (!isRailwayEnvironment() && process.env.DATABASE_SSL !== "true") {
    return connectionString;
  }
  if (connectionString.includes("sslmode=")) {
    return connectionString.replace(
      /sslmode=[^&]*/i,
      `sslmode=${RAILWAY_SSL_MODE}`
    );
  }
  const separator = connectionString.includes("?") ? "&" : "?";
  return `${connectionString}${separator}sslmode=${RAILWAY_SSL_MODE}`;
}
