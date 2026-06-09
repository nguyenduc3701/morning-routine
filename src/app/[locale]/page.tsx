import React from 'react';
import { useTranslations } from 'next-intl';
import { GlassCard } from '@/components/ui/GlassCard';
import { AudioPlayer } from '@/components/dashboard/AudioPlayer';

export default function DashboardPage() {
  const t = useTranslations('Dashboard');

  return (
    <>
      {/* Greeting Section */}
      <section id="greeting-section" className="space-y-sm">
        <h2 className="font-headline-md text-[36px] md:text-[44px] leading-tight text-on-surface font-bold tracking-tight">
          {t('greeting')}
        </h2>
      </section>

      {/* Prepare Data Section - Full width */}
      <section id="prepare-data-section" className="w-full">
        <GlassCard className="rounded-xl p-sm md:p-md space-y-sm w-full" glow>
          <div className="flex justify-between items-center">
            <span className="font-body-md text-body-md text-on-surface-variant">
              {t('prepareData')}
            </span>
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-tertiary text-sm animate-spin-slow">sync</span>
              <span className="font-label-sm text-label-sm text-tertiary">40% {t('complete')}</span>
            </div>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="progress-gradient h-full rounded-full w-[40%] transition-all duration-1000 ease-in-out"></div>
          </div>
        </GlassCard>
      </section>

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
            <div id="audio-playlist" className="flex-1 overflow-y-auto space-y-1">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/10 border border-tertiary/20 shadow-[0_0_15px_rgba(140,212,230,0.1)]">
                <span className="font-semibold text-sm text-tertiary tracking-wide">{t('hydrate')}</span>
                <span className="material-symbols-outlined text-tertiary text-[16px] animate-pulse">equalizer</span>
              </div>
              <div className="flex items-center px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-on-surface-variant cursor-pointer">
                <span className="font-medium text-sm tracking-wide">{t('mindful')}</span>
              </div>
              <div className="flex items-center px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-on-surface-variant cursor-pointer">
                <span className="font-medium text-sm tracking-wide">{t('sunlight')}</span>
              </div>
            </div>
            
            {/* Navigation & Audio Controls */}
            <div className="flex items-center justify-between pt-sm border-t border-white/10">
              <button id="btn-audio-back" className="flex items-center gap-1 p-2 rounded-full hover:bg-white/10 transition-all text-on-surface-variant group">
                <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">chevron_left</span>
                <span className="font-label-sm uppercase tracking-widest hidden lg:inline">{t('back')}</span>
              </button>
              
              <div className="flex items-center gap-sm">
                <button id="btn-audio-replay" className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-white/10 hover:text-white transition-colors">
                  <span className="material-symbols-outlined">replay_10</span>
                </button>
                <button id="btn-audio-stop" className="w-12 h-12 flex items-center justify-center rounded-full text-white bg-white/5 border border-white/10 hover:bg-white/20 transition-colors">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stop</span>
                </button>
                <button id="btn-audio-forward" className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-white/10 hover:text-white transition-colors">
                  <span className="material-symbols-outlined">forward_10</span>
                </button>
              </div>
              
              <button id="btn-audio-next" className="flex items-center gap-1 p-2 rounded-full hover:bg-white/10 transition-all text-tertiary group">
                <span className="font-label-sm uppercase tracking-widest hidden lg:inline">{t('next')}</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>
            </div>
          </GlassCard>
        </section>

        {/* Categories Section */}
        <section id="categories-section" className="flex-1 space-y-sm min-w-0">
          <h3 className="font-headline-md text-on-surface opacity-90 px-xs text-[18px] md:text-[20px] font-semibold">{t('categories')}</h3>
          <div className="grid grid-cols-2 gap-sm">
            {/* Hydration - Large Vertical */}
            <GlassCard id="card-hydrate" className="rounded-xl p-sm md:p-md col-span-1 row-span-2 flex flex-col justify-between hover:bg-white/15 transition-colors cursor-pointer group">
              <div>
                <div className="flex justify-between items-start">
                  <span className="material-symbols-outlined text-primary mb-sm text-3xl">water_drop</span>
                  <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">play_circle</span>
                </div>
                <h3 className="font-headline-md text-[20px] md:text-[22px] leading-tight font-semibold mt-2">{t('hydrate')}</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">{t('hydrateDesc')}</p>
              <button id="btn-hydrate-done" className="mt-md w-12 h-12 rounded-full border-[1.5px] border-tertiary flex items-center justify-center text-tertiary group-hover:bg-tertiary group-hover:text-surface transition-all">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              </button>
            </GlassCard>

            {/* Meditation - Wide */}
            <GlassCard id="card-meditation" className="rounded-xl p-sm md:p-md col-span-1 flex flex-col justify-between hover:bg-white/15 transition-colors cursor-pointer group">
              <div className="flex items-start justify-between">
                <span className="material-symbols-outlined text-secondary text-2xl">self_improvement</span>
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity text-xl">play_circle</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">{t('mindfulDesc')}</span>
                </div>
              </div>
              <h3 className="font-headline-md text-[16px] md:text-[18px] font-semibold mt-base">{t('mindful')}</h3>
            </GlassCard>

            {/* Light Exposure */}
            <GlassCard id="card-sunlight" className="rounded-xl p-sm md:p-md col-span-1 flex flex-col justify-between hover:bg-white/15 transition-colors cursor-pointer group">
              <div className="flex items-start justify-between">
                <span className="material-symbols-outlined text-tertiary text-2xl">wb_sunny</span>
                <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity text-xl">play_circle</span>
              </div>
              <h3 className="font-headline-md text-[16px] md:text-[18px] font-semibold mt-base">{t('sunlight')}</h3>
            </GlassCard>
          </div>
        </section>

      </div>
    </>
  );
}
