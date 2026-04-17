'use client';

import { GameState } from '@/lib/pickleball-state';
import { Users } from 'lucide-react';

interface CourtDiagramProps {
  gameState: GameState | null;
  servingTeam: 'A' | 'B';
  serverPosition: 'right' | 'left';
}

export function CourtDiagram({ gameState, servingTeam, serverPosition }: CourtDiagramProps) {
  if (!gameState) {
    return <div className="h-64 animate-pulse bg-muted rounded-lg" />;
  }

  const teamA = gameState.teams.A;
  const teamB = gameState.teams.B;

  const isServerRight = serverPosition === 'right';
  const serverPlayerName =
    gameState.serving.serverNumber === 1
      ? isServerRight
        ? servingTeam === 'A'
          ? teamA.players[1]
          : teamB.players[1]
        : servingTeam === 'A'
          ? teamA.players[0]
          : teamB.players[0]
      : isServerRight
        ? servingTeam === 'A'
          ? teamA.players[1]
          : teamB.players[1]
        : servingTeam === 'A'
          ? teamA.players[0]
          : teamB.players[0];

  return (
    <div className="rounded-xl bg-card p-8 shadow-lg">
      {/* Court Title */}
      <h2 className="text-center text-xl font-bold mb-8 text-foreground">Court Positions</h2>

      {/* Court Visual */}
      <div className="space-y-8">
        {/* Team A (Top) */}
        <div className="rounded-lg border-2 border-primary/30 bg-gradient-to-b from-primary/10 to-transparent p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-foreground">Team A</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Team A Left */}
            <div
              className={`rounded-lg border-2 p-4 text-center transition-all ${
                servingTeam === 'A' && !isServerRight
                  ? 'border-primary bg-primary/20 shadow-lg'
                  : 'border-muted-foreground/30 bg-muted/50'
              }`}
            >
              <Users className="mx-auto mb-2 h-8 w-8" />
              <div className="text-sm font-medium line-clamp-1">{teamA.players[0].name}</div>
              <div className="text-xs text-muted-foreground mt-1">Left</div>
              {servingTeam === 'A' && !isServerRight && (
                <div className="mt-2 inline-block rounded bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
                  Server
                </div>
              )}
            </div>

            {/* Team A Right */}
            <div
              className={`rounded-lg border-2 p-4 text-center transition-all ${
                servingTeam === 'A' && isServerRight
                  ? 'border-primary bg-primary/20 shadow-lg'
                  : 'border-muted-foreground/30 bg-muted/50'
              }`}
            >
              <Users className="mx-auto mb-2 h-8 w-8" />
              <div className="text-sm font-medium line-clamp-1">{teamA.players[1].name}</div>
              <div className="text-xs text-muted-foreground mt-1">Right</div>
              {servingTeam === 'A' && isServerRight && (
                <div className="mt-2 inline-block rounded bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
                  Server
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-0.5 bg-border" />
          <span className="text-sm font-semibold text-muted-foreground">NET</span>
          <div className="flex-1 h-0.5 bg-border" />
        </div>

        {/* Team B (Bottom) */}
        <div className="rounded-lg border-2 border-secondary/30 bg-gradient-to-b from-secondary/10 to-transparent p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-foreground">Team B</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Team B Left */}
            <div
              className={`rounded-lg border-2 p-4 text-center transition-all ${
                servingTeam === 'B' && !isServerRight
                  ? 'border-secondary bg-secondary/20 shadow-lg'
                  : 'border-muted-foreground/30 bg-muted/50'
              }`}
            >
              <Users className="mx-auto mb-2 h-8 w-8" />
              <div className="text-sm font-medium line-clamp-1">{teamB.players[0].name}</div>
              <div className="text-xs text-muted-foreground mt-1">Left</div>
              {servingTeam === 'B' && !isServerRight && (
                <div className="mt-2 inline-block rounded bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground">
                  Server
                </div>
              )}
            </div>

            {/* Team B Right */}
            <div
              className={`rounded-lg border-2 p-4 text-center transition-all ${
                servingTeam === 'B' && isServerRight
                  ? 'border-secondary bg-secondary/20 shadow-lg'
                  : 'border-muted-foreground/30 bg-muted/50'
              }`}
            >
              <Users className="mx-auto mb-2 h-8 w-8" />
              <div className="text-sm font-medium line-clamp-1">{teamB.players[1].name}</div>
              <div className="text-xs text-muted-foreground mt-1">Right</div>
              {servingTeam === 'B' && isServerRight && (
                <div className="mt-2 inline-block rounded bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground">
                  Server
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
