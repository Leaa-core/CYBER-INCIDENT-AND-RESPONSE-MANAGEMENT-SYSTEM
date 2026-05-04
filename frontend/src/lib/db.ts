import { Pool } from 'pg';

declare global {
  var __cirmsPool: Pool | undefined;
}

function shouldUseSsl(connectionString: string): boolean {
  try {
    const url = new URL(connectionString);
    return !['localhost', '127.0.0.1', '::1'].includes(url.hostname);
  } catch {
    return true;
  }
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is missing. Please add it to your environment variables (e.g., in Vercel project settings).');
  }

  return new Pool({
    connectionString,
    ssl: shouldUseSsl(connectionString) ? { rejectUnauthorized: false } : undefined,
    max: 1,                  // 1 connection per serverless function instance
    idleTimeoutMillis: 10000, // release idle connections after 10s
    connectionTimeoutMillis: 5000, // fail fast if can't connect in 5s
  });
}

export function getDbPool() {
  if (!globalThis.__cirmsPool) {
    globalThis.__cirmsPool = createPool();
  }

  return globalThis.__cirmsPool;
}