'use client';

import React, { useState, useEffect, useCallback, FC } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { GlassCard } from '@/components/ui/GlassCard';
import { useSettingsStore, SavedVoice } from '@/store/settingsStore';
import {
  Clock,
  Mic2,
  PlayCircle,
  CheckCircle2,
  CalendarClock,
  Volume2,
} from 'lucide-react';

// --- Toggle Switch Component ---
interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({ id, checked, onChange }) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8CD4E6] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
      checked
        ? 'border-[#FECD71] bg-[#FECD71]/20'
        : 'border-white/20 bg-white/5'
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full shadow-lg ring-0 transition-all duration-300 ease-in-out ${
        checked
          ? 'translate-x-5 bg-[#FECD71]'
          : 'translate-x-0.5 bg-white/40'
      }`}
    />
  </button>
);

// --- Section Header Component ---
interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  desc: string;
  iconColor: string;
}

const SectionHeader: FC<SectionHeaderProps> = ({ icon: Icon, title, desc, iconColor }) => (
  <div className="flex items-start gap-4 mb-6">
    <div
      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
      style={{ background: `${iconColor}18`, border: `1px solid ${iconColor}30` }}
    >
      <Icon size={22} strokeWidth={1.5} style={{ color: iconColor }} />
    </div>
    <div>
      <h2 className="font-headline-md text-[18px] font-semibold text-on-surface leading-tight">
        {title}
      </h2>
      <p className="font-body-md text-sm text-on-surface-variant mt-0.5 leading-relaxed">
        {desc}
      </p>
    </div>
  </div>
);

// --- Main Settings Page ---
export default function SettingsPage(): React.ReactElement {
  const t = useTranslations('Settings');
  const locale = useLocale();

  const { cronEnabled, cronTime, selectedVoice, updateSettings, setSelectedVoice } =
    useSettingsStore();

  // Danh sách giọng đọc từ trình duyệt
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load danh sách giọng đọc - cần retry vì trình duyệt có thể load async
  const loadVoices = useCallback((): void => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const available = window.speechSynthesis.getVoices();
    if (available.length > 0) {
      // Ưu tiên giọng theo locale hiện tại lên đầu
      const sorted = [...available].sort((a, b) => {
        const aMatch = a.lang.toLowerCase().startsWith(locale.toLowerCase()) ? -1 : 0;
        const bMatch = b.lang.toLowerCase().startsWith(locale.toLowerCase()) ? -1 : 0;
        return aMatch - bMatch;
      });
      setVoices(sorted);
    }
  }, [locale]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    loadVoices();
    // Safari/Firefox load giọng bất đồng bộ, lắng nghe event voiceschanged
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [loadVoices]);

  // Tìm giọng đang được chọn trong danh sách hiện tại
  const currentVoice = voices.find((v) => v.voiceURI === selectedVoice?.voiceURI) ?? null;

  const handleVoiceChange = (voiceURI: string): void => {
    const voice = voices.find((v) => v.voiceURI === voiceURI);
    if (!voice) {
      setSelectedVoice(null);
      return;
    }
    setSelectedVoice({ voiceURI: voice.voiceURI, name: voice.name, lang: voice.lang });
  };

  const handleTestVoice = (): void => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isTesting) {
      window.speechSynthesis.cancel();
      setIsTesting(false);
      return;
    }

    const sampleText = t('voiceTestSample');
    const utterance = new SpeechSynthesisUtterance(sampleText);
    if (currentVoice) utterance.voice = currentVoice;
    utterance.onstart = () => setIsTesting(true);
    utterance.onend = () => setIsTesting(false);
    utterance.onerror = () => setIsTesting(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSave = (): void => {
    // Trạng thái đã được lưu tự động bởi Zustand persist
    // Hiển thị phản hồi trực quan cho người dùng
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="settings-page" className="w-full max-w-2xl mx-auto pb-16 space-y-6">
      {/* Page Header */}
      <header id="settings-header" className="space-y-1">
        <h1 className="font-headline-md text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
          {t('title')}
        </h1>
        <p className="font-body-md text-on-surface-variant">{t('desc')}</p>
      </header>

      {/* Section 1: Automation & Scheduling */}
      <GlassCard id="settings-schedule-card" className="rounded-2xl p-6">
        <SectionHeader
          icon={CalendarClock}
          title={t('sectionSchedule')}
          desc=""
          iconColor="#FECD71"
        />

        {/* Toggle Row */}
        <div
          id="settings-cron-toggle-row"
          className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
        >
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-on-surface">{t('cronEnabled')}</p>
            <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
              {t('cronEnabledDesc')}
            </p>
          </div>
          <ToggleSwitch
            id="toggle-cron-enabled"
            checked={cronEnabled}
            onChange={(val) => updateSettings({ cronEnabled: val })}
          />
        </div>

        {/* Time Picker - hiện khi cron được bật */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            cronEnabled ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-4 rounded-xl bg-[#FECD71]/5 border border-[#FECD71]/20 space-y-3">
            <div className="flex items-center gap-2">
              <Clock size={16} strokeWidth={1.5} className="text-[#FECD71] shrink-0" />
              <span className="font-semibold text-sm text-on-surface">{t('cronTime')}</span>
            </div>
            <input
              id="input-cron-time"
              type="time"
              value={cronTime}
              onChange={(e) => updateSettings({ cronTime: e.target.value })}
              className="w-full bg-black/20 border border-[#FECD71]/30 rounded-xl px-4 py-3 text-on-surface font-mono text-lg font-semibold focus:outline-none focus:border-[#FECD71]/70 transition-colors appearance-none cursor-pointer"
              style={{ colorScheme: 'dark' }}
            />
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {t('cronTimeDesc')}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Section 2: Voice Preferences */}
      <GlassCard id="settings-voice-card" className="rounded-2xl p-6">
        <SectionHeader
          icon={Mic2}
          title={t('sectionVoice')}
          desc=""
          iconColor="#8CD4E6"
        />

        {voices.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant text-sm">
            <Volume2 size={32} strokeWidth={1} className="mx-auto mb-3 opacity-40" />
            {t('noVoicesAvailable')}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="select-voice" className="font-semibold text-sm text-on-surface block">
                {t('voiceSelect')}
              </label>
              <p className="text-xs text-on-surface-variant">{t('voiceSelectDesc')}</p>
            </div>

            {/* Voice Dropdown */}
            <div className="relative">
              <select
                id="select-voice"
                value={currentVoice?.voiceURI ?? ''}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="w-full appearance-none bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-on-surface text-sm font-medium focus:outline-none focus:border-[#8CD4E6]/60 hover:border-white/25 transition-colors cursor-pointer pr-10"
                style={{ colorScheme: 'dark' }}
              >
                <option value="">{t('voiceDefault')}</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  className="h-4 w-4 text-on-surface-variant"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Test Voice Button */}
            <button
              id="btn-test-voice"
              onClick={handleTestVoice}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 ${
                isTesting
                  ? 'bg-[#DA8593]/20 border border-[#DA8593]/50 text-[#DA8593]'
                  : 'bg-[#8CD4E6]/10 border border-[#8CD4E6]/30 text-[#8CD4E6] hover:bg-[#8CD4E6]/20'
              }`}
            >
              <PlayCircle
                size={18}
                strokeWidth={1.5}
                className={isTesting ? 'animate-pulse' : ''}
              />
              {isTesting ? '■ Stop' : t('voiceTest')}
            </button>

            {/* Giọng đang chọn */}
            {currentVoice && (
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <span className="w-2 h-2 rounded-full bg-[#8CD4E6] shrink-0" />
                <span>
                  {currentVoice.name} — <span className="font-mono">{currentVoice.lang}</span>
                </span>
              </div>
            )}
          </div>
        )}
      </GlassCard>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          id="btn-save-settings"
          onClick={handleSave}
          className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 active:scale-95 ${
            saved
              ? 'bg-[#8CD4E6]/20 border border-[#8CD4E6]/50 text-[#8CD4E6]'
              : 'bg-[#FECD71] text-black hover:bg-[#FBE09A] shadow-[0_0_20px_rgba(239,191,101,0.25)]'
          }`}
        >
          {saved ? (
            <>
              <CheckCircle2 size={18} strokeWidth={2} />
              {t('saved')}
            </>
          ) : (
            t('saveChanges')
          )}
        </button>
      </div>
    </div>
  );
}
