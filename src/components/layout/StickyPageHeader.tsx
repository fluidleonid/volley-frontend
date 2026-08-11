import React from 'react';
import { PageHeader } from './PageHeader';

interface StickyPageHeaderProps {
  title: string;
  onBack?: () => void;
  onClose?: () => void;
}

export const StickyPageHeader: React.FC<StickyPageHeaderProps> = ({
  title,
  onBack,
  onClose,
}) => (
  <div className="sticky top-0 z-40 bg-[#121212] pt-[84px] pb-5 -mx-4 px-4">
    <PageHeader title={title} onBack={onBack} onClose={onClose} />
  </div>
);
