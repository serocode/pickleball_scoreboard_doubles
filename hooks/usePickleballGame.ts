import { useState, useCallback, useEffect } from 'react';
import {
  GameState,
  GameEvent,
  Player,
  scorePoint as scorePointFn,
  recordFault as recordFaultFn,
  resetGame as resetGameFn,
  undoLastAction as undoLastActionFn,
  getServerPosition,
  getScoreCall,
  isGamePoint as isGamePointFn,
  isGameWon as isGameWonFn,
  isMatchWon as isMatchWonFn,
  startNextGame as startNextGameFn,
  getMomentum as getMomentumFn,
  MatchMode,
} from '@/lib/pickleball-state';

const STORAGE_KEY = 'pickleball-game-state';

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
        // Ensure events array exists for backward compatibility
        if (!parsed.events) {
          parsed.events = [];
        }
        if (!parsed.gameHistory) {
          parsed.gameHistory = [];
        }
        setGameState(parsed);
      } else {
        setGameState(resetGameFn());
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
      setGameState(resetGameFn());
    }
    setIsLoading(false);
  }, []);

  // Save state to localStorage whenever it changes
  const updateGameState = useCallback((newState: GameState) => {
    setGameState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }, []);

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
  const events = gameState?.events ?? [];

  return {
    gameState,
    isLoading,
    lastAction,
    scorePoint,
    recordFault,
    resetGame,
    startNextGame,
    undo,
    updateMatchSettings,
    serverPosition,
    scoreCall,
    gamePoint,
    gameWon,
    matchWon,
    momentum,
    events,
  };
}
