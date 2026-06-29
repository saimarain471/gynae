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

create table if not exists blog_posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  category text not null default 'General',
  author text not null default 'Dr. Zainab Mohsin',
  read_time integer not null default 5 check (read_time > 0),
  cover_image_url text,
  content text not null,
  published boolean not null default false,
  views integer not null default 0 check (views >= 0)
);

create table if not exists faqs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  question text not null,
  answer text not null,
  category text not null default 'General',
  sort_order integer not null default 0,
  published boolean not null default false
);

create table if not exists testimonials (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  patient_name text not null,
  city text not null,
  rating integer not null check (rating between 1 and 5),
  review_text text not null,
  service_type text not null default 'Consultation',
  approved boolean not null default false,
  featured boolean not null default false
);

create index if not exists class_bookings_created_at_idx on class_bookings (created_at desc);
create index if not exists class_bookings_status_idx on class_bookings (status);
create index if not exists consultation_bookings_created_at_idx on consultation_bookings (created_at desc);
create index if not exists consultation_bookings_status_idx on consultation_bookings (status);
create index if not exists blog_posts_published_created_at_idx on blog_posts (published, created_at desc);
create index if not exists blog_posts_category_idx on blog_posts (category);
create index if not exists faqs_published_sort_order_idx on faqs (published, sort_order);
create index if not exists testimonials_approved_featured_created_at_idx on testimonials (approved, featured, created_at desc);
