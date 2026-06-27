import { SavedOutfit } from './types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';

export async function getSavedOutfits(): Promise<SavedOutfit[]> {
  try {
    const { data, error } = await supabase
      .from('outfits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching outfits:', error);
      return [];
    }

    return (data || []).map(outfit => ({
      id: outfit.id,
      items: outfit.items,
      harmonyType: outfit.harmony_type || 'none',
      score: outfit.match_score || 0,
      explanation: outfit.description || '',
      savedAt: outfit.created_at,
    }));
  } catch (error) {
    console.error('Error fetching outfits:', error);
    return [];
  }
}

export async function addSavedOutfit(outfit: Omit<SavedOutfit, 'id' | 'savedAt'>): Promise<SavedOutfit> {
  try {
    const id = uuidv4();
    const { data, error } = await supabase
      .from('outfits')
      .insert([
        {
          id,
          name: outfit.harmonyType || 'Untitled Outfit',
          description: outfit.explanation || null,
          items: outfit.items,
          harmony_type: outfit.harmonyType,
          match_score: outfit.score || null,
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding outfit:', error);
      throw error;
    }

    return {
      id: data.id,
      items: data.items,
      harmonyType: data.harmony_type || 'none',
      score: data.match_score || 0,
      explanation: data.description || '',
      savedAt: data.created_at,
    };
  } catch (error) {
    console.error('Error adding outfit:', error);
    throw error;
  }
}

export async function deleteSavedOutfit(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('outfits')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting outfit:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting outfit:', error);
    return false;
  }
}

export async function getSavedOutfit(id: string): Promise<SavedOutfit | null> {
  try {
    const { data, error } = await supabase
      .from('outfits')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching outfit:', error);
      return null;
    }

    return {
      id: data.id,
      items: data.items,
      harmonyType: data.harmony_type || 'none',
      score: data.match_score || 0,
      explanation: data.description || '',
      savedAt: data.created_at,
    };
  } catch (error) {
    console.error('Error fetching outfit:', error);
    return null;
  }
}
