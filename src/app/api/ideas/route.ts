/**
 * API Route: /api/ideas
 * POST - Create new idea
 * GET - List ideas with filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { createIdea, getIdeas } from '@/lib/repositories/ideas';
import {
  createIdeaSchema,
  getIdeasQuerySchema,
  safeValidateRequest,
} from '@/lib/validations';

/**
 * POST /api/ideas - Create a new idea
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = safeValidateRequest(createIdeaSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    // Create idea
    const idea = await createIdea(validation.data);

    return NextResponse.json(
      {
        success: true,
        data: idea,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/ideas error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Failed to create idea',
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ideas - List ideas with filters and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Convert search params to object
    const queryParams = {
      user_id: searchParams.get('user_id') || '',
      status: searchParams.get('status') || undefined,
      project_id: searchParams.get('project_id') || undefined,
      priority: searchParams.get('priority') || undefined,
      search: searchParams.get('search') || undefined,
      tag: searchParams.get('tag') || undefined,
      limit: searchParams.get('limit') || '20',
      offset: searchParams.get('offset') || '0',
      sort: searchParams.get('sort') || 'created_at',
      order: searchParams.get('order') || 'desc',
    };

    // Validate query parameters
    const validation = safeValidateRequest(getIdeasQuerySchema, queryParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    // Get ideas
    const result = await getIdeas(validation.data);

    return NextResponse.json({
      success: true,
      data: result.ideas,
      pagination: {
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        pages: Math.ceil(result.total / result.limit),
      },
    });
  } catch (error) {
    console.error('GET /api/ideas error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Failed to fetch ideas',
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/ideas - CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
