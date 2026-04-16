-- Create a table for public profiles
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Basic table for Microblogging Posts (Max 280 chars)
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content varchar(280) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.posts enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

-- Policies for Posts (Global reverse-chronological feed)
create policy "Posts are viewable by everyone." on public.posts
  for select using (true);

create policy "Users can insert their own posts." on public.posts
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own posts." on public.posts
  for delete using (auth.uid() = user_id);

-- Create a Trigger to handle new user signups automatically
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
