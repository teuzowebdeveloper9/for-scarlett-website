create table if not exists public.music_lyrics (
  id uuid primary key default gen_random_uuid(),
  music_id text not null unique,
  title text not null,
  artist text not null,
  lyrics_json jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists music_lyrics_music_id_idx
  on public.music_lyrics (music_id);
