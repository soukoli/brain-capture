/**
 * Database Connection
 * Vercel Postgres (Neon) client with connection pooling
 */

import { sql } from '@vercel/postgres';

// Export the sql client for direct queries
export { sql };

/**
 * Database query helper with error handling
 */
export async function query<T = any>(
  queryText: string,
  params?: any[]
): Promise<T[]> {
  try {
    const result = await sql.query(queryText, params);
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
  callback: (client: typeof sql) => Promise<T>
): Promise<T> {
  try {
    // Vercel Postgres handles connection pooling automatically
    return await callback(sql);
  } catch (error) {
    console.error('Transaction error:', error);
    throw error;
  }
}

/**
 * Health check - verifies database connection
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
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

    // Execute schema (Vercel Postgres doesn't support multi-statement, so split)
    const statements = schemaSQL
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement) {
        await sql.query(statement);
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
