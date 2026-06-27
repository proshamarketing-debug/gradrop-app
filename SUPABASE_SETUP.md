# Supabase Setup

## 1. Run SQL Migration

https://app.supabase.com > SQL Editor > + New Query

Kopyala ve çalıştır:

```sql
-- Create wardrobe_items table
CREATE TABLE IF NOT EXISTS wardrobe_items (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  color VARCHAR(20),
  color_name VARCHAR(100),
  color_temp VARCHAR(50),
  size VARCHAR(50),
  season TEXT[],
  image TEXT,
  brand VARCHAR(100),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wardrobe_items_created_at ON wardrobe_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wardrobe_items_type ON wardrobe_items(type);

-- Create outfits table
CREATE TABLE IF NOT EXISTS outfits (
  id TEXT PRIMARY KEY,
  name VARCHAR(200),
  description TEXT,
  items JSONB NOT NULL,
  image_url TEXT,
  match_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outfits_created_at ON outfits(created_at DESC);

-- Create lookbook table
CREATE TABLE IF NOT EXISTS lookbook (
  id TEXT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url TEXT,
  outfit_id TEXT REFERENCES outfits(id),
  tags JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lookbook_created_at ON lookbook(created_at DESC);
```

## 2. Storage Bucket

Storage > + New Bucket
- Name: `images`
- Public: ON

## Done! ✅

Şimdi test et!
