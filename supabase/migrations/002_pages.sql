-- Generalized per-page editable content + history.
create table if not exists pages (
  slug text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists page_history (
  id bigint generated always as identity primary key,
  slug text not null,
  data jsonb not null,
  saved_at timestamptz not null default now()
);

create index if not exists page_history_slug_idx on page_history (slug, saved_at desc);
