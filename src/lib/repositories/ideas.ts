/**
 * Ideas Repository
 * Data access layer for ideas table
 */

import { sql } from '../db';
import type { Idea, IdeaWithRelations, Tag } from '../db';
import type { CreateIdeaInput, UpdateIdeaInput, GetIdeasQuery } from '../validations';

/**
 * Create a new idea
 */
export async function createIdea(data: CreateIdeaInput): Promise<IdeaWithRelations> {
  const {
    content,
    polished,
    project_id,
    user_id,
    status,
    priority,
    capture_method,
    ai_processed,
    ai_metadata,
    tags,
  } = data;

  // Insert idea
  const ideaResult = await sql`
    INSERT INTO ideas (
      content, polished, project_id, user_id, status,
      priority, capture_method, ai_processed, ai_metadata
    )
    VALUES (
      ${content}, ${polished || null}, ${project_id || null}, ${user_id},
      ${status}, ${priority || null}, ${capture_method || null},
      ${ai_processed}, ${ai_metadata ? JSON.stringify(ai_metadata) : null}
    )
    RETURNING *
  `;

  const idea = ideaResult.rows[0] as Idea;

  // Handle tags if provided
  if (tags && tags.length > 0) {
    await attachTagsToIdea(idea.id, tags);
  }

  // Fetch full idea with relations
  return getIdeaById(idea.id);
}

/**
 * Get ideas with filters and pagination
 */
export async function getIdeas(query: GetIdeasQuery): Promise<{
  ideas: IdeaWithRelations[];
  total: number;
  limit: number;
  offset: number;
}> {
  const {
    user_id,
    status,
    project_id,
    priority,
    search,
    tag,
    limit,
    offset,
    sort,
    order,
  } = query;

  // Build WHERE conditions
  const conditions: string[] = ['user_id = $1'];
  const params: any[] = [user_id];
  let paramIndex = 2;

  if (status) {
    conditions.push(`status = $${paramIndex}`);
    params.push(status);
    paramIndex++;
  }

  if (project_id) {
    conditions.push(`project_id = $${paramIndex}`);
    params.push(project_id);
    paramIndex++;
  }

  if (priority) {
    conditions.push(`priority = $${paramIndex}`);
    params.push(priority);
    paramIndex++;
  }

  if (search) {
    conditions.push(`(content ILIKE $${paramIndex} OR polished ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Handle tag filtering (requires join)
  let fromClause = 'FROM ideas';
  if (tag) {
    fromClause = `
      FROM ideas
      INNER JOIN idea_tags ON ideas.id = idea_tags.idea_id
      INNER JOIN tags ON idea_tags.tag_id = tags.id
    `;
    conditions.push(`tags.name = $${paramIndex}`);
    params.push(tag);
    paramIndex++;
  }

  // Get total count
  const countQuery = `
    SELECT COUNT(DISTINCT ideas.id) as count
    ${fromClause}
    ${whereClause}
  `;
  const countResult = await sql.query(countQuery, params);
  const total = parseInt(countResult.rows[0].count, 10);

  // Get ideas
  const orderByClause = `ORDER BY ideas.${sort} ${order.toUpperCase()}`;
  const ideasQuery = `
    SELECT DISTINCT ideas.*
    ${fromClause}
    ${whereClause}
    ${orderByClause}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  params.push(limit, offset);

  const ideasResult = await sql.query(ideasQuery, params);
  const ideas = ideasResult.rows as Idea[];

  // Fetch relations for each idea
  const ideasWithRelations = await Promise.all(
    ideas.map(async (idea) => {
      const [project, tags] = await Promise.all([
        idea.project_id ? getProjectForIdea(idea.project_id) : null,
        getTagsForIdea(idea.id),
      ]);
      return { ...idea, project: project as any, tags };
    })
  );

  return {
    ideas: ideasWithRelations,
    total,
    limit,
    offset,
  };
}

/**
 * Get a single idea by ID
 */
export async function getIdeaById(id: string): Promise<IdeaWithRelations> {
  const result = await sql`
    SELECT * FROM ideas WHERE id = ${id}
  `;

  if (result.rows.length === 0) {
    throw new Error('Idea not found');
  }

  const idea = result.rows[0] as Idea;

  // Fetch relations
  const [project, tags] = await Promise.all([
    idea.project_id ? getProjectForIdea(idea.project_id) : null,
    getTagsForIdea(idea.id),
  ]);

  return { ...idea, project: project as any, tags };
}

/**
 * Update an idea
 */
export async function updateIdea(
  id: string,
  data: UpdateIdeaInput
): Promise<IdeaWithRelations> {
  const { tags, ...ideaData } = data;

  // Build update query dynamically
  const updateFields: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  Object.entries(ideaData).forEach(([key, value]) => {
    if (value !== undefined) {
      updateFields.push(`${key} = $${paramIndex}`);
      params.push(value === null ? null : value);
      paramIndex++;
    }
  });

  if (updateFields.length === 0 && !tags) {
    // No updates
    return getIdeaById(id);
  }

  if (updateFields.length > 0) {
    updateFields.push(`updated_at = NOW()`);
    params.push(id);

    const updateQuery = `
      UPDATE ideas
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    await sql.query(updateQuery, params);
  }

  // Update tags if provided
  if (tags) {
    // Remove existing tags
    await sql`DELETE FROM idea_tags WHERE idea_id = ${id}`;
    // Attach new tags
    if (tags.length > 0) {
      await attachTagsToIdea(id, tags);
    }
  }

  return getIdeaById(id);
}

/**
 * Delete an idea (soft delete by setting status)
 */
export async function deleteIdea(id: string): Promise<void> {
  const result = await sql`
    UPDATE ideas
    SET status = 'deleted', updated_at = NOW()
    WHERE id = ${id}
    RETURNING id
  `;

  if (result.rows.length === 0) {
    throw new Error('Idea not found');
  }
}

/**
 * Hard delete an idea (permanent)
 */
export async function hardDeleteIdea(id: string): Promise<void> {
  const result = await sql`
    DELETE FROM ideas WHERE id = ${id} RETURNING id
  `;

  if (result.rows.length === 0) {
    throw new Error('Idea not found');
  }
}

/**
 * Helper: Get project for idea
 */
async function getProjectForIdea(projectId: string) {
  const result = await sql`
    SELECT * FROM projects WHERE id = ${projectId}
  `;
  return result.rows[0] || null;
}

/**
 * Helper: Get tags for idea
 */
async function getTagsForIdea(ideaId: string): Promise<Tag[]> {
  const result = await sql`
    SELECT tags.*
    FROM tags
    INNER JOIN idea_tags ON tags.id = idea_tags.tag_id
    WHERE idea_tags.idea_id = ${ideaId}
    ORDER BY tags.name
  `;
  return result.rows as Tag[];
}

/**
 * Helper: Attach tags to idea (creates tags if they don't exist)
 */
async function attachTagsToIdea(ideaId: string, tagNames: string[]): Promise<void> {
  for (const tagName of tagNames) {
    const normalizedName = tagName.toLowerCase().trim();

    // Get or create tag
    let tagResult = await sql`
      SELECT id FROM tags WHERE name = ${normalizedName}
    `;

    let tagId: string;
    if (tagResult.rows.length === 0) {
      // Create new tag
      const newTagResult = await sql`
        INSERT INTO tags (name) VALUES (${normalizedName})
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
      `;
      tagId = newTagResult.rows[0].id;
    } else {
      tagId = tagResult.rows[0].id;
    }

    // Create idea-tag relationship
    await sql`
      INSERT INTO idea_tags (idea_id, tag_id)
      VALUES (${ideaId}, ${tagId})
      ON CONFLICT (idea_id, tag_id) DO NOTHING
    `;
  }
}

/**
 * Get ideas by tag
 */
export async function getIdeasByTag(tagName: string, userId: string): Promise<Idea[]> {
  const result = await sql`
    SELECT ideas.*
    FROM ideas
    INNER JOIN idea_tags ON ideas.id = idea_tags.idea_id
    INNER JOIN tags ON idea_tags.tag_id = tags.id
    WHERE tags.name = ${tagName.toLowerCase()}
      AND ideas.user_id = ${userId}
    ORDER BY ideas.created_at DESC
  `;
  return result.rows as Idea[];
}

/**
 * Get all tags for a user
 */
export async function getUserTags(userId: string): Promise<Tag[]> {
  const result = await sql`
    SELECT DISTINCT tags.*
    FROM tags
    INNER JOIN idea_tags ON tags.id = idea_tags.tag_id
    INNER JOIN ideas ON idea_tags.idea_id = ideas.id
    WHERE ideas.user_id = ${userId}
    ORDER BY tags.name
  `;
  return result.rows as Tag[];
}
