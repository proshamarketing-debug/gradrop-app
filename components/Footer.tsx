'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <>
      <p className="text-xs text-zinc-400">{t('allRightsReserved')}</p>
      <div className="flex gap-4">
        <a href="#" className="hover:text-stone-900 transition">{t('privacyPolicy')}</a>
        <a href="#" className="hover:text-stone-900 transition">{t('termsOfUse')}</a>
      </div>
    </>
  );
}
