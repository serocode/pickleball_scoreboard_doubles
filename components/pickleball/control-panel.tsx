'use client';

import { Button } from '@/components/ui/button';
import { RotateCcw, Undo2, Check, X } from 'lucide-react';

interface ControlPanelProps {
  onScorePoint: () => void;
  onFault: () => void;
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export function ControlPanel({
  onScorePoint,
  onFault,
  onReset,
  onUndo,
  canUndo,
}: ControlPanelProps) {
  return (
    <div className="rounded-xl bg-card p-8 shadow-lg">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Score Point Button */}
        <Button
          onClick={onScorePoint}
          className="h-auto flex-col items-center justify-center gap-2 py-6 text-base font-semibold"
          size="lg"
        >
          <Check className="h-6 w-6" />
          <span className="text-sm">Point</span>
        </Button>

        {/* Fault Button */}
        <Button
          onClick={onFault}
          variant="destructive"
          className="h-auto flex-col items-center justify-center gap-2 py-6 text-base font-semibold"
          size="lg"
        >
          <X className="h-6 w-6" />
          <span className="text-sm">Fault</span>
        </Button>

        {/* Undo Button */}
        <Button
          onClick={onUndo}
          variant="outline"
          disabled={!canUndo}
          className="h-auto flex-col items-center justify-center gap-2 py-6 text-base font-semibold"
          size="lg"
        >
          <Undo2 className="h-6 w-6" />
          <span className="text-sm">Undo</span>
        </Button>

        {/* Reset Button */}
        <Button
          onClick={onReset}
          variant="secondary"
          className="h-auto flex-col items-center justify-center gap-2 py-6 text-base font-semibold"
          size="lg"
        >
          <RotateCcw className="h-6 w-6" />
          <span className="text-sm">Reset</span>
        </Button>
      </div>

      {/* Action Descriptions */}
      <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-muted-foreground sm:grid-cols-4">
        <div className="text-center">
          <p className="font-semibold">Award Point</p>
          <p>to serving team</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">Record Fault</p>
          <p>server or side-out</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">Undo</p>
          <p>last action</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">Reset</p>
          <p>start new game</p>
        </div>
      </div>
    </div>
  );
}
