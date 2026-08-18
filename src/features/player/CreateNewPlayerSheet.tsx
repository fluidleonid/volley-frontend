import React, { useState } from 'react';
import { BottomSheet } from '../../shared/ui/BottomSheet';
import { useTranslation } from 'react-i18next';
import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/Input';

interface CreateNewPlayerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlayer: (data: { name: string; phone: string; level: string }) => void;
  hasParent?: boolean;
}

const levels = ['Beginner', 'Amateur', 'Advanced', 'Pro'];

export const CreateNewPlayerSheet: React.FC<CreateNewPlayerSheetProps> = ({
  isOpen,
  onClose,
  onCreatePlayer,
  hasParent,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [level, setLevel] = useState('Beginner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreatePlayer({ name: name.trim(), phone: phone.trim(), level });
      setName('');
      setPhone('');
      setLevel('Beginner');
    }
  };

  const titleNode = (
    <div className="text-center space-y-0.5">
      <h3 className="font-display text-lg font-bold text-white tracking-tight">
        {t('coach.players.createNewPlayer', 'Create a new player')}
      </h3>
      <p className="font-sans text-xs text-muted-foreground font-normal">
        {t('coach.players.addDetailsForDB', 'Add details for club database')}
      </p>
    </div>
  );

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={titleNode} zIndex={170} hasParent={hasParent}>
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        <div className="space-y-4">
          <Input
            label={t('coach.players.playerName', 'Player name*')}
            placeholder={t('coach.players.enterPlayerName', 'Enter player name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          <Input
            type="tel"
            label={t('common.phone', 'Phone')}
            placeholder={t('coach.players.enterPhone', 'Enter phone number')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />



          {/* Level Selector */}
          <div className="flex gap-2 justify-between">
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
                {t(`levels.${lvl.toLowerCase()}`, lvl)}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          size="xl"
          disabled={!name.trim()}
        >
          {t('coach.players.addPlayer', 'Add player')}
        </Button>
      </form>
    </BottomSheet>
  );
};
