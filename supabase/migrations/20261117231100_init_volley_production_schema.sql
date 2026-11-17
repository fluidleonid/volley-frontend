-- Volley Production Schema for Supabase (Postgres 17)
-- Separate tables for Coaches (Admins) and Players, multi-coach support, achievements, and RLS.

create table if not exists public.coaches (
  id uuid primary key default gen_random_uuid(),
  telegram_id bigint unique,
  telegram_username text unique,
  name text not null,
  avatar_url text,
  public_training_cost integer not null default 4000,
  private_training_cost integer not null default 10000,
  weekly_schedule jsonb not null default '[]'::jsonb,
  special_dates jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  telegram_id bigint unique,
  telegram_username text,
  phone text,
  name text not null,
  avatar_url text,
  level integer not null default 1,
  xp numeric(10,1) not null default 0.0,
  bp_total numeric(10,1) not null default 0.0,
  bp_today numeric(10,1) not null default 0.0,
  status text not null default 'spectating',
  is_hardmode boolean not null default false,
  has_telegram boolean not null default false,
  is_guest boolean not null default false,
  created_by_coach_id uuid references public.coaches(id) on delete set null,
  games_played integer not null default 0,
  wins integer not null default 0,
  hardmode_wins integer not null default 0,
  win_streak integer not null default 0,
  max_win_streak integer not null default 0,
  party_matches_played integer not null default 0,
  sessions_attended integer not null default 0,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists players_created_by_coach_id_idx on public.players (created_by_coach_id);
create index if not exists players_bp_total_idx on public.players (bp_total desc);

create table if not exists public.coach_players (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.coaches(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  notes text,
  trainings_count integer not null default 0,
  last_attended_at timestamptz,
  created_at timestamptz not null default now(),
  unique (coach_id, player_id)
);

create index if not exists coach_players_coach_id_idx on public.coach_players (coach_id);
create index if not exists coach_players_player_id_idx on public.coach_players (player_id);

create table if not exists public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.coaches(id) on delete cascade,
  status text not null default 'active',
  scheduled_start timestamptz,
  started_at timestamptz default now(),
  ended_at timestamptz,
  courts jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists training_sessions_coach_id_idx on public.training_sessions (coach_id);
create index if not exists training_sessions_status_idx on public.training_sessions (status);

create table if not exists public.session_attendances (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.training_sessions(id) on delete cascade,
  coach_id uuid not null references public.coaches(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  checked_out_at timestamptz,
  is_active boolean not null default true,
  unique (session_id, player_id)
);

create index if not exists session_attendances_session_id_idx on public.session_attendances (session_id);
create index if not exists session_attendances_coach_id_idx on public.session_attendances (coach_id);
create index if not exists session_attendances_player_id_idx on public.session_attendances (player_id);

create table if not exists public.private_sessions (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.coaches(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  session_date date not null,
  session_time text not null,
  status text not null default 'upcoming',
  cost integer not null default 10000,
  created_at timestamptz not null default now()
);

create index if not exists private_sessions_coach_id_idx on public.private_sessions (coach_id);
create index if not exists private_sessions_player_id_idx on public.private_sessions (player_id);

create table if not exists public.billing_transactions (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.coaches(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  session_type text not null default 'public',
  amount integer not null,
  status text not null default 'unpaid',
  payment_method text,
  session_date date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists billing_transactions_coach_id_idx on public.billing_transactions (coach_id);
create index if not exists billing_transactions_player_id_idx on public.billing_transactions (player_id);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.training_sessions(id) on delete set null,
  coach_id uuid references public.coaches(id) on delete set null,
  court_name text not null default '#1',
  is_hardmode boolean not null default false,
  team_a_ids uuid[] not null default '{}',
  team_b_ids uuid[] not null default '{}',
  team_a_snapshot jsonb not null default '[]'::jsonb,
  team_b_snapshot jsonb not null default '[]'::jsonb,
  score_a integer not null default 0,
  score_b integer not null default 0,
  winner_team text,
  xp_deltas jsonb not null default '{}'::jsonb,
  bp_deltas jsonb not null default '{}'::jsonb,
  played_date date not null default current_date,
  played_time text not null default '12:00',
  created_at timestamptz not null default now()
);

create index if not exists matches_session_id_idx on public.matches (session_id);
create index if not exists matches_coach_id_idx on public.matches (coach_id);
create index if not exists matches_played_date_idx on public.matches (played_date desc);

create table if not exists public.achievements_catalog (
  id text primary key,
  title text not null,
  description text not null,
  rarity text not null default 'Common',
  icon_key text not null,
  max_progress integer not null default 1,
  glow_color text,
  sort_order integer not null default 0
);

create table if not exists public.player_achievements (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  achievement_id text not null references public.achievements_catalog(id) on delete cascade,
  progress integer not null default 0,
  is_earned boolean not null default false,
  earned_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (player_id, achievement_id)
);

create index if not exists player_achievements_player_id_idx on public.player_achievements (player_id);
create index if not exists player_achievements_achievement_id_idx on public.player_achievements (achievement_id);

create table if not exists public.player_blacklist (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  blocked_player_id uuid not null references public.players(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (player_id, blocked_player_id)
);

create index if not exists player_blacklist_player_id_idx on public.player_blacklist (player_id);
create index if not exists player_blacklist_blocked_player_id_idx on public.player_blacklist (blocked_player_id);
