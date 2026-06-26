'use client';

import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MissingPage() {
  const { t } = useLanguage();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    // Client-side only: Wishlist'i localStorage'dan yükle
    if (typeof window !== 'undefined') {
      const savedWishlist = localStorage.getItem('wishlistItems');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    }
  }, []);

  const handleDeleteItem = (id: string) => {
    setWishlist(prev => {
      const updated = prev.filter(w => w.id !== id);
      localStorage.setItem('wishlistItems', JSON.stringify(updated));
      return updated;
    });
  };

  const handleImageUpload = async (id: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) return;

      const data = await res.json();
      setWishlist(prev => {
        const updated = prev.map(item =>
          item.id === id ? { ...item, image: data.filename } : item
        );
        localStorage.setItem('wishlistItems', JSON.stringify(updated));
        return updated;
      });
      alert(t('imageUploadedSuccess'));
    } catch (err) {
      alert(t('imageUploadFailed'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8">{t('missing')}</h1>

        {/* Wishlist - Eklenen Öneriler */}
        {wishlist.length > 0 ? (
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{t('addedMissingItems')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {wishlist.map((item) => (
                <div key={item.id} className="bg-white border border-indigo-50 rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow hover-lift">
                  {/* Resim Alanı */}
                  <div
                    className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-40 sm:h-48 flex items-center justify-center overflow-hidden cursor-pointer group"
                    onClick={() => fileInputRefs.current[item.id]?.click()}
                  >
                    {item.image ? (
                      <img
                        src={`/uploads/${item.image}`}
                        alt={item.colorName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div
                          className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                          style={{
                            backgroundColor: item.colorName.toLowerCase().includes('beyaz') ? '#f5f5f5'
                              : item.colorName.toLowerCase().includes('siyah') ? '#1a1a1a'
                              : item.colorName.toLowerCase().includes('gri') ? '#808080'
                              : item.colorName.toLowerCase().includes('mavi') ? '#0066cc'
                              : item.colorName.toLowerCase().includes('kırmızı') ? '#cc0000'
                              : item.colorName.toLowerCase().includes('yeşil') ? '#009900'
                              : '#999999',
                          }}
                        />
                        <div className="relative z-10 text-6xl mb-2">
                          {item.type === 'üst' ? '👔'
                            : item.type === 'alt' ? '👖'
                            : item.type === 'ayakkabı' ? '👟'
                            : item.type === 'dış giyim' ? '🧥'
                            : item.type === 'aksesuar' ? '⌚'
                            : item.type === 'elbise' ? '👗'
                            : '👕'}
                        </div>
                        <div className="relative z-10 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded">
                          {t('addImage')}
                        </div>
                      </div>
                    )}
                    <input
                      ref={(el) => {
                        if (el) fileInputRefs.current[item.id] = el;
                      }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleImageUpload(item.id, e.target.files[0]);
                        }
                      }}
                    />
                  </div>

                  {/* İçerik */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg">
                          {item.colorName}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="flex-shrink-0 ml-2 text-gray-400 hover:text-red-500 font-bold text-xl transition-colors"
                        type="button"
                        title={t('delete')}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Renk Swatch */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
                        style={{
                          backgroundColor: item.colorName.toLowerCase().includes('beyaz') ? '#ffffff'
                            : item.colorName.toLowerCase().includes('siyah') ? '#000000'
                            : item.colorName.toLowerCase().includes('gri') ? '#808080'
                            : item.colorName.toLowerCase().includes('mavi') ? '#0066cc'
                            : item.colorName.toLowerCase().includes('kırmızı') ? '#cc0000'
                            : item.colorName.toLowerCase().includes('yeşil') ? '#009900'
                            : '#999999',
                        }}
                      />
                      <span className="text-xs text-gray-600 flex-1">
                        {t('added')}: {new Date(item.addedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Tavsiye */}
                    {item.reason && (
                      <p className="text-xs text-gray-600 italic border-t pt-3">
                        "{item.reason}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-sm sm:text-base md:text-lg text-gray-600">{t('noMissingItems')}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">{t('addFromOutfits')}</p>
          </div>
        )}

        <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-4 sm:p-6">
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2">{t('tips')}</h3>
          <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-700 text-xs sm:text-sm">
            <li>{t('addImageFromOutfits')}</li>
            <li>{t('neutralColorsHelpful')}</li>
            <li>{t('colorPalette')}</li>
            <li>{t('seasonalVariety')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
