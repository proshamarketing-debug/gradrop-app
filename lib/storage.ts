import { supabase } from './supabase';
import { ClothingItem } from './types';
import { v4 as uuidv4 } from 'uuid';

export async function getWardrobe(): Promise<ClothingItem[]> {
  try {
    const { data, error } = await supabase
      .from('wardrobe_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching wardrobe:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      color: item.color,
      colorName: item.color_name,
      colorTemp: item.color_temp,
      size: item.size,
      season: item.season || [],
      image: item.image,
      brand: item.brand,
      tags: item.tags || [],
      createdAt: item.created_at,
    }));
  } catch (error) {
    console.error('Error fetching wardrobe:', error);
    return [];
  }
}

export async function addClothingItem(item: ClothingItem): Promise<ClothingItem> {
  try {
    // Ensure ID is a valid UUID
    const id = item.id && item.id.length === 36 ? item.id : uuidv4();

    const { data, error } = await supabase
      .from('wardrobe_items')
      .insert([
        {
          id,
          name: item.name,
          type: item.type,
          color: item.color,
          color_name: item.colorName,
          color_temp: item.colorTemp,
          size: item.size,
          season: item.season,
          image: item.image || null,
          brand: item.brand || null,
          tags: item.tags || [],
          created_at: item.createdAt,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding clothing item:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      color: data.color,
      colorName: data.color_name,
      colorTemp: data.color_temp,
      size: data.size,
      season: data.season,
      image: data.image,
      brand: data.brand,
      tags: data.tags,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('Error adding clothing item:', error);
    throw error;
  }
}

export async function updateClothingItem(id: string, updates: Partial<ClothingItem>): Promise<ClothingItem | null> {
  try {
    const updateData: any = {};

    if (updates.name) updateData.name = updates.name;
    if (updates.type) updateData.type = updates.type;
    if (updates.color) updateData.color = updates.color;
    if (updates.colorName) updateData.color_name = updates.colorName;
    if (updates.colorTemp) updateData.color_temp = updates.colorTemp;
    if (updates.size) updateData.size = updates.size;
    if (updates.season) updateData.season = updates.season;
    if (updates.image) updateData.image = updates.image;
    if (updates.brand) updateData.brand = updates.brand;
    if (updates.tags) updateData.tags = updates.tags;

    const { data, error } = await supabase
      .from('wardrobe_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating clothing item:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      color: data.color,
      colorName: data.color_name,
      colorTemp: data.color_temp,
      size: data.size,
      season: data.season,
      image: data.image,
      brand: data.brand,
      tags: data.tags,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('Error updating clothing item:', error);
    return null;
  }
}

export async function deleteClothingItem(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('wardrobe_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting clothing item:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting clothing item:', error);
    return false;
  }
}

export async function getClothingItem(id: string): Promise<ClothingItem | null> {
  try {
    const { data, error } = await supabase
      .from('wardrobe_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching clothing item:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      color: data.color,
      colorName: data.color_name,
      colorTemp: data.color_temp,
      size: data.size,
      season: data.season,
      image: data.image,
      brand: data.brand,
      tags: data.tags,
      createdAt: data.created_at,
    };
  } catch (error) {
    console.error('Error fetching clothing item:', error);
    return null;
  }
}
