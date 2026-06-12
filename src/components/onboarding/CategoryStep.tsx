'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Database, CloudSun, TrendingUp, CalendarDays, Globe, FileText } from 'lucide-react';
import { useCategoryStore, Category } from '@/store/categoryStore';

interface CategoryStepProps {
  onNext: () => void;
}

const categoryIconMap: Record<string, React.ElementType> = {
  cat_1: CloudSun,
  cat_2: TrendingUp,
  cat_3: CalendarDays,
};

function getCategoryIcon(cat: Category): React.ElementType {
  return categoryIconMap[cat.id] ?? (cat.isFacebook ? Globe : FileText);
}

const ACCENT_COLORS = ['#8CD4E6', '#efbf65', '#DA8593', '#7B5C9C', '#a3e4b0'];

export function CategoryStep({ onNext }: CategoryStepProps) {
  const t = useTranslations('Onboarding');
  const { categories, toggleCategoryStatus } = useCategoryStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(140,212,230,0.15), rgba(123,92,156,0.1))',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Database size={24} strokeWidth={1.5} color="#8CD4E6" />
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-on-surface)', margin: 0, letterSpacing: '-0.02em' }}>
          {t('categoryTitle')}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--color-on-surface-variant)', margin: 0, lineHeight: 1.6 }}>
          {t('categoryDesc')}
        </p>
      </div>

      {/* Category List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {categories.map((cat, idx) => {
          const Icon = getCategoryIcon(cat);
          const color = ACCENT_COLORS[idx % ACCENT_COLORS.length];
          return (
            <div
              key={cat.id}
              onClick={() => toggleCategoryStatus(cat.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 16px', borderRadius: 14, cursor: 'pointer',
                border: `1px solid ${cat.isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
                background: cat.isActive ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                opacity: cat.isActive ? 1 : 0.6,
                transition: 'all 0.2s',
              }}
            >
              {/* Icon */}
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${color}18`,
                border: `1px solid ${color}30`,
              }}>
                <Icon size={20} strokeWidth={1.5} color={color} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 14, fontWeight: 600, margin: 0,
                  color: cat.isActive ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {cat.name}
                </p>
                <p 
                  title={cat.url || ''}
                  style={{ 
                    fontSize: 11, color: 'var(--color-on-surface-variant)', opacity: 0.7, margin: 0, marginTop: 2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}
                >
                  {cat.url ? cat.url : cat.isFacebook ? 'Facebook Page' : 'Built-in source'}
                </p>
              </div>

              {/* Toggle */}
              <div
                style={{
                  position: 'relative', width: 44, height: 24, borderRadius: 999, flexShrink: 0,
                  background: cat.isActive ? '#efbf65' : 'rgba(255,255,255,0.2)',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{
                  position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%',
                  background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  transition: 'transform 0.2s',
                  transform: `translateX(${cat.isActive ? 22 : 2}px)`,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <button
        id="onboarding-category-cta"
        onClick={onNext}
        style={{
          width: '100%', padding: '16px 0', borderRadius: 16, border: 'none', cursor: 'pointer',
          fontWeight: 600, fontSize: 15, letterSpacing: '0.02em', color: '#131317',
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
        {t('categoryCta')}
      </button>
    </div>
  );
}
