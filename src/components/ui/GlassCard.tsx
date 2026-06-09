import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassCard({ children, className = '', glow = false, ...props }: GlassCardProps) {
  return (
    <div
      className={`glass-card ${glow ? 'glow-subtle' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
