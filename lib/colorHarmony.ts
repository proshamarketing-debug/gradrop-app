import tinycolor from 'tinycolor2';
import { ClothingItem, HarmonyType } from './types';

function normalizeHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

function hueDifference(h1: number, h2: number): number {
  const diff = Math.abs(normalizeHue(h1) - normalizeHue(h2));
  return Math.min(diff, 360 - diff);
}

export function getColorHarmony(hex1: string, hex2: string): HarmonyType {
  const c1 = tinycolor(hex1);
  const c2 = tinycolor(hex2);

  if (!c1.isValid() || !c2.isValid()) return 'none';

  const h1 = c1.toHsv().h;
  const h2 = c2.toHsv().h;
  const diff = hueDifference(h1, h2);

  if (diff < 15) return 'monokromatik';
  if (diff < 40) return 'analogous';
  if (diff > 160 && diff < 200) return 'complementary';
  if ((diff > 100 && diff < 140) || (diff > 220 && diff < 260)) return 'triadic';
  if (diff > 130 && diff < 160) return 'split-complementary';
  if ((diff > 70 && diff < 110) || (diff > 250 && diff < 290)) return 'tetradic';
  if ((diff > 80 && diff < 100) || (diff > 170 && diff < 190) || (diff > 260 && diff < 280)) return 'square';

  return 'none';
}

export function scoreOutfit(items: ClothingItem[]): number {
  if (items.length < 2) return 50;

  let harmonyScore = 0;
  let pairCount = 0;

  // Renk uyumu puanlaması
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const harmony = getColorHarmony(items[i].color, items[j].color);
      const scores: Record<HarmonyType, number> = {
        monokromatik: 95,
        analogous: 90,
        complementary: 85,
        triadic: 85,
        'split-complementary': 80,
        tetradic: 75,
        square: 75,
        none: 40,
      };
      harmonyScore += scores[harmony];
      pairCount++;
    }
  }

  const avgHarmony = pairCount > 0 ? harmonyScore / pairCount : 50;

  // Mevsim uygunluğu
  let seasonBonus = 0;
  const seasons = items.flatMap((i) => i.season);
  if (seasons.length > 0) {
    const seasonCounts = seasons.reduce(
      (acc, s) => ({ ...acc, [s]: (acc[s as keyof typeof acc] || 0) + 1 }),
      {} as Record<string, number>
    );
    const maxCount = Math.max(...Object.values(seasonCounts));
    seasonBonus = (maxCount / items.length) * 10;
  }

  // Tip çeşitliliği
  const types = new Set(items.map((i) => i.type));
  const typeBonus = Math.min(types.size * 3, 15);

  return Math.min(Math.round(avgHarmony * 0.7 + seasonBonus + typeBonus), 100);
}

export function suggestMissingColors(wardrobeItems: ClothingItem[]): string[] {
  if (wardrobeItems.length === 0) {
    return ['Siyah', 'Beyaz', 'Lacivert', 'Grimelanj'];
  }

  const existingHues = wardrobeItems.map((item) => {
    const c = tinycolor(item.color);
    return c.toHsv().h;
  });

  // Ana renk kategorileri
  const categories = [
    { name: 'Kırmızı', hue: 0, range: 30 },
    { name: 'Turuncu', hue: 30, range: 30 },
    { name: 'Sarı', hue: 60, range: 30 },
    { name: 'Yeşil', hue: 120, range: 30 },
    { name: 'Mavi', hue: 240, range: 30 },
    { name: 'Mor', hue: 270, range: 30 },
  ];

  const coverage: Record<string, number> = {};
  categories.forEach((cat) => {
    let count = 0;
    existingHues.forEach((h) => {
      const diff = hueDifference(h, cat.hue);
      if (diff < cat.range) count++;
    });
    coverage[cat.name] = count;
  });

  // En az kaplanı kategorileri öner
  const missing = Object.entries(coverage)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)
    .map(([name]) => name);

  // Nötr renkleri kontrol et
  const grays = wardrobeItems.filter((i) => {
    const c = tinycolor(i.color);
    const s = c.toHsv().s;
    return s < 10;
  });

  if (grays.length < 2) missing.push('Gri tonları');

  return [...new Set(missing)];
}
