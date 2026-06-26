import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';
import { getWardrobe } from '@/lib/storage';
import { getColorHarmony, scoreOutfit } from '@/lib/colorHarmony';
import { OutfitSuggestion } from '@/lib/types';
import { translations, Language } from '@/lib/translations';

const client = new Anthropic();

const getPrompt = (language: Language, harmonyInfo: any, occasion: string, weather: string, style: string) => {
  const itemList = harmonyInfo.slice(0, 8).map(item => `${item.id}: ${item.name} (${item.colorName})`).join(', ');

  const prompts = {
    tr: `Sen moda danismanisın. Bu kıyafetlerden: ${itemList}

Etkinlik: ${occasion}, Hava: ${weather}, Stil: ${style}

Kurallar: 3-4 kıyafet seç. Renk uyumu sağla. Her kıyafetin ID'sini yaz.

JSON cevap ver:
{"itemIds": ["id1", "id2"], "explanation": "Neden bu kombin iyi?", "suggestedItems": []}`,

    az: `Sen moda məsləhətçisisin. Bu geyimlərden: ${itemList}

Tədbiyin tipi: ${occasion}, Hava: ${weather}, Stil: ${style}

Qaydalar: 3-4 geyim seç. Rəng uyğunluğu sağla. Hər geyimin ID'sini yaz.

JSON cavab ver:
{"itemIds": ["id1", "id2"], "explanation": "Bu kombinə niyə uyğundur?", "suggestedItems": []}`,

    en: `You are a fashion consultant. From these items: ${itemList}

Event: ${occasion}, Weather: ${weather}, Style: ${style}

Rules: Select 3-4 items. Ensure color harmony. Use item IDs.

Return JSON:
{"itemIds": ["id1", "id2"], "explanation": "Why is this outfit good?", "suggestedItems": []}`
  };

  return prompts[language];
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { occasion, weather, style, language = 'tr' } = body;
    const wardrobe = await getWardrobe();

    if (wardrobe.length < 2) {
      const messages = {
        tr: 'Gardropunuzda en az 2 kiyafet olmasi gerekilir.',
        az: 'Geyim dolabinizda en azi 2 geyim olmasi telebdir.',
        en: 'Your wardrobe must have at least 2 items.',
      };
      return NextResponse.json(
        { error: messages[language as Language] || messages.tr },
        { status: 400 }
      );
    }

    const harmonyInfo = wardrobe.map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      color: item.color,
      colorName: item.colorName,
      season: item.season,
    }));

    const prompt = getPrompt(language as Language, harmonyInfo, occasion, weather, style);

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('JSON parse error:', responseText);
      return NextResponse.json({ error: 'Could not parse response' }, { status: 500 });
    }

    try {
      const aiResponse = JSON.parse(jsonMatch[0]);
      const selectedItems = wardrobe.filter((item) => aiResponse.itemIds.includes(item.id));

      if (selectedItems.length < 2) {
        return NextResponse.json(
          { error: 'Could not select enough items' },
          { status: 400 }
        );
      }

      const harmony = selectedItems.length > 1 ? getColorHarmony(selectedItems[0].color, selectedItems[1].color) : 'none';
      const score = scoreOutfit(selectedItems);

      const suggestion: OutfitSuggestion = {
        items: selectedItems,
        harmonyType: harmony,
        score,
        explanation: aiResponse.explanation || 'Great outfit combo',
        suggestedItems: aiResponse.suggestedItems || [],
      };

      return NextResponse.json(suggestion);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return NextResponse.json({ error: 'Could not process response' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Could not create suggestion' }, { status: 500 });
  }
}
