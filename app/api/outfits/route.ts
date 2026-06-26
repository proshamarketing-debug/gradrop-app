import { NextRequest, NextResponse } from 'next/server';
import { getSavedOutfits, addSavedOutfit, deleteSavedOutfit } from '@/lib/savedOutfits';
import { SavedOutfit } from '@/lib/types';

export async function GET() {
  try {
    const outfits = await getSavedOutfits();
    return NextResponse.json(outfits);
  } catch (error) {
    console.error('Error fetching outfits:', error);
    return NextResponse.json({ error: 'Kombinler yüklenemedi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Omit<SavedOutfit, 'id' | 'savedAt'>;
    const newOutfit = await addSavedOutfit(body);
    return NextResponse.json(newOutfit);
  } catch (error) {
    console.error('Error saving outfit:', error);
    return NextResponse.json({ error: 'Kombin kaydedilemedi' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
    }

    const deleted = await deleteSavedOutfit(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Kombin bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting outfit:', error);
    return NextResponse.json({ error: 'Kombin silinemedi' }, { status: 500 });
  }
}
