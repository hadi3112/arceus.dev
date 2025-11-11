/*
  # Arceus AI Coding Assistant - Initial Database Schema

  ## Summary
  Creates the core database structure for Arceus, an AI coding assistant that helps non-technical founders
  build software projects. This migration sets up tables for user management, chat sessions, projects,
  collaboration, and GitHub integration.

  ## New Tables

  ### 1. `users`
  Stores user profile information beyond auth.users
  - `id` (uuid, FK to auth.users)
  - `username` (text, unique)
  - `display_name` (text)
  - `avatar_url` (text)
  - `github_username` (text)
  - `onboarding_completed` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `projects`
  Stores user projects created through Arceus
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK to users)
  - `name` (text)
  - `description` (text)
  - `github_repo_url` (text)
  - `github_connected` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `chat_sessions`
  Stores chat conversation sessions
  - `id` (uuid, primary key)
  - `project_id` (uuid, FK to projects)
  - `user_id` (uuid, FK to users)
  - `title` (text)
  - `model_name` (text) - e.g., "DeepSeek R1", "Gemini 2.5 Flash"
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `chat_messages`
  Stores individual messages within chat sessions
  - `id` (uuid, primary key)
  - `session_id` (uuid, FK to chat_sessions)
  - `role` (text) - 'user' or 'assistant'
  - `content` (text)
  - `model_used` (text)
  - `created_at` (timestamptz)

  ### 5. `collaborators`
  Stores project collaboration relationships
  - `id` (uuid, primary key)
  - `project_id` (uuid, FK to projects)
  - `user_id` (uuid, FK to users)
  - `role` (text) - 'owner', 'editor', 'reviewer'
  - `invited_at` (timestamptz)
  - `accepted_at` (timestamptz)

  ### 6. `code_reviews`
  Stores code review requests and feedback
  - `id` (uuid, primary key)
  - `project_id` (uuid, FK to projects)
  - `reviewer_id` (uuid, FK to users)
  - `branch_name` (text)
  - `status` (text) - 'pending', 'approved', 'changes_requested'
  - `comments` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can only read/write their own data
  - Project collaborators can access shared projects
  - Secure collaboration with role-based access
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  display_name text,
  avatar_url text,
  github_username text,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  github_repo_url text,
  github_connected boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create collaborators table (needed before projects policies)
CREATE TABLE IF NOT EXISTS collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL DEFAULT 'reviewer' CHECK (role IN ('owner', 'editor', 'reviewer')),
  invited_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  UNIQUE(project_id, user_id)
);

ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;

-- Now create projects policies
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM collaborators 
      WHERE collaborators.project_id = projects.id 
      AND collaborators.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create collaborators policies
CREATE POLICY "Project owners and collaborators can view collaborators"
  ON collaborators FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = collaborators.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can manage collaborators"
  ON collaborators FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = collaborators.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can update collaborators"
  ON collaborators FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = collaborators.project_id 
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = collaborators.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can remove collaborators"
  ON collaborators FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = collaborators.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text DEFAULT 'New Chat',
  model_name text DEFAULT 'DeepSeek V3',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat sessions"
  ON chat_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own chat sessions"
  ON chat_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own chat sessions"
  ON chat_sessions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own chat sessions"
  ON chat_sessions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  model_used text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in own sessions"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own sessions"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- Create code_reviews table
CREATE TABLE IF NOT EXISTS code_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  branch_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'changes_requested')),
  comments text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE code_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members can view code reviews"
  ON code_reviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = code_reviews.project_id 
      AND (
        projects.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM collaborators 
          WHERE collaborators.project_id = projects.id 
          AND collaborators.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Collaborators can create code reviews"
  ON code_reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM collaborators 
      WHERE collaborators.project_id = code_reviews.project_id 
      AND collaborators.user_id = auth.uid()
    )
  );

CREATE POLICY "Reviewers can update own reviews"
  ON code_reviews FOR UPDATE
  TO authenticated
  USING (reviewer_id = auth.uid())
  WITH CHECK (reviewer_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_project_id ON chat_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_project_id ON collaborators(project_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_code_reviews_project_id ON code_reviews(project_id);
