import React, { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { Button } from './button';
import { Input } from './Input';
import { Box } from 'lucide-react';

interface AddGuestPlayerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  requireLevel?: boolean;
  onAddGuest: (data: { name: string; level?: string }) => void;
}

const levels = ['Beginner', 'Amateur', 'Advanced', 'Pro'];

export const AddGuestPlayerSheet: React.FC<AddGuestPlayerSheetProps> = ({
  isOpen,
  onClose,
  title = 'Add a guest player',
  subtitle = 'Add guest for a session',
  requireLevel = false,
  onAddGuest,
}) => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('Beginner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddGuest({ name: name.trim(), level: requireLevel ? level : undefined });
      setName('');
      setLevel('Beginner');
    }
  };

  const titleNode = (
    <div className="text-center space-y-0.5">
      <h3 className="font-display text-lg font-bold text-white tracking-tight">
        {title}
      </h3>
      <p className="font-sans text-xs text-[#8E8E93] font-normal">
        {subtitle}
      </p>
    </div>
  );

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={titleNode} zIndex={170} topOffset={120}>
      <form onSubmit={handleSubmit} className="p-4 space-y-6 pt-2">
        <div className="space-y-4">
          <Input
            label="Guest name*"
            icon={<Box className="h-5 w-5" />}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          {requireLevel && (
            <div className="flex gap-2 justify-between mt-2">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`flex-1 h-[36px] rounded-full text-xs font-medium transition-all ${
                    level === lvl
                      ? 'border border-[#68BD44] text-white'
                      : 'bg-[#1C1C1E] text-[#8E8E93] hover:text-white border border-transparent'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={!name.trim()}
        >
          Add guest
        </Button>
      </form>
    </BottomSheet>
  );
};
