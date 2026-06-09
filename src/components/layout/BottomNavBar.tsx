import React from 'react';

export function BottomNavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-[100] flex justify-around items-center px-4 py-4 backdrop-blur-2xl bg-[#131317]/80 border-t border-white/10 md:hidden">
      <button className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-white/5 active:scale-90 transition-all w-12 h-12 rounded-full">
        <span className="material-symbols-outlined text-[28px]" data-icon="grid_view">grid_view</span>
      </button>
      <button className="flex flex-col items-center justify-center text-tertiary font-bold active:scale-95 transition-all w-14 h-14 rounded-full bg-white/5 border border-tertiary/20">
        <span className="material-symbols-outlined text-[36px]" data-icon="home" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
      </button>
      <button className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-white/5 active:scale-90 transition-all w-12 h-12 rounded-full">
        <span className="material-symbols-outlined text-[28px]" data-icon="settings">settings</span>
      </button>
    </nav>
  );
}
