/**
 * Database Connection with Drizzle ORM
 * Simple, clean connection using connection string
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Singleton instances
let pool: Pool | undefined;
let db: ReturnType<typeof drizzle> | undefined;

/**
 * Get database connection string from environment
 */
function getConnectionString(): string {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error(
      "Missing database connection string. Set DATABASE_URL or POSTGRES_URL environment variable."
    );
  }

  return connectionString;
}

/**
 * Get or create database connection pool
 */
export function getPool(): Pool {
  if (!pool) {
    const connectionString = getConnectionString();

    pool = new Pool({
      connectionString,
      // Use SSL in production
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    });
  }

  return pool;
}

/**
 * Get Drizzle database instance
 */
export function getDb() {
  if (!db) {
    const poolInstance = getPool();
    db = drizzle(poolInstance, { schema });
  }

  return db;
}

/**
 * Health check - verifies database connection
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const poolInstance = getPool();
    await poolInstance.query("SELECT 1");
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
}

/**
 * Close database connections (for graceful shutdown)
 */
export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = undefined;
    db = undefined;
  }
}

// Export schema for direct access
export { schema };

// Export types from schema
export type {
  Project,
  NewProject,
  Idea,
  NewIdea,
  Tag,
  NewTag,
  IdeaTag,
  NewIdeaTag,
} from "./schema";
