'use client';

interface ControlPanelProps {
  onScorePoint: () => void;
  onFault: () => void;
  onResetRequest: () => void;
  onNextGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
  isGameWon: boolean;
  isMatchWon: boolean;
}

export function ControlPanel({
  onScorePoint,
  onFault,
  onResetRequest,
  onNextGame,
  onUndo,
  canUndo,
  isGameWon,
  isMatchWon,
}: ControlPanelProps) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* ===== POINT BUTTON — Primary CTA ===== */}
      <button
        onClick={onScorePoint}
        disabled={isGameWon}
        className={`col-span-2 md:col-span-2 h-24 rounded-3xl flex items-center justify-center gap-3 transition-all duration-200 active:scale-95 cursor-pointer ${
          isGameWon ? 'opacity-40 cursor-not-allowed' : ''
        }`}
        style={{
          background: 'linear-gradient(135deg, #f4ffc8 0%, #cffc00 100%)',
          color: 'var(--kc-on-accent)',
          boxShadow: isGameWon ? 'none' : '0 0 20px rgba(209, 255, 0, 0.15)',
        }}
      >
        <span className="material-symbols-outlined font-black text-3xl">add_circle</span>
        <span className="font-lexend font-extrabold text-2xl uppercase tracking-widest">POINT</span>
      </button>

      {/* ===== SIDE OUT / FAULT BUTTON ===== */}
      <button
        onClick={onFault}
        disabled={isGameWon}
        className={`h-24 rounded-3xl flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-95 cursor-pointer ${
          isGameWon ? 'opacity-40 cursor-not-allowed' : ''
        }`}
        style={{
          background: 'var(--kc-surface-highest)',
          color: 'var(--kc-text)',
        }}
      >
        <span className="material-symbols-outlined" style={{ color: 'var(--kc-accent)' }}>
          swap_horiz
        </span>
        <span
          className="font-inter font-bold text-[10px] uppercase tracking-widest"
          style={{ color: 'var(--kc-text-dim)' }}
        >
          SIDE OUT
        </span>
      </button>

      {/* ===== UNDO BUTTON ===== */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`h-24 rounded-3xl flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-95 cursor-pointer ${
          !canUndo ? 'opacity-30 cursor-not-allowed' : ''
        }`}
        style={{
          background: 'var(--kc-surface-highest)',
          color: 'var(--kc-text)',
        }}
      >
        <span className="material-symbols-outlined" style={{ color: 'var(--kc-error)' }}>
          undo
        </span>
        <span
          className="font-inter font-bold text-[10px] uppercase tracking-widest"
          style={{ color: 'var(--kc-text-dim)' }}
        >
          UNDO LAST
        </span>
      </button>

      {/* ===== NEXT GAME / NEW GAME ===== */}
      {isGameWon && !isMatchWon && (
        <button
          onClick={onNextGame}
          className="col-span-2 md:col-span-4 h-16 rounded-3xl flex items-center justify-center gap-3 transition-all duration-200 active:scale-95 cursor-pointer animate-fade-in"
          style={{
            background: 'var(--kc-surface-highest)',
            color: 'var(--kc-accent)',
          }}
        >
          <span className="material-symbols-outlined">arrow_forward</span>
          <span className="font-lexend font-bold text-sm uppercase tracking-widest">NEXT GAME</span>
        </button>
      )}

      {isMatchWon && (
        <button
          onClick={onResetRequest}
          className="col-span-2 md:col-span-4 h-16 rounded-3xl flex items-center justify-center gap-3 transition-all duration-200 active:scale-95 cursor-pointer animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, #f4ffc8 0%, #cffc00 100%)',
            color: 'var(--kc-on-accent)',
            boxShadow: '0 0 20px rgba(209, 255, 0, 0.15)',
          }}
        >
          <span className="material-symbols-outlined">replay</span>
          <span className="font-lexend font-bold text-sm uppercase tracking-widest">NEW MATCH</span>
        </button>
      )}
    </section>
  );
}
