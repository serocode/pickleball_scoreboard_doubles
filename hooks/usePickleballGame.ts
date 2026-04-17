import { useState, useCallback, useEffect } from 'react';
import {
  GameState,
  GameEvent,
  Player,
  MatchStats,
  scorePoint as scorePointFn,
  recordFault as recordFaultFn,
  resetGame as resetGameFn,
  resetGameKeepSettings as resetGameKeepSettingsFn,
  undoLastAction as undoLastActionFn,
  getServerPosition,
  getScoreCall,
  isGamePoint as isGamePointFn,
  isGameWon as isGameWonFn,
  isMatchWon as isMatchWonFn,
  startNextGame as startNextGameFn,
  getMomentum as getMomentumFn,
  getWinProbability as getWinProbabilityFn,
  ensureMatchStats,
  MatchMode,
} from '@/lib/pickleball-state';

const STORAGE_KEY = 'pickleball-game-state';

/**
 * Migrate older persisted states to include new fields.
 * This ensures backward compatibility when the user refreshes
 * with state saved from a previous version.
 */
function migrateState(parsed: GameState): GameState {
  let state = { ...parsed };

  // Ensure events array exists
  if (!state.events) {
    state.events = [];
  }
  if (!state.gameHistory) {
    state.gameHistory = [];
  }

  // Ensure gamesWon exists
  if (!state.gamesWon) {
    state.gamesWon = { A: 0, B: 0 };
  }

  // Ensure currentGame exists
  if (!state.currentGame) {
    state.currentGame = 1;
  }

  // Ensure matchStats exists (rebuild from events if needed)
  state = ensureMatchStats(state);

  // Ensure each event has the new fields (id, game, server, score)
  state.events = state.events.map((event: GameEvent, index: number) => ({
    id: event.id || `migrated-${index}-${Date.now().toString(36)}`,
    type: event.type,
    team: event.team,
    server: event.server ?? event.serverAfter?.serverNumber ?? 1,
    score: event.score || `${event.scoreAfter?.A ?? 0}-${event.scoreAfter?.B ?? 0}-${event.serverAfter?.serverNumber ?? 1}`,
    scoreAfter: event.scoreAfter || { A: 0, B: 0 },
    serverAfter: event.serverAfter || { team: 'A', serverNumber: 1 },
    game: event.game ?? 1,
    timestamp: event.timestamp || Date.now(),
  }));

  return state;
}

export function usePickleballGame() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastAction, setLastAction] = useState<'point' | 'fault' | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as GameState;
        const migrated = migrateState(parsed);
        setGameState(migrated);
      } else {
        setGameState(resetGameFn());
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
      setGameState(resetGameFn());
    }
    setIsLoading(false);
  }, []);

  /**
   * Prepare state for localStorage by stripping heavy data (base64 photos)
   * from gameHistory entries to avoid quota exceeded errors.
   */
  const prepareForStorage = useCallback((state: GameState): GameState => {
    const stripPhotos = (players: [Player, Player]): [Player, Player] => [
      { name: players[0].name },
      { name: players[1].name },
    ];

    return {
      ...state,
      gameHistory: state.gameHistory.map(h => ({
        ...h,
        teams: {
          A: { ...h.teams.A, players: stripPhotos(h.teams.A.players) },
          B: { ...h.teams.B, players: stripPhotos(h.teams.B.players) },
        },
        gameHistory: [], // Don't nest undo history
      })),
    };
  }, []);

  // Save state to localStorage whenever it changes
  const updateGameState = useCallback((newState: GameState) => {
    setGameState(newState);
    try {
      const toStore = prepareForStorage(newState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }, [prepareForStorage]);

  const scorePoint = useCallback(() => {
    if (!gameState) return;
    const newState = scorePointFn(gameState);
    setLastAction('point');
    updateGameState(newState);
    // Clear action indicator after animation
    setTimeout(() => setLastAction(null), 600);
  }, [gameState, updateGameState]);

  const recordFault = useCallback(() => {
    if (!gameState) return;
    const newState = recordFaultFn(gameState);
    setLastAction('fault');
    updateGameState(newState);
    setTimeout(() => setLastAction(null), 600);
  }, [gameState, updateGameState]);

  const resetGame = useCallback(() => {
    const newState = resetGameFn(gameState || undefined);
    updateGameState(newState);
    setLastAction(null);
  }, [gameState, updateGameState]);

  const resetGameKeepSettings = useCallback(() => {
    if (!gameState) return;
    const newState = resetGameKeepSettingsFn(gameState);
    updateGameState(newState);
    setLastAction(null);
  }, [gameState, updateGameState]);

  const startNextGame = useCallback(() => {
    if (!gameState) return;
    const newState = startNextGameFn(gameState);
    updateGameState(newState);
    setLastAction(null);
  }, [gameState, updateGameState]);

  const undo = useCallback(() => {
    if (!gameState) return;
    const newState = undoLastActionFn(gameState);
    updateGameState(newState);
    setLastAction(null);
  }, [gameState, updateGameState]);

  const updateMatchSettings = useCallback(
    (
      teamAName: string,
      teamBName: string,
      teamAPlayers: [Player, Player],
      teamBPlayers: [Player, Player],
      matchMode: MatchMode
    ) => {
      if (!gameState) return;
      const newState = {
        ...gameState,
        matchMode,
        teams: {
          A: { ...gameState.teams.A, name: teamAName, players: teamAPlayers },
          B: { ...gameState.teams.B, name: teamBName, players: teamBPlayers },
        },
      };
      updateGameState(newState);
    },
    [gameState, updateGameState]
  );

  const serverPosition = gameState ? getServerPosition(gameState.serving.team, gameState.teams) : 'right';
  const scoreCall = gameState ? getScoreCall(gameState) : null;
  const gamePoint = gameState ? isGamePointFn(gameState) : { isGamePoint: false, team: null };
  const gameWon = gameState ? isGameWonFn(gameState) : { isWon: false, winner: null };
  const matchWon = gameState ? isMatchWonFn(gameState) : { isWon: false, winner: null };
  const momentum = gameState ? getMomentumFn(gameState) : { teamAPoints: 0, teamBPoints: 0, dominant: 'even' as const, streak: { team: null, count: 0 } };
  const winProbability = gameState ? getWinProbabilityFn(gameState) : 50;
  const matchStats = gameState?.matchStats ?? { A: { pointsWon: 0, faults: 0, sideOuts: 0 }, B: { pointsWon: 0, faults: 0, sideOuts: 0 } };
  const events = gameState?.events ?? [];

  return {
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
  };
}
