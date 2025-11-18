-- StudyPro Database Schema
-- Prefix: studypro_*
-- Supabase projekt sdílený s ostatními ProApp moduly

-- ============================================
-- 1. USERS (Uživatelé)
-- ============================================
CREATE TABLE IF NOT EXISTS studypro_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  auth_provider TEXT DEFAULT 'google',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Gamifikace
  total_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,

  -- Nastavení
  settings JSONB DEFAULT '{
    "notifications": true,
    "theme": "light",
    "language": "cs",
    "studyReminders": true
  }'::jsonb
);

-- Index pro rychlé vyhledávání
CREATE INDEX idx_studypro_users_email ON studypro_users(email);
CREATE INDEX idx_studypro_users_created_at ON studypro_users(created_at);

-- ============================================
-- 2. COURSES (Kurzy/Workshopy/Materiály)
-- ============================================
CREATE TABLE IF NOT EXISTS studypro_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES studypro_users(id) ON DELETE CASCADE,

  -- Základní info
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  platform TEXT, -- Udemy, Coursera, škola, vlastní, atd.
  category TEXT, -- programování, design, business, jazyk, atd.

  -- Typ kurzu
  course_type TEXT CHECK (course_type IN ('paid', 'free', 'school', 'workshop', 'book', 'article', 'video', 'other')) DEFAULT 'paid',

  -- Časové údaje
  purchase_date DATE,
  start_date DATE,
  end_date DATE,
  access_until DATE, -- Deadline přístupu
  estimated_hours DECIMAL(10, 2),

  -- Progress
  total_lessons INTEGER DEFAULT 0,
  completed_lessons INTEGER DEFAULT 0,
  progress_percentage DECIMAL(5, 2) DEFAULT 0,

  -- Finanční info
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'CZK',

  -- URL a materiály
  course_url TEXT,
  cover_image_url TEXT,
  certificate_url TEXT,

  -- Status
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused', 'expired')) DEFAULT 'not_started',

  -- Priorita a hodnocení
  priority INTEGER DEFAULT 0, -- 0=nízká, 1=střední, 2=vysoká
  rating INTEGER CHECK (rating >= 0 AND rating <= 5),
  notes TEXT,

  -- Tagy
  tags TEXT[], -- ['react', 'javascript', 'webdev']

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexy
CREATE INDEX idx_studypro_courses_user_id ON studypro_courses(user_id);
CREATE INDEX idx_studypro_courses_status ON studypro_courses(status);
CREATE INDEX idx_studypro_courses_category ON studypro_courses(category);
CREATE INDEX idx_studypro_courses_access_until ON studypro_courses(access_until);
CREATE INDEX idx_studypro_courses_tags ON studypro_courses USING GIN(tags);

-- ============================================
-- 3. LESSONS (Lekce/Moduly)
-- ============================================
CREATE TABLE IF NOT EXISTS studypro_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES studypro_courses(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL, -- Pořadí v kurzu

  -- Progress
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Časový odhad
  estimated_minutes INTEGER,
  actual_minutes INTEGER,

  -- URL a materiály
  lesson_url TEXT,
  video_url TEXT,
  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_studypro_lessons_course_id ON studypro_lessons(course_id);
CREATE INDEX idx_studypro_lessons_order ON studypro_lessons(course_id, order_index);

-- ============================================
-- 4. STUDY SESSIONS (Studijní sezení)
-- ============================================
CREATE TABLE IF NOT EXISTS studypro_study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES studypro_users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES studypro_courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES studypro_lessons(id) ON DELETE SET NULL,

  -- Čas
  session_date DATE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,

  -- Bodování
  points_earned INTEGER DEFAULT 0,

  -- Poznámky
  notes TEXT,
  mood TEXT, -- 'great', 'good', 'ok', 'bad'

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_studypro_sessions_user_id ON studypro_study_sessions(user_id);
CREATE INDEX idx_studypro_sessions_date ON studypro_study_sessions(session_date);
CREATE INDEX idx_studypro_sessions_course ON studypro_study_sessions(course_id);

-- ============================================
-- 5. ACHIEVEMENTS (Odznaky/Úspěchy)
-- ============================================
CREATE TABLE IF NOT EXISTS studypro_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  code TEXT UNIQUE NOT NULL, -- 'first_course', 'week_streak', 'night_owl', atd.
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- emoji nebo URL
  points INTEGER DEFAULT 0,

  -- Podmínky pro odemčení
  unlock_criteria JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Předvyplnění základních achievementů
INSERT INTO studypro_achievements (code, title, description, icon, points, unlock_criteria) VALUES
('first_course', 'První kurz', 'Přidal/a jsi svůj první kurz!', '🎓', 10, '{"type": "course_count", "value": 1}'::jsonb),
('week_streak', 'Týdenní šňůra', '7 dní v řadě jsi studoval/a', '🔥', 50, '{"type": "streak", "value": 7}'::jsonb),
('month_streak', 'Měsíční šňůra', '30 dní v řadě jsi studoval/a', '💪', 200, '{"type": "streak", "value": 30}'::jsonb),
('first_completion', 'První dokončení', 'Dokončil/a jsi svůj první kurz!', '🏆', 100, '{"type": "completed_courses", "value": 1}'::jsonb),
('early_bird', 'Ranní ptáče', 'Studoval/a před 8:00 ráno', '🌅', 25, '{"type": "early_study", "value": true}'::jsonb),
('night_owl', 'Noční sova', 'Studoval/a po 22:00', '🦉', 25, '{"type": "night_study", "value": true}'::jsonb),
('speed_learner', 'Rychlík', 'Dokončil/a kurz za méně než týden', '⚡', 75, '{"type": "fast_completion", "days": 7}'::jsonb),
('knowledge_seeker', 'Hledač poznání', '10 dokončených kurzů', '📚', 500, '{"type": "completed_courses", "value": 10}'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- 6. USER ACHIEVEMENTS (Odemčené odznaky)
-- ============================================
CREATE TABLE IF NOT EXISTS studypro_user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES studypro_users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES studypro_achievements(id) ON DELETE CASCADE,

  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_studypro_user_achievements_user ON studypro_user_achievements(user_id);

-- ============================================
-- 7. GOALS (Studijní cíle)
-- ============================================
CREATE TABLE IF NOT EXISTS studypro_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES studypro_users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,

  -- Typ cíle
  goal_type TEXT CHECK (goal_type IN ('complete_course', 'study_hours', 'lessons_count', 'daily_streak', 'custom')) DEFAULT 'custom',

  -- Cílová hodnota
  target_value DECIMAL(10, 2),
  current_value DECIMAL(10, 2) DEFAULT 0,
  unit TEXT, -- 'courses', 'hours', 'lessons', 'days'

  -- Časový rámec
  start_date DATE,
  deadline DATE,

  -- Status
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Motivace
  reward TEXT, -- Co si dopřeješ po splnění?

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_studypro_goals_user_id ON studypro_goals(user_id);
CREATE INDEX idx_studypro_goals_deadline ON studypro_goals(deadline);

-- ============================================
-- 8. MATERIALS (Studijní materiály/zdroje)
-- ============================================
CREATE TABLE IF NOT EXISTS studypro_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES studypro_courses(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,

  -- Typ materiálu
  material_type TEXT CHECK (material_type IN ('pdf', 'video', 'article', 'code', 'quiz', 'exercise', 'link', 'other')) DEFAULT 'other',

  -- URL nebo soubor
  url TEXT,
  file_path TEXT,

  -- Metadata
  file_size_mb DECIMAL(10, 2),
  duration_minutes INTEGER,

  -- Status
  is_downloaded BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_studypro_materials_course ON studypro_materials(course_id);

-- ============================================
-- TRIGGERS pro automatické updaty
-- ============================================

-- Trigger: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_studypro_users_updated_at BEFORE UPDATE ON studypro_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_studypro_courses_updated_at BEFORE UPDATE ON studypro_courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_studypro_lessons_updated_at BEFORE UPDATE ON studypro_lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_studypro_goals_updated_at BEFORE UPDATE ON studypro_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update course progress
CREATE OR REPLACE FUNCTION update_course_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE studypro_courses
  SET
    completed_lessons = (SELECT COUNT(*) FROM studypro_lessons WHERE course_id = NEW.course_id AND is_completed = true),
    progress_percentage = CASE
      WHEN total_lessons > 0 THEN
        ((SELECT COUNT(*) FROM studypro_lessons WHERE course_id = NEW.course_id AND is_completed = true)::decimal / total_lessons) * 100
      ELSE 0
    END,
    status = CASE
      WHEN (SELECT COUNT(*) FROM studypro_lessons WHERE course_id = NEW.course_id AND is_completed = true) = 0 THEN 'not_started'
      WHEN (SELECT COUNT(*) FROM studypro_lessons WHERE course_id = NEW.course_id AND is_completed = true) = total_lessons THEN 'completed'
      ELSE 'in_progress'
    END
  WHERE id = NEW.course_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_update_course_progress
AFTER INSERT OR UPDATE ON studypro_lessons
FOR EACH ROW
EXECUTE FUNCTION update_course_progress();

-- Trigger: Update streak po studijním sezení
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_date DATE;
  curr_date DATE;
BEGIN
  curr_date := NEW.session_date;

  SELECT last_activity_date INTO last_date
  FROM studypro_users
  WHERE id = NEW.user_id;

  IF last_date IS NULL OR last_date < curr_date THEN
    UPDATE studypro_users
    SET
      last_activity_date = curr_date,
      current_streak = CASE
        WHEN last_date = curr_date - 1 THEN current_streak + 1
        WHEN last_date < curr_date - 1 THEN 1
        ELSE current_streak
      END,
      longest_streak = GREATEST(longest_streak,
        CASE
          WHEN last_date = curr_date - 1 THEN current_streak + 1
          WHEN last_date < curr_date - 1 THEN 1
          ELSE current_streak
        END
      ),
      total_points = total_points + NEW.points_earned
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_update_user_streak
AFTER INSERT ON studypro_study_sessions
FOR EACH ROW
EXECUTE FUNCTION update_user_streak();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE studypro_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE studypro_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE studypro_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE studypro_study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE studypro_user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE studypro_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE studypro_materials ENABLE ROW LEVEL SECURITY;

-- Policies: Uživatelé vidí jen svoje data
CREATE POLICY "Users can view own data" ON studypro_users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON studypro_users FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own courses" ON studypro_courses FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own courses" ON studypro_courses FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own courses" ON studypro_courses FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own courses" ON studypro_courses FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own lessons" ON studypro_lessons FOR SELECT USING (
  EXISTS (SELECT 1 FROM studypro_courses WHERE id = studypro_lessons.course_id AND user_id::text = auth.uid()::text)
);
CREATE POLICY "Users can manage own lessons" ON studypro_lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM studypro_courses WHERE id = studypro_lessons.course_id AND user_id::text = auth.uid()::text)
);

CREATE POLICY "Users can view own sessions" ON studypro_study_sessions FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage own sessions" ON studypro_study_sessions FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own achievements" ON studypro_user_achievements FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage own achievements" ON studypro_user_achievements FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own goals" ON studypro_goals FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can manage own goals" ON studypro_goals FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own materials" ON studypro_materials FOR SELECT USING (
  EXISTS (SELECT 1 FROM studypro_courses WHERE id = studypro_materials.course_id AND user_id::text = auth.uid()::text)
);
CREATE POLICY "Users can manage own materials" ON studypro_materials FOR ALL USING (
  EXISTS (SELECT 1 FROM studypro_courses WHERE id = studypro_materials.course_id AND user_id::text = auth.uid()::text)
);

-- Achievements jsou veřejné (všichni je mohou číst)
CREATE POLICY "Anyone can view achievements" ON studypro_achievements FOR SELECT TO authenticated USING (true);

-- ============================================
-- DONE! 🎉
-- ============================================
