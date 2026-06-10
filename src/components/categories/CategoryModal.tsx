'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Category, useCategoryStore } from '@/store/categoryStore';
import { X } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Category | null;
}

export function CategoryModal({ isOpen, onClose, initialData }: CategoryModalProps) {
  const t = useTranslations('Categories');
  const { addCategory, updateCategory } = useCategoryStore();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [isFacebook, setIsFacebook] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setUrl(initialData.url);
        setIsFacebook(initialData.isFacebook);
      } else {
        setName('');
        setUrl('');
        setIsFacebook(false);
      }
      setError('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError(t('errorNameRequired'));
      return;
    }

    if (isFacebook && url && !url.includes('facebook.com')) {
      setError(t('errorInvalidFbUrl'));
      return;
    }

    const categoryData = {
      name: name.trim(),
      url: url.trim(),
      isFacebook,
      isActive: initialData ? initialData.isActive : true,
    };

    if (initialData) {
      updateCategory(initialData.id, categoryData);
    } else {
      addCategory(categoryData);
    }

    onClose();
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal Panel */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '448px',
          maxHeight: '90dvh',
          overflowY: 'auto',
          backgroundColor: 'rgba(31, 42, 95, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(123, 92, 156, 0.4)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#e4e1e7', margin: 0 }}>
            {initialData ? t('editCategory') : t('addCategory')}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#c6c5d1',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#c6c5d1', marginBottom: '6px' }}>
              {t('categoryName')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('categoryPlaceholder')}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
              }}
            />
          </div>

          {/* Facebook Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <span style={{ fontSize: '14px', color: '#c6c5d1' }}>{t('isFacebook')}</span>
            <button
              type="button"
              onClick={() => setIsFacebook(!isFacebook)}
              style={{
                position: 'relative',
                display: 'inline-flex',
                height: '24px',
                width: '44px',
                alignItems: 'center',
                borderRadius: '999px',
                backgroundColor: isFacebook ? '#efbf65' : 'rgba(255,255,255,0.2)',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                flexShrink: 0,
              }}
            >
              <span style={{
                display: 'inline-block',
                height: '16px',
                width: '16px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                transform: isFacebook ? 'translateX(22px)' : 'translateX(4px)',
                transition: 'transform 0.2s',
              }} />
            </button>
          </div>

          {/* URL */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#c6c5d1', marginBottom: '6px' }}>
              {t('dataUrl')}
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={isFacebook ? 'https://facebook.com/...' : 'https://...'}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
              }}
            />
          </div>

          {/* Error */}
          {error && <p style={{ color: '#f87171', fontSize: '14px', margin: 0 }}>{error}</p>}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.7)',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                fontWeight: 600,
                color: '#000',
                backgroundColor: '#efbf65',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                boxShadow: '0 0 20px rgba(239,191,101,0.3)',
              }}
            >
              {initialData ? t('saveChanges') : t('create')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
