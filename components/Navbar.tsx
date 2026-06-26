'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/translations';

const NavLink = ({ href, label, isActive }: { href: string; label: string; isActive: boolean }) => (
  <Link
    href={href}
    className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 hover-scale whitespace-nowrap ${
      isActive
        ? 'bg-indigo-600 text-white shadow-lg'
        : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
    }`}
  >
    {label}
  </Link>
);

export function Navbar() {
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-indigo-100 px-4 sm:px-6 py-3 sm:py-4 shadow-sm hover-lift">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300">
          <Image
            src="/logo.png?v=12"
            alt="GraDrop Logo"
            width={140}
            height={44}
            priority
            unoptimized
            className="h-auto w-auto sm:w-48"
          />
        </Link>

        {/* Modern Navigation Tabs & Language Selector */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <nav className="flex flex-wrap justify-center items-center gap-0.5 sm:gap-1 bg-slate-100 p-1 rounded-full text-xs sm:text-sm overflow-x-auto">
            <NavLink href="/" label={t('dashboard')} isActive={isActive('/')} />
            <NavLink href="/wardrobe" label={t('wardrobe')} isActive={isActive('/wardrobe')} />
            <NavLink href="/outfits" label={t('outfits')} isActive={isActive('/outfits')} />
            <NavLink href="/lookbook" label={t('lookbook')} isActive={isActive('/lookbook')} />
            <NavLink href="/stats" label={t('stats')} isActive={isActive('/stats')} />
            <NavLink href="/missing" label={t('missing')} isActive={isActive('/missing')} />
          </nav>

          {/* Language Selector */}
          <div className="flex gap-0.5 sm:gap-1 bg-slate-100 p-1 rounded-full">
            {(['tr', 'az', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 hover-scale ${
                  language === lang
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
