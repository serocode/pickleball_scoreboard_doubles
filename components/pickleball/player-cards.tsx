'use client';

import { Player } from '@/lib/pickleball-state';

interface PlayerCardsProps {
  teamName: string;
  players: [Player, Player];
  isServing: boolean;
  serverNumber?: 1 | 2;
}

const DEFAULT_AVATAR = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23e5e7eb"/%3E%3Ccircle cx="50" cy="35" r="15" fill="%239ca3af"/%3E%3Cellipse cx="50" cy="75" rx="25" ry="20" fill="%239ca3af"/%3E%3C/svg%3E';

export function PlayerCards({
  teamName,
  players,
  isServing,
  serverNumber,
}: PlayerCardsProps) {
  const positions = ['Left', 'Right'];

  return (
    <div className={`space-y-4 ${isServing ? 'opacity-100' : 'opacity-60'} transition-opacity duration-300`}>
      <div className="text-center">
        <h3 className="text-lg font-bold text-foreground">{teamName}</h3>
        {isServing && (
          <p className="text-xs text-primary font-semibold">SERVING (Server {serverNumber})</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {players.map((player, index) => (
          <div
            key={index}
            className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
              isServing && serverNumber === (index + 1 as 1 | 2)
                ? 'border-primary bg-primary/5'
                : 'border-border'
            }`}
          >
            <img
              src={player.photo || DEFAULT_AVATAR}
              alt={player.name}
              className="w-16 h-16 rounded-full object-cover mb-2 bg-muted"
            />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground truncate w-full">
                {player.name}
              </p>
              <p className="text-xs text-muted-foreground">{positions[index]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
