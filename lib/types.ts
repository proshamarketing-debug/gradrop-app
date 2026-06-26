export type ClothingType = 'üst' | 'alt' | 'ayakkabı' | 'dış giyim' | 'aksesuar' | 'elbise';
export type ColorTemp = 'sıcak' | 'soğuk' | 'nötr';
export type Season = 'ilkbahar' | 'yaz' | 'sonbahar' | 'kış';
export type HarmonyType = 'monokromatik' | 'analogous' | 'complementary' | 'triadic' | 'split-complementary' | 'tetradic' | 'square' | 'none';
export type BodyShape = 'slim' | 'average' | 'athletic' | 'curvy' | 'plus';
export type SkinTone = 'light' | 'medium' | 'olive' | 'dark' | 'deep';
export type HairColor = 'black' | 'brown' | 'blonde' | 'red' | 'grey' | 'white';
export type HairStyle = 'short' | 'medium' | 'long' | 'curly' | 'bun';
export type StylePersona = 'casual' | 'formal' | 'smart-casual' | 'sporty' | 'bohemian';
export type Gender = 'female' | 'male' | 'unisex';

export interface ClothingItem {
  id: string;
  name: string;
  type: ClothingType;
  color: string; // HEX renk kodu
  colorName: string; // "Lacivert", "Beyaz" vb.
  colorTemp: ColorTemp;
  size: string;
  season: Season[];
  image?: string; // /uploads/ klasöründe dosya adı
  brand?: string;
  tags: string[];
  createdAt: string;
}

export interface OutfitSuggestion {
  items: ClothingItem[];
  harmonyType: HarmonyType;
  score: number; // 0-100
  explanation: string;
  suggestedItems?: Array<{
    type: ClothingType;
    colorName: string;
    reason: string;
  }>;
}

export interface MissingPiece {
  type: ClothingType;
  color: string;
  colorName: string;
  reason: string;
  examples?: string[];
}

export interface SavedOutfit {
  id: string;
  items: ClothingItem[];
  harmonyType: HarmonyType;
  score: number;
  explanation: string;
  savedAt: string;
  suggestedItems?: Array<{
    type: ClothingType;
    colorName: string;
    reason: string;
  }>;
}

export interface UserProfile {
  name: string;
  heightCm: number;
  weightKg: number;
  bodyShape: BodyShape;
  skinTone: SkinTone;
  hairColor: HairColor;
  hairStyle: HairStyle;
  stylePersona: StylePersona;
  gender: Gender;
  profileImage?: string;
}
