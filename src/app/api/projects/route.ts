/**
 * API Route: /api/projects
 * POST - Create new project
 * GET - List projects
 */

import { NextRequest, NextResponse } from 'next/server';
import { createProject, getProjects } from '@/lib/repositories/projects';
import {
  createProjectSchema,
  getProjectsQuerySchema,
  safeValidateRequest,
} from '@/lib/validations';

/**
 * POST /api/projects - Create a new project
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = safeValidateRequest(createProjectSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    // Create project
    const project = await createProject(validation.data);

    return NextResponse.json(
      {
        success: true,
        data: project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/projects error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Failed to create project',
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
 * GET /api/projects - List projects for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Convert search params to object
    const queryParams = {
      user_id: searchParams.get('user_id') || '',
      status: searchParams.get('status') || undefined,
      include_stats: searchParams.get('include_stats') || 'true',
    };

    // Validate query parameters
    const validation = safeValidateRequest(getProjectsQuerySchema, queryParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    // Get projects
    const projects = await getProjects(validation.data);

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('GET /api/projects error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Failed to fetch projects',
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
 * OPTIONS /api/projects - CORS preflight
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
