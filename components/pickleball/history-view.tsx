'use client';

import { GameEvent, GameState } from '@/lib/pickleball-state';

interface HistoryViewProps {
  events: GameEvent[];
  gameState: GameState;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function getEventIcon(type: GameEvent['type']): string {
  switch (type) {
    case 'point':
      return 'sports_tennis';
    case 'fault':
      return 'warning';
    case 'sideout':
      return 'swap_horiz';
    default:
      return 'circle';
  }
}

function getEventLabel(type: GameEvent['type']): string {
  switch (type) {
    case 'point':
      return 'Point Scored';
    case 'fault':
      return 'Fault';
    case 'sideout':
      return 'Side Out';
    default:
      return 'Event';
  }
}

export function HistoryView({ events, gameState }: HistoryViewProps) {
  const reversedEvents = [...events].reverse();

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <h3 className="font-lexend font-bold text-sm tracking-widest uppercase">
          Scoring History
        </h3>
        <div className="h-px grow" style={{ background: 'var(--kc-outline-dim)' }} />
        <span className="text-[10px]" style={{ color: 'var(--kc-text-dim)' }}>
          {events.length} events
        </span>
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div
          className="rounded-[32px] p-12 text-center"
          style={{ background: 'var(--kc-surface)' }}
        >
          <span
            className="material-symbols-outlined text-5xl mb-3"
            style={{ color: 'var(--kc-surface-bright)' }}
          >
            history
          </span>
          <h4 className="font-lexend font-bold text-lg mb-1" style={{ color: 'var(--kc-text-dim)' }}>
            No Events Yet
          </h4>
          <p className="text-sm" style={{ color: 'var(--kc-text-muted)' }}>
            Game events will appear here as the match progresses
          </p>
        </div>
      )}

      {/* Event Timeline */}
      <div className="space-y-3">
        {reversedEvents.map((event, index) => {
          const teamName = event.team === 'A' ? gameState.teams.A.name : gameState.teams.B.name;
          const isPoint = event.type === 'point';
          const isSideout = event.type === 'sideout';

          return (
            <div
              key={index}
              className="rounded-2xl p-4 flex items-center justify-between animate-slide-in-right"
              style={{
                background: isPoint ? 'var(--kc-surface-mid)' : 'rgba(0, 0, 0, 0.3)',
                borderLeft: `4px solid ${isPoint
                    ? 'var(--kc-accent-container)'
                    : isSideout
                      ? 'var(--kc-secondary-text)'
                      : 'var(--kc-surface-highest)'
                  }`,
                animationDelay: `${index * 0.03}s`,
              }}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--kc-surface-high)' }}
                >
                  <span
                    className={`material-symbols-outlined ${isPoint ? 'filled' : ''}`}
                    style={{
                      color: isPoint ? 'var(--kc-accent)' : 'var(--kc-text-dim)',
                      fontVariationSettings: isPoint ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {getEventIcon(event.type)}
                  </span>
                </div>

                {/* Event Info */}
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--kc-text)' }}>
                    {getEventLabel(event.type)} — {teamName}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--kc-text-dim)' }}>
                    {event.type === 'point'
                      ? `Server ${event.serverAfter.serverNumber} scored`
                      : event.type === 'sideout'
                        ? 'Serve transferred to other team'
                        : `Server ${event.serverAfter.serverNumber} next`}
                  </p>
                </div>
              </div>

              {/* Score at this point */}
              <div className="text-right">
                <p className="text-lg font-lexend font-black tracking-tighter" style={{ color: 'var(--kc-text)' }}>
                  {String(event.scoreAfter.A).padStart(2, '0')} - {String(event.scoreAfter.B).padStart(2, '0')}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--kc-text-dim)' }}>
                  {formatTime(event.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
