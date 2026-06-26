'use client';

import { useState, useEffect } from 'react';
import { OutfitSuggestion, ClothingType } from '@/lib/types';
import { ClothingCard } from './ClothingCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  outfit: OutfitSuggestion;
  onSave?: (outfit: OutfitSuggestion) => Promise<void>;
}

const HARMONY_LABELS = {
  monokromatik: {
    tr: 'Monokromatik',
    az: 'Monokromatik',
    en: 'Monochromatic',
  },
  analogous: {
    tr: 'Analogous',
    az: 'Analogous',
    en: 'Analogous',
  },
  complementary: {
    tr: 'Tamamlayıcı',
    az: 'Tamamlayıcı',
    en: 'Complementary',
  },
  triadic: {
    tr: 'Triadik',
    az: 'Triadik',
    en: 'Triadic',
  },
  'split-complementary': {
    tr: 'Split-Comp',
    az: 'Split-Comp',
    en: 'Split-Complementary',
  },
  tetradic: {
    tr: 'Tetradik',
    az: 'Tetradik',
    en: 'Tetradic',
  },
  square: {
    tr: 'Square',
    az: 'Square',
    en: 'Square',
  },
  none: {
    tr: 'Uyumsuz',
    az: 'Uyğun Deyil',
    en: 'Unmatched',
  },
};

const HARMONY_CONFIG: Record<string, { emoji: string; color: string }> = {
  monokromatik: { emoji: '🎨', color: 'from-gray-400 to-gray-600' },
  analogous: { emoji: '🌈', color: 'from-green-400 to-teal-600' },
  complementary: { emoji: '✨', color: 'from-pink-400 to-purple-600' },
  triadic: { emoji: '🔺', color: 'from-red-400 to-yellow-600' },
  'split-complementary': { emoji: '🌙', color: 'from-blue-400 to-indigo-600' },
  tetradic: { emoji: '🎭', color: 'from-orange-400 to-red-600' },
  square: { emoji: '📦', color: 'from-cyan-400 to-blue-600' },
  none: { emoji: '❓', color: 'from-gray-400 to-gray-600' },
};

export function OutfitCard({ outfit, onSave }: Props) {
  const { language, t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const config = HARMONY_CONFIG[outfit.harmonyType] || HARMONY_CONFIG.none;
  const harmonyLabel = HARMONY_LABELS[outfit.harmonyType as keyof typeof HARMONY_LABELS]?.[language as 'tr' | 'az' | 'en'] || 'Unknown';

  const handleAddSuggestedItem = async (item: {type: ClothingType; colorName: string}) => {
    try {
      // localStorage'a ekle
      const wishlist = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
      const newItem = {
        id: `${item.type}-${item.colorName}-${Date.now()}`,
        ...item,
        addedAt: new Date().toISOString(),
      };

      // Duplikasyon kontrolü
      const exists = wishlist.some((w: any) => w.type === item.type && w.colorName === item.colorName);
      if (!exists) {
        wishlist.push(newItem);
        localStorage.setItem('wishlistItems', JSON.stringify(wishlist));
        const messages = {
          tr: `✅ ${item.colorName} Eksiklere eklendi!`,
          az: `✅ ${item.colorName} Çatışanlar siyahına əlavə edildi!`,
          en: `✅ ${item.colorName} added to Missing Items!`,
        };
        alert(messages[language as 'tr' | 'az' | 'en']);
      } else {
        const messages = {
          tr: `ℹ️ ${item.colorName} zaten Eksiklerde var`,
          az: `ℹ️ ${item.colorName} artıq Çatışanlar siyahında var`,
          en: `ℹ️ ${item.colorName} already in Missing Items`,
        };
        alert(messages[language as 'tr' | 'az' | 'en']);
      }
    } catch (err) {
      const messages = {
        tr: 'Hata oluştu',
        az: 'Xəta baş verdi',
        en: 'An error occurred',
      };
      alert(messages[language as 'tr' | 'az' | 'en']);
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(outfit);
    } finally {
      setIsSaving(false);
    }
  };

  const scoreColor = outfit.score >= 85 ? 'text-green-600' : outfit.score >= 70 ? 'text-blue-600' : 'text-yellow-600';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow">
      {/* Header */}
      <div className={`bg-gradient-to-r ${config.color} p-8 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 opacity-10 text-9xl">{config.emoji}</div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full mb-3">
                <span className="text-2xl">{config.emoji}</span>
                <span className="font-semibold text-sm">{harmonyLabel}</span>
              </div>
              <p className="text-sm text-white/90 leading-relaxed max-w-2xl">{outfit.explanation}</p>
            </div>
            <div className="flex flex-col items-end">
              <div className={`text-4xl font-bold ${scoreColor}`}>{outfit.score}</div>
              <div className="text-sm text-gray-200">/100</div>
            </div>
          </div>
        </div>
      </div>

      {/* Kombin Parçaları */}
      <div className="p-8">
        <p className="text-sm font-bold text-stone-900 mb-6">✨ {t('outfitPieces')}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {outfit.items.map((item) => (
            <ClothingCard key={item.id} item={item} />
          ))}
        </div>

        {/* Önerilen Parçalar */}
        {outfit.suggestedItems && outfit.suggestedItems.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-5 mb-8">
            <p className="text-sm font-bold text-amber-900 mb-4">
              💡 {language === 'tr' ? 'Kombinle İyi Gidecek Parçalar' : language === 'az' ? 'Kombin Yaxşı Gidəcək Parçalar' : 'Pieces That Go Well With Outfit'}
            </p>
            <div className="space-y-3">
              {outfit.suggestedItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-amber-100 hover:border-amber-300 transition-colors">
                  <span className="text-xl mt-0.5">🎁</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {item.colorName} <span className="text-gray-500 font-normal text-sm">({item.type})</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{item.reason}</p>
                  </div>
                  <button
                    onClick={() => handleAddSuggestedItem(item as {type: ClothingType; colorName: string})}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-400 hover:bg-amber-500 text-white flex items-center justify-center font-bold transition-colors"
                    title={language === 'tr' ? 'Gardırobaya ekle' : language === 'az' ? 'Geyim dolabına əlavə et' : 'Add to wardrobe'}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {onSave && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 font-semibold transition-all transform hover:scale-105 active:scale-95"
          >
            {isSaving ? `⏳ ${language === 'tr' ? 'Kaydediliyor...' : language === 'az' ? 'Saxlanılır...' : 'Saving...'}` : `💾 ${t('saveOutfit')}`}
          </button>
        )}
      </div>
    </div>
  );
}
