import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';
import { getWardrobe } from '@/lib/storage';
import { suggestMissingColors } from '@/lib/colorHarmony';
import { MissingPiece } from '@/lib/types';
import { Language } from '@/lib/translations';

const client = new Anthropic();

const getMissingPrompt = (language: Language, wardrobeInfo: any, missingColors: string[]) => {
  const prompts = {
    tr: `Sen bir moda danışmanısın. Aşağıdaki gardropun boşluklarını analiz et ve eksik kıyafet parçaları öner.

MEVCUT GARDROP:
${JSON.stringify(wardrobeInfo, null, 2)}

KAPLANMAYAN RENKLER:
${missingColors.join(', ')}

Analiz Et:
1. Bu gardropla ne tür kombinler yapılabiliyor?
2. Ne tür kombinler yapılamıyor?
3. En çok ihtiyaç duyulan parçalar neler?
4. Her parça için renk ve tür önerileri

Yanıt formatı (JSON):
{
  "suggestions": [
    {
      "type": "üst" | "alt" | "ayakkabı" | "dış giyim" | "aksesuar",
      "colorName": "Renk adı",
      "reason": "Neden bu renk ve parça gerekli",
      "examples": ["örnek 1", "örnek 2"]
    }
  ],
  "analysis": "Genel analiz ve öneriler"
}`,
    az: `Siz bir moda məsləhətçisisiniz. Aşağıdakı geyim dolabının boşluğunu analiz edin və çatışan geyim parçalarını təklif edin.

MÖVCUD GEYIM DOLABI:
${JSON.stringify(wardrobeInfo, null, 2)}

TUTULMAYAN RƏNGLƏR:
${missingColors.join(', ')}

Analiz Edin:
1. Bu geyim dolabı ilə hansı kombinlər edilə bilər?
2. Hansı kombinlər edilə bilməz?
3. Ən çox tələb olunan parçalar hansılardır?
4. Hər parça üçün rəng və tip təklifləri

Cavab Formatı (JSON):
{
  "suggestions": [
    {
      "type": "üst" | "alt" | "ayakkabı" | "xarici giyim" | "aksesor",
      "colorName": "Rəng adı",
      "reason": "Bu rəng və parça niyə lazımdır",
      "examples": ["nümunə 1", "nümunə 2"]
    }
  ],
  "analysis": "Ümumi analiz və təkliflər"
}`,
    en: `You are a fashion consultant. Analyze the gaps in the wardrobe below and suggest missing clothing pieces.

CURRENT WARDROBE:
${JSON.stringify(wardrobeInfo, null, 2)}

MISSING COLORS:
${missingColors.join(', ')}

Analyze:
1. What types of outfits can be made with this wardrobe?
2. What types of outfits cannot be made?
3. What pieces are most needed?
4. For each piece suggest colors and types

Response Format (JSON):
{
  "suggestions": [
    {
      "type": "top" | "bottom" | "shoes" | "outerwear" | "accessory",
      "colorName": "Color name",
      "reason": "Why this color and piece are needed",
      "examples": ["example 1", "example 2"]
    }
  ],
  "analysis": "General analysis and recommendations"
}`,
  };

  return prompts[language];
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = (searchParams.get('language') || 'tr') as Language;
    const wardrobe = await getWardrobe();

    if (wardrobe.length === 0) {
      const messages = {
        tr: 'Gardropunuzu oluşturmak için önce kıyafet ekleyin.',
        az: 'Geyim dolabınızı yaratmaq üçün əvvəlcə geyim əlavə edin.',
        en: 'Please add clothing first to create your wardrobe.',
      };
      return NextResponse.json(
        { error: messages[language] || messages.tr },
        { status: 400 }
      );
    }

    const wardrobeInfo = wardrobe.map((item) => ({
      type: item.type,
      color: item.colorName,
      season: item.season,
      brand: item.brand,
    }));

    const missingColors = suggestMissingColors(wardrobe);

    const prompt = getMissingPrompt(language, wardrobeInfo, missingColors);

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      const messages = {
        tr: 'AI yanıtı işlenemiyor',
        az: 'AI cavabı işlənilə bilmir',
        en: 'Could not process AI response',
      };
      return NextResponse.json({ error: messages[language] || messages.tr }, { status: 500 });
    }

    const aiResponse = JSON.parse(jsonMatch[0]);

    const suggestions: MissingPiece[] = aiResponse.suggestions.map((s: any) => ({
      type: s.type,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // placeholder
      colorName: s.colorName,
      reason: s.reason,
      examples: s.examples,
    }));

    return NextResponse.json({
      suggestions,
      analysis: aiResponse.analysis,
    });
  } catch (error) {
    console.error('Missing error:', error);
    const language = (new URL(new Request('').url).searchParams.get('language') || 'tr') as Language;
    const messages = {
      tr: 'Eksik parça önerileri oluşturulamadı',
      az: 'Çatışan parça təklifləri yaradıla bilinmədi',
      en: 'Could not create missing item suggestions',
    };
    return NextResponse.json(
      { error: messages[language] || messages.tr },
      { status: 500 }
    );
  }
}
