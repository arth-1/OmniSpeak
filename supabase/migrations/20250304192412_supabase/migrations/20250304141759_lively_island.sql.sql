-- Drop existing policies that reference user_id
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can CRUD own projects" ON projects;

-- Alter the column type
ALTER TABLE users
ALTER COLUMN id TYPE TEXT;

ALTER TABLE projects
ALTER COLUMN user_id TYPE TEXT;

-- Recreate the policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id);

CREATE POLICY "Users can CRUD own projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id);