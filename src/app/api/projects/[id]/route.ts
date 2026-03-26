/**
 * API Route: /api/projects/[id]
 * GET - Get single project with stats
 * PUT - Update project
 * DELETE - Delete project
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getProjectById,
  updateProject,
  deleteProject,
  getProjectStats,
} from '@/lib/repositories/projects';
import {
  updateProjectSchema,
  uuidParamSchema,
  safeValidateRequest,
} from '@/lib/validations';

/**
 * GET /api/projects/[id] - Get a single project with stats
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('include_stats') !== 'false';

    // Validate ID
    const validation = safeValidateRequest(uuidParamSchema, { id });
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid project ID',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    // Get project
    const project = await getProjectById(validation.data.id);

    // Get detailed stats if requested
    let stats = null;
    if (includeStats) {
      stats = await getProjectStats(validation.data.id);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...project,
        stats,
      },
    });
  } catch (error) {
    console.error('GET /api/projects/[id] error:', error);

    if (error instanceof Error && error.message === 'Project not found') {
      return NextResponse.json(
        {
          error: 'Project not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch project',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/[id] - Update a project
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID
    const idValidation = safeValidateRequest(uuidParamSchema, { id });
    if (!idValidation.success) {
      return NextResponse.json(
        {
          error: 'Invalid project ID',
          details: idValidation.error.issues,
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = safeValidateRequest(updateProjectSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    // Update project
    const project = await updateProject(idValidation.data.id, validation.data);

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('PUT /api/projects/[id] error:', error);

    if (error instanceof Error && error.message === 'Project not found') {
      return NextResponse.json(
        {
          error: 'Project not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update project',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[id] - Delete a project
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID
    const validation = safeValidateRequest(uuidParamSchema, { id });
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid project ID',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    // Delete project
    await deleteProject(validation.data.id);

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/projects/[id] error:', error);

    if (error instanceof Error && error.message === 'Project not found') {
      return NextResponse.json(
        {
          error: 'Project not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to delete project',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/projects/[id] - CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
