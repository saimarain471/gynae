-- Supabase SQL schema for Dr. Zainab Mohsin website

create table if not exists class_bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  whatsapp_number text not null,
  city text not null,
  class_id integer not null,
  class_title text not null,
  class_price integer not null,
  payment_method text not null,
  transaction_id text not null,
  additional_notes text,
  status text default 'pending'
);

create table if not exists consultation_bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  whatsapp_number text not null,
  city text not null,
  preferred_date text not null,
  preferred_time text not null,
  concern text not null,
  payment_method text not null,
  transaction_id text not null,
  additional_notes text,
  status text default 'pending'
);

-- ── Content tables ────────────────────────────────────────────
create table if not exists blog_posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  title text not null,
  slug text not null unique,
  category text,
  excerpt text,
  content text,
  author text default 'Dr. Zainab Mohsin',
  read_time integer default 5,
  cover_image_url text,
  published boolean default false,
  views integer default 0
);

create table if not exists faqs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  question text not null,
  answer text not null,
  category text,
  sort_order integer default 0,
  published boolean default true
);

create table if not exists testimonials (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  patient_name text not null,
  city text,
  rating integer not null,
  review_text text not null,
  service_type text,
  featured boolean default false,
  approved boolean default false
);

-- ── Atomic blog view counter ──────────────────────────────────
-- Used by BlogPost.jsx so concurrent readers can't clobber each
-- other's increment (read-then-write would lose updates).
create or replace function increment_blog_views(post_id uuid)
returns void
language sql
as $$
  update blog_posts set views = coalesce(views, 0) + 1 where id = post_id;
$$;

-- ── Row Level Security (STRONGLY RECOMMENDED) ─────────────────
-- The anon key ships in the client bundle, so without RLS anyone
-- can read/modify every row. Enable RLS and add policies that:
--   • allow public INSERT of bookings + testimonials (approved=false)
--   • allow public SELECT only of published blog_posts/faqs and
--     approved testimonials
--   • restrict UPDATE/DELETE and admin reads to authenticated staff
-- Example (adjust to your auth setup):
--
--   alter table consultation_bookings enable row level security;
--   create policy "public insert" on consultation_bookings
--     for insert to anon with check (true);
--   -- (no anon SELECT policy => anon cannot read bookings)
--
--   alter table blog_posts enable row level security;
--   create policy "read published" on blog_posts
--     for select using (published = true);
