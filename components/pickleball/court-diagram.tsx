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
        className="relative rounded-[32px] p-6 flex flex-col justify-between overflow-hidden text-center"
        style={{ background: 'var(--kc-surface)' }}
      >
        {/* Background */}
        <div className="absolute inset-0 opacity-20 saturate-50 pointer-events-none">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ8WzCHEjlvJ16dFyDwE27F1kdTAXjbXjzqqeht1nA4g2d8OWWnmMggcE5v9EAKiP_G6RF8P_bmx_WITpu418XYg1l5aWgrhKT2D7AF8nL-Jg2UiH-3AoO8GtctoI0mnPX5Izoexwnq6K7itokPJye1zq3mOubti95kbl1HiI-wyGiOTkwdxxpdbiPmDrHUMcGQ85bJGhNReXNtx2wkd7_j0x3AatPZ13iqA-pMOY9wRfS5a2Mo8j3Swh-tt1tav_bkGsEdljm4AQ"
            alt=""
          />
        </div>
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-center gap-3 mb-4">
          <span
            className="material-symbols-outlined text-xl"
            style={{ color: 'var(--kc-accent)' }}
          >
            campaign
          </span>
          <span
            className="font-lexend text-sm md:text-base font-extrabold uppercase tracking-[0.2em]"
            style={{ color: 'var(--kc-text)' }}
          >
            Score Call
          </span>
        </div>

        {/* CENTERED SCORE */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
          <div
            className="text-5xl md:text-6xl font-lexend font-black tracking-tight leading-none"
            style={{ color: 'var(--kc-text)' }}
          >
            {gameState.teams[servingTeam].score}
            <span className="mx-2" style={{ color: 'var(--kc-text-muted)' }}>:</span>
            {gameState.teams[servingTeam === 'A' ? 'B' : 'A'].score}
            <span className="mx-2" style={{ color: 'var(--kc-text-muted)' }}>•</span>
            {gameState.serving.serverNumber}
          </div>

          {/* Improved label */}
          <div
            className="mt-3 text-[10px] font-inter uppercase tracking-wider flex gap-3"
            style={{ color: 'var(--kc-text-dim)' }}
          >
            <span>Serving</span>
            <span>Receiving</span>
            <span>Server</span>
          </div>
        </div>

        {/* First serve indicator */}
        {gameState.serving.isFirstServe && (
          <div
            className="relative z-10 mt-4 px-3 py-2 rounded-xl text-center"
            style={{ background: 'var(--kc-surface-highest)' }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: 'var(--kc-text-dim)' }}
            >
              ⚡ First Serve
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
