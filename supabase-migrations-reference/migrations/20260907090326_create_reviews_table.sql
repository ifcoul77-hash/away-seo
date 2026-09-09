/*
# Create reviews table for visitor-submitted client reviews

1. New Tables
- `reviews`
  - `id` (uuid, primary key)
  - `name` (text, not null) — reviewer's display name
  - `location` (text, nullable) — reviewer's city/country
  - `rating` (integer, not null, 1–5) — star rating
  - `text` (text, not null) — review content
  - `approved` (boolean, default false) — moderation flag, only approved reviews show on site
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `reviews`.
- SELECT: anyone (anon + authenticated) can read approved reviews only.
- INSERT: anyone (anon + authenticated) can submit a review, but only with approved=false (prevents self-approval).
- No UPDATE or DELETE for anon/authenticated — moderation happens via Supabase dashboard.

3. Important Notes
- This is a single-tenant site with no sign-in, so policies use `TO anon, authenticated`.
- Reviews are moderated: visitors submit, owner approves via Supabase dashboard.
- Rating is constrained to 1–5 via a CHECK constraint.
*/

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text text NOT NULL,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_approved_reviews" ON reviews;
CREATE POLICY "anon_read_approved_reviews"
ON reviews FOR SELECT
TO anon, authenticated
USING (approved = true);

DROP POLICY IF EXISTS "anon_insert_reviews" ON reviews;
CREATE POLICY "anon_insert_reviews"
ON reviews FOR INSERT
TO anon, authenticated
WITH CHECK (approved = false);
