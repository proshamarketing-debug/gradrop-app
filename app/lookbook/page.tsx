'use client';

import { useEffect, useState } from 'react';
import { SavedOutfit } from '@/lib/types';
import { OutfitCard } from '@/components/OutfitCard';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LookbookPage() {
  const { t } = useLanguage();
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOutfits();
  }, []);

  const fetchOutfits = async () => {
    try {
      const res = await fetch('/api/outfits');
      if (!res.ok) throw new Error('Kombinler yüklenemedi');
      const data = await res.json();
      setOutfits(data);
    } catch (err) {
      setError('Kombinler yüklenirken hata oluştu');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOutfit = async (id: string) => {
    if (!confirm('Bu kombinı silmek istediğinizden emin misiniz?')) return;

    try {
      const res = await fetch(`/api/outfits?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Silme başarısız');
      setOutfits(outfits.filter((o) => o.id !== id));
    } catch (err) {
      alert('Silme işlemi başarısız oldu');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('lookbookPageTitle')}</h1>
          <p className="text-gray-600 text-lg">{t('lookbookPageSubtitle')}</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Kombinler yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        ) : outfits.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 mb-4">{t('noSavedOutfits')}</p>
            <p className="text-sm text-gray-500">
              💡 {t('startCreatingOutfits')}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {outfits.map((outfit) => (
              <div key={outfit.id} className="relative">
                <OutfitCard outfit={outfit} />
                <button
                  onClick={() => handleDeleteOutfit(outfit.id)}
                  className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 font-medium"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
