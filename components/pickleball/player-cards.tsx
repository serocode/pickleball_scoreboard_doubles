'use client';

import { Player } from '@/lib/pickleball-state';

interface PlayerCardsProps {
  teamName: string;
  players: [Player, Player];
  isServing: boolean;
  serverNumber?: 1 | 2;
  teamLabel: string;
  accentColor: string;
}

const DEFAULT_AVATAR = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%231f2631"/%3E%3Ccircle cx="50" cy="35" r="15" fill="%23434851"/%3E%3Cellipse cx="50" cy="75" rx="25" ry="20" fill="%23434851"/%3E%3C/svg%3E';

export function PlayerCards({
  teamName,
  players,
  isServing,
  serverNumber,
  teamLabel,
  accentColor,
}: PlayerCardsProps) {
  const positions = ['Left', 'Right'];

  return (
    <div
      className="rounded-[32px] p-6 md:p-8 animate-slide-in-up"
      style={{ background: 'var(--kc-surface)' }}
    >
      {/* Team Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <span
            className="font-lexend text-[10px] uppercase tracking-widest font-semibold"
            style={{ color: accentColor }}
          >
            {teamLabel}
          </span>
          <h3
            className="font-lexend font-bold text-xl"
            style={{ color: 'var(--kc-text)' }}
          >
            {teamName}
          </h3>
        </div>
        {isServing && (
          <div
            className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
            style={{ background: 'var(--kc-accent)', color: 'var(--kc-on-accent)' }}
          >
            SERVING
          </div>
        )}
      </div>

      {/* Player Cards */}
      <div className="grid grid-cols-2 gap-4">
        {players.map((player, index) => {
          const isServer = isServing && serverNumber === ((index + 1) as 1 | 2);

          return (
            <div
              key={index}
              className={`rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 ${
                isServer ? 'animate-glow-ring' : ''
              }`}
              style={{
                background: isServer ? 'var(--kc-surface-high)' : 'var(--kc-surface-mid)',
              }}
            >
              {/* Avatar */}
              <div className="relative mb-3">
                <img
                  src={player.photo || DEFAULT_AVATAR}
                  alt={player.name}
                  className="w-20 h-20 rounded-full object-cover"
                  style={{
                    border: isServer ? '2px solid var(--kc-accent)' : '2px solid var(--kc-surface-highest)',
                  }}
                />
                {isServer && (
                  <div
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: 'var(--kc-accent)', color: 'var(--kc-on-accent)' }}
                  >
                    S{serverNumber}
                  </div>
                )}
              </div>

              {/* Name */}
              <p
                className="text-sm font-inter font-semibold truncate w-full mb-1"
                style={{ color: 'var(--kc-text)' }}
              >
                {player.name}
              </p>

              {/* Position */}
              <span
                className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                style={{
                  background: 'var(--kc-surface-highest)',
                  color: 'var(--kc-text-muted)',
                }}
              >
                {positions[index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
