-- ============================================================
-- ResumeForge — Initial Schema
-- Run this in your Supabase project's SQL editor or via
-- `supabase migration up` if using the Supabase CLI.
-- ============================================================

-- 0. Extensions
-- ============================================================
create extension if not exists "pgcrypto";


-- 1. Profiles (extends auth.users)
-- ============================================================
create table if not exists public.profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  email             text not null,
  name              text,
  avatar_url        text,
  subscription_tier text not null default 'free',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);


-- 2. Resumes
-- ============================================================
create table if not exists public.resumes (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  data        jsonb       not null,
  cl          jsonb,
  template    text,
  metadata    jsonb       default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_resumes_user_id on public.resumes(user_id);

alter table public.resumes enable row level security;

create policy "Users can view own resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

create policy "Users can insert own resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own resumes"
  on public.resumes for update
  using (auth.uid() = user_id);

create policy "Users can delete own resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);


-- 3. Resume Slots (named versions of a resume)
-- ============================================================
create table if not exists public.resume_slots (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  name        text        not null,
  data        jsonb       not null,
  cl          jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_resume_slots_user_id on public.resume_slots(user_id);

alter table public.resume_slots enable row level security;

create policy "Users can view own slots"
  on public.resume_slots for select
  using (auth.uid() = user_id);

create policy "Users can insert own slots"
  on public.resume_slots for insert
  with check (auth.uid() = user_id);

create policy "Users can update own slots"
  on public.resume_slots for update
  using (auth.uid() = user_id);

create policy "Users can delete own slots"
  on public.resume_slots for delete
  using (auth.uid() = user_id);


-- 4. Cover Letters (standalone, not tied to a specific resume)
-- ============================================================
create table if not exists public.cover_letters (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  resume_id   uuid        references public.resumes(id) on delete set null,
  data        jsonb       not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_cover_letters_user_id on public.cover_letters(user_id);

alter table public.cover_letters enable row level security;

create policy "Users can view own cover letters"
  on public.cover_letters for select
  using (auth.uid() = user_id);

create policy "Users can insert own cover letters"
  on public.cover_letters for insert
  with check (auth.uid() = user_id);

create policy "Users can update own cover letters"
  on public.cover_letters for update
  using (auth.uid() = user_id);

create policy "Users can delete own cover letters"
  on public.cover_letters for delete
  using (auth.uid() = user_id);


-- 5. Subscriptions (mirrors Stripe data)
-- ============================================================
create table if not exists public.subscriptions (
  id                     uuid        primary key default gen_random_uuid(),
  user_id                uuid        not null references auth.users(id) on delete cascade unique,
  stripe_customer_id     text,
  stripe_subscription_id text,
  tier                   text        not null default 'free',
  status                 text        not null default 'inactive',
  current_period_end     timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert own subscription"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own subscription"
  on public.subscriptions for update
  using (auth.uid() = user_id);


-- 6. Auto-Create Profile on Signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 7. Auto-Update updated_at Timestamps
-- ============================================================
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array['profiles', 'resumes', 'resume_slots', 'cover_letters', 'subscriptions']
  loop
    execute format(
      'create trigger if not exists set_updated_at before update on public.%I
       for each row execute function public.update_updated_at_column()', t
    );
  end loop;
end;
$$;
