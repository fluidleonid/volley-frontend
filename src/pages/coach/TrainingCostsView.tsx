import React, { useState } from 'react';
import { useAppStore } from '../../app/store/appStore';
import { useTranslation } from 'react-i18next';
import { Header } from '../../widgets/layout/Header';
import { Input } from '../../shared/ui/Input';

interface TrainingCostsViewProps {
  onClose: () => void;
}

export const TrainingCostsView: React.FC<TrainingCostsViewProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const { trainingCosts, setTrainingCosts } = useAppStore();
  const [publicCost, setPublicCost] = useState(trainingCosts.public.toString());
  const [privateCost, setPrivateCost] = useState(trainingCosts.private.toString());

  const handleSave = () => {
    setTrainingCosts({
      public: parseInt(publicCost, 10) || 0,
      private: parseInt(privateCost, 10) || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-right-full duration-300 max-w-[480px] mx-auto px-4">
      <Header variant="page" sticky stickyClassName="-mx-4 px-4" title={t('profile.trainingCosts', 'Training costs')} onBack={onClose} />
      
      <div className="flex-1 overflow-y-auto py-6">
        <div className="space-y-6">
          <Input
            label={t('coach.costs.publicCost', 'Public training cost (֏)')}
            type="number"
            value={publicCost}
            onChange={(e) => setPublicCost(e.target.value)}
            placeholder={t('coach.costs.examplePublic', 'e.g. 4000')}
          />

          <Input
            label={t('coach.costs.privateCost', 'Private training cost (֏)')}
            type="number"
            value={privateCost}
            onChange={(e) => setPrivateCost(e.target.value)}
            placeholder={t('coach.costs.examplePrivate', 'e.g. 10000')}
          />
        </div>
      </div>
      <div className="sticky bottom-0 z-40 py-8 bg-background/80 backdrop-blur-md -mx-4 px-4 mt-auto">
        <button
          onClick={handleSave}
          className="w-full h-[56px] rounded-full bg-primary text-primary-foreground font-bold text-lg active:scale-95 transition-all hover:bg-primary/90"
        >
          {t('common.saveChanges', 'Save Changes')}
        </button>
      </div>
    </div>
  );
};
