/**
 * Database Seed Script
 * Populates the database with sample data for development
 */

import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

console.log("Environment loaded. DATABASE_URL:", process.env.DATABASE_URL ? "set" : "NOT SET");

import { getDb } from "./index";
import { projects, ideas, tags } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Defer getting DB connection until after env is loaded
  const db = getDb();

  try {
    // Clear existing data (in reverse order due to foreign keys)
    console.log("Clearing existing data...");
    await db.delete(ideas);
    await db.delete(projects);
    await db.delete(tags);

    // Insert sample projects
    console.log("Creating projects...");
    const insertedProjects = await db
      .insert(projects)
      .values([
        {
          name: "Personal",
          description: "Personal ideas and thoughts",
          color: "#3B82F6",
          userId: "dev-user",
          status: "active",
        },
        {
          name: "Work",
          description: "Work-related ideas and tasks",
          color: "#10B981",
          userId: "dev-user",
          status: "active",
        },
        {
          name: "Side Project",
          description: "Side project ideas",
          color: "#F59E0B",
          userId: "dev-user",
          status: "active",
        },
        {
          name: "Learning",
          description: "Things to learn and study",
          color: "#8B5CF6",
          userId: "dev-user",
          status: "active",
        },
      ])
      .returning();

    console.log(`✅ Created ${insertedProjects.length} projects`);

    // Insert sample tags
    console.log("Creating tags...");
    const insertedTags = await db
      .insert(tags)
      .values([
        { name: "urgent" },
        { name: "research" },
        { name: "feature" },
        { name: "bug" },
        { name: "idea" },
        { name: "meeting" },
        { name: "learning" },
      ])
      .returning();

    console.log(`✅ Created ${insertedTags.length} tags`);

    // Insert sample ideas
    console.log("Creating ideas...");
    const insertedIdeas = await db
      .insert(ideas)
      .values([
        {
          content: "Build a mobile app for task management",
          projectId: insertedProjects[0].id,
          userId: "dev-user",
          status: "inbox",
          priority: "high",
          captureMethod: "quick",
        },
        {
          content: "Learn about Drizzle ORM and database migrations",
          projectId: insertedProjects[3].id,
          userId: "dev-user",
          status: "in-progress",
          priority: "medium",
          captureMethod: "quick",
        },
        {
          content: "Fix authentication bug in login flow",
          projectId: insertedProjects[1].id,
          userId: "dev-user",
          status: "inbox",
          priority: "urgent",
          captureMethod: "quick",
        },
        {
          content: "Add color picker for projects",
          projectId: insertedProjects[2].id,
          userId: "dev-user",
          status: "inbox",
          priority: "low",
          captureMethod: "quick",
        },
        {
          content: "Research best practices for mobile-first design",
          projectId: insertedProjects[3].id,
          userId: "dev-user",
          status: "inbox",
          priority: "medium",
          captureMethod: "quick",
        },
      ])
      .returning();

    console.log(`✅ Created ${insertedIdeas.length} ideas`);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
