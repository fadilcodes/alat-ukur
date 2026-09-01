-- ========================================================
-- SUPABASE DATABASE OVERHAUL SCHEMA: BELAJAR ALAT UKUR CMS & ADMIN
-- ========================================================

-- 1. USERS TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' NOT NULL CHECK (role IN ('admin', 'user')),
  total_points INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Backwards compatibility profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' NOT NULL CHECK (role IN ('admin', 'user')),
  total_points INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Ensure role column exists on profiles & users as TEXT
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' NOT NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' NOT NULL;

-- 3. SITE SETTINGS TABLE (Single-Row CMS Table)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_title TEXT NOT NULL DEFAULT 'Belajar Alat Ukur - Metrologi Industri',
  site_description TEXT NOT NULL DEFAULT 'Platform E-Learning Gamifikasi interaktif 2D & 3D untuk belajar Jangka Sorong dan Mikrometer Sekrup.',
  hero_title TEXT NOT NULL DEFAULT 'Kuasai Alat Ukur Presisi Secara Interaktif',
  hero_description TEXT NOT NULL DEFAULT 'Pelajari cara membaca Jangka Sorong & Mikrometer Sekrup melalui modul interaktif, simulasi 3D realistis, dan tantangan Quiz ber-point!',
  seo_keywords TEXT DEFAULT 'alat ukur, jangka sorong, mikrometer sekrup, metrologi, e-learning, simulasi 3D',
  contact_email TEXT DEFAULT 'admin@alatukur.id',
  announcement TEXT DEFAULT 'Selamat datang di E-Learning Alat Ukur Presisi!',
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Insert default single row for site_settings
INSERT INTO public.site_settings (id, site_title, site_description, hero_title, hero_description, seo_keywords, contact_email, announcement)
VALUES (
  1,
  'Belajar Alat Ukur - Metrologi Industri',
  'Platform E-Learning Gamifikasi interaktif 2D & 3D untuk belajar Jangka Sorong dan Mikrometer Sekrup.',
  'Kuasai Alat Ukur Presisi Secara Interaktif',
  'Pelajari cara membaca Jangka Sorong & Mikrometer Sekrup melalui modul interaktif, simulasi 3D realistis, dan tantangan Quiz ber-point!',
  'alat ukur, jangka sorong, mikrometer sekrup, metrologi, e-learning, simulasi 3D',
  'admin@alatukur.id',
  'Selamat datang di E-Learning Alat Ukur Presisi!'
)
ON CONFLICT (id) DO NOTHING;

-- 4. MODULES TABLE (CMS Learning Content)
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'Metrologi' NOT NULL,
  description TEXT,
  content_body TEXT NOT NULL,
  image_url TEXT,
  order_index INT DEFAULT 0 NOT NULL,
  is_published BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. QUIZ QUESTIONS TABLE (CRUD Quiz Management)
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  points INT DEFAULT 10 NOT NULL,
  explanation TEXT,
  order_index INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. USER SCORES / LEADERBOARD TABLE
CREATE TABLE IF NOT EXISTS public.user_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  score INT NOT NULL,
  correct_answers INT NOT NULL,
  total_questions INT NOT NULL,
  module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quiz_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  score INT NOT NULL,
  correct_answers INT NOT NULL,
  total_questions INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========================================================
-- HELPER FUNCTIONS & TRIGGERS
-- ========================================================

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  ) OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Trigger function for new user registration (Ultra Safe TEXT-based PL/pgSQL)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT := 'user';
  base_username TEXT;
  final_username TEXT;
BEGIN
  IF (NEW.raw_user_meta_data->>'role') = 'admin' THEN
    assigned_role := 'admin';
  END IF;

  base_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1),
    'user_' || substring(NEW.id::text from 1 for 6)
  );
  final_username := base_username;

  -- Insert into public.users safely
  BEGIN
    INSERT INTO public.users (id, email, username, role, total_points)
    VALUES (NEW.id, NEW.email, final_username, assigned_role, 0)
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      username = EXCLUDED.username;
  EXCEPTION WHEN OTHERS THEN
    BEGIN
      final_username := base_username || '_' || substring(NEW.id::text from 1 for 4);
      INSERT INTO public.users (id, email, username, role, total_points)
      VALUES (NEW.id, NEW.email, final_username, assigned_role, 0)
      ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END;

  -- Insert into public.profiles safely
  BEGIN
    INSERT INTO public.profiles (id, email, username, role, total_points)
    VALUES (NEW.id, NEW.email, final_username, assigned_role, 0)
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      username = EXCLUDED.username;
  EXCEPTION WHEN OTHERS THEN
    BEGIN
      INSERT INTO public.profiles (id, email, username, role, total_points)
      VALUES (NEW.id, NEW.email, final_username, assigned_role, 0)
      ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for syncing user total_points upon score insertion
CREATE OR REPLACE FUNCTION public.update_user_total_points()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    UPDATE public.users
    SET total_points = total_points + NEW.score,
        updated_at = NOW()
    WHERE id = NEW.user_id;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    UPDATE public.profiles
    SET total_points = total_points + NEW.score,
        updated_at = NOW()
    WHERE id = NEW.user_id;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_user_score_inserted ON public.user_scores;
CREATE TRIGGER on_user_score_inserted
  AFTER INSERT ON public.user_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_user_total_points();

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;

-- Policy USERS & PROFILES
CREATE POLICY "Users viewable by authenticated users or public leaderboard" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users insertable on register" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own non-role fields" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins full management of users" ON public.users FOR ALL USING (public.is_admin());

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profiles insertable on register" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Profiles updated by owner" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins full management of profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Policy SITE SETTINGS
CREATE POLICY "Site settings viewable by everyone" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Site settings editable by admins only" ON public.site_settings FOR ALL USING (public.is_admin());

-- Policy MODULES
CREATE POLICY "Modules viewable by everyone" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Modules manageable by admins only" ON public.modules FOR ALL USING (public.is_admin());

-- Policy QUIZ QUESTIONS
CREATE POLICY "Quiz questions viewable by everyone" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Quiz questions manageable by admins only" ON public.quiz_questions FOR ALL USING (public.is_admin());

-- Policy USER SCORES & QUIZ SCORES
CREATE POLICY "User scores viewable by everyone" ON public.user_scores FOR SELECT USING (true);
CREATE POLICY "Users can insert own scores" ON public.user_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage user scores" ON public.user_scores FOR ALL USING (public.is_admin());

CREATE POLICY "Quiz scores viewable by everyone" ON public.quiz_scores FOR SELECT USING (true);
CREATE POLICY "Users can insert own quiz scores" ON public.quiz_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage quiz scores" ON public.quiz_scores FOR ALL USING (public.is_admin());
