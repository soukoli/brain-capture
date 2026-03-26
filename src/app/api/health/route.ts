/**
 * API Route: /api/health
 * Database health check endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { healthCheck } from '@/lib/db';

/**
 * GET /api/health - Check API and database health
 */
export async function GET(request: NextRequest) {
  try {
    const dbHealthy = await healthCheck();

    if (!dbHealthy) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          database: 'disconnected',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check error:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
