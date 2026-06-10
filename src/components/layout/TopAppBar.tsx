'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter, Link } from '@/i18n/routing';

const LOCALE_INFO = [
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'vi', flag: '🇻🇳', label: 'Tiếng Việt' },
  { code: 'jp', flag: '🇯🇵', label: '日本語' },
  { code: 'cn', flag: '🇨🇳', label: '中文' },
  { code: 'kr', flag: '🇰🇷', label: '한국어' }
];

export function TopAppBar() {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLanguage = (nextLocale: string) => {
    localStorage.setItem('preferred_locale', nextLocale);
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };
  
  const currentLocaleInfo = LOCALE_INFO.find(l => l.code === locale) || LOCALE_INFO[0];

  return (
    <>
    <header id="top-app-bar" className="flex justify-between items-center w-full px-container-margin md:px-8 py-base backdrop-blur-xl bg-white/10 sticky top-0 z-50 md:py-sm">
      {/* Logo & Title */}
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Morning Routine Logo" className="w-9 h-9 rounded-full object-cover border border-white/20 shadow-sm" />
        <h1 className="font-headline-md text-[28px] leading-[36px] font-semibold text-on-surface tracking-tight">
          {t('title')}
        </h1>
      </div>

      {/* Right Section: Menu & Language Switcher */}
      <div className="flex items-center gap-4 md:gap-8">
        {/* Desktop Menu - Hidden on mobile, No icons */}
        <nav id="desktop-nav" className="hidden md:flex items-center space-x-8">
          <Link href="/categories" className={`flex items-center transition-colors ${pathname === '/categories' ? 'text-tertiary' : 'text-on-surface-variant hover:text-white'}`}>
            <span className="font-semibold text-sm uppercase tracking-wider">{t('menuCategories')}</span>
          </Link>
          <Link href="/" className={`flex items-center transition-colors ${pathname === '/' ? 'text-tertiary' : 'text-on-surface-variant hover:text-white'}`}>
            <span className="font-semibold text-sm uppercase tracking-wider">{t('menuHome')}</span>
          </Link>
          <Link href="/settings" className={`flex items-center transition-colors ${pathname === '/settings' ? 'text-tertiary' : 'text-on-surface-variant hover:text-white'}`}>
            <span className="font-semibold text-sm uppercase tracking-wider">{t('menuSettings')}</span>
          </Link>
        </nav>

        {/* Language Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            id="lang-switcher-btn"
            onClick={() => setIsOpen(!isOpen)}
            className="h-10 px-3 flex items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 text-on-surface-variant hover:bg-white/10 transition-colors uppercase font-mono text-sm tracking-widest font-bold"
            title="Toggle Language"
          >
            <span className="text-lg">{currentLocaleInfo.flag}</span>
            <span className="hidden md:inline">{currentLocaleInfo.code}</span>
          </button>

          {isOpen && (
            <div id="lang-dropdown-menu" className="absolute right-0 mt-2 w-40 rounded-xl bg-[#1F2A5F]/90 backdrop-blur-xl border border-white/10 shadow-lg overflow-hidden z-50">
              <div className="flex flex-col py-1">
                {LOCALE_INFO.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLanguage(lang.code)}
                    className={`flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors text-left ${locale === lang.code ? 'text-tertiary bg-white/5' : 'text-on-surface'}`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="font-body-md text-sm">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* Full Screen Loading Overlay for Language Switch */}
    {isPending && (
      <div className="fixed inset-0 z-[9999] bg-[#0A0F2C]/80 backdrop-blur-md flex items-center justify-center transition-all duration-300">
        <div className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/10 border-t-tertiary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl">{currentLocaleInfo.flag}</span>
            </div>
          </div>
          <p className="text-on-surface font-headline-sm font-medium animate-pulse tracking-wide">
            {t('loading', { defaultValue: 'Switching language...' })}
          </p>
        </div>
      </div>
    )}
    </>
  );
}
