'use client';

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ClothingItem, ClothingType, ColorTemp, Season } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<ClothingItem, 'id' | 'createdAt'>) => Promise<void>;
  prefilledColorName?: string;
  prefilledType?: ClothingType;
}

interface FormDataState extends Omit<ClothingItem, 'id' | 'createdAt'> {
  tags: string;
}

const CLOTHING_TYPES: ClothingType[] = ['üst', 'alt', 'ayakkabı', 'dış giyim', 'aksesuar', 'elbise'];
const COLOR_TEMPS: ColorTemp[] = ['sıcak', 'soğuk', 'nötr'];
const SEASONS: Season[] = ['ilkbahar', 'yaz', 'sonbahar', 'kış'];

export function AddClothingModal({ isOpen, onClose, onAdd, prefilledColorName, prefilledType }: Props) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [removeBackground, setRemoveBackground] = useState(true);
  const [formData, setFormData] = useState<FormDataState>({
    name: '',
    type: prefilledType || ('üst' as ClothingType),
    color: '#000000',
    colorName: prefilledColorName || 'Siyah',
    colorTemp: 'nötr' as ColorTemp,
    size: 'M',
    season: [] as Season[],
    image: undefined,
    brand: '',
    tags: '',
  });

  // Modal açılınca prefilledType ve prefilledColorName'i güncelle
  useEffect(() => {
    if (isOpen && prefilledType) {
      setFormData(prev => ({
        ...prev,
        type: prefilledType,
        colorName: prefilledColorName || 'Siyah',
      }));
    }
  }, [isOpen, prefilledType, prefilledColorName]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      setUploadError(null);

      const file = acceptedFiles[0];
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      formDataToSend.append('removeBackground', removeBackground.toString());

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataToSend,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          setUploadError(errData.detail ? `Hata: ${errData.detail}` : 'Fotoğraf yüklenemedi');
          return;
        }

        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          image: data.url,
        }));
      } catch (error) {
        setUploadError('Yükleme başarısız');
        console.error('Upload error:', error);
      }
    },
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onAdd({
        ...formData,
        season: formData.season.length > 0 ? formData.season : SEASONS,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });

      setFormData({
        name: '',
        type: 'üst',
        color: '#000000',
        colorName: 'Siyah',
        colorTemp: 'nötr',
        size: 'M',
        season: [],
        image: undefined,
        brand: '',
        tags: '',
      });
      setUploadError(null);

      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Kıyafet Ekle</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <input {...getInputProps()} />
            {formData.image ? (
              <div className="text-sm">
                <div className="text-green-600 font-medium">✓ Fotoğraf yüklendi</div>
                <div className="text-gray-500 text-xs">{formData.image}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                <div>📷 Fotoğraf sürükleyin veya tıklayın</div>
              </div>
            )}
            {uploadError && <div className="text-red-500 text-xs mt-2">{uploadError}</div>}
          </div>

          {/* Background Removal Toggle */}
          <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
            <input
              type="checkbox"
              id="removeBg"
              checked={removeBackground}
              onChange={(e) => setRemoveBackground(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <label htmlFor="removeBg" className="text-sm text-gray-700 cursor-pointer">
              {t('removeBackgroundCheckbox')}
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('clothingName')}
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder={t('example')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('type')}
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ClothingType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {CLOTHING_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('colorHex')}
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="h-10 w-16 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('colorNameLabel')}
            </label>
            <input
              type="text"
              required
              value={formData.colorName}
              onChange={(e) => setFormData({ ...formData, colorName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder={t('mavi')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('colorTemp')}
            </label>
            <select
              value={formData.colorTemp}
              onChange={(e) => setFormData({ ...formData, colorTemp: e.target.value as ColorTemp })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {COLOR_TEMPS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beden
            </label>
            <input
              type="text"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="M"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mevsimler
            </label>
            <div className="space-y-2">
              {SEASONS.map((season) => (
                <label key={season} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.season.includes(season)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, season: [...formData.season, season] });
                      } else {
                        setFormData({
                          ...formData,
                          season: formData.season.filter((s) => s !== season),
                        });
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{season}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('brand')}
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Zara"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Etiketler (virgülle ayırın)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="casual, summer"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Ekleniyor...' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
