import { Pool } from "pg";

let pool: Pool | undefined;

export function getLiveStudioPool(): Pool {
  if (typeof window !== "undefined") {
    throw new Error("Live Studio database access is server-only.");
  }

  const connectionString = process.env.LIVE_STUDIO_DATABASE_URL;

  if (!connectionString) {
    throw new Error("Live Studio database URL is not configured.");
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: true },
      max: 2,
      connectionTimeoutMillis: 8000,
      idleTimeoutMillis: 10000,
      allowExitOnIdle: true,
    });
  }

  return pool;
}
