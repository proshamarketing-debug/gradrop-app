import { SavedOutfit } from './types';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = path.join(process.cwd(), 'data');
const SAVED_OUTFITS_FILE = path.join(DATA_DIR, 'saved-outfits.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
}

export async function getSavedOutfits(): Promise<SavedOutfit[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(SAVED_OUTFITS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function saveSavedOutfits(outfits: SavedOutfit[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(SAVED_OUTFITS_FILE, JSON.stringify(outfits, null, 2), 'utf-8');
}

export async function addSavedOutfit(outfit: Omit<SavedOutfit, 'id' | 'savedAt'>): Promise<SavedOutfit> {
  const outfits = await getSavedOutfits();
  const newOutfit: SavedOutfit = {
    ...outfit,
    id: uuidv4(),
    savedAt: new Date().toISOString(),
  };
  outfits.push(newOutfit);
  await saveSavedOutfits(outfits);
  return newOutfit;
}

export async function deleteSavedOutfit(id: string): Promise<boolean> {
  const outfits = await getSavedOutfits();
  const filtered = outfits.filter((o) => o.id !== id);
  if (filtered.length === outfits.length) {
    return false;
  }
  await saveSavedOutfits(filtered);
  return true;
}

export async function getSavedOutfit(id: string): Promise<SavedOutfit | null> {
  const outfits = await getSavedOutfits();
  return outfits.find((o) => o.id === id) || null;
}
