'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Player } from '@/lib/pickleball-state';

interface PlayerSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamAName: string;
  teamBName: string;
  teamAPlayers: [Player, Player];
  teamBPlayers: [Player, Player];
  onSave: (
    teamAName: string,
    teamBName: string,
    teamAPlayers: [Player, Player],
    teamBPlayers: [Player, Player]
  ) => void;
}

export function PlayerSetupModal({
  open,
  onOpenChange,
  teamAName,
  teamBName,
  teamAPlayers,
  teamBPlayers,
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
  });

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [field]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
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

    onSave(formData.teamAName, formData.teamBName, teamAPlayers, teamBPlayers);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Setup Game Players</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Team A Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Team A Name</label>
              <Input
                value={formData.teamAName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, teamAName: e.target.value }))
                }
                placeholder="Enter team name"
              />
            </div>

            {/* Team A Players */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'teamA1', label: 'Player 1 (Left)', nameField: 'teamA1Name', photoField: 'teamA1Photo' },
                { key: 'teamA2', label: 'Player 2 (Right)', nameField: 'teamA2Name', photoField: 'teamA2Photo' },
              ].map(({ key, label, nameField, photoField }) => (
                <div key={key} className="space-y-2 p-4 border rounded-lg">
                  <label className="block text-sm font-medium">{label}</label>
                  <Input
                    value={formData[nameField as keyof typeof formData] as string}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, [nameField]: e.target.value }))
                    }
                    placeholder="Player name"
                    className="mb-2"
                  />
                  <div className="space-y-2">
                    <label className="block text-xs text-muted-foreground">Photo</label>
                    {formData[photoField as keyof typeof formData] && (
                      <img
                        src={formData[photoField as keyof typeof formData] as string}
                        alt={label}
                        className="w-full h-32 object-cover rounded"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, photoField)}
                      className="block w-full text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team B Section */}
          <div className="space-y-4 border-t pt-6">
            <div>
              <label className="block text-sm font-medium mb-1">Team B Name</label>
              <Input
                value={formData.teamBName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, teamBName: e.target.value }))
                }
                placeholder="Enter team name"
              />
            </div>

            {/* Team B Players */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'teamB1', label: 'Player 1 (Left)', nameField: 'teamB1Name', photoField: 'teamB1Photo' },
                { key: 'teamB2', label: 'Player 2 (Right)', nameField: 'teamB2Name', photoField: 'teamB2Photo' },
              ].map(({ key, label, nameField, photoField }) => (
                <div key={key} className="space-y-2 p-4 border rounded-lg">
                  <label className="block text-sm font-medium">{label}</label>
                  <Input
                    value={formData[nameField as keyof typeof formData] as string}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, [nameField]: e.target.value }))
                    }
                    placeholder="Player name"
                    className="mb-2"
                  />
                  <div className="space-y-2">
                    <label className="block text-xs text-muted-foreground">Photo</label>
                    {formData[photoField as keyof typeof formData] && (
                      <img
                        src={formData[photoField as keyof typeof formData] as string}
                        alt={label}
                        className="w-full h-32 object-cover rounded"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, photoField)}
                      className="block w-full text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Players</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
