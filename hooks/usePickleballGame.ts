import { useState, useCallback, useEffect } from 'react';
import {
  GameState,
  Player,
  scorePoint as scorePointFn,
  recordFault as recordFaultFn,
  resetGame as resetGameFn,
  undoLastAction as undoLastActionFn,
  getServerPosition,
  getScoreCall,
} from '@/lib/pickleball-state';

const STORAGE_KEY = 'pickleball-game-state';

export function usePickleballGame() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setGameState(JSON.parse(stored));
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
    updateGameState(newState);
  }, [gameState, updateGameState]);

  const recordFault = useCallback(() => {
    if (!gameState) return;
    const newState = recordFaultFn(gameState);
    updateGameState(newState);
  }, [gameState, updateGameState]);

  const resetGame = useCallback(() => {
    const newState = resetGameFn();
    updateGameState(newState);
  }, [updateGameState]);

  const undo = useCallback(() => {
    if (!gameState) return;
    const newState = undoLastActionFn(gameState);
    updateGameState(newState);
  }, [gameState, updateGameState]);

  const updatePlayers = useCallback(
    (
      teamAName: string,
      teamBName: string,
      teamAPlayers: [Player, Player],
      teamBPlayers: [Player, Player]
    ) => {
      if (!gameState) return;
      const newState = {
        ...gameState,
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

  return {
    gameState,
    isLoading,
    scorePoint,
    recordFault,
    resetGame,
    undo,
    updatePlayers,
    serverPosition,
    scoreCall,
  };
}
