'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { useSettingsStore, useSettingsStoreHydration } from '@/store/settingsStore';

export function AppInitializer() {
  const { hasCompletedOnboarding } = useSettingsStore();
  const isHydrated = useSettingsStoreHydration();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;

    const isOnOnboardingPage = pathname === '/onboarding';
    const isLoginPage = pathname === '/login';

    if (!hasCompletedOnboarding && !isOnOnboardingPage && !isLoginPage) {
      // User chưa onboard, redirect sang /login
      router.replace('/login');
    } else if (hasCompletedOnboarding && (isOnOnboardingPage || isLoginPage)) {
      // User đã onboard mà cố vào /onboarding hoặc /login, redirect về home
      router.replace('/');
    }
  }, [hasCompletedOnboarding, isHydrated, pathname, router]);

  if (!isHydrated) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#0A0F2C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#efbf65', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return null;
}
