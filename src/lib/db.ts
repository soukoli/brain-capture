/**
 * Database Connection
 * Supports both Vercel Postgres and AWS RDS with IAM authentication
 */

import { Pool } from 'pg';

// Check if we have POSTGRES_URL (Vercel Postgres) or IAM credentials
const hasPostgresUrl = !!process.env.POSTGRES_URL;
const hasIamCredentials = !!(
  process.env.PGHOST &&
  process.env.PGUSER &&
  process.env.PGDATABASE
);

let pool: Pool | null = null;

/**
 * Get or create database connection pool
 */
export function getPool(): Pool {
  if (pool) return pool;

  if (hasPostgresUrl) {
    // Use Vercel Postgres connection string
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    });
  } else if (hasIamCredentials) {
    // Use IAM authentication for AWS RDS
    pool = new Pool({
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || '5432'),
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false,
      // IAM token will be generated per request by AWS SDK
      // This requires @aws-sdk/rds-signer for token generation
    });
  } else {
    throw new Error('No database configuration found. Set POSTGRES_URL or IAM credentials.');
  }

  return pool;
}

/**
 * Tagged template function for SQL queries (compatible with @vercel/postgres API)
 */
export async function sql(
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<{ rows: any[]; rowCount: number }> {
  const pool = getPool();

  // Convert template literal to parameterized query
  let text = strings[0];
  const params: any[] = [];

  for (let i = 0; i < values.length; i++) {
    text += `$${i + 1}` + strings[i + 1];
    params.push(values[i]);
  }

  const result = await pool.query(text, params);
  return { rows: result.rows, rowCount: result.rowCount || 0 };
}

// Add query method to sql function for compatibility
sql.query = async (text: string, params?: any[]) => {
  const pool = getPool();
  const result = await pool.query(text, params);
  return { rows: result.rows, rowCount: result.rowCount || 0 };
};

/**
 * Database query helper with error handling
 */
export async function query<T = any>(
  queryText: string,
  params?: any[]
): Promise<T[]> {
  try {
    const pool = getPool();
    const result = await pool.query(queryText, params);
    return result.rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  }
}

/**
 * Transaction helper
 */
export async function transaction<T>(
  callback: (client: Pool) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback(pool);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction error:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Health check - verifies database connection
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const pool = getPool();
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

/**
 * Initialize database (run schema)
 * For development only - use Vercel dashboard for production
 */
export async function initDatabase(): Promise<void> {
  const { readFileSync } = await import('fs');
  const { join } = await import('path');

  try {
    const schemaSQL = readFileSync(
      join(process.cwd(), 'scripts', 'init-db.sql'),
      'utf-8'
    );

    const pool = getPool();

    // Execute schema (split by semicolon and filter out comments)
    const statements = schemaSQL
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement) {
        await pool.query(statement);
      }
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

/**
 * Type definitions for database models
 */
export interface Idea {
  id: string;
  content: string;
  polished: string | null;
  project_id: string | null;
  user_id: string;
  status: 'inbox' | 'in-progress' | 'completed' | 'archived' | 'deleted';
  priority: 'low' | 'medium' | 'high' | 'urgent' | null;
  capture_method: 'quick' | 'voice' | 'import' | 'email' | 'api' | null;
  ai_processed: boolean;
  ai_metadata: Record<string, any> | null;
  started_at: Date | null;
  completed_at: Date | null;
  time_spent_seconds: number;
  focus_warning_threshold: number;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  status: 'active' | 'archived' | 'completed';
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Tag {
  id: string;
  name: string;
  created_at: Date;
}

export interface IdeaTag {
  idea_id: string;
  tag_id: string;
  created_at: Date;
}

export interface IdeaWithRelations extends Idea {
  project?: Project | null;
  tags?: Tag[];
}

export interface ProjectWithStats extends Project {
  idea_count?: number;
  recent_ideas?: number;
}
