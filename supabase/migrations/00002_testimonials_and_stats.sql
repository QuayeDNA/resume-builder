-- ── Live site statistics (counts actual rows from existing tables) ──
create or replace function public.get_site_stats()
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  resume_count   integer;
  user_count     integer;
  cover_count    integer;
begin
  select count(*) into resume_count from public.resumes;
  select count(*) into user_count   from public.profiles;
  select count(*) into cover_count  from public.cover_letters;
  return json_build_object(
    'resumesBuilt', resume_count,
    'totalUsers',   user_count,
    'coverLetters', cover_count
  );
end;
$$;

grant execute on function public.get_site_stats() to anon, authenticated;

-- ── Testimonials (public) ──
create table if not exists public.testimonials (
  id         uuid        primary key default gen_random_uuid(),
  quote      text        not null,
  name       text        not null,
  role       text        not null,
  rating     smallint    not null default 5,
  sort_order integer     not null default 0,
  visible    boolean     not null default true,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

drop policy if exists "Anyone can read visible testimonials" on public.testimonials;
create policy "Anyone can read visible testimonials"
  on public.testimonials for select
  using (visible = true);
