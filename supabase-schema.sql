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
