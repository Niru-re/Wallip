-- Wallip Database Schema (Supabase / PostgreSQL)
-- Run in Supabase SQL Editor: https://supabase.com/dashboard

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Re-runnable schema (prevents "relation already exists" errors)
DROP TABLE IF EXISTS collection_wallpapers;
DROP TABLE IF EXISTS user_favorites;
DROP TABLE IF EXISTS collections;
DROP TABLE IF EXISTS download_events;
DROP TABLE IF EXISTS wallpaper_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS wallpapers;


-- ─── Wallpapers ───────────────────────────────────────────────────────────

CREATE TABLE wallpapers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  category      TEXT NOT NULL,
  device_type   TEXT NOT NULL CHECK (device_type IN ('mobile', 'desktop', 'laptop', 'tablet', 'ultrawide')),
  resolution    TEXT NOT NULL,          -- e.g. "1920x1080"
  width         INTEGER NOT NULL,
  height        INTEGER NOT NULL,
  image_url     TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  dominant_color TEXT,                  -- hex color for filter-by-color
  downloads     INTEGER NOT NULL DEFAULT 0,
  views         INTEGER NOT NULL DEFAULT 0,
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  is_published  BOOLEAN NOT NULL DEFAULT true,
  source        TEXT,                   -- 'unsplash', 'pexels', 'pixabay', 'original'
  source_id     TEXT,                   -- external API ID for deduplication
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wallpapers_category    ON wallpapers(category);
CREATE INDEX idx_wallpapers_device      ON wallpapers(device_type);
CREATE INDEX idx_wallpapers_resolution  ON wallpapers(resolution);
CREATE INDEX idx_wallpapers_downloads   ON wallpapers(downloads DESC);
CREATE INDEX idx_wallpapers_views       ON wallpapers(views DESC);
CREATE INDEX idx_wallpapers_created_at  ON wallpapers(created_at DESC);
CREATE INDEX idx_wallpapers_featured    ON wallpapers(is_featured) WHERE is_featured = true;
CREATE INDEX idx_wallpapers_published   ON wallpapers(is_published) WHERE is_published = true;

-- Full-text search
ALTER TABLE wallpapers ADD COLUMN search_vector TSVECTOR
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
  ) STORED;

CREATE INDEX idx_wallpapers_search ON wallpapers USING GIN(search_vector);

-- ─── Tags ───────────────────────────────────────────────────────────────────

CREATE TABLE tags (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL UNIQUE,
  slug       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE wallpaper_tags (
  wallpaper_id UUID NOT NULL REFERENCES wallpapers(id) ON DELETE CASCADE,
  tag_id       UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (wallpaper_id, tag_id)
);

CREATE INDEX idx_wallpaper_tags_wallpaper ON wallpaper_tags(wallpaper_id);
CREATE INDEX idx_wallpaper_tags_tag       ON wallpaper_tags(tag_id);

-- ─── Users & Favorites (Phase 2) ──────────────────────────────────────────

CREATE TABLE user_favorites (
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wallpaper_id UUID NOT NULL REFERENCES wallpapers(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, wallpaper_id)
);

CREATE TABLE collections (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  description TEXT,
  is_public   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE collection_wallpapers (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  wallpaper_id  UUID NOT NULL REFERENCES wallpapers(id) ON DELETE CASCADE,
  added_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (collection_id, wallpaper_id)
);

-- ─── Analytics ────────────────────────────────────────────────────────────

CREATE TABLE download_events (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallpaper_id UUID NOT NULL REFERENCES wallpapers(id) ON DELETE CASCADE,
  ip_hash      TEXT,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Helper Functions ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION increment_downloads(wallpaper_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE wallpapers SET downloads = downloads + 1 WHERE id = wallpaper_uuid;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_views(wallpaper_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE wallpapers SET views = views + 1 WHERE id = wallpaper_uuid;
END;
$$ LANGUAGE plpgsql;

-- ─── Row Level Security ─────────────────────────────────────────────────────

ALTER TABLE wallpapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallpaper_tags ENABLE ROW LEVEL SECURITY;

-- Public read access for published wallpapers
CREATE POLICY "Public read wallpapers"
  ON wallpapers FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public read tags"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Public read wallpaper_tags"
  ON wallpaper_tags FOR SELECT
  USING (true);

-- Service role handles writes (admin uploads via API routes)
