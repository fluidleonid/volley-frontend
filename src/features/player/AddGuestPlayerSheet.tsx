import React, { useState } from 'react';
import { BottomSheet } from '../../shared/ui/BottomSheet';
import { useTranslation } from 'react-i18next';
import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/Input';
import { HatGlasses } from 'lucide-react';

interface AddGuestPlayerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  requireLevel?: boolean;
  onAddGuest: (data: { name: string; level?: string }) => void;
  hasParent?: boolean;
}

const levels = ['Beginner', 'Amateur', 'Advanced', 'Pro'];

export const AddGuestPlayerSheet: React.FC<AddGuestPlayerSheetProps> = ({
  isOpen,
  onClose,
  title = 'Add a guest player',
  subtitle = 'Add guest for a session',
  requireLevel = false,
  onAddGuest,
  hasParent,
}) => {
  const { t } = useTranslation();
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
      <p className="font-sans text-xs text-muted-foreground font-normal">
        {subtitle}
      </p>
    </div>
  );

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={titleNode} zIndex={170} hasParent={hasParent}>
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        <div className="space-y-4">
          <Input
            label={t('coach.players.guestName', 'Guest name*')}
            placeholder={t('coach.players.enterGuestName', 'Enter guest name')}
            icon={<HatGlasses className="h-5 w-5" />}
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
                  className={`flex-1 h-[52px] rounded-full text-base font-medium transition-all ${
                    level === lvl
                      ? 'border border-primary text-white'
                      : 'bg-card text-muted-foreground hover:text-white border border-transparent'
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
          size="xl"
          disabled={!name.trim()}
        >
          {t('coach.players.addGuest', 'Add guest')}
        </Button>
      </form>
    </BottomSheet>
  );
};
