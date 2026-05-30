create table if not exists site_content_history (
  id bigint generated always as identity primary key,
  data jsonb not null,
  saved_at timestamptz not null default now()
);
