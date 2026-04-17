'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Player, MatchMode } from '@/lib/pickleball-state';

interface PlayerSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamAName: string;
  teamBName: string;
  teamAPlayers: [Player, Player];
  teamBPlayers: [Player, Player];
  currentMatchMode: MatchMode;
  onSave: (
    teamAName: string,
    teamBName: string,
    teamAPlayers: [Player, Player],
    teamBPlayers: [Player, Player],
    matchMode: MatchMode
  ) => void;
}

export function PlayerSetupModal({
  open,
  onOpenChange,
  teamAName,
  teamBName,
  teamAPlayers,
  teamBPlayers,
  currentMatchMode,
  onSave,
}: PlayerSetupProps) {
  const [formData, setFormData] = useState({
    teamAName,
    teamBName,
    teamA1Name: teamAPlayers[0].name,
    teamA2Name: teamAPlayers[1].name,
    teamB1Name: teamBPlayers[0].name,
    teamB2Name: teamBPlayers[1].name,
    teamA1Photo: teamAPlayers[0].photo || '',
    teamA2Photo: teamAPlayers[1].photo || '',
    teamB1Photo: teamBPlayers[0].photo || '',
    teamB2Photo: teamBPlayers[1].photo || '',
    matchMode: currentMatchMode,
  });

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setFormData((prev) => ({
            ...prev,
            [field]: dataUrl,
          }));
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const teamAPlayers: [Player, Player] = [
      { name: formData.teamA1Name, photo: formData.teamA1Photo || undefined },
      { name: formData.teamA2Name, photo: formData.teamA2Photo || undefined },
    ];

    const teamBPlayers: [Player, Player] = [
      { name: formData.teamB1Name, photo: formData.teamB1Photo || undefined },
      { name: formData.teamB2Name, photo: formData.teamB2Photo || undefined },
    ];

    onSave(formData.teamAName, formData.teamBName, teamAPlayers, teamBPlayers, formData.matchMode);
    onOpenChange(false);
  };

  const inputStyle: React.CSSProperties = {
    background: 'var(--kc-surface-highest)',
    color: 'var(--kc-text)',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 16px',
    width: '100%',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
  };

  const teams = [
    {
      label: 'TEAM 1',
      nameField: 'teamAName' as const,
      accentColor: 'var(--kc-accent)',
      players: [
        { key: 'teamA1', label: 'Player 1 (Left)', nameField: 'teamA1Name', photoField: 'teamA1Photo' },
        { key: 'teamA2', label: 'Player 2 (Right)', nameField: 'teamA2Name', photoField: 'teamA2Photo' },
      ],
    },
    {
      label: 'TEAM 2',
      nameField: 'teamBName' as const,
      accentColor: 'var(--kc-secondary-text)',
      players: [
        { key: 'teamB1', label: 'Player 1 (Left)', nameField: 'teamB1Name', photoField: 'teamB1Photo' },
        { key: 'teamB2', label: 'Player 2 (Right)', nameField: 'teamB2Name', photoField: 'teamB2Photo' },
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: 'var(--kc-surface-mid)',
          border: 'none',
          borderRadius: '32px',
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="font-lexend font-bold text-xl uppercase tracking-widest"
            style={{ color: 'var(--kc-text)' }}
          >
            Match Setup
          </DialogTitle>
          <DialogDescription
            className="text-sm"
            style={{ color: 'var(--kc-text-dim)' }}
          >
            Configure team names, player names, and photos for this match.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 mt-4">
          {/* Match Mode Selector */}
          <div className="space-y-4">
            <span
              className="font-lexend text-[10px] uppercase tracking-widest font-bold"
              style={{ color: 'var(--kc-text-dim)' }}
            >
              Match Settings
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'casual', label: 'Casual', desc: '1 game to 11' },
                { id: 'standard', label: 'Standard', desc: 'Best of 3 to 11' },
                { id: 'long', label: 'Long', desc: 'Best of 5 to 11' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setFormData((prev) => ({ ...prev, matchMode: mode.id as MatchMode }))}
                  className={`p-4 rounded-xl text-left transition-all border-2 ${formData.matchMode === mode.id
                      ? 'border-kc-accent bg-kc-surface-high'
                      : 'border-transparent bg-kc-surface-high opacity-70 hover:opacity-100'
                    }`}
                >
                  <div className={`font-lexend font-bold text-sm ${formData.matchMode === mode.id ? 'text-kc-accent' : 'text-kc-text'}`}>
                    {mode.label}
                  </div>
                  <div className="font-inter text-xs mt-1 text-kc-text-dim">
                    {mode.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {teams.map((team) => (
            <div key={team.label} className="space-y-4">
              {/* Team Label */}
              <span
                className="font-lexend text-[10px] uppercase tracking-widest font-bold"
                style={{ color: team.accentColor }}
              >
                {team.label}
              </span>

              {/* Team Name */}
              <div>
                <label
                  className="block text-[10px] font-inter font-bold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--kc-text-dim)' }}
                >
                  Team Name
                </label>
                <input
                  value={formData[team.nameField]}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [team.nameField]: e.target.value }))
                  }
                  onFocus={(e) => e.target.select()}
                  placeholder="Enter team name"
                  style={inputStyle}
                />
              </div>

              {/* Players */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.players.map(({ key, label, nameField, photoField }) => (
                  <div
                    key={key}
                    className="rounded-2xl p-4 space-y-3"
                    style={{ background: 'var(--kc-surface-high)' }}
                  >
                    <label
                      className="block text-[10px] font-inter font-bold uppercase tracking-widest"
                      style={{ color: 'var(--kc-text-dim)' }}
                    >
                      {label}
                    </label>
                    <input
                      value={formData[nameField as keyof typeof formData] as string}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, [nameField]: e.target.value }))
                      }
                      placeholder="Player name"
                      style={inputStyle}
                    />
                    <div className="space-y-2">
                      <label
                        className="block text-[10px] font-inter uppercase tracking-widest"
                        style={{ color: 'var(--kc-text-muted)' }}
                      >
                        Photo
                      </label>
                      {formData[photoField as keyof typeof formData] && (
                        <img
                          src={formData[photoField as keyof typeof formData] as string}
                          alt={label}
                          className="w-full h-32 object-cover rounded-xl"
                        />
                      )}
                      <label
                        className="flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer transition-colors"
                        style={{
                          background: 'var(--kc-surface-highest)',
                          color: 'var(--kc-text-dim)',
                          border: '1px dashed var(--kc-outline)',
                        }}
                      >
                        <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                        <span className="text-xs font-inter">Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, photoField)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="mt-8 gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="px-6 py-3 rounded-full font-inter font-semibold text-sm transition-all active:scale-95 cursor-pointer"
            style={{ background: 'var(--kc-surface-highest)', color: 'var(--kc-text-dim)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-full font-lexend font-bold text-sm uppercase tracking-widest kinetic-gradient transition-all active:scale-95 cursor-pointer"
            style={{ color: 'var(--kc-on-accent)' }}
          >
            Save Players
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
