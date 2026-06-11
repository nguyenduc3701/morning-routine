'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';

export default function LoginPage() {
  const t = useTranslations('Login');
  const router = useRouter();

  const handleMockLogin = () => {
    router.push('/onboarding');
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
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        
        <div style={{ textAlign: 'center', animation: 'fadeInUp 0.4s ease-out both', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {/* Logo / Icon Placeholder */}
          <div style={{ 
            width: 80, height: 80, borderRadius: 24, 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 32,
            boxShadow: '0 16px 32px rgba(0,0,0,0.2)'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#efbf65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 600, color: '#FFFFFF', marginBottom: 12, letterSpacing: '-0.02em' }}>
            {t('title')}
          </h1>
          <p style={{ fontSize: 16, color: 'var(--color-on-surface-variant)', maxWidth: 280, lineHeight: 1.5, marginBottom: 48 }}>
            {t('subtitle')}
          </p>

          <button
            onClick={handleMockLogin}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              width: '100%', maxWidth: 320, padding: '16px 24px',
              borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)', color: '#FFFFFF',
              fontSize: 16, fontWeight: 500,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
            onMouseDown={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(1px)';
            }}
          >
            {/* Google Icon */}
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {t('continueWithGoogle')}
          </button>
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
