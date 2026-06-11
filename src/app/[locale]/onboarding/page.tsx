'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useSettingsStore } from '@/store/settingsStore';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { VoiceStep } from '@/components/onboarding/VoiceStep';
import { CategoryStep } from '@/components/onboarding/CategoryStep';
import { ChevronLeft } from 'lucide-react';

const TOTAL_STEPS = 3;

export default function OnboardingPage() {
  const t = useTranslations('Onboarding');
  const router = useRouter();
  const { completeOnboarding } = useSettingsStore();
  const [step, setStep] = useState(1);

  const goNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      handleFinish();
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const handleFinish = () => {
    completeOnboarding();
    router.replace('/');
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', width: '100vw', height: '100dvh', overflow: 'hidden' }}
    >
      {/* Animated background */}
      <div style={{ position: 'absolute', inset: 0, background: '#0A0F2C' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 600, height: 600, borderRadius: '50%', background: 'rgba(31,42,95,0.6)', filter: 'blur(80px)', transform: 'translate(25%, -33%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 400, height: 400, borderRadius: '50%', background: 'rgba(123,92,156,0.3)', filter: 'blur(80px)', transform: 'translate(-25%, 33%)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(239,191,101,0.05)', filter: 'blur(80px)', transform: 'translate(-50%, -50%)' }} />
      </div>

      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>

        {/* Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 16px' }}>
          {/* Back button */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            {step > 1 && (
              <button
                id="onboarding-back-btn"
                onClick={goBack}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '8px 12px', borderRadius: 999, border: 'none', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.05)', color: 'var(--color-on-surface-variant)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-on-surface)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-on-surface-variant)';
                }}
              >
                <ChevronLeft size={16} strokeWidth={2} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{t('back', { defaultValue: 'Back' })}</span>
              </button>
            )}
          </div>

          {/* Step dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 8, borderRadius: 999,
                  transition: 'all 0.3s',
                  width: i + 1 === step ? 24 : 8,
                  background: i + 1 <= step ? '#efbf65' : 'rgba(255,255,255,0.2)',
                  opacity: i + 1 < step ? 0.5 : 1,
                }}
              />
            ))}
          </div>

          {/* Step label */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 11, color: 'var(--color-on-surface-variant)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
              {t('stepOf', { step, total: TOTAL_STEPS })}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '0 24px' }}>
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(to right, #efbf65, #DA8593)',
              borderRadius: 999,
              transition: 'width 0.5s ease-out',
              width: `${(step / TOTAL_STEPS) * 100}%`,
            }}
          />
        </div>

        {/* Scrollable content area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 16px',
            boxSizing: 'border-box',
            minHeight: 0,
          }}
        >
          <div
            key={step}
            style={{ width: '100%', maxWidth: 520, animation: 'fadeInUp 0.4s ease-out both' }}
          >
            {step === 1 && <WelcomeStep onNext={goNext} />}
            {step === 2 && <VoiceStep onNext={goNext} onSkip={goNext} />}
            {step === 3 && <CategoryStep onNext={handleFinish} />}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
