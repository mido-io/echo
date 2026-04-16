-- Add Profile features to the public.profiles table
ALTER TABLE public.profiles
ADD COLUMN handle text UNIQUE,
ADD COLUMN display_name text,
ADD COLUMN bio text;

-- Add a constraint to ensure handles are alphanumeric and lowercase
ALTER TABLE public.profiles
ADD CONSTRAINT handle_format CHECK (handle ~ '^[a-z0-9_]{3,15}$');
