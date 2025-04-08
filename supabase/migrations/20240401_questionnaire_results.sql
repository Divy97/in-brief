-- Create questionnaire_results table
create table if not exists public.questionnaire_results (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id),
    questionnaire_type text not null,
    answers jsonb not null default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS policies
alter table public.questionnaire_results enable row level security;

-- Allow users to view their own results
create policy "Users can view own results"
    on public.questionnaire_results
    for select
    using (auth.uid() = user_id);

-- Allow users to insert their own results
create policy "Users can insert own results"
    on public.questionnaire_results
    for insert
    with check (
        auth.uid() = user_id or
        user_id is null  -- Allow anonymous submissions
    );

-- Create index for faster queries
create index if not exists questionnaire_results_user_id_idx
    on public.questionnaire_results(user_id);

-- Create index for questionnaire type queries
create index if not exists questionnaire_results_type_idx
    on public.questionnaire_results(questionnaire_type); 