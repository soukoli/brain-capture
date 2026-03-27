import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Projects Table
 * Represents user projects for organizing tasks
 */
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 50 }).default("#3B82F6").notNull(),
  status: varchar("status", { length: 50 })
    .default("active")
    .notNull()
    .$type<"active" | "archived" | "completed">(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Ideas Table
 * Represents captured tasks/thoughts
 */
export const ideas = pgTable("ideas", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  polished: text("polished"),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  userId: varchar("user_id", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 })
    .default("inbox")
    .notNull()
    .$type<"inbox" | "in-progress" | "completed" | "archived" | "deleted">(),
  priority: varchar("priority", { length: 50 }).$type<"low" | "medium" | "high" | "urgent">(),
  captureMethod: varchar("capture_method", { length: 50 }).$type<
    "quick" | "voice" | "import" | "email" | "api"
  >(),
  aiProcessed: boolean("ai_processed").default(false).notNull(),
  aiMetadata: jsonb("ai_metadata").$type<Record<string, any>>(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  timeSpentSeconds: integer("time_spent_seconds").default(0).notNull(),
  focusWarningThreshold: integer("focus_warning_threshold").default(7200).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Tags Table
 * Represents tags for categorizing ideas
 */
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Idea-Tags Junction Table
 * Many-to-many relationship between ideas and tags
 */
export const ideaTags = pgTable(
  "idea_tags",
  {
    ideaId: uuid("idea_id")
      .notNull()
      .references(() => ideas.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.ideaId, table.tagId] }),
    };
  }
);

/**
 * Relations
 */
export const projectsRelations = relations(projects, ({ many }) => ({
  ideas: many(ideas),
}));

export const ideasRelations = relations(ideas, ({ one, many }) => ({
  project: one(projects, {
    fields: [ideas.projectId],
    references: [projects.id],
  }),
  ideaTags: many(ideaTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  ideaTags: many(ideaTags),
}));

export const ideaTagsRelations = relations(ideaTags, ({ one }) => ({
  idea: one(ideas, {
    fields: [ideaTags.ideaId],
    references: [ideas.id],
  }),
  tag: one(tags, {
    fields: [ideaTags.tagId],
    references: [tags.id],
  }),
}));

/**
 * Type exports
 */
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Idea = typeof ideas.$inferSelect;
export type NewIdea = typeof ideas.$inferInsert;

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export type IdeaTag = typeof ideaTags.$inferSelect;
export type NewIdeaTag = typeof ideaTags.$inferInsert;
