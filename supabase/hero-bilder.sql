-- Bildausschnitt (Fokuspunkt) der Hero-Bilder, einstellbar im Admin unter „Hero-Bilder“.
-- Einmal im Supabase SQL Editor ausführen.
create table if not exists public.hero_images (
  page_key      text primary key,
  focus_desktop text not null default '50% 50%',
  focus_mobile  text not null default '50% 50%',
  updated_at    timestamptz not null default now()
);

alter table public.hero_images enable row level security;
-- Zugriff nur über den Server (Service-Role); keine öffentlichen Rechte
revoke all on public.hero_images from anon, authenticated;
