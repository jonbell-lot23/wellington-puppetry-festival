-- Row-level security: public read for live page content; writes via service role only.

alter table pages enable row level security;
alter table page_history enable row level security;

create policy "pages_public_read"
  on pages for select
  using (true);

-- page_history has no anon policies — history reads/writes use the service role in server actions.

grant select on pages to anon, authenticated;
