import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSettingsStore } from './settingsStore';

export interface PlaylistItem {
  id: string;
  name: string;
  text: string;
  lang?: string; // Mã ngôn ngữ phát âm (ví dụ: 'vi-VN', 'en-US', 'ja-JP',...)
}

interface AudioPlaylistState {
  playlist: PlaylistItem[];
  currentIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  rate: number; // Tốc độ đọc (0.5x, 1x, 1.5x, 2x,...)
}

interface AudioPlaylistActions {
  setPlaylist: (playlist: PlaylistItem[]) => void;
  setCurrentIndex: (index: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  back: () => void;
  setRate: (rate: number) => void;
}

export const useAudioPlaylistStore = create<AudioPlaylistState & AudioPlaylistActions>()(
  persist(
    (set, get) => ({
  playlist: [],
  currentIndex: 0,
  isPlaying: false,
  isPaused: false,
  rate: 1.0, // Mặc định là 1.0x

  setPlaylist: (playlist) => {
    set({ playlist, currentIndex: 0, isPlaying: false, isPaused: false });
  },

  setCurrentIndex: (index) => {
    const { playlist } = get();
    if (index >= 0 && index < playlist.length) {
      set({ currentIndex: index });
      if (get().isPlaying) {
        get().play();
      }
    }
  },

  setRate: (rate) => {
    set({ rate });
    const state = get();
    // Nếu đang tạm dừng mà đổi tốc độ, ta huỷ utterance cũ đang lưu.
    // Việc này giúp lần nhấn Play kế tiếp sẽ tạo utterance mới với tốc độ mới (đọc lại từ đầu phần hiện tại).
    if (state.isPaused) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      set({ isPaused: false, isPlaying: false });
    }
  },

  play: () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    const { playlist, currentIndex, isPaused, rate } = get();
    if (playlist.length === 0) return;

    // Nếu đang tạm dừng thì chỉ cần nói tiếp
    if (isPaused) {
      window.speechSynthesis.resume();
      set({ isPlaying: true, isPaused: false });
      return;
    }

    // Dừng tất cả âm thanh trước đó
    window.speechSynthesis.cancel();

    const currentItem = playlist[currentIndex];
    const utterance = new SpeechSynthesisUtterance(currentItem.text);

    // Gán tốc độ đọc
    utterance.rate = rate;

    // Cấu hình ngôn ngữ đọc tự động dựa trên cài đặt giọng đọc
    const selectedVoice = useSettingsStore.getState().selectedVoice;
    if (selectedVoice) {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((v) => v.voiceURI === selectedVoice.voiceURI);
      if (voice) {
        utterance.voice = voice;
      }
    } else if (currentItem.lang) {
      // Nếu không cấu hình giọng đọc thủ công, tự động lấy accent tương ứng với ngôn ngữ của nội dung
      utterance.lang = currentItem.lang;
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => {
      const state = get();
      if (state.currentIndex < state.playlist.length - 1) {
        state.next();
      } else {
        set({ isPlaying: false, isPaused: false, currentIndex: 0 });
      }
    };

    utterance.onerror = (e) => {
      // Bỏ qua lỗi ngắt giữa chừng (do user bấm Stop/Next/Back)
      if (e.error !== 'interrupted') {
        console.error('Speech synthesis error:', e);
        set({ isPlaying: false, isPaused: false });
      }
    };

    window.speechSynthesis.speak(utterance);
    set({ isPlaying: true, isPaused: false });
  },

  pause: () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.pause();
    set({ isPlaying: false, isPaused: true });
  },

  stop: () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    set({ isPlaying: false, isPaused: false, currentIndex: 0 });
  },

  next: () => {
    const { playlist, currentIndex } = get();
    if (currentIndex < playlist.length - 1) {
      set({ currentIndex: currentIndex + 1, isPaused: false });
      get().play();
    } else {
      get().stop();
    }
  },

  back: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1, isPaused: false });
      get().play();
    } else {
      // Nếu ở phần đầu tiên thì đọc lại từ đầu đoạn đó
      get().play();
    }
  }
    }),
    {
      name: 'audio-playlist-storage',
      partialize: (state) => ({ rate: state.rate }),
    }
  )
);
