'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function PricingPage() {
  const { t, language } = useLanguage();

  const monthlyPerYear = 7 * 12;
  const yearlySavings = monthlyPerYear - 70;
  const savingsPercent = Math.round((yearlySavings / monthlyPerYear) * 100);

  const features = [
    'featureAI',
    'featureUnlimited',
    'featureLookbook',
    'featureStats',
    'featureMissing',
    'featurePriority',
  ];

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="serif-title text-4xl md:text-5xl font-bold text-stone-900 mb-4">
          {t('pricingTitle')}
        </h1>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          {t('pricingSubtitle')}
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
        {/* Monthly Plan */}
        <div className="border border-zinc-200 rounded-3xl p-8 bg-white hover:shadow-lg transition-shadow duration-300">
          <div className="mb-6">
            <h3 className="serif-title text-2xl font-bold text-stone-900 mb-2">
              {t('monthlyPlan')}
            </h3>
            <p className="text-zinc-600 text-sm mb-4">{t('monthlyDescription')}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-stone-900">{t('monthlyPrice')}</span>
              <span className="text-zinc-600">{t('perMonth')}</span>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-4 mb-8 py-8 border-y border-zinc-100">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-zinc-700">{t(feature as any)}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button className="w-full py-3 px-6 bg-stone-100 text-stone-900 hover:bg-stone-200 rounded-xl font-semibold transition-colors duration-300">
            {t('freeTrial')}
          </button>
        </div>

        {/* Yearly Plan - Featured */}
        <div className="border-2 border-stone-900 rounded-3xl p-8 bg-gradient-to-br from-stone-50 to-white shadow-xl relative">
          {/* Popular Badge */}
          <div className="absolute -top-4 right-6 bg-stone-900 text-white px-4 py-1 rounded-full text-sm font-semibold">
            {t('save')} {savingsPercent}%
          </div>

          <div className="mb-6">
            <h3 className="serif-title text-2xl font-bold text-stone-900 mb-2">
              {t('yearlyPlan')}
            </h3>
            <p className="text-zinc-600 text-sm mb-4">{t('yearlyDescription')}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-stone-900">{t('yearlyPrice')}</span>
              <span className="text-zinc-600">/year</span>
            </div>
            <p className="text-sm text-green-600 font-semibold mt-2">
              {language === 'tr' && `Aylık ${(70/12).toFixed(2)}$`}
              {language === 'az' && `Aylıq ${(70/12).toFixed(2)}$`}
              {language === 'en' && `Just ${(70/12).toFixed(2)}$/month`}
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-4 mb-8 py-8 border-y border-zinc-200">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-zinc-700">{t(feature as any)}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button className="w-full py-3 px-6 bg-stone-900 text-white hover:bg-stone-800 rounded-xl font-semibold transition-colors duration-300">
            {t('subscribe')}
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-2xl mx-auto bg-amber-50 border border-amber-100 rounded-3xl p-8">
        <h3 className="serif-title text-2xl font-bold text-stone-900 mb-6">
          {language === 'tr' && 'Sık Sorulan Sorular'}
          {language === 'az' && 'Tez-tez Soruşulan Suallar'}
          {language === 'en' && 'Frequently Asked Questions'}
        </h3>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-stone-900 mb-2">
              {language === 'tr' && '7 günlük deneme süresi nasıl çalışır?'}
              {language === 'az' && '7 günlük sınama müddəti necə işləyir?'}
              {language === 'en' && 'How does the 7-day trial work?'}
            </h4>
            <p className="text-zinc-700 text-sm">
              {language === 'tr' && 'İlk 7 gün tamamen ücretsizdir. Kredi kartı bilgilerinizi girmezsiniz. Süreden sonra otomatik olarak ödeme başlar.'}
              {language === 'az' && 'İlk 7 gün tamamilə pulsuzdir. Kredit kartı məlumatını girməyə ehtiyac yoxdur. Müddətdən sonra avtomatik ödəniş başlayır.'}
              {language === 'en' && 'The first 7 days are completely free. No credit card needed. After the trial, automatic billing begins.'}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 mb-2">
              {language === 'tr' && 'Aboneliğimi ne zaman iptal edebilirim?'}
              {language === 'az' && 'Aboneliğimi nə vaxt ləğv edə biləm?'}
              {language === 'en' && 'When can I cancel my subscription?'}
            </h4>
            <p className="text-zinc-700 text-sm">
              {language === 'tr' && 'Herhangi bir zamanda iptal edebilirsiniz. Deneme dönemi sırasında veya aktif aboneliğiniz boyunca iptal edebilirsiniz.'}
              {language === 'az' && 'İstənilən vaxt ləğv edə bilərsiniz. Sınama dövrü ərzində və ya aktiv aboneliyi boyunca ləğv edə bilərsiniz.'}
              {language === 'en' && 'You can cancel anytime. Cancel during the trial period or during your active subscription.'}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-stone-900 mb-2">
              {language === 'tr' && 'Yıllık paket özür parası iade edilir mi?'}
              {language === 'az' && 'İllik paket geri qaytarılma garantiyası var?'}
              {language === 'en' && 'Is there a refund guarantee for yearly plan?'}
            </h4>
            <p className="text-zinc-700 text-sm">
              {language === 'tr' && 'Evet, 30 gün para iade garantisi sunuyoruz. Memnun değilseniz tam geri ödeme alabilirsiniz.'}
              {language === 'az' && 'Bəli, biz 30 gün pul qaytarma zəmanəti təklif edirik. Razı deyilsəniz tam geri ödəniş ala bilərsiniz.'}
              {language === 'en' && 'Yes, we offer a 30-day money-back guarantee. Get a full refund if you\'re not satisfied.'}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
