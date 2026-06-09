import React from 'react';
import { useTranslations } from 'next-intl';

export default function CategoriesPage() {
  const t = useTranslations('Dashboard');

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <span className="material-symbols-outlined text-6xl text-primary animate-pulse-soft">grid_view</span>
      <h2 className="font-headline-md text-3xl font-bold text-on-surface">{t('menuCategories')}</h2>
      <p className="text-on-surface-variant font-body-md text-center">This page is under construction.</p>
    </div>
  );
}
