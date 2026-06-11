'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Sunrise, AudioLines, BookOpen } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

const features = [
  { icon: Sunrise, defaultLabel: 'Weather & Schedule' },
  { icon: AudioLines, defaultLabel: 'AI Voice Briefing' },
  { icon: BookOpen, defaultLabel: 'News & Updates' },
];

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const t = useTranslations('Onboarding');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 32, width: '100%' }}>
      {/* Logo */}
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        <div style={{ width: 96, height: 96, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          <img src="/logo.png" alt="Morning Routine" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{
          position: 'absolute', inset: -12, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,191,101,0.2) 0%, rgba(140,212,230,0.1) 100%)',
          filter: 'blur(16px)', zIndex: -1,
        }} />
      </div>

      {/* Heading */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
        <h1 style={{ fontSize: 'clamp(40px, 8vw, 60px)', fontWeight: 700, color: 'var(--color-on-surface)', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.1 }}>
          {t('welcomeTitle')}
        </h1>
        <p style={{ fontSize: 17, color: '#efbf65', fontWeight: 500, letterSpacing: '0.02em', margin: 0 }}>
          {t('welcomeSubtitle')}
        </p>
        <p style={{ fontSize: 15, color: 'var(--color-on-surface-variant)', lineHeight: 1.7, margin: '0 auto', maxWidth: 400 }}>
          {t('welcomeDesc')}
        </p>
      </div>

      {/* Feature Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
        {features.map(({ icon: Icon, defaultLabel }) => (
          <div
            key={defaultLabel}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 999,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Icon size={14} strokeWidth={1.5} color="#efbf65" />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-on-surface-variant)' }}>{defaultLabel}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        id="onboarding-welcome-cta"
        onClick={onNext}
        style={{
          width: '100%', maxWidth: 320, padding: '16px 0',
          borderRadius: 16, border: 'none', cursor: 'pointer',
          fontWeight: 600, fontSize: 15, letterSpacing: '0.02em',
          color: '#131317',
          background: 'linear-gradient(135deg, #efbf65 0%, #FECD71 50%, #DA8593 100%)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(239,191,101,0.3)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
        }}
      >
        {t('welcomeCta')}
      </button>
    </div>
  );
}
