'use client';

// Server indicator is now integrated directly into ScoreDisplay component.
// This file is kept for backward compatibility but the visual is rendered inline.

interface ServerIndicatorProps {
  serverNumber: 1 | 2;
  servingTeam: 'A' | 'B';
  isFirstServe: boolean;
  serverPosition: 'right' | 'left';
}

export function ServerIndicator({
  serverNumber,
  servingTeam,
  isFirstServe,
  serverPosition,
}: ServerIndicatorProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div
        className="px-4 py-2 rounded-full font-lexend text-sm font-bold uppercase tracking-widest"
        style={{ background: 'var(--kc-accent)', color: 'var(--kc-on-accent)' }}
      >
        Server {serverNumber}
      </div>

      <div
        className="px-4 py-2 rounded-full font-inter text-sm"
        style={{ background: 'var(--kc-surface-highest)', color: 'var(--kc-text)' }}
      >
        {servingTeam === 'A' ? 'Team A' : 'Team B'} — {serverPosition === 'right' ? 'Right' : 'Left'} Side
      </div>

      {isFirstServe && (
        <div
          className="px-4 py-2 rounded-full font-inter text-sm"
          style={{ background: 'var(--kc-surface-high)', color: 'var(--kc-text-dim)' }}
        >
          ⚡ First Serve Only
        </div>
      )}
    </div>
  );
}
