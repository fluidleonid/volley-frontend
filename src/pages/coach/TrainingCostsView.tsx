import React, { useState } from 'react';
import { useAppStore } from '../../app/store/appStore';
import { Header } from '../../widgets/layout/Header';
import { Input } from '../../shared/ui/Input';

interface TrainingCostsViewProps {
  onClose: () => void;
}

export const TrainingCostsView: React.FC<TrainingCostsViewProps> = ({ onClose }) => {
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
      <Header variant="page" sticky stickyClassName="-mx-4 px-4" title="Training costs" onBack={onClose} />
      
      <div className="flex-1 overflow-y-auto py-6">
        <div className="space-y-6">
          <Input
            label="Public training cost (֏)"
            type="number"
            value={publicCost}
            onChange={(e) => setPublicCost(e.target.value)}
            placeholder="e.g. 4000"
          />

          <Input
            label="Private training cost (֏)"
            type="number"
            value={privateCost}
            onChange={(e) => setPrivateCost(e.target.value)}
            placeholder="e.g. 10000"
          />
        </div>
      </div>
      <div className="sticky bottom-0 z-40 py-8 bg-background/80 backdrop-blur-md border-t border-border/60 -mx-4 px-4 mt-auto">
        <button
          onClick={handleSave}
          className="w-full h-[56px] rounded-full bg-primary text-primary-foreground font-bold text-lg active:scale-95 transition-all hover:bg-primary/90"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
