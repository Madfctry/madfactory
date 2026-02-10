-- MadFactory Database Schema
-- Run this in your Supabase SQL editor

-- Table: ideas
create table ideas (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  category text not null,
  email text not null,
  twitter_handle text not null,
  votes integer default 0,
  status text default 'submitted',
  voting_round integer,
  created_at timestamp with time zone default now()
);

alter table ideas enable row level security;
create policy "Ideas are viewable by everyone" on ideas for select using (true);
create policy "Anyone can submit ideas" on ideas for insert with check (true);

-- Table: products
create table products (
  id uuid default gen_random_uuid() primary key,
  idea_id uuid references ideas(id),
  name text not null,
  description text not null,
  token_ticker text,
  token_mint text,
  bags_url text,
  github_url text,
  demo_url text,
  day_number integer,
  fees_earned numeric default 0,
  volume numeric default 0,
  status text default 'building',
  launched_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table products enable row level security;
create policy "Products are viewable by everyone" on products for select using (true);

-- Table: votes
create table votes (
  id uuid default gen_random_uuid() primary key,
  idea_id uuid references ideas(id),
  voter_identifier text not null,
  created_at timestamp with time zone default now(),
  unique(idea_id, voter_identifier)
);

alter table votes enable row level security;
create policy "Votes are viewable by everyone" on votes for select using (true);
create policy "Anyone can vote" on votes for insert with check (true);

-- Table: voting_rounds
create table voting_rounds (
  id uuid default gen_random_uuid() primary key,
  round_number integer not null,
  starts_at timestamp with time zone not null,
  ends_at timestamp with time zone not null,
  status text default 'active',
  winning_idea_id uuid references ideas(id),
  created_at timestamp with time zone default now()
);

alter table voting_rounds enable row level security;
create policy "Rounds are viewable by everyone" on voting_rounds for select using (true);

-- Helper function: increment votes (used by vote API)
create or replace function increment_votes(idea_id uuid)
returns void as $$
begin
  update ideas set votes = votes + 1 where id = idea_id;
end;
$$ language plpgsql security definer;
