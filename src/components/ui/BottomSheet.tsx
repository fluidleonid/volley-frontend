import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft } from 'lucide-react';

export interface SheetContextType {
  depth: number;
  closeAll: () => void;
}

export const SheetContext = createContext<SheetContextType>({
  depth: 0,
  closeAll: () => {},
});

// Global ref counter for body scroll lock across all active sheets
let globalActiveSheetsCount = 0;

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseAll?: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  zIndex?: number;
  hasParent?: boolean;
  className?: string;
  topOffset?: number;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  onCloseAll,
  title,
  children,
  zIndex = 100,
  hasParent: explicitHasParent,
  className = '',
  topOffset,
}) => {
  const parentContext = useContext(SheetContext);
  const depth = parentContext.depth + 1;
  const isNested = explicitHasParent ?? (parentContext.depth > 0);

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when any sheet is open
  useEffect(() => {
    if (!isOpen) return;

    globalActiveSheetsCount += 1;
    document.body.style.overflow = 'hidden';

    return () => {
      globalActiveSheetsCount = Math.max(0, globalActiveSheetsCount - 1);
      if (globalActiveSheetsCount === 0) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCloseAll = () => {
    if (onCloseAll) {
      onCloseAll();
    } else if (parentContext.closeAll && parentContext.depth > 0) {
      parentContext.closeAll();
    } else {
      onClose();
    }
  };

  // Drag down gestures on top handle pill and header
  const handlePointerDown = (e: React.PointerEvent | React.TouchEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.PointerEvent).clientY;
    startYRef.current = clientY;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent | React.TouchEvent) => {
    if (!isDragging || startYRef.current === null) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.PointerEvent).clientY;
    const delta = clientY - startYRef.current;
    if (delta > 0) {
      setDragY(delta);
    } else {
      setDragY(0);
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    startYRef.current = null;
    if (dragY > 80) {
      onClose();
    }
    setDragY(0);
  };

  const currentContextValue: SheetContextType = {
    depth,
    closeAll: handleCloseAll,
  };

  return createPortal(
    <SheetContext.Provider value={currentContextValue}>
      <div
        className="fixed inset-0 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 !mt-0"
        style={{ zIndex }}
      >
        {/* Backdrop overlay */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Sheet Content Container */}
        <div
          ref={sheetRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          style={{
            transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            ...(topOffset ? { height: `calc(100vh - ${topOffset}px)`, maxHeight: `calc(100vh - ${topOffset}px)` } : {}),
          }}
          className={`relative w-full max-w-[480px] rounded-t-[32px] bg-[#121212] border-t border-[#2C2C2E]/60 px-4 pt-6 overflow-hidden ${topOffset ? 'pb-0 flex flex-col' : 'pb-8'} text-white shadow-2xl z-10 animate-in slide-in-from-bottom duration-300 ${className}`}
        >
          {/* Top Handle Pill Bar at exactly 8px from top (4px height, pixel-perfect centered, 6px top/bottom padding) */}
          <div className="absolute top-[8px] inset-x-0 flex justify-center items-center z-20 pointer-events-none">
            <div
              onPointerDown={handlePointerDown}
              onTouchStart={handlePointerDown}
              className="py-[6px] px-6 -my-[6px] cursor-grab active:cursor-grabbing pointer-events-auto flex items-center justify-center"
              title="Drag down to dismiss"
            >
              <div className="w-9 h-[4px] rounded-full bg-[#3A3A3C] hover:bg-[#505054] transition-colors" />
            </div>
          </div>

          {/* Header Row (Fixed 44px height, matching page headers exactly) */}
          {title !== undefined && (
            <div
              onPointerDown={handlePointerDown}
              onTouchStart={handlePointerDown}
              className="relative z-20 flex h-[44px] items-center justify-center pt-0 mb-[20px] cursor-grab active:cursor-grabbing select-none shrink-0"
            >
              {/* Back Button (Chevron Left) - Shown if nested / opened from another sheet */}
              {isNested && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="absolute left-0 flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#1C1C1E] text-white transition-colors hover:bg-[#242426] cursor-pointer active:scale-95"
                  title="Back to previous sheet"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}

              {/* Sheet Title */}
              {typeof title === 'string' ? (
                <h3 className="font-display text-lg font-bold text-white tracking-tight">
                  {title}
                </h3>
              ) : (
                title
              )}

              {/* Close Button ('X') - Closes ALL sheets */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseAll();
                }}
                className="absolute right-0 flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#1C1C1E] text-white transition-colors hover:bg-[#242426] cursor-pointer active:scale-95"
                title="Close all sheets"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {children}
        </div>
      </div>
    </SheetContext.Provider>,
    document.body
  );
};
