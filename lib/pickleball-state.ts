export interface Player {
  name: string;
  photo?: string; // base64 encoded image
}

export type MatchMode = 'casual' | 'standard' | 'long';

export interface MatchModeConfig {
  gamesToWin: number;
}

export const MATCH_MODES: Record<MatchMode, MatchModeConfig> = {
  casual: { gamesToWin: 1 },
  standard: { gamesToWin: 2 }, // Best of 3
  long: { gamesToWin: 3 }, // Best of 5
};

export interface Team {
  name: string;
  score: number;
  players: [Player, Player]; // [left, right]
}

export interface ServingState {
  team: 'A' | 'B';
  serverNumber: 1 | 2;
  isFirstServe: boolean;
}

// ─── Cumulative per-team stats across all games in a match ─────────────────────
export interface MatchStats {
  pointsWon: number;
  faults: number;
  sideOuts: number;
}

export interface GameEvent {
  id: string;
  type: 'point' | 'fault' | 'sideout';
  team: 'A' | 'B';
  server: 1 | 2;
  score: string; // "X-Y-Z" format (servingScore-receivingScore-serverNumber)
  scoreAfter: { A: number; B: number };
  serverAfter: { team: 'A' | 'B'; serverNumber: 1 | 2 };
  game: number;
  timestamp: number;
}

export interface GameState {
  teams: {
    A: Team;
    B: Team;
  };
  serving: ServingState;
  matchMode: MatchMode;
  gamesWon: { A: number; B: number };
  currentGame: number;
  isMatchStarted: boolean;
  isMatchOver: boolean;
  matchStats: { A: MatchStats; B: MatchStats };
  events: GameEvent[];
  gameHistory: GameState[];
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const EMPTY_MATCH_STATS: MatchStats = { pointsWon: 0, faults: 0, sideOuts: 0 };

const INITIAL_GAME_STATE: GameState = {
  teams: {
    A: {
      name: 'Team A',
      score: 0,
      players: [
        { name: 'Player 1A' },
        { name: 'Player 2A' },
      ],
    },
    B: {
      name: 'Team B',
      score: 0,
      players: [
        { name: 'Player 1B' },
        { name: 'Player 2B' },
      ],
    },
  },
  serving: { team: 'A', serverNumber: 2, isFirstServe: true },
  matchMode: 'casual',
  gamesWon: { A: 0, B: 0 },
  currentGame: 1,
  isMatchStarted: false,
  isMatchOver: false,
  matchStats: {
    A: { ...EMPTY_MATCH_STATS },
    B: { ...EMPTY_MATCH_STATS },
  },
  events: [],
  gameHistory: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Coerce any string to a valid MatchMode, falling back to 'casual'.
 * This prevents runtime crashes when form state or persisted data
 * contains an unexpected / empty value.
 */
export function safeMatchMode(value: string | undefined | null): MatchMode {
  if (value && value in MATCH_MODES) return value as MatchMode;
  return 'casual';
}

/** Generate a short unique ID for events. */
function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Ensure matchStats exists on a deserialized state.
 * Older persisted states may not have matchStats.
 */
export function ensureMatchStats(state: GameState): GameState {
  if (!state.matchStats) {
    // Rebuild stats from events if they exist
    const stats = { A: { ...EMPTY_MATCH_STATS }, B: { ...EMPTY_MATCH_STATS } };
    for (const event of (state.events || [])) {
      if (event.type === 'point') {
        stats[event.team].pointsWon++;
      } else if (event.type === 'fault') {
        stats[event.team].faults++;
      } else if (event.type === 'sideout') {
        stats[event.team].sideOuts++;
      }
    }
    return { ...state, matchStats: stats };
  }
  return state;
}

// ─── Position helpers ─────────────────────────────────────────────────────────

// Get the serve position (right or left) based on score parity
export function getServerPosition(servingTeam: 'A' | 'B', teams: GameState['teams']): 'right' | 'left' {
  const score = teams[servingTeam].score;
  // Even score = right, Odd score = left
  return score % 2 === 0 ? 'right' : 'left';
}

// Rotate serving team's positions when they score
export function rotatePositions(team: Team): Team {
  return {
    ...team,
    players: [team.players[1], team.players[0]],
  };
}

// ─── Score Call Formatting ────────────────────────────────────────────────────

/** Format a score call string as "servingScore-receivingScore-serverNumber" */
function formatScoreCall(
  servingTeamScore: number,
  receivingTeamScore: number,
  serverNumber: 1 | 2,
): string {
  return `${servingTeamScore}-${receivingTeamScore}-${serverNumber}`;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

// Handle point scored by serving team
export function scorePoint(state: GameState): GameState {
  const newState = JSON.parse(JSON.stringify(state)) as GameState;
  newState.gameHistory = [JSON.parse(JSON.stringify(state))];
  newState.isMatchStarted = true;
  // Ensure matchMode is always valid after deserialization
  newState.matchMode = safeMatchMode(newState.matchMode);
  // Ensure matchStats after deserialization
  if (!newState.matchStats) {
    newState.matchStats = { A: { ...EMPTY_MATCH_STATS }, B: { ...EMPTY_MATCH_STATS } };
  }

  const servingTeamKey = newState.serving.team;
  const receivingTeamKey = servingTeamKey === 'A' ? 'B' : 'A';
  newState.teams[servingTeamKey].score += 1;

  // Rotate the serving team's positions
  newState.teams[servingTeamKey] = rotatePositions(newState.teams[servingTeamKey]);

  // Increment cumulative stats
  newState.matchStats[servingTeamKey].pointsWon += 1;

  // Build score call string (after scoring)
  const scoreStr = formatScoreCall(
    newState.teams[servingTeamKey].score,
    newState.teams[receivingTeamKey].score,
    newState.serving.serverNumber,
  );

  // Record event
  newState.events = [
    ...state.events,
    {
      id: generateId(),
      type: 'point',
      team: servingTeamKey,
      server: newState.serving.serverNumber,
      score: scoreStr,
      scoreAfter: { A: newState.teams.A.score, B: newState.teams.B.score },
      serverAfter: { team: newState.serving.team, serverNumber: newState.serving.serverNumber },
      game: newState.currentGame ?? 1,
      timestamp: Date.now(),
    },
  ];

  return newState;
}

// Handle fault/lose serve
export function recordFault(state: GameState): GameState {
  const newState = JSON.parse(JSON.stringify(state)) as GameState;
  newState.gameHistory = [JSON.parse(JSON.stringify(state))];
  newState.isMatchStarted = true;
  // Ensure matchMode is always valid after deserialization
  newState.matchMode = safeMatchMode(newState.matchMode);
  // Ensure matchStats after deserialization
  if (!newState.matchStats) {
    newState.matchStats = { A: { ...EMPTY_MATCH_STATS }, B: { ...EMPTY_MATCH_STATS } };
  }

  const currentServingTeam = newState.serving.team;
  const otherTeam = currentServingTeam === 'A' ? 'B' : 'A';

  let eventType: GameEvent['type'] = 'fault';

  if (newState.serving.serverNumber === 1) {
    // First server lost, switch to second server
    newState.serving.serverNumber = 2;
    // Increment faults for the serving team
    newState.matchStats[currentServingTeam].faults += 1;
  } else {
    // Second server lost, side-out to other team
    newState.serving.team = otherTeam;
    newState.serving.serverNumber = 1;
    newState.serving.isFirstServe = false;
    eventType = 'sideout';
    // Increment sideOuts for the serving team (the team that lost serve)
    newState.matchStats[currentServingTeam].sideOuts += 1;
  }

  // Build score call string (after fault)
  const servingNow = newState.serving.team;
  const receivingNow = servingNow === 'A' ? 'B' : 'A';
  const scoreStr = formatScoreCall(
    newState.teams[servingNow].score,
    newState.teams[receivingNow].score,
    newState.serving.serverNumber,
  );

  // Record event
  newState.events = [
    ...state.events,
    {
      id: generateId(),
      type: eventType,
      team: currentServingTeam,
      server: state.serving.serverNumber,
      score: scoreStr,
      scoreAfter: { A: newState.teams.A.score, B: newState.teams.B.score },
      serverAfter: { team: newState.serving.team, serverNumber: newState.serving.serverNumber },
      game: newState.currentGame ?? 1,
      timestamp: Date.now(),
    },
  ];

  return newState;
}

// Reset game to initial state (full reset — clears everything)
export function resetGame(state?: GameState): GameState {
  const base = JSON.parse(JSON.stringify(INITIAL_GAME_STATE)) as GameState;
  if (state) {
    base.teams.A.name = state.teams.A.name;
    base.teams.B.name = state.teams.B.name;
    base.teams.A.players = state.teams.A.players;
    base.teams.B.players = state.teams.B.players;
    // Validate matchMode before copying to avoid propagating a bad value
    base.matchMode = safeMatchMode(state.matchMode);
  }
  return base;
}

// Reset while keeping match mode & player settings ("restart with same settings")
export function resetGameKeepSettings(state: GameState): GameState {
  const base = JSON.parse(JSON.stringify(INITIAL_GAME_STATE)) as GameState;
  base.teams.A.name = state.teams.A.name;
  base.teams.B.name = state.teams.B.name;
  base.teams.A.players = JSON.parse(JSON.stringify(state.teams.A.players));
  base.teams.B.players = JSON.parse(JSON.stringify(state.teams.B.players));
  base.matchMode = safeMatchMode(state.matchMode);
  return base;
}

// Undo last action
export function undoLastAction(state: GameState): GameState {
  if (state.gameHistory.length === 0) {
    return state;
  }
  return state.gameHistory[state.gameHistory.length - 1];
}

// ─── Queries ──────────────────────────────────────────────────────────────────

// Get the full score call (e.g., "7-5-1" for Team A: 7, Team B: 5, Server: 1)
export function getScoreCall(state: GameState): {
  servingTeamScore: number;
  receivingTeamScore: number;
  serverNumber: 1 | 2;
  servingTeam: 'A' | 'B';
} {
  const servingTeam = state.serving.team;
  const receivingTeam = servingTeam === 'A' ? 'B' : 'A';

  return {
    servingTeamScore: state.teams[servingTeam].score,
    receivingTeamScore: state.teams[receivingTeam].score,
    serverNumber: state.serving.serverNumber,
    servingTeam,
  };
}

// Check if any team has reached game point (score >= 10 and leading)
export function isGamePoint(state: GameState): { isGamePoint: boolean; team: 'A' | 'B' | null } {
  if (!state?.teams) return { isGamePoint: false, team: null };
  const scoreA = state.teams.A?.score ?? 0;
  const scoreB = state.teams.B?.score ?? 0;

  if (scoreA >= 10 && scoreA > scoreB) {
    return { isGamePoint: true, team: 'A' };
  }
  if (scoreB >= 10 && scoreB > scoreA) {
    return { isGamePoint: true, team: 'B' };
  }
  return { isGamePoint: false, team: null };
}

// Check if game is won (score >= 11 and win by 2)
export function isGameWon(state: GameState): { isWon: boolean; winner: 'A' | 'B' | null } {
  if (!state?.teams) return { isWon: false, winner: null };
  const scoreA = state.teams.A?.score ?? 0;
  const scoreB = state.teams.B?.score ?? 0;

  if (scoreA >= 11 && scoreA - scoreB >= 2) {
    return { isWon: true, winner: 'A' };
  }
  if (scoreB >= 11 && scoreB - scoreA >= 2) {
    return { isWon: true, winner: 'B' };
  }
  return { isWon: false, winner: null };
}

// Check if the entire series match is won
export function isMatchWon(state: GameState): { isWon: boolean; winner: 'A' | 'B' | null } {
  // Guard: state itself or gamesWon may be undefined during first render
  if (!state || !state.gamesWon) return { isWon: false, winner: null };

  // Guard: coerce matchMode to a valid key before indexing MATCH_MODES
  const mode = safeMatchMode(state.matchMode);
  const requiredWins = MATCH_MODES[mode].gamesToWin;

  // Re-calculate based on current score because we might just have won a game
  let projectedA = state.gamesWon.A ?? 0;
  let projectedB = state.gamesWon.B ?? 0;

  const currentWin = isGameWon(state);
  if (currentWin.isWon) {
    if (currentWin.winner === 'A') projectedA++;
    if (currentWin.winner === 'B') projectedB++;
  }

  if (projectedA >= requiredWins) return { isWon: true, winner: 'A' };
  if (projectedB >= requiredWins) return { isWon: true, winner: 'B' };
  return { isWon: false, winner: null };
}

// Move to the next game in a match
export function startNextGame(state: GameState): GameState {
  const newState = JSON.parse(JSON.stringify(state)) as GameState;
  // Ensure matchMode is always valid after deserialization
  newState.matchMode = safeMatchMode(newState.matchMode);
  // Ensure gamesWon and currentGame are never undefined after deserialization
  newState.gamesWon = { A: newState.gamesWon?.A ?? 0, B: newState.gamesWon?.B ?? 0 };
  newState.currentGame = newState.currentGame ?? 1;

  const gameWinCheck = isGameWon(state);
  if (!gameWinCheck.isWon || !gameWinCheck.winner) return state; // Safety guard

  // Increment games won
  newState.gamesWon[gameWinCheck.winner] += 1;

  // Check match win (using updated state)
  const requiredWins = MATCH_MODES[newState.matchMode].gamesToWin;
  if (newState.gamesWon.A >= requiredWins || newState.gamesWon.B >= requiredWins) {
    newState.isMatchOver = true;
    return newState;
  }

  // Progress to next game
  newState.currentGame += 1;
  newState.teams.A.score = 0;
  newState.teams.B.score = 0;

  // The loser of the previous game serves first
  const loser = gameWinCheck.winner === 'A' ? 'B' : 'A';
  newState.serving = { team: loser, serverNumber: 2, isFirstServe: true };

  // IMPORTANT: Preserve events and matchStats across game transitions
  // Events are tagged with game number so they can be filtered by game
  newState.gameHistory = [];

  return newState;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

// Get momentum analysis from last N events
export function getMomentum(state: GameState, lastN: number = 5): {
  teamAPoints: number;
  teamBPoints: number;
  dominant: 'A' | 'B' | 'even';
  streak: { team: 'A' | 'B' | null; count: number };
} {
  const recentEvents = state.events.filter(e => e.type === 'point').slice(-lastN);

  const teamAPoints = recentEvents.filter(e => e.team === 'A').length;
  const teamBPoints = recentEvents.filter(e => e.team === 'B').length;

  let dominant: 'A' | 'B' | 'even' = 'even';
  if (teamAPoints > teamBPoints) dominant = 'A';
  else if (teamBPoints > teamAPoints) dominant = 'B';

  // Calculate current scoring streak
  let streak = { team: null as 'A' | 'B' | null, count: 0 };
  const pointEvents = state.events.filter(e => e.type === 'point');
  if (pointEvents.length > 0) {
    const lastTeam = pointEvents[pointEvents.length - 1].team;
    let count = 0;
    for (let i = pointEvents.length - 1; i >= 0; i--) {
      if (pointEvents[i].team === lastTeam) {
        count++;
      } else {
        break;
      }
    }
    streak = { team: lastTeam, count };
  }

  return { teamAPoints, teamBPoints, dominant, streak };
}

// ─── Win Probability Heuristic ────────────────────────────────────────────────

/**
 * Estimate win probability for each team based on:
 * - Current game score & distance to 11
 * - Games won in the match
 * - Scoring momentum
 *
 * Returns a value 0–100 for Team A (Team B = 100 – A).
 */
export function getWinProbability(state: GameState): number {
  if (!state?.teams) return 50;

  const scoreA = state.teams.A?.score ?? 0;
  const scoreB = state.teams.B?.score ?? 0;
  const gamesA = state.gamesWon?.A ?? 0;
  const gamesB = state.gamesWon?.B ?? 0;

  // 1. Score-based component (60% weight)
  const totalScore = scoreA + scoreB;
  let scoreProbA = 50;
  if (totalScore > 0) {
    // Factor in distance to 11 and lead
    const distA = Math.max(0, 11 - scoreA);
    const distB = Math.max(0, 11 - scoreB);
    const totalDist = distA + distB;
    scoreProbA = totalDist > 0 ? Math.round(((totalDist - distA) / totalDist) * 100) : 50;
  }

  // 2. Games-won component (25% weight) — only relevant for multi-game matches
  const mode = safeMatchMode(state.matchMode);
  const requiredWins = MATCH_MODES[mode].gamesToWin;
  let gamesProbA = 50;
  if (requiredWins > 1) {
    const totalGames = gamesA + gamesB;
    if (totalGames > 0) {
      gamesProbA = Math.round((gamesA / totalGames) * 100);
    }
  }

  // 3. Momentum component (15% weight)
  const momentum = getMomentum(state);
  let momentumProbA = 50;
  const totalMomentum = momentum.teamAPoints + momentum.teamBPoints;
  if (totalMomentum > 0) {
    momentumProbA = Math.round((momentum.teamAPoints / totalMomentum) * 100);
  }

  // Weighted average
  const weightedProb = requiredWins > 1
    ? Math.round(scoreProbA * 0.6 + gamesProbA * 0.25 + momentumProbA * 0.15)
    : Math.round(scoreProbA * 0.75 + momentumProbA * 0.25);

  // Clamp to 5–95 so it never shows 0% or 100% during an active match
  if (!state.isMatchOver) {
    return Math.max(5, Math.min(95, weightedProb));
  }
  return weightedProb;
}