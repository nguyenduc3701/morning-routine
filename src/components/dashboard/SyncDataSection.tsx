'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSyncStore } from '@/store/syncStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { RefreshCw, Play, CheckCircle2 } from 'lucide-react';

export function SyncDataSection() {
  const t = useTranslations('Dashboard');
  const { status, progress, startSync, completeSync } = useSyncStore();

  // Mock progress simulation
  useEffect(() => {
    if (status === 'syncing') {
      const interval = setInterval(() => {
        useSyncStore.setState((state) => {
          if (state.progress >= 100) {
            clearInterval(interval);
            setTimeout(() => useSyncStore.getState().completeSync(), 200);
            return state;
          }
          // Increment by a random amount between 2 and 10
          return { progress: state.progress + Math.floor(Math.random() * 8) + 2 };
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <section id="prepare-data-section" className="w-full">
      <GlassCard className="rounded-xl p-sm md:p-md space-y-sm w-full transition-all duration-300" glow={status === 'syncing'}>
        
        {status === 'idle' && (
          <div className="flex justify-between items-center">
            <span className="font-body-md text-body-md text-on-surface-variant">
              {t('syncIdle')}
            </span>
            <button
              onClick={startSync}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary text-[#0A0F2C] hover:bg-tertiary/90 hover:scale-105 transition-all text-sm font-bold shadow-[0_0_15px_rgba(239,191,101,0.3)]"
            >
              <Play size={14} strokeWidth={2} />
              {t('startSync')}
            </button>
          </div>
        )}

        {status === 'syncing' && (
          <>
            <div className="flex justify-between items-center">
              <span className="font-body-md text-body-md text-on-surface-variant">
                {t('syncing')}
              </span>
              <div className="flex items-center gap-xs">
                <RefreshCw size={14} strokeWidth={2} className="text-tertiary animate-spin-slow" />
                <span className="font-label-sm text-label-sm text-tertiary">{Math.min(100, progress)}%</span>
              </div>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="progress-gradient h-full rounded-full transition-all duration-200 ease-out" 
                style={{ width: `${Math.min(100, progress)}%` }}
              ></div>
            </div>
          </>
        )}

        {status === 'completed' && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} strokeWidth={2} className="text-[#8CD4E6]" />
              <span className="font-body-md text-body-md text-[#8CD4E6] font-medium">
                {t('syncCompleted')}
              </span>
            </div>
            <button
              onClick={startSync}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-on-surface-variant hover:text-white text-sm font-medium"
            >
              <RefreshCw size={14} strokeWidth={2} />
              {t('reSync')}
            </button>
          </div>
        )}

      </GlassCard>
    </section>
  );
}
