import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useAudioPlaylistStore } from '@/store/audioPlaylistStore';

export function AudioPlayer() {
  const { playlist, currentIndex, isPlaying, play, pause } = useAudioPlaylistStore();

  const hasPlaylist = playlist.length > 0;
  const progressPercent = hasPlaylist ? ((currentIndex + (isPlaying ? 0.5 : 0)) / playlist.length) * 100 : 0;
  // Chu vi hình tròn r=30 là 2 * PI * 30 = 188.4
  const strokeDashoffset = 188.4 - (188.4 * progressPercent) / 100;

  const handleTogglePlay = () => {
    if (!hasPlaylist) return;
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <div className={`relative w-16 h-16 flex-shrink-0 ${!hasPlaylist ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <svg className="w-full h-full -rotate-90">
        <circle cx="32" cy="32" fill="none" r="30" stroke="rgba(255,255,255,0.1)" strokeWidth="2"></circle>
        {hasPlaylist && (
          <circle 
            className="text-tertiary transition-all duration-500 ease-in-out" 
            cx="32" 
            cy="32" 
            fill="none" 
            r="30" 
            stroke="currentColor" 
            strokeDasharray="188.4" 
            strokeDashoffset={strokeDashoffset} 
            strokeWidth="2"
          ></circle>
        )}
      </svg>
      <button 
        onClick={handleTogglePlay}
        disabled={!hasPlaylist}
        className="absolute inset-0 flex items-center justify-center text-on-surface hover:text-white transition-colors disabled:cursor-not-allowed"
      >
        {isPlaying ? (
          <Pause size={24} fill="currentColor" className="text-tertiary animate-pulse" />
        ) : (
          <Play size={28} fill="currentColor" strokeWidth={0} />
        )}
      </button>
    </div>
  );
}
