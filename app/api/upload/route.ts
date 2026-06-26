import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

async function removeBackground(buffer: Buffer, mimeType: string): Promise<Buffer | null> {
  try {
    const apiKey = process.env.REMOVEBG_API_KEY;
    if (!apiKey) {
      console.warn('REMOVEBG_API_KEY not set, skipping background removal');
      return null;
    }

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
    formData.append('image_file', blob);
    formData.append('format', 'png');
    formData.append('type', 'product');
    formData.append('size', 'auto');

    const res = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
      },
      body: formData,
    });

    if (!res.ok) {
      console.error('Remove.bg API error:', res.status, res.statusText);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Background removal error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const removebg = formData.get('removeBackground') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    let bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);

    // Remove background if requested (for clothing items)
    if (removebg) {
      const cleanedBuffer = await removeBackground(buffer, file.type);
      if (cleanedBuffer) {
        buffer = cleanedBuffer;
      }
    }

    const ext = removebg ? 'png' : (file.name.split('.').pop() || 'jpg');
    const filename = `${uuidv4()}.${ext}`;
    const filepath = join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({
      success: true,
      filename: filename,
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Yükleme başarısız' }, { status: 500 });
  }
}
