import React, { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { Button } from './button';
import { Input } from './Input';

interface CreateNewPlayerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlayer: (data: { name: string; phone: string; username: string; level: string }) => void;
}

const levels = ['Beginner', 'Amateur', 'Advanced', 'Pro'];

export const CreateNewPlayerSheet: React.FC<CreateNewPlayerSheetProps> = ({
  isOpen,
  onClose,
  onCreatePlayer,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [level, setLevel] = useState('Beginner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreatePlayer({ name: name.trim(), phone: phone.trim(), username: username.trim(), level });
      setName('');
      setPhone('');
      setUsername('');
      setLevel('Beginner');
    }
  };

  const titleNode = (
    <div className="text-center space-y-0.5">
      <h3 className="font-display text-lg font-bold text-white tracking-tight">
        Create a new player
      </h3>
      <p className="font-sans text-xs text-[#8E8E93] font-normal">
        Add details for club database
      </p>
    </div>
  );

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={titleNode} zIndex={170} topOffset={120}>
      <form onSubmit={handleSubmit} className="p-4 space-y-6 pt-2">
        <div className="space-y-4">
          <Input
            label="Player name*"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          <Input
            type="tel"
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            label="@username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Level Selector */}
          <div className="flex gap-2 justify-between">
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
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={!name.trim()}
        >
          Add player
        </Button>
      </form>
    </BottomSheet>
  );
};
