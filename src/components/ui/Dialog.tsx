import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonOnClick: () => void;
  secondaryButtonText?: string;
  secondaryButtonOnClick?: () => void;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  primaryButtonText,
  primaryButtonOnClick,
  secondaryButtonText,
  secondaryButtonOnClick,
}) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      // Small delay to allow DOM render before triggering animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsRendered(false), 300); // match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-auto">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div
        className={`relative w-full max-w-[320px] bg-[#121212] border border-[#2C2C2E] rounded-3xl p-6 shadow-xl transition-all duration-300 transform ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <h2 className="text-xl font-bold text-white text-center mb-2">{title}</h2>
        <p className="text-[#8E8E93] text-sm text-center mb-6">{description}</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={primaryButtonOnClick}
            className="w-full h-[44px] rounded-full bg-[#1C1C1E] flex items-center justify-center text-[#FF453A] font-semibold hover:bg-[#2C2C2E] active:scale-95 transition-all"
          >
            {primaryButtonText}
          </button>
          
          {(secondaryButtonText && secondaryButtonOnClick) && (
            <button
              onClick={secondaryButtonOnClick}
              className="w-full h-[44px] rounded-full bg-[#1C1C1E] flex items-center justify-center text-white font-semibold hover:bg-[#2C2C2E] active:scale-95 transition-all"
            >
              {secondaryButtonText}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
