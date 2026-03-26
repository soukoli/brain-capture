/**
 * API Route: /api/ideas/[id]
 * GET - Get single idea
 * PUT - Update idea
 * DELETE - Delete idea
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getIdeaById,
  updateIdea,
  deleteIdea,
} from '@/lib/repositories/ideas';
import {
  updateIdeaSchema,
  uuidParamSchema,
  safeValidateRequest,
} from '@/lib/validations';

/**
 * GET /api/ideas/[id] - Get a single idea
 */
export async function GET(
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
          error: 'Invalid idea ID',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    // Get idea
    const idea = await getIdeaById(validation.data.id);

    return NextResponse.json({
      success: true,
      data: idea,
    });
  } catch (error) {
    console.error('GET /api/ideas/[id] error:', error);

    if (error instanceof Error && error.message === 'Idea not found') {
      return NextResponse.json(
        {
          error: 'Idea not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch idea',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/ideas/[id] - Update an idea
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
          error: 'Invalid idea ID',
          details: idValidation.error.issues,
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = safeValidateRequest(updateIdeaSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    // Update idea
    const idea = await updateIdea(idValidation.data.id, validation.data);

    return NextResponse.json({
      success: true,
      data: idea,
    });
  } catch (error) {
    console.error('PUT /api/ideas/[id] error:', error);

    if (error instanceof Error && error.message === 'Idea not found') {
      return NextResponse.json(
        {
          error: 'Idea not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update idea',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ideas/[id] - Delete an idea (soft delete)
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
          error: 'Invalid idea ID',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    // Delete idea
    await deleteIdea(validation.data.id);

    return NextResponse.json({
      success: true,
      message: 'Idea deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/ideas/[id] error:', error);

    if (error instanceof Error && error.message === 'Idea not found') {
      return NextResponse.json(
        {
          error: 'Idea not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to delete idea',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/ideas/[id] - CORS preflight
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
