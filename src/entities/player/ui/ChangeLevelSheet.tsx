import React, { useState } from 'react';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared/ui/button';
import { Dialog } from '../../../shared/ui/Dialog';
import { Check } from 'lucide-react';
import { Player } from '../../../shared/types/index';
import { skillLevels } from '../../../pages/common/OnboardingView';

interface ChangeLevelSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseAll?: () => void;
  player: Player | null;
  hasParent?: boolean;
}

export const ChangeLevelSheet: React.FC<ChangeLevelSheetProps> = ({
  isOpen,
  onClose,
  player,
  hasParent = false,
}) => {
  const { t } = useTranslation();
  const [selectedLevelId, setSelectedLevelId] = useState<string>('beginner');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // When sheet opens, ideally we'd set selectedLevelId based on player's current tier
  // but since we only have numeric level, we can just default to beginner or infer it.
  // We'll leave it as default or let the coach just select.

  const handleChangeClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    // In a real app, update player.level to the minimum level of the selected tier
    // and reset XP to 0.
    console.log(`Resetting ${player?.name} to tier ${selectedLevelId}`);
    setIsConfirmOpen(false);
    onClose();
  };

  if (!player) return null;

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose} title={t('coach.players.changeLevel', 'Change Level')} hasParent={hasParent} zIndex={150}>
        <div className="flex flex-col h-full mt-4">
          <div className="space-y-2.5 w-full mb-8">
            {skillLevels.map((level) => {
              const isSelected = selectedLevelId === level.id;

              return (
                <div
                  key={level.id}
                  onClick={() => setSelectedLevelId(level.id)}
                  className={`group flex h-[52px] cursor-pointer items-center justify-between rounded-[12px] px-4 transition-all duration-200 active:scale-[0.99] ${
                    isSelected
                      ? 'bg-card border border-primary'
                      : 'bg-card/70 hover:bg-card border border-transparent'
                  }`}
                >
                  <div>
                    <div className="text-base font-semibold text-white leading-snug">
                      {t(`onboarding.levels.${level.id}.title`, level.title)}
                    </div>
                    <div className="text-xs font-normal text-muted-foreground">
                      {level.id === 'beginner' ? t('coach.players.levelSubtitles.beginner', 'Wants to learn') : 
                       level.id === 'amateur' ? t('coach.players.levelSubtitles.amateur', 'Plays for fun') : 
                       level.id === 'advanced' ? t('coach.players.levelSubtitles.advanced', 'Plays to win') : 
                       level.id === 'pro' ? t('coach.players.levelSubtitles.pro', 'Lives for this game') : 
                       level.subtitle}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-black font-bold shadow-md">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-auto w-full pb-8">
            <Button fullWidth size="xl" onClick={handleChangeClick}>
              {t('common.change', 'Change')}
            </Button>
          </div>
        </div>
      </BottomSheet>

      <Dialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title={t('common.areYouSure', 'Are you sure?')}
        description={t('coach.players.xpResetDesc', 'XP will be reset to the initial level of this tier.')}
        primaryButtonText={t('coach.players.confirmChange', 'Confirm change')}
        primaryButtonOnClick={handleConfirm}
        secondaryButtonText={t('common.cancel', 'Cancel')}
        secondaryButtonOnClick={() => setIsConfirmOpen(false)}
      />
    </>
  );
};
