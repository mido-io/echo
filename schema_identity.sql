-- 1. Updates to Profiles Table
ALTER TABLE public.profiles
ADD COLUMN avatar_url text,
ADD COLUMN header_url text;

-- 2. Follows System Mapping Table
CREATE TABLE public.follows (
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  PRIMARY KEY (follower_id, following_id)
);

-- Enable RLS on Follows
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Follow Policies
CREATE POLICY "Follows are public." ON public.follows
  FOR SELECT USING (true);

CREATE POLICY "Users can follow others." ON public.follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others." ON public.follows
  FOR DELETE USING (auth.uid() = follower_id);

-- 3. Storage Setup (Assuming the buckets 'avatars' and 'headers' are manually created in the dashboard)
-- Run these after creating public buckets "avatars" and "headers" in Supabase Storage.
-- (Or create them via the Supabase dashboard)

CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload an avatar."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

CREATE POLICY "Anyone can update their own avatar."
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'avatars' AND auth.uid() = owner )
  WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

CREATE POLICY "Header images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'headers' );

CREATE POLICY "Anyone can upload a header."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'headers' AND auth.role() = 'authenticated' );
