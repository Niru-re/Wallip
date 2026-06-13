-- Wallip demo seed data (safe to re-run)
-- Usage in Supabase SQL Editor:
--   Paste this file and Run
-- Notes:
--   - Inserts only if slug doesn't exist.
--   - Sets is_published=true so the app shows rows.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Idempotent seed for demo wallpapers + tags.

-- Tags
-- (keep slugs lowercase because app filters by tag name -> tag.name)
INSERT INTO tags (id, name, slug)
SELECT uuid_generate_v4(), 'nature', 'nature'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'nature');

INSERT INTO tags (id, name, slug)
SELECT uuid_generate_v4(), 'mountains', 'mountains'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'mountains');

INSERT INTO tags (id, name, slug)
SELECT uuid_generate_v4(), 'city', 'city'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'city');

INSERT INTO tags (id, name, slug)
SELECT uuid_generate_v4(), 'space', 'space'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'space');

INSERT INTO tags (id, name, slug)
SELECT uuid_generate_v4(), 'minimal', 'minimal'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'minimal');

INSERT INTO tags (id, name, slug)
SELECT uuid_generate_v4(), 'neon', 'neon'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'neon');

INSERT INTO tags (id, name, slug)
SELECT uuid_generate_v4(), 'forest', 'forest'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'forest');

INSERT INTO tags (id, name, slug)
SELECT uuid_generate_v4(), 'ocean', 'ocean'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'ocean');

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
  'nature',
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
  'technology',
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

-- 3) Forest
WITH existing AS (
  SELECT id FROM wallpapers WHERE slug = 'forest-mist-1' LIMIT 1
)
INSERT INTO wallpapers (
  id, title, slug, description, category, device_type, resolution,
  width, height, image_url, thumbnail_url, dominant_color,
  downloads, views, is_featured, is_published,
  source, source_id
)
SELECT
  uuid_generate_v4(),
  'Forest Mist',
  'forest-mist-1',
  'Demo wallpaper for Wallip',
  'nature',
  'desktop',
  '3840x2160',
  3840, 2160,
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=60',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=480&q=60',
  '#22c55e',
  10400, 41000,
  true, true,
  'unsplash', 'demo-3'
WHERE NOT EXISTS (SELECT 1 FROM existing);

-- 4) Space
WITH existing AS (
  SELECT id FROM wallpapers WHERE slug = 'solar-flare-1' LIMIT 1
)
INSERT INTO wallpapers (
  id, title, slug, description, category, device_type, resolution,
  width, height, image_url, thumbnail_url, dominant_color,
  downloads, views, is_featured, is_published,
  source, source_id
)
SELECT
  uuid_generate_v4(),
  'Solar Flare',
  'solar-flare-1',
  'Demo wallpaper for Wallip',
  'space',
  'desktop',
  '2560x1440',
  2560, 1440,
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=60',
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=480&q=60',
  '#f59e0b',
  13200, 54000,
  true, true,
  'unsplash', 'demo-4'
WHERE NOT EXISTS (SELECT 1 FROM existing);

-- 5) Minimal
WITH existing AS (
  SELECT id FROM wallpapers WHERE slug = 'minimal-grid-1' LIMIT 1
)
INSERT INTO wallpapers (
  id, title, slug, description, category, device_type, resolution,
  width, height, image_url, thumbnail_url, dominant_color,
  downloads, views, is_featured, is_published,
  source, source_id
)
SELECT
  uuid_generate_v4(),
  'Minimal Grid',
  'minimal-grid-1',
  'Demo wallpaper for Wallip',
  'minimalist',
  'laptop',
  '2880x1800',
  2880, 1800,
  'https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=1920&q=60',
  'https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=480&q=60',
  '#94a3b8',
  7200, 25000,
  false, true,
  'unsplash', 'demo-5'
WHERE NOT EXISTS (SELECT 1 FROM existing);

-- 6) Neon
WITH existing AS (
  SELECT id FROM wallpapers WHERE slug = 'cyber-highlights-1' LIMIT 1
)
INSERT INTO wallpapers (
  id, title, slug, description, category, device_type, resolution,
  width, height, image_url, thumbnail_url, dominant_color,
  downloads, views, is_featured, is_published,
  source, source_id
)
SELECT
  uuid_generate_v4(),
  'Cyber Highlights',
  'cyber-highlights-1',
  'Demo wallpaper for Wallip',
  'technology',
  'desktop',
  '1920x1080',
  1920, 1080,
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=60',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=480&q=60',
  '#06b6d4',
  15400, 62000,
  true, true,
  'unsplash', 'demo-6'
WHERE NOT EXISTS (SELECT 1 FROM existing);

-- 7) Ocean
WITH existing AS (
  SELECT id FROM wallpapers WHERE slug = 'underwater-calm-1' LIMIT 1
)
INSERT INTO wallpapers (
  id, title, slug, description, category, device_type, resolution,
  width, height, image_url, thumbnail_url, dominant_color,
  downloads, views, is_featured, is_published,
  source, source_id
)
SELECT
  uuid_generate_v4(),
  'Underwater Calm',
  'underwater-calm-1',
  'Demo wallpaper for Wallip',
  'animals',
  'mobile',
  '1080x1920',
  1080, 1920,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=60',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=480&q=60',
  '#60a5fa',
  6700, 21000,
  false, true,
  'unsplash', 'demo-7'
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
    WHERE t.slug IN ('city','neon')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Forest Mist
DO $$
DECLARE
  w_id uuid;
BEGIN
  SELECT id INTO w_id FROM wallpapers WHERE slug = 'forest-mist-1' LIMIT 1;

  IF w_id IS NOT NULL THEN
    INSERT INTO wallpaper_tags (wallpaper_id, tag_id)
    SELECT w_id, t.id
    FROM tags t
    WHERE t.slug IN ('nature','forest','mountains')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Solar Flare
DO $$
DECLARE
  w_id uuid;
BEGIN
  SELECT id INTO w_id FROM wallpapers WHERE slug = 'solar-flare-1' LIMIT 1;

  IF w_id IS NOT NULL THEN
    INSERT INTO wallpaper_tags (wallpaper_id, tag_id)
    SELECT w_id, t.id
    FROM tags t
    WHERE t.slug IN ('space')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Minimal Grid
DO $$
DECLARE
  w_id uuid;
BEGIN
  SELECT id INTO w_id FROM wallpapers WHERE slug = 'minimal-grid-1' LIMIT 1;

  IF w_id IS NOT NULL THEN
    INSERT INTO wallpaper_tags (wallpaper_id, tag_id)
    SELECT w_id, t.id
    FROM tags t
    WHERE t.slug IN ('minimal')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Cyber Highlights
DO $$
DECLARE
  w_id uuid;
BEGIN
  SELECT id INTO w_id FROM wallpapers WHERE slug = 'cyber-highlights-1' LIMIT 1;

  IF w_id IS NOT NULL THEN
    INSERT INTO wallpaper_tags (wallpaper_id, tag_id)
    SELECT w_id, t.id
    FROM tags t
    WHERE t.slug IN ('neon','city')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Underwater Calm
DO $$
DECLARE
  w_id uuid;
BEGIN
  SELECT id INTO w_id FROM wallpapers WHERE slug = 'underwater-calm-1' LIMIT 1;

  IF w_id IS NOT NULL THEN
    INSERT INTO wallpaper_tags (wallpaper_id, tag_id)
    SELECT w_id, t.id
    FROM tags t
    WHERE t.slug IN ('ocean')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Ensure at least one is featured & published (set per-row)


