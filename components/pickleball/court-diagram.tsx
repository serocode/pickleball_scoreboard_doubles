'use client';

import { GameState } from '@/lib/pickleball-state';

interface CourtDiagramProps {
  gameState: GameState | null;
  servingTeam: 'A' | 'B';
  serverPosition: 'right' | 'left';
}

export function CourtDiagram({ gameState, servingTeam, serverPosition }: CourtDiagramProps) {
  if (!gameState) {
    return (
      <div
        className="h-48 rounded-[32px] animate-pulse"
        style={{ background: 'var(--kc-surface)' }}
      />
    );
  }

  const teamA = gameState.teams.A;
  const teamB = gameState.teams.B;
  const servingTeamData = servingTeam === 'A' ? teamA : teamB;
  const receivingTeamData = servingTeam === 'A' ? teamB : teamA;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* ===== Court Position Card ===== */}
      <div
        className="md:col-span-2 rounded-[32px] p-6 relative overflow-hidden"
        style={{ background: 'var(--kc-surface)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-sm" style={{ color: 'var(--kc-accent)' }}>
            sports_tennis
          </span>
          <span
            className="font-inter text-[10px] font-bold uppercase tracking-widest"
            style={{ color: 'var(--kc-text-dim)' }}
          >
            COURT POSITIONS
          </span>
        </div>

        {/* Mini Court Visualization */}
        <div className="flex flex-col gap-3">
          {/* Serving Team Side */}
          <div
            className="rounded-2xl p-4 flex items-center justify-between"
            style={{ background: 'var(--kc-surface-mid)' }}
          >
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                {serverPosition === 'left' && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'var(--kc-accent)' }}
                  />
                )}
                <span
                  className="text-sm font-inter font-medium truncate"
                  style={{ color: 'var(--kc-text)' }}
                >
                  {servingTeamData.players[0].name}
                </span>
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: 'var(--kc-text-muted)' }}
              >
                LEFT
              </span>
            </div>

            <div
              className="w-px h-10 mx-4"
              style={{ background: 'var(--kc-surface-bright)' }}
            />

            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                {serverPosition === 'right' && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'var(--kc-accent)' }}
                  />
                )}
                <span
                  className="text-sm font-inter font-medium truncate"
                  style={{ color: 'var(--kc-text)' }}
                >
                  {servingTeamData.players[1].name}
                </span>
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: 'var(--kc-text-muted)' }}
              >
                RIGHT
              </span>
            </div>
          </div>

          {/* Net indicator */}
          <div className="flex items-center gap-3 px-2">
            <div className="flex-1 h-px" style={{ background: 'var(--kc-surface-bright)' }} />
            <span
              className="text-[10px] font-lexend font-bold uppercase tracking-widest"
              style={{ color: 'var(--kc-text-muted)' }}
            >
              NET
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--kc-surface-bright)' }} />
          </div>

          {/* Receiving Team Side */}
          <div
            className="rounded-2xl p-4 flex items-center justify-between"
            style={{ background: 'var(--kc-surface-mid)' }}
          >
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span
                  className="text-sm font-inter font-medium truncate"
                  style={{ color: 'var(--kc-text-dim)' }}
                >
                  {receivingTeamData.players[0].name}
                </span>
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: 'var(--kc-text-muted)' }}
              >
                LEFT
              </span>
            </div>

            <div
              className="w-px h-10 mx-4"
              style={{ background: 'var(--kc-surface-bright)' }}
            />

            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span
                  className="text-sm font-inter font-medium truncate"
                  style={{ color: 'var(--kc-text-dim)' }}
                >
                  {receivingTeamData.players[1].name}
                </span>
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: 'var(--kc-text-muted)' }}
              >
                RIGHT
              </span>
            </div>
          </div>
        </div>

        {/* Team labels */}
        <div className="mt-4 flex justify-between">
          <span
            className="text-[10px] font-lexend font-bold uppercase tracking-widest"
            style={{ color: 'var(--kc-accent)' }}
          >
            {servingTeamData.name} (Serving)
          </span>
          <span
            className="text-[10px] font-lexend font-bold uppercase tracking-widest"
            style={{ color: 'var(--kc-text-dim)' }}
          >
            {receivingTeamData.name} (Receiving)
          </span>
        </div>
      </div>

      {/* ===== Score Call Card ===== */}
      <div
        className="rounded-[32px] p-6 flex flex-col justify-between"
        style={{ background: 'var(--kc-surface)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-sm" style={{ color: 'var(--kc-accent)' }}>
              campaign
            </span>
            <span
              className="font-inter text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--kc-text-dim)' }}
            >
              SCORE CALL
            </span>
          </div>

          <div className="space-y-3">
            <div
              className="text-4xl font-lexend font-black tracking-tight"
              style={{ color: 'var(--kc-text)' }}
            >
              {gameState.teams[servingTeam].score}
              <span style={{ color: 'var(--kc-text-muted)' }}> — </span>
              {gameState.teams[servingTeam === 'A' ? 'B' : 'A'].score}
              <span style={{ color: 'var(--kc-text-muted)' }}> — </span>
              {gameState.serving.serverNumber}
            </div>
            <p
              className="text-xs font-inter"
              style={{ color: 'var(--kc-text-dim)' }}
            >
              Serving team score — Receiving score — Server #
            </p>
          </div>
        </div>

        {/* First serve indicator */}
        {gameState.serving.isFirstServe && (
          <div
            className="mt-4 px-3 py-2 rounded-xl text-center"
            style={{ background: 'var(--kc-surface-highest)' }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--kc-text-dim)' }}
            >
              ⚡ First serve rule active
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
