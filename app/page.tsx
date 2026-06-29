'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ClothingItem } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

const StatCard = ({ icon, label, value, emoji }: { icon?: string; emoji?: string; label: string; value: number | string }) => (
  <div className="card-hover bg-white rounded-2xl p-6 border border-indigo-50 shadow-sm flex items-center gap-4 hover-scale hover-lift group">
    <div className="p-3.5 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
      <span className="text-lg">{emoji || icon}</span>
    </div>
    <div>
      <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">{label}</p>
      <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
    </div>
  </div>
);

const QuickAccessCard = ({ href, emoji, title, description }: { href: string; emoji: string; title: string; description: string }) => (
  <Link href={href} className="card-hover flex items-center justify-between p-3.5 rounded-xl border border-indigo-50 bg-white hover:bg-indigo-50 cursor-pointer hover-lift group">
    <div className="flex items-center gap-3">
      <span className="text-xl group-hover:scale-110 transition-transform duration-300">{emoji}</span>
      <div>
        <h5 className="text-xs font-semibold text-slate-800">{title}</h5>
        <p className="text-[10px] text-slate-400">{description}</p>
      </div>
    </div>
    <svg className="w-4 h-4 text-indigo-300 group-hover:text-indigo-600 transition-colors duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </Link>
);

export default function Home() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ total: 0, tops: 0, bottoms: 0, shoes: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/wardrobe');
        const wardrobe = await res.json() as ClothingItem[];

        const tops = wardrobe.filter(i => i.type === 'üst').length;
        const bottoms = wardrobe.filter(i => i.type === 'alt').length;
        const shoes = wardrobe.filter(i => i.type === 'ayakkabı').length;

        setStats({ total: wardrobe.length, tops, bottoms, shoes });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
      {/* Hero Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 text-white p-6 sm:p-8 md:p-12 shadow-xl mb-8 sm:mb-10">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[length:16px_16px] pointer-events-none" />
        <div className="max-w-2xl relative z-10 space-y-3 sm:space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-stone-200 text-xs font-medium backdrop-blur-md">
            <svg className="w-3.5 h-3.5 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {t('shineToday')}
          </span>
          <h2 className="serif-title text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight leading-tight">{t('organizeWardrobeExpress')}</h2>
          <p className="text-stone-300 font-light text-xs sm:text-sm md:text-base max-w-lg leading-relaxed">
            {t('digitizeOutfits')}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
            <Link href="/wardrobe" className="px-4 sm:px-5 py-3 sm:py-2.5 bg-white text-stone-900 hover:bg-stone-100 transition rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center sm:justify-start gap-2 shadow-sm hover-scale">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('addClothing')}
            </Link>
            <Link href="/outfits" className="px-4 sm:px-5 py-3 sm:py-2.5 bg-stone-800 text-stone-100 hover:bg-stone-700 transition border border-stone-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center sm:justify-start gap-2 hover-scale">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1m2-1v2.5M2 7l2 1m-2-1l2-1m-2 1v2.5" />
              </svg>
              {t('designOutfit')}
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard label={t('totalClothing')} value={stats.total} emoji="👔" />
        <StatCard label={t('tops')} value={stats.tops} emoji="👕" />
        <StatCard label={t('bottoms')} value={stats.bottoms} emoji="👖" />
        <StatCard label={t('shoes')} value={stats.shoes} emoji="👟" />
      </div>

      {/* Dashboard Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Smart Weather Suggestion Frame */}
        <div className="lg:col-span-7 bg-amber-50/50 border border-amber-100 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-700 tracking-wider uppercase">{t('smartSuggestion')}</span>
              <h3 className="serif-title text-2xl font-bold text-stone-900">{t('istanbulSunny')}</h3>
            </div>
            <div className="flex items-center gap-2 text-amber-600 bg-amber-100/60 px-3.5 py-1.5 rounded-full text-sm font-semibold">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zm12-1.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V11.25a.75.75 0 01.75-.75zM7.5 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 017.5 18zm.75-13.5a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0V4.5zM18 7.5a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18.75a.75.75 0 01-.75-.75zm0 8.25a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18.75a.75.75 0 01-.75-.75zM6.75 18.75a.75.75 0 00-1.5 0V21a.75.75 0 001.5 0v-2.25zM3 16.5a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm3.75-8.25a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0V3.75z" />
              </svg>
              22°C
            </div>
          </div>

          <p className="text-zinc-600 text-sm leading-relaxed font-light">
            {t('weatherDescription')}
          </p>

          {/* Smart Combo Preview */}
          <div className="grid grid-cols-4 gap-3 bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex flex-col items-center p-2 rounded-xl bg-stone-50 text-center">
              <span className="text-3xl mb-1">👔</span>
              <span className="text-[10px] text-zinc-500 font-medium truncate w-full">{t('shirt')}</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-stone-50 text-center">
              <span className="text-3xl mb-1">👖</span>
              <span className="text-[10px] text-zinc-500 font-medium truncate w-full">{t('jeans')}</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-stone-50 text-center">
              <span className="text-3xl mb-1">👟</span>
              <span className="text-[10px] text-zinc-500 font-medium truncate w-full">{t('sneaker')}</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-stone-50 text-center">
              <span className="text-3xl mb-1">✨</span>
              <span className="text-[10px] text-zinc-500 font-medium truncate w-full">{t('accessory')}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-amber-800/70 font-medium">{t('matchPercentage')}</span>
            <Link href="/outfits" className="text-xs font-semibold text-stone-900 flex items-center gap-1 hover:underline">
              {t('editOutfit')}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Fast Actions / Stats Overview */}
        <div className="lg:col-span-5 bg-white border border-zinc-100 rounded-3xl p-6 md:p-8 space-y-6">
          <h4 className="serif-title text-xl font-bold text-stone-900">{t('quickAccessMenu')}</h4>
          <p className="text-zinc-500 text-xs font-light">{t('quickAccessDesc')}</p>

          <div className="space-y-3">
            <QuickAccessCard href="/wardrobe" emoji="🧥" title={t('wardrobeDiscovery')} description={t('wardrobeDesc')} />
            <QuickAccessCard href="/outfits" emoji="🪄" title={t('outfitWizard')} description={t('outfitDesc')} />
            <QuickAccessCard href="/lookbook" emoji="📸" title={t('personalLookbook')} description={t('lookbookDesc')} />
          </div>
        </div>
      </div>

      {/* Pricing Section - Separate Below */}
      <div className="mt-16 pt-12 border-t border-zinc-200">
        <div className="text-center mb-12">
          <h2 className="serif-title text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            {t('pricingTitle')}
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            {t('pricingSubtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly */}
          <div className="border border-zinc-200 rounded-2xl p-8 bg-white hover:shadow-lg transition-shadow">
            <h3 className="serif-title text-xl font-bold text-stone-900 mb-2">{t('monthlyPlan')}</h3>
            <p className="text-zinc-600 text-sm mb-4">{t('monthlyDescription')}</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-stone-900">{t('monthlyPrice')}</span>
              <span className="text-zinc-600">{t('perMonth')}</span>
            </div>
            <button className="w-full py-2.5 px-4 bg-stone-100 text-stone-900 hover:bg-stone-200 rounded-xl font-semibold transition-colors">
              {t('freeTrial')}
            </button>
          </div>

          {/* Yearly */}
          <div className="border-2 border-stone-900 rounded-2xl p-8 bg-gradient-to-br from-stone-50 to-white shadow-lg relative">
            <div className="absolute -top-3 right-6 bg-stone-900 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {t('save')} 21%
            </div>
            <h3 className="serif-title text-xl font-bold text-stone-900 mb-2">{t('yearlyPlan')}</h3>
            <p className="text-zinc-600 text-sm mb-4">{t('yearlyDescription')}</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-stone-900">{t('yearlyPrice')}</span>
              <span className="text-zinc-600">/year</span>
            </div>
            <button className="w-full py-2.5 px-4 bg-stone-900 text-white hover:bg-stone-800 rounded-xl font-semibold transition-colors">
              {t('subscribe')}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
