'use client';

import { useState } from 'react';
import { OutfitSuggestion } from '@/lib/types';
import { OutfitCard } from '@/components/OutfitCard';
import { useLanguage } from '@/contexts/LanguageContext';

const OCCASIONS = {
  tr: ['İş', 'Parti', 'Tarih', 'Kahvaltı', 'Gece Çıkışı', 'Spor', 'Rahat Gün'],
  az: ['İş', 'Partiya', 'Sual', 'Səhər Çayı', 'Gecə Çıxışı', 'Sport', 'Rahat Gün'],
  en: ['Work', 'Party', 'Date', 'Brunch', 'Night Out', 'Sports', 'Casual Day'],
};

const WEATHER_OPTIONS = {
  tr: ['Soğuk', 'Sıcak', 'Yağmurlu', 'Rüzgarlı', 'Kuru', 'Ilık'],
  az: ['Soyuq', 'İsti', 'Yağışlı', 'Küləkli', 'Quru', 'Ilıq'],
  en: ['Cold', 'Hot', 'Rainy', 'Windy', 'Dry', 'Mild'],
};

const STYLES = {
  tr: ['Minimalist', 'Şık', 'Spor', 'Bohemian', 'Klasik', 'Modern', 'Romantik'],
  az: ['Minimalist', 'Şık', 'Sport', 'Bohemian', 'Klassik', 'Modern', 'Romantik'],
  en: ['Minimalist', 'Chic', 'Sporty', 'Bohemian', 'Classic', 'Modern', 'Romantic'],
};

export default function OutfitsPage() {
  const { language, t } = useLanguage();
  const [occasion, setOccasion] = useState('');
  const [weather, setWeather] = useState('');
  const [style, setStyle] = useState('');
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleSuggest = async () => {
    if (!occasion && !weather && !style) {
      setError(t('selectCriteria'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occasion, weather, style, language }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || t('outfitSuggestions'));
        return;
      }

      const suggestion = await res.json();
      setSuggestions([suggestion, ...suggestions]);
    } catch (err) {
      setError(t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOutfit = async (outfit: OutfitSuggestion) => {
    try {
      const res = await fetch('/api/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: outfit.items,
          harmonyType: outfit.harmonyType,
          score: outfit.score,
          explanation: outfit.explanation,
          suggestedItems: outfit.suggestedItems,
        }),
      });

      if (!res.ok) {
        throw new Error('Could not save outfit');
      }

      alert(t('outfitSavedMessage'));
    } catch (err) {
      alert(t('saveFailed'));
      console.error(err);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">✨ {t('outfitSuggestions')}</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">{t('getSpecialOutfits')}</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 sm:p-8 mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{t('outfitCriteria')}</h2>

          <div className="space-y-2 sm:space-y-3 mb-6">
            {/* Occasion Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all">
              <button
                onClick={() => toggleSection('occasion')}
                className="w-full px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-all text-sm sm:text-base"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 font-semibold">{t('eventType')}</span>
                  {occasion && (
                    <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                      {occasion}
                    </span>
                  )}
                </div>
                <span className={`text-gray-400 transition-transform duration-300 ${expandedSection === 'occasion' ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedSection === 'occasion' && (
                <div className="px-3 sm:px-4 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2">
                  {OCCASIONS[language as 'tr' | 'az' | 'en'].map((occ) => (
                    <button
                      key={occ}
                      onClick={() => {
                        setOccasion(occ);
                        setExpandedSection(null);
                      }}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                        occasion === occ
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Weather Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all">
              <button
                onClick={() => toggleSection('weather')}
                className="w-full px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-all text-sm sm:text-base"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 font-semibold">{t('weather')}</span>
                  {weather && (
                    <span className="text-xs sm:text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium">
                      {weather}
                    </span>
                  )}
                </div>
                <span className={`text-gray-400 transition-transform duration-300 ${expandedSection === 'weather' ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedSection === 'weather' && (
                <div className="px-3 sm:px-4 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2">
                  {WEATHER_OPTIONS[language as 'tr' | 'az' | 'en'].map((w) => (
                    <button
                      key={w}
                      onClick={() => {
                        setWeather(w);
                        setExpandedSection(null);
                      }}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                        weather === w
                          ? 'bg-orange-600 text-white shadow-md'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Style Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all">
              <button
                onClick={() => toggleSection('style')}
                className="w-full px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-all text-sm sm:text-base"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 font-semibold">{t('stylePreference')}</span>
                  {style && (
                    <span className="text-xs sm:text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium">
                      {style}
                    </span>
                  )}
                </div>
                <span className={`text-gray-400 transition-transform duration-300 ${expandedSection === 'style' ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedSection === 'style' && (
                <div className="px-3 sm:px-4 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2">
                  {STYLES[language as 'tr' | 'az' | 'en'].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setStyle(s);
                        setExpandedSection(null);
                      }}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                        style === s
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleSuggest}
            disabled={isLoading}
            className="btn-primary w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-slate-400 disabled:to-slate-500 disabled:hover:scale-100 px-6 py-3.5 text-lg"
          >
            {isLoading ? `⏳ ${t('processingOutfit')}` : `✨ ${t('suggestOutfit')}`}
          </button>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 ? (
          <div className="space-y-6">
            {suggestions.map((suggestion, index) => (
              <OutfitCard key={index} outfit={suggestion} onSave={handleSaveOutfit} />
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="text-6xl mb-4">✨</div>
              <p className="text-gray-600 mb-4 text-lg font-medium">
                {t('noSuggestionsYet')}
              </p>
              <p className="text-gray-500 mb-6">
                {t('determineCriteria')}
              </p>
              <p className="text-sm text-gray-500 inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
                {t('tip')}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
