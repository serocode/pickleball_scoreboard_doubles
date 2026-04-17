'use client';

import { Badge } from '@/components/ui/badge';

interface ServerIndicatorProps {
  serverNumber: 1 | 2;
  servingTeam: 'A' | 'B';
  isFirstServe: boolean;
  serverPosition: 'right' | 'left';
}

export function ServerIndicator({
  serverNumber,
  servingTeam,
  isFirstServe,
  serverPosition,
}: ServerIndicatorProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge variant="default" className="text-base px-4 py-2">
        Server {serverNumber}
      </Badge>

      <Badge variant="secondary" className="text-base px-4 py-2">
        {servingTeam === 'A' ? 'Team A' : 'Team B'} - {serverPosition === 'right' ? 'Right' : 'Left'} Side
      </Badge>

      {isFirstServe && (
        <Badge variant="outline" className="text-base px-4 py-2">
          First Serve Only
        </Badge>
      )}
    </div>
  );
}
