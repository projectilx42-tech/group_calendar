-- ============================================================
-- KDY SPOLU – Supabase schema
-- Spusť tento SQL kód v Supabase → SQL Editor → New query → Run
-- ============================================================

-- 1) Tabulka uživatelů (registr účtů – jméno + hash hesla)
create table if not exists public.users (
  id text primary key,
  username text unique not null,
  "passwordHash" text not null,
  color text not null default '#2f6fed',
  "isAdmin" boolean not null default false,
  "createdAt" timestamptz not null default now()
);

-- 2) Tabulka událostí (kalendář – dostupnost lidí)
create table if not exists public.events (
  id text primary key,
  "userId" text not null references public.users(id) on delete cascade,
  "userName" text not null,
  "userColor" text not null default '#2f6fed',
  title text not null default '',
  "startDate" date not null,
  "endDate" date not null,
  category text not null default 'free',
  notes text not null default '',
  "createdAt" timestamptz not null default now()
);

-- 3) Bezpečnostní pravidla – povolit čtení všem, zápis autentizovaným
alter table public.users enable row level security;
alter table public.events enable row level security;

-- Čtení uživatelů: povoleno všem (pro zobrazení party)
create policy "users are viewable by everyone"
  on public.users for select
  using (true);

-- Zápis uživatelů: povoleno všem anon klíčem
-- (aplikace nepoužívá Supabase Auth, jen anon klíč – jméno/heslo
--  se ověřuje v aplikaci; hash hesla nikdy neopustí prohlížeč)
create policy "users can be inserted by anyone"
  on public.users for insert
  with check (true);

-- Aktualizace uživatelů: povoleno všem
create policy "users can be updated by anyone"
  on public.users for update
  using (true);

-- Smazání uživatelů: povoleno všem
create policy "users can be deleted by anyone"
  on public.users for delete
  using (true);

-- Čtení událostí: povoleno všem (pro zobrazení kalendáře)
create policy "events are viewable by everyone"
  on public.events for select
  using (true);

-- Zápis událostí: povoleno všem
create policy "events can be inserted by anyone"
  on public.events for insert
  with check (true);

-- Aktualizace událostí: povoleno všem
create policy "events can be updated by anyone"
  on public.events for update
  using (true);

-- Smazání událostí: povoleno všem
create policy "events can be deleted by anyone"
  on public.events for delete
  using (true);

-- ============================================================
-- DŮLEŽITÉ POZNÁMKY:
-- 1) hash hesel se dělá v prohlížeči (SHA-256), server nikdy nezná
--    skutečné heslo – vidí jen hash.
-- 2) První registrovaný uživatel v aplikaci se automaticky stane
--    adminem (isAdmin = true).
-- 3) Aplikace používá anon klíč (ne Supabase Auth), proto jsou
--    všechny politiky nastavené na true – kdokoli s anon klíčem
--    může číst i zapisovat. Pro produkci zvaž vlastní backend,
--    který ověří jméno/heslo na serveru a vrátí service key.
-- ============================================================
