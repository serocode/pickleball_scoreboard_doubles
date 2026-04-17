'use client';

import { GameState, MATCH_MODES, safeMatchMode } from '@/lib/pickleball-state';

interface ScoreDisplayProps {
  gameState: GameState | null;
  servingTeam: 'A' | 'B';
  lastAction: 'point' | 'fault' | null;
}

function padScore(score: number): string {
  return score.toString().padStart(2, '0');
}

export function ScoreDisplay({ gameState, servingTeam, lastAction }: ScoreDisplayProps) {
  if (!gameState) {
    return (
      <div
        className="h-64 rounded-[32px] animate-pulse"
        style={{ background: 'var(--kc-surface)' }}
      />
    );
  }

  const teamA = gameState.teams.A;
  const teamB = gameState.teams.B;
  const isTeamAServing = servingTeam === 'A';
  const isTeamBServing = servingTeam === 'B';
  // Normalize matchMode once so all MATCH_MODES lookups below are safe
  const matchMode = safeMatchMode(gameState.matchMode);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-stretch">
      {/* ===== TEAM A CARD ===== */}
      <div
        className="rounded-[32px] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden"
        style={{ background: 'var(--kc-surface)' }}
      >
        {/* Accent bar for serving team */}
        {isTeamAServing && (
          <div
            className="absolute top-0 left-0 w-1 h-full"
            style={{ background: 'rgba(209, 255, 0, 0.2)' }}
          />
        )}

        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-1">
            <span
              className="font-lexend text-[10px] uppercase tracking-widest font-semibold"
              style={{ color: isTeamAServing ? 'var(--kc-accent)' : 'var(--kc-text-dim)' }}
            >
              {teamA.name.toUpperCase()}
            </span>
            <h2
              className="font-lexend font-bold text-lg md:text-2xl leading-tight"
              style={{ color: 'var(--kc-text)' }}
            >
              {teamA.players[0].name.toUpperCase()}
              <br />
              <span style={{ color: 'var(--kc-text-dim)' }}>&amp;</span>{' '}
              {teamA.players[1].name.toUpperCase()}
            </h2>
            {matchMode !== 'casual' && (
              <div className="flex items-center gap-1.5 mt-2">
                {Array.from({ length: MATCH_MODES[matchMode].gamesToWin }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full transition-colors"
                    style={{ background: i < (gameState.gamesWon?.A ?? 0) ? 'var(--kc-accent)' : 'var(--kc-surface-highest)' }}
                  />
                ))}
                <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--kc-text-dim)', marginLeft: '4px' }}>
                  GAMES WON
                </span>
              </div>
            )}
          </div>

          {/* Serving Indicator */}
          {isTeamAServing && (
            <div className="flex flex-col items-end gap-2">
              <div
                className="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse-glow"
                style={{
                  background: 'var(--kc-accent)',
                  color: 'var(--kc-on-accent)',
                }}
              >
                SERVING
              </div>
              <div className="flex gap-1">
                <div
                  className="w-8 h-2 rounded-full transition-colors duration-300"
                  style={{
                    background: gameState.serving.serverNumber === 1 ? 'var(--kc-accent)' : 'var(--kc-surface-highest)',
                  }}
                />
                <div
                  className="w-8 h-2 rounded-full transition-colors duration-300"
                  style={{
                    background: gameState.serving.serverNumber === 2 ? 'var(--kc-accent)' : 'var(--kc-surface-highest)',
                  }}
                />
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-tighter"
                style={{ color: 'var(--kc-text-dim)' }}
              >
                SERVER {gameState.serving.serverNumber}
              </span>
            </div>
          )}
        </div>

        {/* Score — THE focal point */}
        <div className="flex items-baseline justify-center py-4 md:py-8">
          <span
            className={`font-lexend font-black text-[8rem] md:text-[12rem] lg:text-[14rem] leading-none tracking-tighter transition-all duration-300 ${lastAction === 'point' && isTeamAServing ? 'animate-score-pop' : ''
              }`}
            style={{
              color: isTeamAServing ? 'var(--kc-text)' : 'var(--kc-text-dim)',
              opacity: isTeamAServing ? 1 : 0.4,
            }}
          >
            {padScore(teamA.score)}
          </span>
        </div>
      </div>

      {/* ===== TEAM B CARD ===== */}
      <div
        className="rounded-[32px] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden"
        style={{ background: 'var(--kc-surface)' }}
      >
        {/* Accent bar for serving team */}
        {isTeamBServing && (
          <div
            className="absolute top-0 left-0 w-1 h-full"
            style={{ background: 'rgba(209, 255, 0, 0.2)' }}
          />
        )}

        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-1">
            <span
              className="font-lexend text-[10px] uppercase tracking-widest font-semibold"
              style={{ color: isTeamBServing ? 'var(--kc-accent)' : 'var(--kc-text-dim)' }}
            >
              {teamB.name.toUpperCase()}
            </span>
            <h2
              className="font-lexend font-bold text-lg md:text-2xl leading-tight"
              style={{ color: 'var(--kc-text)' }}
            >
              {teamB.players[0].name.toUpperCase()}
              <br />
              <span style={{ color: 'var(--kc-text-dim)' }}>&amp;</span>{' '}
              {teamB.players[1].name.toUpperCase()}
            </h2>
            {matchMode !== 'casual' && (
              <div className="flex items-center gap-1.5 mt-2">
                {Array.from({ length: MATCH_MODES[matchMode].gamesToWin }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full transition-colors"
                    style={{ background: i < (gameState.gamesWon?.B ?? 0) ? 'var(--kc-accent)' : 'var(--kc-surface-highest)' }}
                  />
                ))}
                <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--kc-text-dim)', marginLeft: '4px' }}>
                  GAMES WON
                </span>
              </div>
            )}
          </div>

          {/* Serving Indicator */}
          {isTeamBServing && (
            <div className="flex flex-col items-end gap-2">
              <div
                className="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse-glow"
                style={{
                  background: 'var(--kc-accent)',
                  color: 'var(--kc-on-accent)',
                }}
              >
                SERVING
              </div>
              <div className="flex gap-1">
                <div
                  className="w-8 h-2 rounded-full transition-colors duration-300"
                  style={{
                    background: gameState.serving.serverNumber === 1 ? 'var(--kc-accent)' : 'var(--kc-surface-highest)',
                  }}
                />
                <div
                  className="w-8 h-2 rounded-full transition-colors duration-300"
                  style={{
                    background: gameState.serving.serverNumber === 2 ? 'var(--kc-accent)' : 'var(--kc-surface-highest)',
                  }}
                />
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-tighter"
                style={{ color: 'var(--kc-text-dim)' }}
              >
                SERVER {gameState.serving.serverNumber}
              </span>
            </div>
          )}
        </div>

        {/* Score — THE focal point */}
        <div className="flex items-baseline justify-center py-4 md:py-8">
          <span
            className={`font-lexend font-black text-[8rem] md:text-[12rem] lg:text-[14rem] leading-none tracking-tighter transition-all duration-300 ${lastAction === 'point' && isTeamBServing ? 'animate-score-pop' : ''
              }`}
            style={{
              color: isTeamBServing ? 'var(--kc-text)' : 'var(--kc-text-dim)',
              opacity: isTeamBServing ? 1 : 0.4,
            }}
          >
            {padScore(teamB.score)}
          </span>
        </div>
      </div>
    </section>
  );
}