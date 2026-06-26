# 👗 My Wardrobe - Gardrop & Kombin Uygulaması

Gardropunuzu yönetin, renk uyumuna göre AI destekli kombin önerileri alın ve eksik parçalarını keşfedin.

## 🚀 Başlamak

### Ön Gereksinimler
- Node.js 18+
- npm

### Kurulum

```bash
# Proje dizinine gir
cd my-wardrobe-app

# Bağımlılıkları yükle
npm install
```

### Ortam Değişkenleri

`.env.local` dosyasını oluştur ve Anthropic API anahtarını ekle:

```
ANTHROPIC_API_KEY=sk-ant-YOUR_API_KEY_HERE
```

[Anthropic Console](https://console.anthropic.com) adresinden API anahtarını al.

### Geliştirme Sunucusunu Başlat

```bash
npm run dev
```

Tarayıcında açın: `http://localhost:3000`

## 📋 Özellikler

### 1. Gardrop Yönetimi (`/wardrobe`)
- ✅ Kıyafet ekleme
- ✅ Kıyafetleri tür, renk, mevsim gibi özelliklerine göre kategorilendirme
- ✅ Kıyafet silme
- ✅ Tipe göre filtreleme

**Kıyafet Bilgileri:**
- Ad
- Tür: üst, alt, ayakkabı, dış giyim, aksesuar, elbise
- Renk (HEX kodu + Renk Adı)
- Renk Sıcaklığı: sıcak, soğuk, nötr
- Beden: XS, S, M, L, XL, vb.
- Mevsimler: ilkbahar, yaz, sonbahar, kış
- Marka (isteğe bağlı)
- Etiketler (virgülle ayrılmış)

### 2. Kombin Önerileri (`/outfits`)
- ✅ AI destekli kombin önerileri (Claude API)
- ✅ Etkinlik türüne göre önerilendirme (iş, parti, casual, vs.)
- ✅ Hava durumuna göre önerilendirme
- ✅ Stil tercihine göre önerilendirme
- ✅ Renk uyumu analizi ve puanlama (0-100)
- ✅ Kombinlerin neden uyumlu olduğunun açıklaması

**Renk Uyumu Şemaları:**
- 🎨 **Monokromatik** — Tek rengin tonları (şık, sade)
- 🌈 **Analogous** — Renk çarkında yan yana 3 renk (doğal, uyumlu)
- ✨ **Tamamlayıcı** — Karşı renkler (çarpıcı, canlı)
- 🔺 **Triadik** — 120° aralıklı 3 renk (canlı ama dengeli)
- 🌙 **Split-Complementary** — Baz + 2 komşu tamamlayıcı (cesur)
- 🎭 **Tetradik** — 2 tamamlayıcı çift (renkli ama dikkatli)
- 📦 **Square** — 90° aralıklı 4 renk (dengeli)

### 3. Eksik Parça Önerileri (`/missing`)
- ✅ Gardropun boşluklarını analiz etme
- ✅ Yapılabilecek ve yapılamayacak kombinlerin analizi
- ✅ En çok ihtiyaç duyulan parçaları önerme
- ✅ Her parça için renk ve tür önerileri

## 📁 Proje Yapısı

```
my-wardrobe-app/
├── app/
│   ├── page.tsx                 # Dashboard
│   ├── layout.tsx               # Root layout + Navbar
│   ├── wardrobe/page.tsx        # Gardrop yönetimi
│   ├── outfits/page.tsx         # Kombin önerileri
│   ├── missing/page.tsx         # Eksik parçalar
│   ├── globals.css
│   └── api/
│       ├── wardrobe/route.ts    # GET/POST/PUT/DELETE kıyafet
│       ├── suggest/route.ts     # Claude AI kombin önerisi
│       └── missing/route.ts     # Claude AI eksik parça önerisi
├── components/
│   ├── Navbar.tsx               # Üst navigasyon
│   ├── ClothingCard.tsx         # Kıyafet kartı
│   ├── AddClothingModal.tsx     # Kıyafet ekleme formu
│   ├── OutfitCard.tsx           # Kombin kartı
│   └── ColorBadge.tsx           # Renk rozeti (hazır)
├── lib/
│   ├── types.ts                 # TypeScript tipleri
│   ├── colorHarmony.ts          # Renk uyumu motoru
│   └── storage.ts               # JSON CRUD işlemleri
├── data/
│   └── wardrobe.json            # Kıyafet veritabanı (local)
├── public/uploads/              # Kıyafet fotoğrafları
├── .env.local                   # API KEY (GİZLİ)
├── package.json
└── tsconfig.json
```

## 🔧 Teknoloji Stack

- **Next.js 14** — Full-stack React framework
- **TypeScript** — Tip güvenliği
- **Tailwind CSS** — Hızlı UI geliştirme
- **Claude API** — AI destekli öneriler
- **tinycolor2** — Renk hesaplamaları

## 🎯 Kullanım Senaryoları

### Senaryo 1: Basit Kombin Önerisi
1. Gardrop bölümüne gidin
2. 3-4 kıyafet ekleyin (farklı renkler ve tipler)
3. Kombinler bölümüne gidin
4. "Etkinlik Türü: İş" yazın ve "Kombin Öner" tıklayın
5. Claude AI'dan uyumlu kombin önerileri alın

### Senaryo 2: Gardrop Tamamlama
1. Tüm kıyafetlerinizi gardrop bölümüne ekleyin
2. Eksik Parçalar bölümüne gidin
3. Gardropun hangi renklere ihtiyacı olduğunu görmek için listesine bakın
4. Claude'un önerdiği ürünleri alışverişe ekleyin

### Senaryo 3: Mevsimsel Kombinler
1. Kıyafetlere mevsim etiketleri ekleyin
2. Kombinler bölümüne gidin
3. "Hava Durumu: Soğuk" yazıp önerileri alın

## 📊 Veri Modeli

### ClothingItem
```typescript
{
  id: string;                    // UUID
  name: string;                  // "Mavi T-shirt"
  type: ClothingType;            // "üst"
  color: string;                 // "#0066CC"
  colorName: string;             // "Mavi"
  colorTemp: ColorTemp;          // "soğuk"
  size: string;                  // "M"
  season: Season[];              // ["ilkbahar", "yaz"]
  brand?: string;                // "Nike"
  tags: string[];                // ["casual", "summer"]
  createdAt: string;             // ISO date
}
```

### OutfitSuggestion
```typescript
{
  items: ClothingItem[];         // Seçilen kıyafetler
  harmonyType: HarmonyType;      // Renk uyumu türü
  score: number;                 // 0-100 puanlama
  explanation: string;           // Neden uyumlu
}
```

## 🌈 Renk Uyumu Motoru

`lib/colorHarmony.ts` dosyasında renk uyumu kuralları implementedir:

- **Hue Farkları:** İki rengin renk çarkı arasındaki açısal mesafe
- **Monokromatik:** < 15° (aynı renk tonları)
- **Analogous:** < 40° (komşu renkler)
- **Complementary:** 160-200° (tam karşı renkler)
- **Puanlama:** Her kombinasyon 0-100 arası puanlanır

### 60-30-10 Kuralı
- %60 Baskın Renk
- %30 İkincil Renk
- %10 Aksesuar Renği

## 🤖 Claude AI Entegrasyonu

### `/api/suggest`
Gardropdaki kıyafetlerle Claude API'ye çağrı yaparak kombin önerileri:
- Model: `claude-sonnet-4-6`
- Max tokens: 500
- JSON format yanıt

### `/api/missing`
Gardropun hangi parçalara ihtiyacı olduğunu analiz:
- Model: `claude-sonnet-4-6`
- Max tokens: 1000
- Renk ve tür önerileri

## 📝 Örnek API Çağrıları

### Kombin Önerisi İste
```bash
curl -X POST http://localhost:3000/api/suggest \
  -H "Content-Type: application/json" \
  -d '{
    "occasion": "İş",
    "weather": "Normal",
    "style": "Klasik"
  }'
```

### Kıyafet Ekle
```bash
curl -X POST http://localhost:3000/api/wardrobe \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Siyah Pantolon",
    "type": "alt",
    "color": "#000000",
    "colorName": "Siyah",
    "colorTemp": "nötr",
    "size": "M",
    "season": ["sonbahar", "kış"],
    "brand": "Zara",
    "tags": ["elegant", "formal"]
  }'
```

### Gardrop Listele
```bash
curl http://localhost:3000/api/wardrobe
```

## ⚙️ Ayarlar

### API Model Seçimi
`app/api/suggest/route.ts` ve `app/api/missing/route.ts` içinde model değiştir:
- `claude-opus-4-8` — Daha güçlü ama yavaş
- `claude-sonnet-4-6` — Dengeli (varsayılan)
- `claude-haiku-4-5` — Hızlı ama daha az kapasiteli

## 🐛 Sorun Giderme

### "API key gerekli" hatası
→ `.env.local` dosyasında geçerli bir API key olduğundan emin ol

### Kıyafet eklenmiyor
→ Form doğrulaması: ad, renk ve renk adı boş olamaz

### Kombin önerisi geçmiyor
→ Gardropunda en az 2-3 kıyafet olması gerekli

### "Veriler yüklenemedi" hatası
→ Dev sunucusu çalışıyor mu kontrol et (`npm run dev`)

## 🚀 İleriye Dönük Özellikler

- [ ] Kıyafet fotoğrafı yükleme (AWS S3)
- [ ] Veritabanı entegrasyonu (PostgreSQL)
- [ ] Kullanıcı hesapları ve giriş
- [ ] Sosyal paylaşım (Instagram, Pinterest)
- [ ] Combo geçmişi ve favori kombinler
- [ ] Hava durumu entegrasyonu (gerçek zamanlı)
- [ ] Ürün fiyat karşılaştırması
- [ ] Mobil uygulama (React Native)

## 📄 Lisans

MIT

---

**Hazır mısınız? Haydi başlayın!** 🎉

```bash
npm run dev
# Ardından http://localhost:3000 açın
```
