-- Migration 003: Create studypro schema and move tables
-- This organizes StudyPro tables into a separate schema for better modularity

-- 1. Create studypro schema
CREATE SCHEMA IF NOT EXISTS studypro;

-- 2. Move tables from public to studypro schema
ALTER TABLE IF EXISTS public.studypro_users SET SCHEMA studypro;
ALTER TABLE IF EXISTS public.studypro_courses SET SCHEMA studypro;
ALTER TABLE IF EXISTS public.studypro_lessons SET SCHEMA studypro;
ALTER TABLE IF EXISTS public.studypro_study_sessions SET SCHEMA studypro;
ALTER TABLE IF EXISTS public.studypro_achievements SET SCHEMA studypro;
ALTER TABLE IF EXISTS public.studypro_user_achievements SET SCHEMA studypro;
ALTER TABLE IF EXISTS public.studypro_goals SET SCHEMA studypro;
ALTER TABLE IF EXISTS public.studypro_materials SET SCHEMA studypro;

-- 3. Update RLS policies (they move automatically with tables)

-- 4. Grant permissions to both anon and authenticated users
GRANT USAGE ON SCHEMA studypro TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA studypro TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA studypro TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA studypro TO anon, authenticated;

-- 5. Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA studypro
GRANT ALL ON TABLES TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA studypro
GRANT ALL ON SEQUENCES TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA studypro
GRANT ALL ON FUNCTIONS TO anon, authenticated;

-- 6. Verify tables were moved
SELECT 
  schemaname, 
  tablename 
FROM pg_tables 
WHERE schemaname = 'studypro' 
ORDER BY tablename;
