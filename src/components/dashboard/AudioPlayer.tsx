import React from 'react';

export function AudioPlayer() {
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-full h-full -rotate-90">
        <circle cx="32" cy="32" fill="none" r="30" stroke="rgba(255,255,255,0.1)" strokeWidth="2"></circle>
        <circle className="text-tertiary transition-all duration-300" cx="32" cy="32" fill="none" r="30" stroke="currentColor" strokeDasharray="188.4" strokeDashoffset="120" strokeWidth="2"></circle>
      </svg>
      <button className="absolute inset-0 flex items-center justify-center text-on-surface hover:text-white transition-colors">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
      </button>
    </div>
  );
}
