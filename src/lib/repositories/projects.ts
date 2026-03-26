/**
 * Projects Repository
 * Data access layer for projects table
 */

import { sql } from '../db';
import type { Project, ProjectWithStats } from '../db';
import type { CreateProjectInput, UpdateProjectInput, GetProjectsQuery } from '../validations';

/**
 * Create a new project
 */
export async function createProject(data: CreateProjectInput): Promise<Project> {
  const { name, description, color, status, user_id } = data;

  const result = await sql`
    INSERT INTO projects (name, description, color, status, user_id)
    VALUES (${name}, ${description || null}, ${color}, ${status}, ${user_id})
    RETURNING *
  `;

  return result.rows[0] as Project;
}

/**
 * Get all projects for a user
 */
export async function getProjects(query: GetProjectsQuery): Promise<ProjectWithStats[]> {
  const { user_id, status, include_stats } = query;

  const conditions: string[] = ['user_id = $1'];
  const params: any[] = [user_id];
  let paramIndex = 2;

  if (status) {
    conditions.push(`status = $${paramIndex}`);
    params.push(status);
    paramIndex++;
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  if (include_stats) {
    // Get projects with idea counts
    const projectsQuery = `
      SELECT
        p.*,
        COUNT(DISTINCT i.id) FILTER (WHERE i.status != 'deleted') as idea_count,
        COUNT(DISTINCT i.id) FILTER (
          WHERE i.status != 'deleted'
          AND i.created_at >= NOW() - INTERVAL '7 days'
        ) as recent_ideas
      FROM projects p
      LEFT JOIN ideas i ON p.id = i.project_id
      ${whereClause}
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;

    const result = await sql.query(projectsQuery, params);
    return result.rows.map((row) => ({
      ...row,
      idea_count: parseInt(row.idea_count, 10),
      recent_ideas: parseInt(row.recent_ideas, 10),
    })) as ProjectWithStats[];
  } else {
    // Simple project list without stats
    const projectsQuery = `
      SELECT * FROM projects
      ${whereClause}
      ORDER BY created_at DESC
    `;

    const result = await sql.query(projectsQuery, params);
    return result.rows as Project[];
  }
}

/**
 * Get a single project by ID
 */
export async function getProjectById(id: string): Promise<ProjectWithStats> {
  const result = await sql`
    SELECT
      p.*,
      COUNT(DISTINCT i.id) FILTER (WHERE i.status != 'deleted') as idea_count,
      COUNT(DISTINCT i.id) FILTER (
        WHERE i.status != 'deleted'
        AND i.created_at >= NOW() - INTERVAL '7 days'
      ) as recent_ideas
    FROM projects p
    LEFT JOIN ideas i ON p.id = i.project_id
    WHERE p.id = ${id}
    GROUP BY p.id
  `;

  if (result.rows.length === 0) {
    throw new Error('Project not found');
  }

  const row = result.rows[0];
  return {
    ...row,
    idea_count: parseInt(row.idea_count, 10),
    recent_ideas: parseInt(row.recent_ideas, 10),
  } as ProjectWithStats;
}

/**
 * Update a project
 */
export async function updateProject(
  id: string,
  data: UpdateProjectInput
): Promise<Project> {
  // Build update query dynamically
  const updateFields: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      updateFields.push(`${key} = $${paramIndex}`);
      params.push(value === null ? null : value);
      paramIndex++;
    }
  });

  if (updateFields.length === 0) {
    // No updates, just return current project
    const result = await sql`SELECT * FROM projects WHERE id = ${id}`;
    if (result.rows.length === 0) {
      throw new Error('Project not found');
    }
    return result.rows[0] as Project;
  }

  updateFields.push(`updated_at = NOW()`);
  params.push(id);

  const updateQuery = `
    UPDATE projects
    SET ${updateFields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
  `;

  const result = await sql.query(updateQuery, params);

  if (result.rows.length === 0) {
    throw new Error('Project not found');
  }

  return result.rows[0] as Project;
}

/**
 * Delete a project
 * Note: This will set all associated ideas' project_id to NULL (due to ON DELETE SET NULL)
 */
export async function deleteProject(id: string): Promise<void> {
  const result = await sql`
    DELETE FROM projects WHERE id = ${id} RETURNING id
  `;

  if (result.rows.length === 0) {
    throw new Error('Project not found');
  }
}

/**
 * Archive a project (soft delete)
 */
export async function archiveProject(id: string): Promise<Project> {
  const result = await sql`
    UPDATE projects
    SET status = 'archived', updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  if (result.rows.length === 0) {
    throw new Error('Project not found');
  }

  return result.rows[0] as Project;
}

/**
 * Get project statistics
 */
export async function getProjectStats(id: string) {
  const result = await sql`
    SELECT
      COUNT(*) FILTER (WHERE status = 'inbox') as inbox_count,
      COUNT(*) FILTER (WHERE status = 'processed') as processed_count,
      COUNT(*) FILTER (WHERE status = 'archived') as archived_count,
      COUNT(*) FILTER (WHERE priority = 'urgent') as urgent_count,
      COUNT(*) FILTER (WHERE priority = 'high') as high_priority_count,
      COUNT(*) FILTER (WHERE ai_processed = true) as ai_processed_count,
      MAX(created_at) as last_idea_at
    FROM ideas
    WHERE project_id = ${id} AND status != 'deleted'
  `;

  return {
    inbox_count: parseInt(result.rows[0].inbox_count, 10),
    processed_count: parseInt(result.rows[0].processed_count, 10),
    archived_count: parseInt(result.rows[0].archived_count, 10),
    urgent_count: parseInt(result.rows[0].urgent_count, 10),
    high_priority_count: parseInt(result.rows[0].high_priority_count, 10),
    ai_processed_count: parseInt(result.rows[0].ai_processed_count, 10),
    last_idea_at: result.rows[0].last_idea_at,
  };
}

/**
 * Get user's project statistics
 */
export async function getUserProjectStats(userId: string) {
  const result = await sql`
    SELECT
      COUNT(DISTINCT p.id) as total_projects,
      COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'active') as active_projects,
      COUNT(DISTINCT i.id) as total_ideas,
      COUNT(DISTINCT i.id) FILTER (WHERE i.status = 'inbox') as inbox_ideas
    FROM projects p
    LEFT JOIN ideas i ON p.id = i.project_id AND i.status != 'deleted'
    WHERE p.user_id = ${userId}
  `;

  return {
    total_projects: parseInt(result.rows[0].total_projects, 10),
    active_projects: parseInt(result.rows[0].active_projects, 10),
    total_ideas: parseInt(result.rows[0].total_ideas, 10),
    inbox_ideas: parseInt(result.rows[0].inbox_ideas, 10),
  };
}
