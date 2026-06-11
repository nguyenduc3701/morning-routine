import { create } from 'zustand';

export type SyncStatus = 'idle' | 'syncing' | 'completed';

interface SyncState {
  status: SyncStatus;
  progress: number;
}

interface SyncActions {
  startSync: () => void;
  resetSync: () => void;
  setProgress: (progress: number) => void;
  completeSync: () => void;
}

export const useSyncStore = create<SyncState & SyncActions>((set) => ({
  status: 'idle',
  progress: 0,

  startSync: () => {
    set({ status: 'syncing', progress: 0 });
  },

  resetSync: () => {
    set({ status: 'idle', progress: 0 });
  },

  setProgress: (progress) => {
    set({ progress: Math.min(100, Math.max(0, progress)) });
  },

  completeSync: () => {
    set({ status: 'completed', progress: 100 });
  },
}));
