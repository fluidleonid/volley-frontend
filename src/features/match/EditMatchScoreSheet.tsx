import React, { useState, useEffect } from 'react';
import { BottomSheet } from '../../shared/ui/BottomSheet';
import { useTranslation } from 'react-i18next';
import { Player } from '../../shared/types/index';
import { Button } from '../../shared/ui/button';
import { AvatarGroup } from '../../shared/ui/AvatarGroup';

interface EditMatchScoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseAll?: () => void;
  hasParent?: boolean;
  onSave?: (scoreA: number, scoreB: number) => void;
  teamA: Player[];
  teamB: Player[];
  initialScoreA?: number;
  initialScoreB?: number;
}

export const EditMatchScoreSheet: React.FC<EditMatchScoreSheetProps> = ({ 
  isOpen, 
  onClose, 
  onCloseAll,
  hasParent,
  onSave,
  teamA,
  teamB,
  initialScoreA,
  initialScoreB
}) => {
  const { t } = useTranslation();
  const [scoreA, setScoreA] = useState(initialScoreA?.toString() || '');
  const [scoreB, setScoreB] = useState(initialScoreB?.toString() || '');

  useEffect(() => {
    if (isOpen) {
      setScoreA(initialScoreA?.toString() || '');
      setScoreB(initialScoreB?.toString() || '');
    }
  }, [isOpen, initialScoreA, initialScoreB]);

  const handleSave = () => {
    if (onSave) {
      onSave(parseInt(scoreA) || 0, parseInt(scoreB) || 0);
    }
    onClose();
  };

  return (
    <BottomSheet 
      isOpen={isOpen} 
      onClose={onClose} 
      onCloseAll={onCloseAll}
      hasParent={hasParent}
      title={t('match.enterScore', 'Enter score')} 
      zIndex={200}
    >
      <div className="flex flex-col gap-10 pt-6 pb-8 bg-background px-4">
        
        <div className="flex items-center justify-center gap-[20px]">
          {/* Team A Column */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <AvatarGroup players={teamA} size="lg" stacked={true} hasBorder={false} ringColor="ring-background" />
            <input 
              type="number" 
              className="w-full max-w-[120px] h-14 text-center text-xl font-display font-extrabold rounded-full bg-card border-none text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/30"
              value={scoreA}
              onChange={(e) => setScoreA(e.target.value)}
              placeholder="0"
            />
          </div>

          {/* VS */}
          <div className="flex flex-col items-center justify-center pb-20">
            <span className="font-display font-extrabold text-muted-foreground text-xl">vs</span>
          </div>

          {/* Team B Column */}
          <div className="flex flex-col items-center gap-3 flex-1">
            <AvatarGroup players={teamB} size="lg" stacked={true} hasBorder={false} ringColor="ring-background" />
            <input 
              type="number" 
              className="w-full max-w-[120px] h-14 text-center text-xl font-display font-extrabold rounded-full bg-card border-none text-white focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/30"
              value={scoreB}
              onChange={(e) => setScoreB(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <Button size="xl" fullWidth onClick={handleSave}>
          {t('common.submit', 'Submit')}
        </Button>
      </div>
    </BottomSheet>
  );
};
