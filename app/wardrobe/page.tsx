'use client';

import { useEffect, useState } from 'react';
import { ClothingItem } from '@/lib/types';
import { AddClothingModal } from '@/components/AddClothingModal';
import { ClothingCard } from '@/components/ClothingCard';
import { useLanguage } from '@/contexts/LanguageContext';

export default function WardrobePage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchWardrobe();
  }, []);

  const fetchWardrobe = async () => {
    try {
      const res = await fetch('/api/wardrobe');
      setItems(await res.json());
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClothing = async (newItem: Omit<ClothingItem, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/wardrobe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (res.ok) {
        const item = await res.json();
        setItems([...items, item]);
      }
    } catch (error) {
      alert(t('addClothingError'));
    }
  };

  const handleDeleteClothing = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return;

    try {
      const res = await fetch(`/api/wardrobe?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(items.filter((item) => item.id !== id));
      }
    } catch (error) {
      alert(t('deleteClothingError'));
    }
  };

  const filteredItems = filter ? items.filter((item) => item.type === filter) : items;
  const types = Array.from(new Set(items.map((item) => item.type)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">👔 {t('wardrobeTitle')}</h1>
            <p className="text-sm sm:text-base text-gray-600">{items.length} {t('clothingCount')}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 px-4 sm:px-6 py-3"
          >
            {t('addClothingButton')}
          </button>
        </div>

        {/* Filtreler */}
        {types.length > 0 && (
          <div className="mb-8 pb-6 border-b border-gray-200 overflow-x-auto">
            <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-3">{t('filterByType')}</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter(null)}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
                  filter === null
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {t('allClothing')} ({items.length})
              </button>
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all capitalize whitespace-nowrap ${
                    filter === type
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type} ({items.filter((i) => i.type === type).length})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Kıyafet Kartları */}
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-sm sm:text-base text-gray-600">⏳ {t('processingOutfit')}</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <ClothingCard
                key={item.id}
                item={item}
                onDelete={handleDeleteClothing}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-4">👔</div>
            <p className="text-gray-600 mb-4 text-lg">{t('noClothing')}</p>
            <p className="text-gray-500 mb-6">{t('startAddingClothes')}</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
            >
              {t('addClothingButton')} →
            </button>
          </div>
        )}

        <AddClothingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddClothing}
        />
      </div>
    </div>
  );
}
