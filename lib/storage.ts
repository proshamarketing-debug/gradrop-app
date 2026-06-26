import { promises as fs } from 'fs';
import path from 'path';
import { ClothingItem } from './types';

const WARDROBE_FILE = path.join(process.cwd(), 'data', 'wardrobe.json');

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

export async function getWardrobe(): Promise<ClothingItem[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(WARDROBE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveWardrobe(items: ClothingItem[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(WARDROBE_FILE, JSON.stringify(items, null, 2), 'utf-8');
}

export async function addClothingItem(item: ClothingItem): Promise<ClothingItem> {
  const wardrobe = await getWardrobe();
  wardrobe.push(item);
  await saveWardrobe(wardrobe);
  return item;
}

export async function updateClothingItem(id: string, updates: Partial<ClothingItem>): Promise<ClothingItem | null> {
  const wardrobe = await getWardrobe();
  const index = wardrobe.findIndex((item) => item.id === id);
  if (index === -1) return null;

  wardrobe[index] = { ...wardrobe[index], ...updates };
  await saveWardrobe(wardrobe);
  return wardrobe[index];
}

export async function deleteClothingItem(id: string): Promise<boolean> {
  const wardrobe = await getWardrobe();
  const filtered = wardrobe.filter((item) => item.id !== id);
  if (filtered.length === wardrobe.length) return false;

  await saveWardrobe(filtered);
  return true;
}

export async function getClothingItem(id: string): Promise<ClothingItem | null> {
  const wardrobe = await getWardrobe();
  return wardrobe.find((item) => item.id === id) || null;
}
