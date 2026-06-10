'use client';

import React from 'react';
import { usePathname, Link } from '@/i18n/routing';
import { LayoutGrid, Home, Settings } from 'lucide-react';

export function BottomNavBar() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-[100] flex justify-around items-center px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+8px)] backdrop-blur-2xl bg-[#131317]/80 border-t border-white/10 md:hidden">
      <Link href="/categories" className={`flex flex-col items-center justify-center hover:bg-white/5 active:scale-90 transition-all w-12 h-12 rounded-full ${pathname === '/categories' ? 'text-tertiary' : 'text-on-surface-variant'}`}>
        <LayoutGrid size={28} fill={pathname === '/categories' ? 'currentColor' : 'none'} strokeWidth={pathname === '/categories' ? 0 : 1.5} />
      </Link>
      <Link href="/" className={`flex flex-col items-center justify-center font-bold active:scale-95 transition-all w-14 h-14 rounded-full ${pathname === '/' ? 'text-tertiary bg-white/5 border border-tertiary/20 shadow-[0_0_15px_rgba(239,191,101,0.15)]' : 'text-on-surface-variant'}`}>
        <Home size={34} fill={pathname === '/' ? 'currentColor' : 'none'} strokeWidth={pathname === '/' ? 0 : 1.5} />
      </Link>
      <Link href="/settings" className={`flex flex-col items-center justify-center hover:bg-white/5 active:scale-90 transition-all w-12 h-12 rounded-full ${pathname === '/settings' ? 'text-tertiary' : 'text-on-surface-variant'}`}>
        <Settings size={28} strokeWidth={1.5} />
      </Link>
    </nav>
  );
}
