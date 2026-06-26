'use client';

import { ClothingItem } from '@/lib/types';

interface Props {
  item: ClothingItem;
  onDelete?: (id: string) => void;
}

const colorTempColors: Record<string, { bg: string; text: string }> = {
  sıcak: { bg: 'bg-orange-100', text: 'text-orange-700' },
  soğuk: { bg: 'bg-blue-100', text: 'text-blue-700' },
  nötr: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

const sizeColors: Record<string, { bg: string; text: string }> = {
  XS: { bg: 'bg-pink-100', text: 'text-pink-700' },
  S: { bg: 'bg-red-100', text: 'text-red-700' },
  M: { bg: 'bg-purple-100', text: 'text-purple-700' },
  L: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  XL: { bg: 'bg-blue-100', text: 'text-blue-700' },
};

export function ClothingCard({ item, onDelete }: Props) {
  const sizeColor = sizeColors[item.size] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  const tempColor = colorTempColors[item.colorTemp];

  return (
    <div className="group rounded-2xl border border-gray-100 bg-white overflow-hidden hover:border-gray-200 hover:shadow-xl transition-all duration-300">
      {/* Görseller */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
            style={{ backgroundColor: item.color }}
          />
        )}
        {item.brand && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {item.brand}
          </div>
        )}
      </div>

      {/* İçerik */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
          {item.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{item.type}</p>

        {/* Renkler ve Beden */}
        <div className="flex flex-wrap gap-2 mt-3">
          <div className="flex items-center gap-1">
            <div
              className="w-5 h-5 rounded-full border-2 border-gray-300"
              style={{ backgroundColor: item.color }}
              title={item.colorName}
            />
            <span className="text-xs text-gray-600">{item.colorName}</span>
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${sizeColor.bg} ${sizeColor.text}`}>
            {item.size}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tempColor.bg} ${tempColor.text}`}>
            {item.colorTemp}
          </span>
        </div>

        {/* Mevsimler */}
        {item.season.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {item.season.map((s) => (
              <span key={s} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Sil Butonu */}
        {onDelete && (
          <button
            onClick={() => onDelete(item.id)}
            className="mt-4 w-full text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 py-2 rounded-lg transition-colors"
          >
            Sil
          </button>
        )}
      </div>
    </div>
  );
}
