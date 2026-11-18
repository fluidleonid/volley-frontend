import React, { useState } from 'react';
import { BottomSheet } from '../../shared/ui/BottomSheet';
import { useTranslation } from 'react-i18next';
import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/Input';
import { SegmentedControl } from '../../shared/ui/SegmentedControl';
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
  title,
  subtitle,
  requireLevel = false,
  onAddGuest,
  hasParent,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [level, setLevel] = useState('Beginner');

  const resolvedTitle = title || t('coach.players.addGuestPlayer', 'Add guest');
  const resolvedSubtitle = subtitle || t('coach.players.checkInGuest', 'Check in guest for session');

  React.useEffect(() => {
    if (!isOpen) {
      setName('');
      setLevel('Beginner');
    }
  }, [isOpen]);

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
        {resolvedTitle}
      </h3>
      <p className="font-sans text-xs text-muted-foreground font-normal">
        {resolvedSubtitle}
      </p>
    </div>
  );

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={titleNode} zIndex={170} hasParent={hasParent}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            label={t('coach.players.guestName', 'Guest name*')}
            placeholder={t('coach.players.enterGuestName', 'Enter guest name')}
            icon={<HatGlasses className="h-5 w-5" />}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {requireLevel && (
            <SegmentedControl
              options={levels.map((lvl) => ({
                value: lvl,
                label: t(`levels.${lvl.toLowerCase()}`, lvl),
              }))}
              value={level}
              onChange={(val) => setLevel(val as string)}
            />
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
