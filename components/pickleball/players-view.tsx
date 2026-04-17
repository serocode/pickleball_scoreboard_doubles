'use client';

import { GameState } from '@/lib/pickleball-state';

interface PlayersViewProps {
  gameState: GameState;
  matchWon: { isWon: boolean; winner: 'A' | 'B' | null };
  onEditPlayers: () => void;
}

const DEFAULT_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
  

  <!-- Player silhouette (BOTTOM ANCHORED) -->
  <g fill="white">
    <!-- head -->
    <circle cx="100" cy="90" r="28" />

    <!-- torso -->
    <path d="
      M60 140
      Q100 110 140 140
      L160 260
      L40 260
      Z
    " />
  </g>

  <!-- subtle shadow for depth -->
  <ellipse cx="100" cy="270" rx="50" ry="10" fill="black" opacity="0.2"/>
</svg>
`);

function PlayerCutout({ src, alt, size }: { src: string; alt: string; size: 'lg' | 'sm' }) {
  return (
    <img
      src={src}
      alt={alt}
      onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR; }}
      className={`object-contain object-bottom drop-shadow-[0_20px_50px_rgba(209,255,0,0.15)] ${size === 'lg'
        ? 'h-[50vh] md:h-[75vh]'
        : 'h-[45vh] md:h-[70vh] opacity-85'
        }`}
    />
  );
}

export function PlayersView({ gameState, matchWon, onEditPlayers }: PlayersViewProps) {
  const { teams } = gameState;
  const teamA = teams.A;
  const teamB = teams.B;

  const aIsWinner = matchWon.isWon && matchWon.winner === 'A';
  const aIsLoser = matchWon.isWon && matchWon.winner !== 'A';
  const bIsWinner = matchWon.isWon && matchWon.winner === 'B';
  const bIsLoser = matchWon.isWon && matchWon.winner !== 'B';

  const getRoleLabel = (isWinner: boolean, isLoser: boolean, teamKey: 'A' | 'B') => {
    if (isWinner) return '🏆 WINNERS';
    if (isLoser) return 'RUNNERS UP';
    return `TEAM ${teamKey}`;
  };

  const getTeamColor = (isWinner: boolean, isLoser: boolean) =>
    isLoser ? 'var(--kc-text-dim)' : isWinner ? 'var(--kc-accent)' : 'var(--kc-accent)';

  const getScoreColor = (isWinner: boolean) =>
    isWinner || !matchWon.isWon ? 'var(--kc-accent)' : 'var(--kc-text-dim)';

  // Wire this to real momentum data if available (e.g. gameState.recentPoints)
  const recentPoints: Array<'A' | 'B'> = (gameState as any).recentPoints ?? [];

  return (
    <div className="relative w-full h-[calc(100vh-80px)] flex overflow-hidden">

      {/* ── LEFT SIDE (Team A) ── */}
      <section
        role="region"
        aria-label="Team A"
        className={`relative flex-1 bg-kc-surface-low border-r border-kc-accent/10 overflow-hidden transition-all duration-700 ${aIsLoser ? 'grayscale' : ''}`}
      >
        {/* Winner glow ring */}
        {aIsWinner && (
          <div className="absolute inset-0 z-0 animate-pulse pointer-events-none"
            style={{ boxShadow: 'inset 0 0 120px rgba(209,255,0,0.12)' }} />
        )}

        {/* Player cutouts */}
        <div className="absolute inset-0 z-0 flex items-end justify-center px-4">
          <div className="flex items-end -space-x-12 mb-20 md:mb-32">
            <PlayerCutout src={teamA.players[0].photo || DEFAULT_AVATAR} alt={teamA.players[0].name} size="lg" />
            <PlayerCutout src={teamA.players[1].photo || DEFAULT_AVATAR} alt={teamA.players[1].name} size="sm" />
          </div>
        </div>

        {/* Vignette overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-kc-bg via-kc-bg/40 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent to-kc-bg/30" />

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col justify-end p-6 md:p-12 pb-24 md:pb-32">
          <span
            className="mb-2 self-start font-lexend font-black italic uppercase tracking-tighter text-xs px-4 py-1 rounded-full"
            style={{
              background: aIsWinner ? 'var(--kc-accent)' : 'var(--kc-surface-variant)',
              color: aIsWinner ? '#000' : 'var(--kc-text-dim)',
            }}
          >
            {getRoleLabel(aIsWinner, aIsLoser, 'A')}
          </span>
          <h2
            className="font-lexend text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.85] break-words"
            style={{ color: getTeamColor(aIsWinner, aIsLoser) }}
          >
            {teamA.players[0].name.toUpperCase()} &<br />
            {teamA.players[1].name.toUpperCase()}
          </h2>
          <p className="font-lexend font-bold text-kc-text-dim uppercase tracking-widest mt-4 ml-1 text-sm">
            {teamA.name}
          </p>
        </div>
      </section>

      {/* ── CENTER SCORE ── */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-3">

          {/* Mode tag */}
          <div className="bg-kc-surface-highest/80 backdrop-blur-md px-6 py-2 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/5">
            <span className="font-lexend font-bold text-xs uppercase tracking-widest text-kc-text-dim">
              {gameState.matchMode} MODE {matchWon.isWon ? '· FINAL' : ''}
            </span>
          </div>

          {/* Score capsule */}
          <div className="bg-kc-surface-highest/90 border-l-4 border-kc-accent p-1 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center gap-4 md:gap-8 px-6 md:px-10 py-4 md:py-6 -skew-x-[4deg] backdrop-blur-xl">
            <div className="skew-x-[4deg] flex flex-col items-center">
              <span
                className="font-lexend text-5xl md:text-7xl font-black italic leading-none"
                style={{ color: getScoreColor(aIsWinner) }}
              >
                {teamA.score.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="skew-x-[4deg] opacity-30">
              <div className="w-[2px] h-8 md:h-12 bg-kc-text-dim rounded-full" />
            </div>
            <div className="skew-x-[4deg] flex flex-col items-center">
              <span
                className="font-lexend text-5xl md:text-7xl font-black italic leading-none"
                style={{ color: bIsWinner ? 'var(--kc-accent)' : getScoreColor(false) }}
              >
                {teamB.score.toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Games won (non-casual) */}
          {gameState.matchMode !== 'casual' && (
            <div className="flex flex-col items-center rounded-lg bg-kc-surface-high/80 px-4 py-2 border border-kc-surface-highest shadow-xl">
              <span className="font-lexend text-[9px] uppercase tracking-[0.2em] text-kc-text-dim font-bold mb-1">GAMES WON</span>
              <div className="flex gap-4 items-center">
                <span className="font-lexend text-xl font-bold" style={{ color: aIsWinner ? 'var(--kc-accent)' : 'var(--kc-text)' }}>
                  {gameState.gamesWon?.A ?? 0}
                </span>
                <span className="font-lexend text-xs text-kc-text-dim">–</span>
                <span className="font-lexend text-xl font-bold" style={{ color: bIsWinner ? 'var(--kc-accent)' : 'var(--kc-text)' }}>
                  {gameState.gamesWon?.B ?? 0}
                </span>
              </div>
            </div>
          )}

          {/* Serving indicator */}
          {!matchWon.isWon && (gameState as any).servingTeam && (
            <div className="bg-kc-surface-highest/70 backdrop-blur-sm px-4 py-1.5 rounded-full border border-kc-accent/20">
              <span className="font-lexend text-[10px] uppercase tracking-widest text-kc-accent font-bold">
                ● {(gameState as any).servingTeam === 'A' ? teamA.name : teamB.name} SERVING
              </span>
            </div>
          )}

          {/* Momentum dots (last 5 points) */}
          {recentPoints.length > 0 && (
            <div className="flex gap-1.5 items-center mt-1">
              {recentPoints.slice(-5).map((team, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{ background: team === 'A' ? 'var(--kc-accent)' : 'var(--kc-text-dim)' }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT SIDE (Team B) ── */}
      <section
        role="region"
        aria-label="Team B"
        className={`relative flex-1 bg-kc-surface-low overflow-hidden transition-all duration-700 ${bIsLoser ? 'grayscale' : ''}`}
      >
        {/* Winner glow ring */}
        {bIsWinner && (
          <div className="absolute inset-0 z-0 animate-pulse pointer-events-none"
            style={{ boxShadow: 'inset 0 0 120px rgba(209,255,0,0.12)' }} />
        )}

        {/* Player cutouts */}
        <div className="absolute inset-0 z-0 flex items-end justify-center px-4">
          <div className="flex items-end -space-x-12 mb-20 md:mb-32">
            <PlayerCutout src={teamB.players[0].photo || DEFAULT_AVATAR} alt={teamB.players[0].name} size="sm" />
            <PlayerCutout src={teamB.players[1].photo || DEFAULT_AVATAR} alt={teamB.players[1].name} size="lg" />
          </div>
        </div>

        {/* Vignette overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-kc-bg via-kc-bg/40 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-l from-transparent to-kc-bg/30" />

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col justify-end items-end text-right p-6 md:p-12 pb-24 md:pb-32">
          <span
            className="mb-2 font-lexend font-black italic uppercase tracking-tighter text-xs px-4 py-1 rounded-full"
            style={{
              background: bIsWinner ? 'var(--kc-accent)' : 'var(--kc-surface-variant)',
              color: bIsWinner ? '#000' : 'var(--kc-text-dim)',
            }}
          >
            {getRoleLabel(bIsWinner, bIsLoser, 'B')}
          </span>
          <h2
            className="font-lexend text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.85] break-words"
            style={{ color: getTeamColor(bIsWinner, bIsLoser) }}
          >
            {teamB.players[0].name.toUpperCase()} &<br />
            {teamB.players[1].name.toUpperCase()}
          </h2>
          <p className="font-lexend font-bold text-kc-text-dim uppercase tracking-widest mt-4 mr-1 text-sm">
            {teamB.name}
          </p>
        </div>
      </section>

      {/* ── MANAGE PLAYERS BUTTON ── */}
      <button
        onClick={onEditPlayers}
        aria-label="Manage Players"
        className="absolute top-6 md:top-10 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-kc-surface-highest hover:bg-kc-surface-high border border-white/5 shadow-2xl transition-all hover:scale-105 active:scale-95 group pointer-events-auto"
      >
        <span className="material-symbols-outlined text-[16px] text-kc-text-dim group-hover:text-kc-accent transition-colors">edit</span>
        <span className="font-lexend text-xs font-bold tracking-widest uppercase text-kc-text-dim group-hover:text-kc-text transition-colors">
          MANAGE PLAYERS
        </span>
      </button>
    </div>
  );
}