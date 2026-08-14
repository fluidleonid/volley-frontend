import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Header } from '../../widgets/layout/Header';

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
  footer?: React.ReactNode;
  isScrollable?: boolean;
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
  footer,
  isScrollable,
  zIndex = 100,
  hasParent: explicitHasParent,
  className = '',
  topOffset,
}) => {
  const parentContext = useContext(SheetContext);
  const depth = parentContext.depth + 1;
  const isNested = explicitHasParent ?? (parentContext.depth > 0);

  const computedZIndex = zIndex !== 100 ? zIndex : 100 + (depth * 10);

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
        style={{ zIndex: computedZIndex }}
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
            ...(isScrollable && !topOffset ? { maxHeight: '90vh' } : {}),
          }}
          className={`relative w-full max-w-[480px] rounded-t-[32px] bg-background border-t border-border/60 px-4 pt-4 overflow-hidden ${(topOffset || isScrollable) ? 'pb-0 flex flex-col' : 'pb-8'} text-white shadow-2xl z-10 animate-in slide-in-from-bottom duration-300 ${className}`}
        >
          {/* Top Handle Pill Bar at exactly 8px from top (4px height, pixel-perfect centered, 6px top/bottom padding) */}
          <div className="absolute top-[8px] inset-x-0 flex justify-center items-center z-20 pointer-events-none">
            <div
              onPointerDown={handlePointerDown}
              onTouchStart={handlePointerDown}
              className="py-[6px] px-6 -my-[6px] cursor-grab active:cursor-grabbing pointer-events-auto flex items-center justify-center"
              title="Drag down to dismiss"
            >
              <div className="w-9 h-[4px] rounded-full bg-secondary/80 hover:bg-[#505054] transition-colors" />
            </div>
          </div>

          {title !== undefined && (
            <Header
              variant="page"
              title={title}
              onBack={isNested ? onClose : undefined}
              onClose={handleCloseAll}
              forceClose={true}
              titleAs="h3"
              onDragHandle={(e) => {
                e.stopPropagation();
                handlePointerDown(e);
              }}
              className="mb-[20px] z-20 shrink-0"
            />
          )}

          <div className="relative flex-1 min-h-0 flex flex-col w-full">
            {isScrollable ? (
              <div className={`flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-none ${footer ? 'pb-36' : 'pb-8'}`}>
                {children}
              </div>
            ) : (
              children
            )}

            {footer && (
              <>
                <div className="absolute bottom-0 inset-x-0 h-[100px] z-[155] pointer-events-none">
                  <div
                    className="w-full h-full bg-gradient-to-t from-background via-background/85 to-transparent backdrop-blur-md"
                    style={{
                      WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)',
                      maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)',
                    }}
                  />
                </div>
                <div className="absolute bottom-[48px] inset-x-0 px-4 z-[160] pointer-events-none">
                  <div className="w-full pointer-events-auto flex flex-col gap-3">
                    {footer}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </SheetContext.Provider>,
    document.body
  );
};
