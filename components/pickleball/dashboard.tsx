'use client';

import { useState } from 'react';
import { usePickleballGame } from '@/hooks/usePickleballGame';
import { ScoreDisplay } from './score-display';
import { CourtDiagram } from './court-diagram';
import { ControlPanel } from './control-panel';
import { PlayersView } from './players-view';
import { PlayerSetupModal } from './player-setup';
import { StatsView } from './stats-view';
import { HistoryView } from './history-view';
import { ConfirmResetDialog } from './confirm-reset-dialog';

type ViewTab = 'scoring' | 'stats' | 'players' | 'history';

export function PickleballDashboard() {
  const {
    gameState,
    isLoading,
    lastAction,
    scorePoint,
    recordFault,
    resetGame,
    resetGameKeepSettings,
    startNextGame,
    undo,
    updateMatchSettings,
    serverPosition,
    scoreCall,
    gamePoint,
    gameWon,
    matchWon,
    momentum,
    winProbability,
    matchStats,
    events,
  } = usePickleballGame();

  const [activeView, setActiveView] = useState<ViewTab>('scoring');
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleResetRequest = () => {
    if (!gameState || !gameState.isMatchStarted) {
      resetGame();
    } else {
      setConfirmResetOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: 'var(--kc-bg)' }}>
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 rounded-full kinetic-gradient animate-pulse" />
          <span className="font-lexend text-sm uppercase tracking-[0.3em]" style={{ color: 'var(--kc-text-dim)' }}>
            Loading Match...
          </span>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: 'var(--kc-bg)' }}>
        <div className="text-lg" style={{ color: 'var(--kc-text-dim)' }}>Error loading game state</div>
      </div>
    );
  }

  const servingTeam = gameState.serving.team;
  const canUndo = (gameState.gameHistory || []).length > 0;

  const navItems: { id: ViewTab; icon: string; label: string; filled?: boolean }[] = [
    { id: 'scoring', icon: 'scoreboard', label: 'Scoring' },
    { id: 'stats', icon: 'leaderboard', label: 'Stats' },
    { id: 'players', icon: 'group', label: 'Players' },
    { id: 'history', icon: 'history_edu', label: 'History' },
  ];

  return (
    <div className="min-h-screen pb-32" style={{ background: 'var(--kc-bg)' }}>
      {/* ========== TOP APP BAR ========== */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center w-full px-6 py-4"
        style={{ background: 'var(--kc-bg)' }}
      >
        <div className="flex items-center gap-4">
          <img src="/kitchen_counter.png" alt="Logo" className="w-8 h-8 rounded-lg outline outline-1 outline-[var(--kc-outline-dim)]" />
          <h1
            className="text-2xl font-black italic tracking-widest font-lexend uppercase hidden sm:block"
            style={{ color: 'var(--kc-accent)' }}
          >
            Kitchen Counter
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSetupModalOpen(true)}
            className="transition-colors cursor-pointer p-2 rounded-full"
            style={{ color: 'var(--kc-text-dim)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--kc-accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--kc-text-dim)')}
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      {/* ========== VIEW CONTENT ========== */}
      {activeView === 'players' ? (
        <main className="mt-16 flex-1 w-full flex flex-col h-[calc(100vh-64px)] overflow-hidden animate-fade-in">
          <PlayersView 
            gameState={gameState} 
            matchWon={matchWon} 
            onEditPlayers={() => setSetupModalOpen(true)}
          />
        </main>
      ) : (
      <main className="mt-20 px-4 max-w-5xl mx-auto pb-32 w-full">
        {/* Match Won / Game Won Banners */}
        {matchWon.isWon ? (
          <div className="mb-6 rounded-[32px] p-8 text-center animate-fade-in" style={{ background: 'var(--kc-accent-container)', color: 'var(--kc-on-accent)' }}>
            <span className="material-symbols-outlined text-6xl mb-4">trophy</span>
            <h2 className="font-lexend font-black text-3xl uppercase tracking-widest mb-2">
              {matchWon.winner === 'A' ? gameState.teams.A.name : gameState.teams.B.name} WINS THE MATCH!
            </h2>
            {gameState.matchMode !== 'casual' && (
              <p className="font-lexend text-lg opacity-80 uppercase tracking-widest">
                Final Score: {gameState.gamesWon?.A} — {gameState.gamesWon?.B}
              </p>
            )}
          </div>
        ) : gameWon.isWon ? (
          <div className="mb-6 rounded-3xl p-6 text-center animate-fade-in" style={{ background: 'var(--kc-surface-high)', border: '2px solid var(--kc-accent)' }}>
            <h3 className="font-lexend font-bold text-xl uppercase tracking-widest mb-1" style={{ color: 'var(--kc-accent)' }}>
              {gameWon.winner === 'A' ? gameState.teams.A.name : gameState.teams.B.name} WINS GAME {gameState.currentGame}
            </h3>
            <p className="text-sm font-medium" style={{ color: 'var(--kc-text-dim)' }}>
              Review the stats or start the next game when you're ready.
            </p>
          </div>
        ) : null}

        {/* Game State Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-6 animate-fade-in">
          <span
            className="px-3 py-1 rounded-full text-[10px] font-lexend font-bold uppercase tracking-widest"
            style={{ background: 'var(--kc-secondary)', color: 'var(--kc-secondary-text)' }}
          >
            DOUBLES • {gameState.matchMode}
          </span>
          <span
            className="px-3 py-1 rounded-full text-[10px] font-lexend font-bold uppercase tracking-widest"
            style={{ background: 'var(--kc-surface-highest)', color: 'var(--kc-text)' }}
          >
            GAME {gameState.currentGame}
          </span>
          {!gameWon.isWon && !matchWon.isWon && (
            <span
              className="px-3 py-1 rounded-full text-[10px] font-lexend font-bold uppercase tracking-widest flex items-center gap-1.5"
              style={{ background: 'var(--kc-surface-highest)', color: 'var(--kc-accent)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--kc-accent)' }} />
              LIVE
            </span>
          )}
          {gamePoint.isGamePoint && !gameWon.isWon && (
            <span
              className="px-3 py-1 rounded-full text-[10px] font-lexend font-bold uppercase tracking-widest animate-pulse-glow"
              style={{ background: 'var(--kc-accent)', color: 'var(--kc-on-accent)' }}
            >
              GAME POINT — {gamePoint.team === 'A' ? gameState.teams.A.name : gameState.teams.B.name}
            </span>
          )}
          {momentum.streak.team && momentum.streak.count >= 3 && !gameWon.isWon && !matchWon.isWon && (
            <span
              className="px-3 py-1 rounded-full text-[10px] font-lexend font-bold uppercase tracking-widest"
              style={{ background: 'var(--kc-surface-highest)', color: 'var(--kc-text)' }}
            >
              🔥 {momentum.streak.count} STREAK
            </span>
          )}
        </div>

        {/* View Content */}
        <div className="space-y-6 animate-fade-in">
          {activeView === 'scoring' && (
            <>
              <ScoreDisplay
                gameState={gameState}
                servingTeam={servingTeam}
                lastAction={lastAction}
              />
              <ControlPanel
                onScorePoint={scorePoint}
                onFault={recordFault}
                onResetRequest={handleResetRequest}
                onRestartMatch={resetGameKeepSettings}
                onNextGame={startNextGame}
                onUndo={undo}
                canUndo={canUndo}
                isGameWon={gameWon.isWon}
                isMatchWon={matchWon.isWon}
              />
              <CourtDiagram
                gameState={gameState}
                servingTeam={servingTeam}
                serverPosition={serverPosition}
              />
            </>
          )}

          {activeView === 'stats' && (
            <StatsView
              gameState={gameState}
              scoreCall={scoreCall}
              momentum={momentum}
              gamePoint={gamePoint}
              winProbability={winProbability}
              matchStats={matchStats}
            />
          )}

          {activeView === 'history' && (
            <HistoryView events={events} gameState={gameState} />
          )}
        </div>
      </main>
      )}

      {/* ========== BOTTOM NAVIGATION ========== */}
      <nav
        className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 z-50"
        style={{
          background: 'rgba(9, 14, 21, 0.9)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(209, 255, 0, 0.1)',
          borderRadius: '32px 32px 0 0',
          boxShadow: '0 -8px 24px rgba(209, 255, 0, 0.05)',
        }}
      >
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className="flex flex-col items-center justify-center px-6 py-2 transition-all duration-200 active:scale-90 cursor-pointer"
              style={{
                background: isActive ? 'var(--kc-accent)' : 'transparent',
                color: isActive ? 'var(--kc-bg)' : 'var(--kc-text-dim)',
                borderRadius: isActive ? '9999px' : '0',
              }}
            >
              <span
                className={`material-symbols-outlined text-[20px] mb-0.5 ${isActive ? 'filled' : ''}`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-lexend text-[10px] uppercase tracking-widest font-semibold">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ========== PLAYER SETUP MODAL ========== */}
      {gameState && (
        <PlayerSetupModal
          open={setupModalOpen}
          onOpenChange={setSetupModalOpen}
          teamAName={gameState.teams.A.name}
          teamBName={gameState.teams.B.name}
          teamAPlayers={gameState.teams.A.players}
          teamBPlayers={gameState.teams.B.players}
          currentMatchMode={gameState.matchMode}
          onSave={updateMatchSettings}
        />
      )}

      {/* ========== CONFIRM RESET MODAL ========== */}
      <ConfirmResetDialog
        open={confirmResetOpen}
        onOpenChange={setConfirmResetOpen}
        onConfirm={resetGame}
        onConfirmKeepSettings={resetGameKeepSettings}
      />
    </div>
  );
}
