'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Play, Check, Mic } from 'lucide-react';
import { useSettingsStore, SavedVoice } from '@/store/settingsStore';

interface VoiceStepProps {
  onNext: () => void;
  onSkip: () => void;
}

export function VoiceStep({ onNext, onSkip }: VoiceStepProps) {
  const t = useTranslations('Onboarding');
  const { selectedVoice, setSelectedVoice } = useSettingsStore();

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingVoiceURI, setPlayingVoiceURI] = useState<string | null>(null);

  const loadVoices = useCallback(() => {
    const available = window.speechSynthesis.getVoices();
    if (available.length > 0) setVoices(available);
  }, []);

  useEffect(() => {
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, [loadVoices]);

  const previewVoice = (voice: SpeechSynthesisVoice | null) => {
    window.speechSynthesis.cancel();
    const text = t('voiceTestSample');
    const utt = new SpeechSynthesisUtterance(text);
    if (voice) utt.voice = voice;
    const uri = voice?.voiceURI ?? 'default';
    setPlayingVoiceURI(uri);
    setIsPlaying(true);
    utt.onend = () => { setIsPlaying(false); setPlayingVoiceURI(null); };
    utt.onerror = () => { setIsPlaying(false); setPlayingVoiceURI(null); };
    window.speechSynthesis.speak(utt);
  };

  const selectVoice = (voice: SpeechSynthesisVoice | null) => {
    if (voice === null) {
      setSelectedVoice(null);
    } else {
      const saved: SavedVoice = { voiceURI: voice.voiceURI, name: voice.name, lang: voice.lang };
      setSelectedVoice(saved);
    }
  };

  const isSelected = (voice: SpeechSynthesisVoice | null) => {
    if (voice === null) return selectedVoice === null;
    return selectedVoice?.voiceURI === voice.voiceURI;
  };

  const isPreviewPlaying = (voice: SpeechSynthesisVoice | null) =>
    isPlaying && playingVoiceURI === (voice?.voiceURI ?? 'default');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(239,191,101,0.15), rgba(140,212,230,0.1))',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Mic size={24} strokeWidth={1.5} color="#efbf65" />
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-on-surface)', margin: 0, letterSpacing: '-0.02em' }}>
          {t('voiceTitle')}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--color-on-surface-variant)', margin: 0, lineHeight: 1.6 }}>
          {t('voiceDesc')}
        </p>
      </div>

      {/* Voice List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto', paddingRight: 4 }}>
        {voices.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-on-surface-variant)', fontStyle: 'italic', padding: '24px 0' }}>
            {t('noVoicesAvailable')}
          </p>
        ) : (
          <>
            <VoiceRow
              name={t('voiceDefault')}
              lang="—"
              selected={isSelected(null)}
              isPreviewPlaying={isPreviewPlaying(null)}
              onSelect={() => selectVoice(null)}
              onPreview={() => previewVoice(null)}
              previewLabel={t('voiceTest')}
            />
            {voices.map((voice) => (
              <VoiceRow
                key={voice.voiceURI}
                name={voice.name}
                lang={voice.lang}
                selected={isSelected(voice)}
                isPreviewPlaying={isPreviewPlaying(voice)}
                onSelect={() => selectVoice(voice)}
                onPreview={() => previewVoice(voice)}
                previewLabel={t('voiceTest')}
              />
            ))}
          </>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
        <button
          id="onboarding-voice-cta"
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
          {t('voiceCta')}
        </button>
        <button
          id="onboarding-voice-skip"
          onClick={onSkip}
          style={{
            width: '100%', padding: '12px 0', borderRadius: 16, border: 'none', cursor: 'pointer',
            fontSize: 13, color: 'var(--color-on-surface-variant)', background: 'transparent',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-on-surface)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-on-surface-variant)'; }}
        >
          {t('voiceSkip')}
        </button>
      </div>
    </div>
  );
}

interface VoiceRowProps {
  name: string;
  lang: string;
  selected: boolean;
  isPreviewPlaying: boolean;
  onSelect: () => void;
  onPreview: () => void;
  previewLabel: string;
}

function VoiceRow({ name, lang, selected, isPreviewPlaying, onSelect, onPreview, previewLabel }: VoiceRowProps) {
  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
        border: `1px solid ${selected ? 'rgba(239,191,101,0.4)' : 'rgba(255,255,255,0.08)'}`,
        background: selected ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
        transition: 'all 0.2s',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
        <div style={{
          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
          border: `2px solid ${selected ? '#efbf65' : 'rgba(255,255,255,0.3)'}`,
          background: selected ? '#efbf65' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          {selected && <Check size={10} strokeWidth={3} color="#131317" />}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            fontSize: 13, fontWeight: 600, margin: 0,
            color: selected ? '#efbf65' : 'var(--color-on-surface)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {name}
          </p>
          <p style={{ fontSize: 11, color: 'var(--color-on-surface-variant)', margin: 0 }}>{lang}</p>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onPreview(); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)', cursor: 'pointer',
          color: 'var(--color-on-surface-variant)', flexShrink: 0,
          transition: 'all 0.2s', fontSize: 12,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-on-surface)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-on-surface-variant)';
        }}
      >
        <Play size={11} strokeWidth={2} color={isPreviewPlaying ? '#efbf65' : 'currentColor'} />
        <span style={{ fontWeight: 500 }}>{previewLabel}</span>
      </button>
    </div>
  );
}
