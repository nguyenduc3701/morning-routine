import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Kiểu dữ liệu cho một giọng đọc được lưu
export interface SavedVoice {
  voiceURI: string;
  name: string;
  lang: string;
}

interface SettingsState {
  // Cấu hình Cron Job
  cronEnabled: boolean;
  cronTime: string;

  // Cấu hình giọng đọc
  selectedVoice: SavedVoice | null;

  // Onboarding
  hasCompletedOnboarding: boolean;
}

interface SettingsActions {
  updateSettings: (settings: Partial<SettingsState>) => void;
  setSelectedVoice: (voice: SavedVoice | null) => void;
  completeOnboarding: () => void;
}

const defaultState: SettingsState = {
  cronEnabled: false,
  cronTime: '06:00',
  selectedVoice: null,
  hasCompletedOnboarding: false,
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      ...defaultState,

      updateSettings: (settings) =>
        set((state) => ({ ...state, ...settings })),

      setSelectedVoice: (voice) =>
        set(() => ({ selectedVoice: voice })),

      completeOnboarding: () =>
        set(() => ({ hasCompletedOnboarding: true })),
    }),
    {
      name: 'morning-routine-settings', // key trong localStorage
    }
  )
);

import { useState, useEffect } from 'react';

export const useSettingsStoreHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubFinishHydration = useSettingsStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useSettingsStore.persist.hasHydrated());

    return () => {
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};
