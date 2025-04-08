# InBrief - AI-Powered Quiz Generator

## Project Overview

- We are building a website using NEXTJS and SUPABASE where users paste links to articles or YouTube videos, and we generate questionnaires for them.
- The application uses AI to analyze content and create relevant quiz questions.

## Authentication Requirements

### User Flow

- **Anonymous Access**: Users can browse the website and create 1 quiz without signing in
- **Registration Required**: After creating one quiz, users must sign up to save their quiz and create more
- **Daily Limits**: Free users can create up to 3 quizzes per day
- **Premium Option**: Premium users will have higher or unlimited quiz creation limits

### Authentication Methods

1. **Email/Password Authentication**

   - Standard signup with email verification
   - Login with email/password

2. **Social Authentication** (optional for future)

   - Google
   - GitHub
   - Others as needed

3. **Magic Link Authentication**
   - Passwordless login via email link

## Database Schema

### Authentication Tables

- Managed by Supabase Auth

### Application Tables

```sql
-- Authentication is handled by Supabase Auth

-- User profiles table (enhanced)
create table user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  quizzes_taken integer default 0,
  last_quiz_at timestamp with time zone,
  is_premium boolean default false,
  subscription_tier text default 'free',
  subscription_expires_at timestamp with time zone
);

-- User preferences table (keep as is)
create table user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email_notifications boolean default true,
  quiz_difficulty text default 'medium',
  theme text default 'dark',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Quizzes table (new)
create table quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  topic text not null,
  difficulty text default 'medium',
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- For anonymous quiz creators
  session_id text
);

-- Quiz questions table (new)
create table quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references quizzes(id) on delete cascade not null,
  question text not null,
  options jsonb,
  correct_answer text,
  explanation text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Quiz usage tracking (new)
create table quiz_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date default current_date not null,
  quizzes_created integer default 0,
  last_created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Questionnaire results (keep as is)
create table questionnaire_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  quiz_id uuid references quizzes(id) on delete cascade,
  questionnaire_type text,
  answers jsonb,
  score numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Function to set session ID for anonymous users
CREATE OR REPLACE FUNCTION set_session_id(session_id text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_session_id', session_id, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated and anon roles
GRANT EXECUTE ON FUNCTION set_session_id(text) TO authenticated;
GRANT EXECUTE ON FUNCTION set_session_id(text) TO anon;
```

### Row Level Security Policies

```sql
-- Disable RLS for all tables
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_usage DISABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_results DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update their preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can view their own or public quizzes" ON quizzes;
DROP POLICY IF EXISTS "Users can insert quizzes" ON quizzes;
DROP POLICY IF EXISTS "Users can update their own quizzes" ON quizzes;
DROP POLICY IF EXISTS "Users can delete their own quizzes" ON quizzes;
DROP POLICY IF EXISTS "Only quiz owners can view quiz questions" ON quiz_questions;
DROP POLICY IF EXISTS "Only quiz owners can insert questions" ON quiz_questions;
DROP POLICY IF EXISTS "Only quiz owners can update questions" ON quiz_questions;
DROP POLICY IF EXISTS "Only quiz owners can delete questions" ON quiz_questions;
DROP POLICY IF EXISTS "Users can view their quiz usage" ON quiz_usage;
DROP POLICY IF EXISTS "Users can insert/update their quiz usage" ON quiz_usage;
DROP POLICY IF EXISTS "Users can view their results" ON questionnaire_results;
DROP POLICY IF EXISTS "Users can insert their results" ON questionnaire_results;

-- Drop the session_id function since we won't need it without RLS
DROP FUNCTION IF EXISTS set_session_id(text);
```

## Implementation Plan

### 1. Authentication Setup

- Initialize Supabase client
- Configure auth redirects and callbacks
- Create auth pages (sign-up, sign-in, forgot-password)
- Implement protected routes

### 2. Anonymous User Flow

- Track anonymous sessions
- Limit anonymous quiz creation to 1
- Show sign-up prompt after first quiz

### 3. User Management

- User profile creation and management
- User preferences storage and retrieval
- Track quiz usage and apply limits

### 4. Quiz Generation & Storage

- Create quiz generation form
- Store quizzes with proper user associations
- Implement limit checking before quiz creation

### 5. Quiz Taking & Results

- Quiz displaying interface
- Results calculation and storage
- User quiz history

### 6. Premium Features (Future)

- Payment integration
- Subscription management
- Tier-based feature access

## Tooling

- NextJS for frontend and API routes
- Supabase for authentication and database
- Tailwind CSS for styling
- Shadcn UI components
- AI integration for quiz generation
