-- Wallip demo seed data (safe to re-run)
-- Usage in Supabase SQL Editor:
--   Paste this file and Run
-- Notes:
--   - Inserts only if slug doesn't exist.
--   - Sets is_published=true so the app shows rows.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Idempotent seed for a few wallpapers + tags.

-- Tags
INSERT INTO tags (id, name, slug)
SELECT uuid_generate_v4(), 'Nature', 'nature'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'nature');

INSERT INTO tags (id, name, slug)
SELECT uuid_generate_v4(), 'Mountains', 'mountains'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'mountains');

INSERT INTO tags (id, name, slug)
SELECT uuid_generate_v4(), 'City', 'city'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'city');

-- Wallpapers
-- 1) Nature / Mountains
WITH existing AS (
  SELECT id FROM wallpapers WHERE slug = 'misty-mountains-1' LIMIT 1
)
INSERT INTO wallpapers (
  id, title, slug, description, category, device_type, resolution,
  width, height, image_url, thumbnail_url, dominant_color,
  downloads, views, is_featured, is_published,
  source, source_id
)
SELECT
  uuid_generate_v4(),
  'Misty Mountains',
  'misty-mountains-1',
  'Demo wallpaper for Wallip',
  'Nature',
  'desktop',
  '1920x1080',
  1920, 1080,
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=60',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=480&q=60',
  '#6b7b7d',
  120, 30,
  true, true,
  'unsplash', 'demo-1'
WHERE NOT EXISTS (SELECT 1 FROM existing);

-- 2) City
WITH existing AS (
  SELECT id FROM wallpapers WHERE slug = 'city-lights-1' LIMIT 1
)
INSERT INTO wallpapers (
  id, title, slug, description, category, device_type, resolution,
  width, height, image_url, thumbnail_url, dominant_color,
  downloads, views, is_featured, is_published,
  source, source_id
)
SELECT
  uuid_generate_v4(),
  'City Lights',
  'city-lights-1',
  'Demo wallpaper for Wallip',
  'City',
  'desktop',
  '1920x1080',
  1920, 1080,
  'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1920&q=60',
  'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=480&q=60',
  '#1f2a33',
  250, 70,
  true, true,
  'unsplash', 'demo-2'
WHERE NOT EXISTS (SELECT 1 FROM existing);

-- Link tags to wallpapers
-- Misty Mountains
DO $$
DECLARE
  w_id uuid;
BEGIN
  SELECT id INTO w_id FROM wallpapers WHERE slug = 'misty-mountains-1' LIMIT 1;

  IF w_id IS NOT NULL THEN
    INSERT INTO wallpaper_tags (wallpaper_id, tag_id)
    SELECT w_id, t.id
    FROM tags t
    WHERE t.slug IN ('nature','mountains')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- City Lights
DO $$
DECLARE
  w_id uuid;
BEGIN
  SELECT id INTO w_id FROM wallpapers WHERE slug = 'city-lights-1' LIMIT 1;

  IF w_id IS NOT NULL THEN
    INSERT INTO wallpaper_tags (wallpaper_id, tag_id)
    SELECT w_id, t.id
    FROM tags t
    WHERE t.slug IN ('city')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Ensure at least one is featured & published (already set above)

