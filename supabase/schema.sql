-- ========================================================
-- SUPABASE DATABASE SCHEMA: BELAJAR ALAT UKUR (METROLOGI)
-- Perintah SQL untuk membuat tabel, RLS, dan Trigger di Supabase
-- ========================================================

-- 1. TABEL PROFILES (Data Pengguna & Total XP)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE, -- Username bersifat unik (tidak boleh sama)
  avatar_url TEXT,
  total_points INT DEFAULT 0 NOT NULL, -- XP awal selalu dari 0
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. TABEL USER_PROGRESS (Progres Modul & Latihan)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  module_key TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, module_key)
);

-- 3. TABEL QUIZ_SCORES (Hasil Quiz Poin & Leaderboard)
CREATE TABLE IF NOT EXISTS public.quiz_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  score INT NOT NULL,
  correct_answers INT NOT NULL,
  total_questions INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;

-- Policy Profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Policy User Progress
CREATE POLICY "Users can view their own progress" 
  ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update their own progress" 
  ON public.user_progress FOR ALL USING (auth.uid() = user_id);

-- Policy Quiz Scores
CREATE POLICY "Quiz scores viewable by everyone for leaderboard" 
  ON public.quiz_scores FOR SELECT USING (true);

CREATE POLICY "Users can insert their own quiz scores" 
  ON public.quiz_scores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================================
-- AUTOMATIC TRIGGER FOR NEW USER REGISTRATION
-- Membuat profile otomatis dengan XP = 0 saat user Sign Up
-- ========================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, total_points)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    0 -- XP awal start dari 0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pada auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
