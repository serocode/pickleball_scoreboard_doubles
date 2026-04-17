'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePickleballGame } from '@/hooks/usePickleballGame';
import { ScoreDisplay } from './score-display';
import { CourtDiagram } from './court-diagram';
import { ServerIndicator } from './server-indicator';
import { ControlPanel } from './control-panel';
import { PlayerCards } from './player-cards';
import { PlayerSetupModal } from './player-setup';

export function PickleballDashboard() {
  const { gameState, isLoading, scorePoint, recordFault, resetGame, undo, updatePlayers, serverPosition } =
    usePickleballGame();
  const [setupModalOpen, setSetupModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading game...</div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-muted-foreground">Error loading game state</div>
      </div>
    );
  }

  const servingTeam = gameState.serving.team;
  const canUndo = gameState.gameHistory.length > 0;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Pickleball Scorer</h1>
            <p className="mt-2 text-muted-foreground">Doubles Match Scoring System</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSetupModalOpen(true)}
            title="Setup players and teams"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Score Display */}
        <ScoreDisplay gameState={gameState} servingTeam={servingTeam} />

        {/* Server Indicator */}
        <div className="flex justify-center">
          <ServerIndicator
            serverNumber={gameState.serving.serverNumber}
            servingTeam={servingTeam}
            isFirstServe={gameState.serving.isFirstServe}
            serverPosition={serverPosition}
          />
        </div>

        {/* Court Diagram */}
        <CourtDiagram gameState={gameState} servingTeam={servingTeam} serverPosition={serverPosition} />

        {/* Player Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PlayerCards
            teamName={gameState.teams.A.name}
            players={gameState.teams.A.players}
            isServing={servingTeam === 'A'}
            serverNumber={servingTeam === 'A' ? gameState.serving.serverNumber : undefined}
          />
          <PlayerCards
            teamName={gameState.teams.B.name}
            players={gameState.teams.B.players}
            isServing={servingTeam === 'B'}
            serverNumber={servingTeam === 'B' ? gameState.serving.serverNumber : undefined}
          />
        </div>

        {/* Control Panel */}
        <ControlPanel
          onScorePoint={scorePoint}
          onFault={recordFault}
          onReset={resetGame}
          onUndo={undo}
          canUndo={canUndo}
        />

        {/* Player Setup Modal */}
        {gameState && (
          <PlayerSetupModal
            open={setupModalOpen}
            onOpenChange={setSetupModalOpen}
            teamAName={gameState.teams.A.name}
            teamBName={gameState.teams.B.name}
            teamAPlayers={gameState.teams.A.players}
            teamBPlayers={gameState.teams.B.players}
            onSave={updatePlayers}
          />
        )}
      </div>
    </div>
  );
}
