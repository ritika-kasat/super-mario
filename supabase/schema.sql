-- Run this in your Supabase SQL Editor

-- Profiles table
create table profiles (
  id uuid references auth.users primary key,
  username text unique not null,
  created_at timestamp with time zone default now()
);

-- Scores table
create table scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  score integer not null,
  distance integer,
  coins_collected integer,
  played_at timestamp with time zone default now()
);

-- Leaderboard view
create or replace view leaderboard as
select 
  profiles.username,
  max(scores.score) as high_score,
  max(scores.played_at) as played_at
from scores
join profiles on scores.user_id = profiles.id
group by profiles.username
order by high_score desc
limit 100;

-- Row Level Security (RLS)
alter table profiles enable row level security;
alter table scores enable row level security;

create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

create policy "Scores are viewable by everyone" on scores for select using (true);
create policy "Users can insert their own scores" on scores for insert with check (auth.uid() = user_id);
