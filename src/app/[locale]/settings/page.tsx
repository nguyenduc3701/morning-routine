import React from 'react';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const t = useTranslations('Dashboard');

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <span className="material-symbols-outlined text-6xl text-tertiary animate-spin-slow">settings</span>
      <h2 className="font-headline-md text-3xl font-bold text-on-surface">{t('menuSettings')}</h2>
      <p className="text-on-surface-variant font-body-md text-center">This page is under construction.</p>
    </div>
  );
}
