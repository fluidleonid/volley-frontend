import React from 'react';
import { PageHeader } from './PageHeader';
import { useScroll } from '../../hooks/useScroll';

interface StickyPageHeaderProps {
  title: string;
  onBack?: () => void;
  onClose?: () => void;
}

export const StickyPageHeader: React.FC<StickyPageHeaderProps> = ({
  title,
  onBack,
  onClose,
}) => {
  const scrolled = useScroll();
  return (
    <div className={`sticky top-0 z-40 -mx-4 px-4 pt-[84px] pb-5 transition-all duration-300 ${
      scrolled ? 'bg-[#121212]/80 backdrop-blur-md' : 'bg-[#121212]'
    }`}>
      <PageHeader title={title} onBack={onBack} onClose={onClose} />
    </div>
  );
};
