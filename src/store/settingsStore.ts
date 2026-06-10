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
}

interface SettingsActions {
  updateSettings: (settings: Partial<SettingsState>) => void;
  setSelectedVoice: (voice: SavedVoice | null) => void;
}

const defaultState: SettingsState = {
  cronEnabled: false,
  cronTime: '06:00',
  selectedVoice: null,
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      ...defaultState,

      updateSettings: (settings) =>
        set((state) => ({ ...state, ...settings })),

      setSelectedVoice: (voice) =>
        set(() => ({ selectedVoice: voice })),
    }),
    {
      name: 'morning-routine-settings', // key trong localStorage
    }
  )
);
