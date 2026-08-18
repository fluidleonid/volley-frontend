import React from 'react';
import { useTranslation } from 'react-i18next';
import { BottomSheet } from '../../shared/ui/BottomSheet';
import { Rotate3D, Shield, Sword } from 'lucide-react';
import { SelectionList } from '../../shared/ui/SelectionList';

export interface TeamPlacementSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selected: 'any' | 'teammates' | 'rivals';
  onSelect: (value: 'any' | 'teammates' | 'rivals') => void;
}

export const TeamPlacementSheet: React.FC<TeamPlacementSheetProps> = ({
  isOpen,
  onClose,
  selected,
  onSelect
}) => {
  const { t } = useTranslation();

  const options = [
    {
      value: 'any',
      label: t('party.any', 'Any'),
      description: t('party.anyDesc', 'Play with anyone in the lobby'),
      icon: <Rotate3D className="h-5 w-5" />
    },
    {
      value: 'teammates',
      label: t('party.teammates', 'Teammates'),
      description: t('party.teammatesDesc', 'Prioritize playing on the same team'),
      icon: <Shield className="h-5 w-5" />
    },
    {
      value: 'rivals',
      label: t('party.rivals', 'Rivals'),
      description: t('party.rivalsDesc', 'Prioritize playing against each other'),
      icon: <Sword className="h-5 w-5" />
    }
  ] as const;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t('party.teamPlacement', 'Team placement')}
    >
      <div className="pb-8 pt-2">
        <SelectionList
          options={options}
          value={selected}
          onChange={(val) => {
            onSelect(val as 'any' | 'teammates' | 'rivals');
            onClose();
          }}
        />
      </div>
    </BottomSheet>
  );
};
