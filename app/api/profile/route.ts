import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { UserProfile } from '@/lib/types';

const profilePath = path.join(process.cwd(), 'data', 'user-profile.json');

export async function GET() {
  try {
    const data = await fs.readFile(profilePath, 'utf-8');
    const profile: UserProfile = JSON.parse(data);
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error reading profile:', error);
    return NextResponse.json({ error: 'Failed to read profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const profile: UserProfile = await request.json();

    await fs.writeFile(profilePath, JSON.stringify(profile, null, 2));

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
