import { NextResponse } from "next/server";
import { initDatabase } from "@/lib/db";

/**
 * One-time database initialization endpoint
 * POST /api/init-db
 *
 * WARNING: This endpoint should be protected or removed after initial setup
 */
export async function POST() {
  try {
    await initDatabase();

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database initialization error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check if tables exist
 */
export async function GET() {
  try {
    const { sql } = await import("@/lib/db");

    // Check if tables exist
    const result = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('users', 'projects', 'ideas', 'tags', 'idea_tags')
      ORDER BY table_name;
    `;

    const tables = result.rows.map((row: any) => row.table_name);
    const allTablesExist = tables.length === 5;

    return NextResponse.json({
      initialized: allTablesExist,
      existingTables: tables,
      missingTables: ["users", "projects", "ideas", "tags", "idea_tags"].filter(
        (t) => !tables.includes(t)
      ),
    });
  } catch (error) {
    console.error("Database check error:", error);

    return NextResponse.json(
      {
        initialized: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
