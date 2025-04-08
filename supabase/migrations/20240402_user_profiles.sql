-- Create user profiles table
create table if not exists public.user_profiles (
    id uuid references auth.users(id) primary key,
    email text unique not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    quizzes_taken integer default 0,
    last_quiz_at timestamp with time zone,
    is_premium boolean default false
);

-- Create user preferences table
create table if not exists public.user_preferences (
    user_id uuid references auth.users(id) primary key,
    email_notifications boolean default true,
    quiz_difficulty text default 'medium',
    theme text default 'light',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS policies
alter table public.user_profiles enable row level security;
alter table public.user_preferences enable row level security;

-- Users can read their own profile
create policy "Users can view own profile"
    on public.user_profiles
    for select
    using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
    on public.user_profiles
    for update
    using (auth.uid() = id);

-- Users can read their own preferences
create policy "Users can view own preferences"
    on public.user_preferences
    for select
    using (auth.uid() = user_id);

-- Users can update their own preferences
create policy "Users can update own preferences"
    on public.user_preferences
    for update
    using (auth.uid() = user_id);

-- Function to handle user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.user_profiles (id, email)
    values (new.id, new.email);

    insert into public.user_preferences (user_id)
    values (new.id);

    return new;
end;
$$;

-- Trigger to create profile and preferences when a user signs up
create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user(); 