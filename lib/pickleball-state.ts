export interface Player {
  name: string;
  photo?: string; // base64 encoded image
}

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

export interface GameState {
  teams: {
    A: Team;
    B: Team;
  };
  serving: ServingState;
  gameHistory: GameState[];
}

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
  serving: { team: 'A', serverNumber: 1, isFirstServe: true },
  gameHistory: [],
};

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

// Handle point scored by serving team
export function scorePoint(state: GameState): GameState {
  const newState = JSON.parse(JSON.stringify(state)) as GameState;
  newState.gameHistory = [JSON.parse(JSON.stringify(state))];

  const servingTeamKey = newState.serving.team;
  newState.teams[servingTeamKey].score += 1;

  // Rotate the serving team's positions
  newState.teams[servingTeamKey] = rotatePositions(newState.teams[servingTeamKey]);

  return newState;
}

// Handle fault/lose serve
export function recordFault(state: GameState): GameState {
  const newState = JSON.parse(JSON.stringify(state)) as GameState;
  newState.gameHistory = [JSON.parse(JSON.stringify(state))];

  const currentServingTeam = newState.serving.team;
  const otherTeam = currentServingTeam === 'A' ? 'B' : 'A';

  if (newState.serving.serverNumber === 1) {
    // First server lost, switch to second server
    newState.serving.serverNumber = 2;
  } else {
    // Second server lost, side-out to other team
    newState.serving.team = otherTeam;
    newState.serving.serverNumber = 1;
    newState.serving.isFirstServe = false;

    // Serving team moves to right side after side-out
    const score = newState.teams[otherTeam].score;
    const shouldBeRight = score % 2 === 0;
    if (shouldBeRight && newState.teams[otherTeam].players[0] === newState.teams[otherTeam].players[1]) {
      // Players are the same (shouldn't happen, but safeguard)
    }
  }

  return newState;
}

// Reset game to initial state
export function resetGame(): GameState {
  return JSON.parse(JSON.stringify(INITIAL_GAME_STATE)) as GameState;
}

// Undo last action
export function undoLastAction(state: GameState): GameState {
  if (state.gameHistory.length === 0) {
    return state;
  }
  return state.gameHistory[state.gameHistory.length - 1];
}

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
