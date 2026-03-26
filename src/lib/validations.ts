/**
 * Request Validation Schemas
 * Using Zod for runtime type checking and validation
 */

import { z } from 'zod';

// Idea Schemas
export const createIdeaSchema = z.object({
  content: z.string().min(1, 'Content is required').max(10000, 'Content too long'),
  polished: z.string().max(10000).optional().nullable(),
  project_id: z.string().uuid().optional().nullable(),
  user_id: z.string().min(1, 'User ID is required'),
  status: z.enum(['inbox', 'in-progress', 'completed', 'archived', 'deleted'], { message: 'Invalid status' }).default('inbox'),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], { message: 'Invalid priority' }).optional().nullable(),
  capture_method: z.enum(['quick', 'voice', 'import', 'email', 'api'], { message: 'Invalid capture method' }).optional().nullable(),
  ai_processed: z.boolean().default(false),
  ai_metadata: z.record(z.string(), z.any()).optional().nullable(),
  tags: z.array(z.string()).optional(),
});

export const updateIdeaSchema = z.object({
  content: z.string().min(1).max(10000).optional(),
  polished: z.string().max(10000).optional().nullable(),
  project_id: z.string().uuid().optional().nullable(),
  status: z.enum(['inbox', 'in-progress', 'completed', 'archived', 'deleted'], { message: 'Invalid status' }).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], { message: 'Invalid priority' }).optional().nullable(),
  ai_processed: z.boolean().optional(),
  ai_metadata: z.record(z.string(), z.any()).optional().nullable(),
  tags: z.array(z.string()).optional(),
});

export const getIdeasQuerySchema = z.object({
  user_id: z.string().min(1),
  status: z.enum(['inbox', 'in-progress', 'completed', 'archived', 'deleted'], { message: 'Invalid status' }).optional(),
  project_id: z.string().uuid().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], { message: 'Invalid priority' }).optional(),
  search: z.string().optional(),
  tag: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  sort: z.enum(['created_at', 'updated_at', 'priority'], { message: 'Invalid sort field' }).default('created_at'),
  order: z.enum(['asc', 'desc'], { message: 'Invalid order' }).default('desc'),
});

// Project Schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  description: z.string().max(5000).optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color hex').default('#3B82F6'),
  status: z.enum(['active', 'archived', 'completed'], { message: 'Invalid status' }).default('active'),
  user_id: z.string().min(1, 'User ID is required'),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  status: z.enum(['active', 'archived', 'completed'], { message: 'Invalid status' }).optional(),
});

export const getProjectsQuerySchema = z.object({
  user_id: z.string().min(1),
  status: z.enum(['active', 'archived', 'completed'], { message: 'Invalid status' }).optional(),
  include_stats: z.coerce.boolean().default(true),
});

// Tag Schemas
export const createTagSchema = z.object({
  name: z.string().min(1).max(100).toLowerCase().trim(),
});

// Dashboard Schemas
export const getDashboardQuerySchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
});

// Generic ID parameter schema
export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

// Type exports for TypeScript
export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;
export type UpdateIdeaInput = z.infer<typeof updateIdeaSchema>;
export type GetIdeasQuery = z.infer<typeof getIdeasQuerySchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type GetProjectsQuery = z.infer<typeof getProjectsQuerySchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type GetDashboardQuery = z.infer<typeof getDashboardQuerySchema>;

/**
 * Validation helper function
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Safe validation (returns error instead of throwing)
 */
export function safeValidateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
