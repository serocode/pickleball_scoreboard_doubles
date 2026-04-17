'use client';

import { GameState } from '@/lib/pickleball-state';

interface ScoreDisplayProps {
  gameState: GameState | null;
  servingTeam: 'A' | 'B';
}

export function ScoreDisplay({ gameState, servingTeam }: ScoreDisplayProps) {
  if (!gameState) {
    return <div className="h-32 animate-pulse bg-muted rounded-lg" />;
  }

  const teamA = gameState.teams.A;
  const teamB = gameState.teams.B;

  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-card p-8 shadow-lg">
      {/* Main Score Display */}
      <div className="flex items-center justify-center gap-8 w-full">
        {/* Team A Score */}
        <div
          className={`flex flex-col items-center flex-1 ${
            servingTeam === 'A' ? 'opacity-100' : 'opacity-60'
          } transition-opacity duration-300`}
        >
          <span className="text-sm font-semibold text-muted-foreground">{teamA.name}</span>
          <span className="text-7xl font-bold leading-none" style={{ color: 'hsl(var(--primary))' }}>
            {teamA.score}
          </span>
        </div>

        {/* Divider */}
        <div className="h-20 w-1 bg-border" />

        {/* Team B Score */}
        <div
          className={`flex flex-col items-center flex-1 ${
            servingTeam === 'B' ? 'opacity-100' : 'opacity-60'
          } transition-opacity duration-300`}
        >
          <span className="text-sm font-semibold text-muted-foreground">{teamB.name}</span>
          <span className="text-7xl font-bold leading-none" style={{ color: 'hsl(var(--primary))' }}>
            {teamB.score}
          </span>
        </div>
      </div>

      {/* Server Info */}
      <div className="text-center">
        <div className="text-lg font-semibold text-foreground">
          Server: {gameState.serving.serverNumber} - {servingTeam === 'A' ? teamA.name : teamB.name} Serving
        </div>
      </div>
    </div>
  );
}
