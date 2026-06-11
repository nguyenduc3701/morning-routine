'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { GlassCard } from '@/components/ui/GlassCard';
import { AudioPlayer } from '@/components/dashboard/AudioPlayer';
import { SyncDataSection } from '@/components/dashboard/SyncDataSection';
import { useCategoryStore } from '@/store/categoryStore';
import {
  AudioLines, ChevronLeft, ChevronRight,
  RotateCcw, Square, RotateCw, PlayCircle,
  CloudSun, TrendingUp, CalendarDays, Globe, FileText
} from 'lucide-react';

const categoryIconMap: Record<string, React.ElementType> = {
  cat_1: CloudSun,
  cat_2: TrendingUp,
  cat_3: CalendarDays,
};
function getCategoryIcon(catId: string, isFacebook: boolean): React.ElementType {
  return categoryIconMap[catId] ?? (isFacebook ? Globe : FileText);
}

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const { categories } = useCategoryStore();
  
  const activeCategories = categories
    .filter(cat => cat.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {/* Greeting Section */}
      <section id="greeting-section" className="space-y-sm">
        <h2 className="font-headline-md text-[36px] md:text-[44px] leading-tight text-on-surface font-bold tracking-tight">
          {t('greeting')}
        </h2>
      </section>

      {/* Prepare Data Section - Full width */}
      <SyncDataSection />

      {/* Desktop Flex Container for Audio Focus & Categories */}
      <div className="flex flex-col md:flex-row md:gap-8 space-y-sm md:space-y-0 w-full">
        
        {/* Audio Focus Section (Swapped to be before Categories) */}
        <section id="audio-focus-section" className="flex-1 min-w-0">
          <GlassCard className="rounded-xl p-sm md:p-md relative overflow-hidden flex flex-col space-y-md h-full justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-md">
                <AudioPlayer />
                <div>
                  <h4 className="font-headline-md text-[20px] font-semibold">{t('audioTitle')}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">{t('audioDesc')}</p>
                </div>
              </div>
            </div>

            {/* Playlist / Categories Queue */}
            <div id="audio-playlist" className="flex-1 overflow-y-auto space-y-1 pr-2">
              {activeCategories.length > 0 ? activeCategories.map((cat, index) => (
                <div key={cat.id} className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${index === 0 ? 'bg-white/10 border border-tertiary/20 shadow-[0_0_15px_rgba(140,212,230,0.1)]' : 'hover:bg-white/5 text-on-surface-variant group'}`}>
                  <span className={`font-semibold text-sm tracking-wide truncate pr-2 ${index === 0 ? 'text-tertiary' : 'group-hover:text-white'}`}>
                    {cat.name}
                  </span>
                  {index === 0 && <AudioLines size={16} strokeWidth={2} className="text-tertiary animate-pulse shrink-0" />}
                </div>
              )) : (
                <div className="text-sm text-on-surface-variant p-2 italic">No active data sources. Please configure in Categories.</div>
              )}
            </div>
            
            {/* Navigation & Audio Controls */}
            <div className="flex items-center justify-between pt-sm border-t border-white/10">
              <button id="btn-audio-back" className="flex items-center gap-1 p-2 rounded-full hover:bg-white/10 transition-all text-on-surface-variant group">
                <ChevronLeft size={22} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-label-sm uppercase tracking-widest hidden lg:inline">{t('back')}</span>
              </button>
              
              <div className="flex items-center gap-sm">
                <button id="btn-audio-replay" className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-white/10 hover:text-white transition-colors">
                  <RotateCcw size={20} strokeWidth={1.5} />
                </button>
                <button id="btn-audio-stop" className="w-12 h-12 flex items-center justify-center rounded-full text-white bg-white/5 border border-white/10 hover:bg-white/20 transition-colors">
                  <Square size={20} strokeWidth={0} fill="currentColor" />
                </button>
                <button id="btn-audio-forward" className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-white/10 hover:text-white transition-colors">
                  <RotateCw size={20} strokeWidth={1.5} />
                </button>
              </div>
              
              <button id="btn-audio-next" className="flex items-center gap-1 p-2 rounded-full hover:bg-white/10 transition-all text-tertiary group">
                <span className="font-label-sm uppercase tracking-widest hidden lg:inline">{t('next')}</span>
                <ChevronRight size={22} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </GlassCard>
        </section>

        {/* Categories Section */}
        <section id="categories-section" className="flex-1 space-y-sm min-w-0">
          <h3 className="font-headline-md text-on-surface opacity-90 px-xs text-[18px] md:text-[20px] font-semibold">{t('categories')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
            {activeCategories.length > 0 ? activeCategories.map((cat, idx) => {
              const colors = ['#8CD4E6', '#FECD71', '#DA8593', '#7B5C9C'];
              const color = colors[idx % colors.length];
              
              return (
                <GlassCard key={cat.id} className="rounded-xl p-sm md:p-md flex flex-col justify-between hover:bg-white/15 transition-colors cursor-pointer group min-h-[140px]">
                  <div className="flex items-start justify-between">
                  {(() => { const Icon = getCategoryIcon(cat.id, cat.isFacebook); return <Icon size={32} strokeWidth={1.5} style={{ color }} />; })()}
                    <PlayCircle size={20} strokeWidth={1.5} className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h3 className="font-headline-md text-[16px] md:text-[18px] font-semibold mt-base leading-tight">{cat.name}</h3>
                    {cat.url && <p className="text-xs text-on-surface-variant truncate mt-1">{cat.url}</p>}
                  </div>
                </GlassCard>
              );
            }) : (
              <div className="col-span-1 sm:col-span-2 text-center p-8 border border-dashed border-white/20 rounded-xl text-on-surface-variant">
                No active categories.
              </div>
            )}
          </div>
        </section>

      </div>
    </>
  );
}
