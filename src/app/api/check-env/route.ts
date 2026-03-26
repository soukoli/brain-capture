import { NextResponse } from "next/server";

/**
 * Diagnostic endpoint to check environment variable configuration
 * GET /api/check-env
 */
export async function GET() {
  const getEnv = (key: string) => process.env[key] || process.env[`test_${key}`];

  return NextResponse.json({
    hasPostgresUrl: !!process.env.POSTGRES_URL,
    pgHost: getEnv('PGHOST'),
    pgUser: getEnv('PGUSER'),
    pgDatabase: getEnv('PGDATABASE'),
    pgPort: getEnv('PGPORT'),
    pgSslMode: getEnv('PGSSLMODE'),
    awsRegion: getEnv('AWS_REGION'),
    awsAccountId: getEnv('AWS_ACCOUNT_ID'),
    // Show which variables are using test_ prefix
    usingTestPrefix: {
      pgHost: !process.env.PGHOST && !!process.env.test_PGHOST,
      pgUser: !process.env.PGUSER && !!process.env.test_PGUSER,
      pgDatabase: !process.env.PGDATABASE && !!process.env.test_PGDATABASE,
    },
    // Check for whitespace issues
    hasWhitespace: {
      pgHost: (getEnv('PGHOST') || '').includes('\n') || (getEnv('PGHOST') || '').includes(' '),
      pgUser: (getEnv('PGUSER') || '').includes('\n') || (getEnv('PGUSER') || '').includes(' '),
    }
  });
}
