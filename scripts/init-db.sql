-- Brain Capture Database Schema
-- PostgreSQL 14+ (Vercel Postgres / Neon)
-- Run this script to initialize the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables (for clean setup)
DROP TABLE IF EXISTS idea_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS ideas CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(50) DEFAULT '#3B82F6',
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ideas Table
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  polished TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  user_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'inbox' CHECK (status IN ('inbox', 'in-progress', 'completed', 'archived', 'deleted')),
  priority VARCHAR(50) CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  capture_method VARCHAR(50) CHECK (capture_method IN ('quick', 'voice', 'import', 'email', 'api')),
  ai_processed BOOLEAN DEFAULT false,
  ai_metadata JSONB,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER DEFAULT 0,
  focus_warning_threshold INTEGER DEFAULT 7200,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags Table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Idea-Tags Junction Table (Many-to-Many)
CREATE TABLE idea_tags (
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (idea_id, tag_id)
);

-- Indexes for Performance
CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_ideas_project_id ON ideas(project_id);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
CREATE INDEX idx_ideas_user_status ON ideas(user_id, status);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_user_status ON projects(user_id, status);

CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_idea_tags_idea_id ON idea_tags(idea_id);
CREATE INDEX idx_idea_tags_tag_id ON idea_tags(tag_id);

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_ideas_updated_at
  BEFORE UPDATE ON ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for development
INSERT INTO projects (name, description, color, user_id) VALUES
  ('Personal', 'Personal ideas and thoughts', '#3B82F6', 'dev-user'),
  ('Work', 'Work-related ideas and tasks', '#10B981', 'dev-user'),
  ('Side Project', 'Side project ideas', '#F59E0B', 'dev-user');

INSERT INTO tags (name) VALUES
  ('urgent'),
  ('research'),
  ('feature'),
  ('bug'),
  ('idea'),
  ('meeting'),
  ('learning');

-- Verification Queries
-- SELECT 'Projects count:' as info, COUNT(*) as count FROM projects;
-- SELECT 'Ideas count:' as info, COUNT(*) as count FROM ideas;
-- SELECT 'Tags count:' as info, COUNT(*) as count FROM tags;
