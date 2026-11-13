-- Newsletter sign-ups.
--
-- Until Nov 2026 the sign-up form on /contact (and then the homepage band)
-- validated an address and threw it away: it posted nowhere, there was no
-- route behind it, and there was no table. Everyone who filled it in got a
-- thank-you for nothing. This is the table that makes it true.

create table if not exists signups (
  id bigint generated always as identity primary key,
  email text not null,
  first_name text not null default '',
  last_name text not null default '',
  -- Which form it came from, so a future second form is tellable apart.
  source text not null default 'website',
  created_at timestamptz not null default now()
);

-- Case-insensitive uniqueness. Someone signing up twice is the normal case,
-- not an error: the server action lets the insert fail on this index and
-- reads 23505 as "already on the list", which it says kindly and counts as a
-- success. The first row wins, so a second go does not overwrite the name
-- that came with the first. Addresses are stored as typed and only the index
-- is folded, so the address mailed to is the address someone gave.
create unique index if not exists signups_email_key on signups (lower(email));

create index if not exists signups_created_at_idx on signups (created_at desc);

alter table signups enable row level security;

-- No anon policies at all, and no grants. RLS denies by default, so the anon
-- key cannot insert, read, update or delete here even though the key ships in
-- the browser bundle. Writes go through the server action in app/actions.ts
-- using the service role; reads are /admin only, behind the cookie.
--
-- Deliberately NOT a "signups_public_insert" policy for anon. An insert-only
-- anon policy is the usual shape for a newsletter box, and it would work, but
-- it puts a public, unauthenticated, unthrottled INSERT endpoint on the open
-- web addressable with a key anyone can read out of the page source. For a
-- list this size, going through the server means one place to validate, one
-- place to rate limit, and nothing to point a script at.
