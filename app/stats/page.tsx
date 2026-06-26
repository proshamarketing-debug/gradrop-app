'use client';

import { useEffect, useState } from 'react';
import { ClothingItem, ClothingType, ColorTemp, Season } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Statistics {
  totalItems: number;
  typeDistribution: Record<ClothingType, number>;
  colorTempDistribution: Record<ColorTemp, number>;
  seasonDistribution: Record<Season, number>;
  brandDistribution: Record<string, number>;
  colorPalette: Record<string, number>;
}

export default function StatsPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/wardrobe');
      if (!res.ok) throw new Error(t('errorLoadingWardrobe'));

      const items: ClothingItem[] = await res.json();

      const stats: Statistics = {
        totalItems: items.length,
        typeDistribution: {} as Record<ClothingType, number>,
        colorTempDistribution: {} as Record<ColorTemp, number>,
        seasonDistribution: {} as Record<Season, number>,
        brandDistribution: {},
        colorPalette: {},
      };

      items.forEach((item) => {
        stats.typeDistribution[item.type] = (stats.typeDistribution[item.type] || 0) + 1;
        stats.colorTempDistribution[item.colorTemp] =
          (stats.colorTempDistribution[item.colorTemp] || 0) + 1;
        item.season.forEach((s) => {
          stats.seasonDistribution[s] = (stats.seasonDistribution[s] || 0) + 1;
        });
        if (item.brand) {
          stats.brandDistribution[item.brand] = (stats.brandDistribution[item.brand] || 0) + 1;
        }
        stats.colorPalette[item.colorName] = (stats.colorPalette[item.colorName] || 0) + 1;
      });

      setStats(stats);
    } catch (err) {
      setError(t('errorLoadingStats'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">⏳ {t('loading')}</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, unit }: { title: string; value: number; unit?: string }) => (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-indigo-50 p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <p className="text-gray-600 text-xs sm:text-sm font-semibold">{title}</p>
      <p className="text-3xl sm:text-4xl font-bold text-indigo-600 mt-3">
        {value}
        {unit && <span className="text-sm sm:text-lg text-gray-600 ml-1">{unit}</span>}
      </p>
    </div>
  );

  const DistributionChart = ({
    title,
    data,
  }: {
    title: string;
    data: Record<string, number>;
  }) => {
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const maxValue = Math.max(...entries.map((e) => e[1]), 1);

    return (
      <div className="bg-white rounded-xl sm:rounded-2xl border border-indigo-50 p-4 sm:p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">{title}</h3>
        <div className="space-y-3 sm:space-y-4">
          {entries.map(([label, value]) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm text-gray-700 font-semibold capitalize">{label}</span>
                <span className="text-xs sm:text-sm font-bold text-indigo-600 bg-indigo-50 px-2 sm:px-3 py-1 rounded-full">{value}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${(value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">📊 {t('statistics')}</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">{t('wardrobeAnalysis')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard title={t('totalItems')} value={stats.totalItems} />
          <StatCard
            title={t('warmColors')}
            value={stats.colorTempDistribution.sıcak || 0}
          />
          <StatCard
            title={t('coldColors')}
            value={stats.colorTempDistribution.soğuk || 0}
          />
          <StatCard
            title={t('neutralColors')}
            value={stats.colorTempDistribution.nötr || 0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {Object.keys(stats.typeDistribution).length > 0 && (
            <DistributionChart title={t('typeDistribution')} data={stats.typeDistribution} />
          )}

          {Object.keys(stats.seasonDistribution).length > 0 && (
            <DistributionChart title={t('seasonDistribution')} data={stats.seasonDistribution} />
          )}

          {Object.keys(stats.colorPalette).length > 0 && (
            <DistributionChart title={t('colorPalette')} data={stats.colorPalette} />
          )}

          {Object.keys(stats.brandDistribution).length > 0 && (
            <DistributionChart title={t('topBrands')} data={stats.brandDistribution} />
          )}
        </div>
      </div>
    </div>
  );
}
