'use client';

import { GameState } from '@/lib/pickleball-state';

interface StatsViewProps {
  gameState: GameState;
  scoreCall: {
    servingTeamScore: number;
    receivingTeamScore: number;
    serverNumber: 1 | 2;
    servingTeam: 'A' | 'B';
  } | null;
  momentum: {
    teamAPoints: number;
    teamBPoints: number;
    dominant: 'A' | 'B' | 'even';
    streak: { team: 'A' | 'B' | null; count: number };
  };
  gamePoint: {
    isGamePoint: boolean;
    team: 'A' | 'B' | null;
  };
}

export function StatsView({ gameState, scoreCall, momentum, gamePoint }: StatsViewProps) {
  const teamA = gameState.teams.A;
  const teamB = gameState.teams.B;

  // Calculate stats from events
  const teamAPoints = gameState.events.filter(e => e.type === 'point' && e.team === 'A').length;
  const teamBPoints = gameState.events.filter(e => e.type === 'point' && e.team === 'B').length;
  const teamAFaults = gameState.events.filter(e => (e.type === 'fault' || e.type === 'sideout') && e.team === 'A').length;
  const teamBFaults = gameState.events.filter(e => (e.type === 'fault' || e.type === 'sideout') && e.team === 'B').length;
  const teamASideouts = gameState.events.filter(e => e.type === 'sideout' && e.team === 'A').length;
  const teamBSideouts = gameState.events.filter(e => e.type === 'sideout' && e.team === 'B').length;
  const totalEvents = gameState.events.length;

  // Win probability rough estimate based on score
  const totalScore = teamA.score + teamB.score;
  const winProbA = totalScore > 0 ? Math.round((teamA.score / Math.max(totalScore, 1)) * 100) : 50;
  const winProbB = 100 - winProbA;

  // Momentum last 5 point events
  const last5Points = gameState.events.filter(e => e.type === 'point').slice(-5);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <span
            className="text-[10px] font-lexend uppercase tracking-[0.2em]"
            style={{ color: 'var(--kc-text-dim)' }}
          >
            Live Match Analytics
          </span>
          <h2 className="text-xl font-lexend font-bold">Match Stats</h2>
        </div>
        {scoreCall && (
          <div
            className="px-4 py-2 rounded-full font-lexend font-bold text-lg"
            style={{ background: 'var(--kc-surface-highest)', color: 'var(--kc-text)' }}
          >
            {scoreCall.servingTeamScore}-{scoreCall.receivingTeamScore}-{scoreCall.serverNumber}
          </div>
        )}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ===== Win Probability ===== */}
        <div
          className="rounded-[32px] p-6 flex flex-col justify-between"
          style={{ background: 'var(--kc-surface)' }}
        >
          <div>
            <p
              className="text-[10px] font-lexend uppercase tracking-widest mb-1"
              style={{ color: 'var(--kc-text-dim)' }}
            >
              Win Probability
            </p>
            <h4 className="text-4xl font-lexend font-bold" style={{ color: 'var(--kc-text)' }}>
              {winProbA}
              <span className="text-lg font-normal" style={{ color: 'var(--kc-text-dim)' }}>%</span>
            </h4>
            <p className="text-[10px] mt-1" style={{ color: 'var(--kc-text-muted)' }}>
              {teamA.name}
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1 h-3 rounded-full overflow-hidden" style={{ background: 'var(--kc-surface-highest)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${winProbA}%`,
                background: 'var(--kc-accent-container)',
              }}
            />
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${winProbB}%`,
                background: 'var(--kc-surface-bright)',
              }}
            />
          </div>
        </div>

        {/* ===== Momentum / Flow ===== */}
        <div
          className="md:col-span-2 rounded-[32px] p-6 relative overflow-hidden"
          style={{ background: 'var(--kc-surface)' }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <p
                className="text-[10px] font-lexend uppercase tracking-widest mb-1"
                style={{ color: 'var(--kc-text-dim)' }}
              >
                Momentum
              </p>
              <h4 className="text-xl font-lexend font-bold">
                {momentum.dominant === 'even'
                  ? 'Even Match'
                  : `${momentum.dominant === 'A' ? teamA.name : teamB.name} Dominant`}
              </h4>
            </div>
            {momentum.streak.team && momentum.streak.count >= 2 && (
              <span
                className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                style={{ background: 'var(--kc-accent)', color: 'var(--kc-on-accent)' }}
              >
                🔥 {momentum.streak.count} streak
              </span>
            )}
          </div>

          {/* Last 5 points visualization */}
          <div className="flex items-end gap-2 h-20">
            {last5Points.length === 0 ? (
              <p
                className="text-xs font-inter"
                style={{ color: 'var(--kc-text-muted)' }}
              >
                No points scored yet
              </p>
            ) : (
              last5Points.map((event, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-lg transition-all duration-300 animate-slide-in-up"
                  style={{
                    height: `${40 + Math.random() * 40}px`,
                    background: event.team === 'A' ? 'var(--kc-accent-container)' : 'var(--kc-surface-bright)',
                    animationDelay: `${i * 0.05}s`,
                    minWidth: '12px',
                    maxWidth: '32px',
                  }}
                />
              ))
            )}
            {/* Fill empty slots */}
            {Array.from({ length: Math.max(0, 5 - last5Points.length) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex-1 rounded-lg"
                style={{
                  height: '24px',
                  background: 'var(--kc-surface-highest)',
                  minWidth: '12px',
                  maxWidth: '32px',
                }}
              />
            ))}
          </div>

          <div className="flex justify-between mt-3">
            <span className="text-[10px] font-inter" style={{ color: 'var(--kc-text-muted)' }}>Last 5 Points</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--kc-accent-container)' }} />
                <span className="text-[10px]" style={{ color: 'var(--kc-text-muted)' }}>{teamA.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--kc-surface-bright)' }} />
                <span className="text-[10px]" style={{ color: 'var(--kc-text-muted)' }}>{teamB.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Match Metrics Table ===== */}
      <div
        className="rounded-[32px] overflow-hidden"
        style={{ background: 'var(--kc-surface)' }}
      >
        {/* Table Header */}
        <div
          className="px-6 py-4 flex justify-between items-center"
          style={{ borderBottom: '1px solid var(--kc-outline-dim)' }}
        >
          <h3 className="font-lexend font-bold text-sm tracking-widest uppercase">
            Match Metrics
          </h3>
          <span className="text-[10px]" style={{ color: 'var(--kc-text-dim)' }}>
            {totalEvents} total events
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="p-6 grid grid-cols-3 gap-y-6 text-center">
          {/* Column Headers */}
          <div
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: 'var(--kc-text-dim)' }}
          >
            {teamA.name}
          </div>
          <div
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: 'var(--kc-text-dim)' }}
          >
            Metric
          </div>
          <div
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: 'var(--kc-text-dim)' }}
          >
            {teamB.name}
          </div>

          {/* Score */}
          <StatRow
            valueA={teamA.score}
            label="Score"
            valueB={teamB.score}
          />

          {/* Points Won */}
          <StatRow
            valueA={teamAPoints}
            label="Points Won"
            valueB={teamBPoints}
          />

          {/* Faults */}
          <StatRow
            valueA={teamAFaults}
            label="Faults"
            valueB={teamBFaults}
            invertHighlight
          />

          {/* Side-outs */}
          <StatRow
            valueA={teamASideouts}
            label="Side-outs"
            valueB={teamBSideouts}
            invertHighlight
          />
        </div>
      </div>

      {/* ===== Game Point Indicator ===== */}
      {gamePoint.isGamePoint && (
        <div
          className="rounded-[32px] p-6 text-center animate-pulse-glow"
          style={{ background: 'var(--kc-surface)' }}
        >
          <span className="material-symbols-outlined text-4xl mb-2" style={{ color: 'var(--kc-accent)' }}>
            emoji_events
          </span>
          <h3 className="font-lexend font-black text-2xl uppercase tracking-widest" style={{ color: 'var(--kc-accent)' }}>
            GAME POINT
          </h3>
          <p className="text-sm mt-1" style={{ color: 'var(--kc-text-dim)' }}>
            {gamePoint.team === 'A' ? teamA.name : teamB.name} is one point away from victory
          </p>
        </div>
      )}
    </div>
  );
}

function StatRow({
  valueA,
  label,
  valueB,
  invertHighlight = false,
}: {
  valueA: number;
  label: string;
  valueB: number;
  invertHighlight?: boolean;
}) {
  const aWins = invertHighlight ? valueA < valueB : valueA > valueB;
  const bWins = invertHighlight ? valueB < valueA : valueB > valueA;

  return (
    <>
      <div
        className="text-xl font-lexend font-bold"
        style={{ color: aWins ? 'var(--kc-accent-container)' : 'var(--kc-text)' }}
      >
        {valueA}
      </div>
      <div
        className="text-xs font-medium flex items-center justify-center"
        style={{ color: 'var(--kc-text-dim)' }}
      >
        {label}
      </div>
      <div
        className="text-xl font-lexend font-bold"
        style={{ color: bWins ? 'var(--kc-accent-container)' : invertHighlight && valueB > valueA ? 'var(--kc-error)' : 'var(--kc-text)' }}
      >
        {valueB}
      </div>
    </>
  );
}
