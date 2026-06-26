# Supabase Kurulum Adımları

## 1. Supabase Projesi Oluştur
- [supabase.com](https://supabase.com) adresine git
- Yeni bir proje oluştur
- Proje dashboard'dan URL ve anon key'i kopyala
- `.env.local` dosyasındaki bu değişkenleri güncelle:
  - `NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY`

## 2. Veritabanı Tabloları Oluştur
Dashboard > SQL Editor'da aşağıdaki SQL'i çalıştır:

```sql
-- Wardrobe Items Table
CREATE TABLE IF NOT EXISTS public.wardrobe_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  color text NOT NULL,
  color_name text NOT NULL,
  color_temp text NOT NULL,
  size text NOT NULL,
  season text[] NOT NULL DEFAULT '{}',
  image text,
  brand text,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Saved Outfits Table
CREATE TABLE IF NOT EXISTS public.saved_outfits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  items jsonb NOT NULL DEFAULT '[]',
  harmony_type text NOT NULL,
  score integer NOT NULL,
  explanation text NOT NULL,
  suggested_items jsonb NOT NULL DEFAULT '[]',
  saved_at timestamptz NOT NULL DEFAULT now()
);

-- User Profile Table
CREATE TABLE IF NOT EXISTS public.user_profile (
  id uuid PRIMARY KEY DEFAULT 'EXAMPLE-UUID-HERE'::uuid,
  name text,
  height_cm integer,
  weight_kg integer,
  body_shape text,
  skin_tone text,
  hair_color text,
  hair_style text,
  style_persona text,
  gender text,
  profile_image text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

## 3. Storage Bucket Oluştur
- Dashboard > Storage'a git
- "New Bucket" butonuna tıkla
- Bucket adı: `images`
- Public access: **açık** (Public)
- Create bucket

## 4. Test Et
```bash
npm run dev
```

Tarayıcıda açılan uygulamada kıyafet eklemeyi dene. Görsel yüklenmeli ve veritabanında saklanmalı.

## Not
- Auth olmadan çalışıyor (tek kullanıcı, tüm veriler paylaşılıyor)
- Auth istersen, sonraki aşamada ekleyeceğiz
