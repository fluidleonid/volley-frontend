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
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [visualHeight, setVisualHeight] = useState<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const baseHeightRef = useRef<number>(typeof window !== 'undefined' ? window.innerHeight : 800);
  const isInputFocusedRef = useRef<boolean>(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track visualViewport, Telegram.WebApp viewportChanged, and input focus to lift BottomSheet above keyboard
  useEffect(() => {
    if (!isOpen) {
      setKeyboardOffset(0);
      setVisualHeight(null);
      isInputFocusedRef.current = false;
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tg = (window as any).Telegram?.WebApp;
    const vv = window.visualViewport;

    baseHeightRef.current = Math.max(
      window.innerHeight,
      vv?.height || 0,
      tg?.viewportStableHeight || 0
    );

    const computeKeyboard = () => {
      const currentInner = window.innerHeight;
      const vvHeight = vv ? vv.height : currentInner;
      const vvTop = vv ? vv.offsetTop : 0;

      // 1. Standard visualViewport delta (iOS Safari / mobile browsers)
      const vvDiff = Math.max(0, currentInner - (vvHeight + vvTop));
      // 2. Telegram WebApp viewport delta
      const tgDiff =
        tg?.viewportStableHeight && tg?.viewportHeight
          ? Math.max(0, tg.viewportStableHeight - tg.viewportHeight)
          : 0;
      // 3. How much the layout viewport itself shrank
      const layoutShrank = Math.max(0, baseHeightRef.current - currentInner);

      const measuredKb = Math.max(vvDiff, tgDiff);

      if (measuredKb > 60) {
        const effectiveOffset = Math.max(0, measuredKb - layoutShrank);
        setKeyboardOffset(effectiveOffset);
        setVisualHeight(vvHeight);
      } else if (isInputFocusedRef.current && window.innerWidth <= 1024 && layoutShrank < 60) {
        // Fallback for Telegram iOS fullscreen WebView where neither innerHeight nor visualViewport shrinks on keyboard open
        const estimatedKb = Math.min(330, Math.round(baseHeightRef.current * 0.38));
        setKeyboardOffset(estimatedKb);
        setVisualHeight(baseHeightRef.current - estimatedKb);
      } else {
        setKeyboardOffset(0);
        setVisualHeight(vvHeight);
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        if (blurTimeoutRef.current) {
          clearTimeout(blurTimeoutRef.current);
          blurTimeoutRef.current = null;
        }
        isInputFocusedRef.current = true;
        computeKeyboard();
        setTimeout(computeKeyboard, 100);
        setTimeout(computeKeyboard, 300);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        blurTimeoutRef.current = setTimeout(() => {
          isInputFocusedRef.current = false;
          computeKeyboard();
        }, 120);
      }
    };

    const el = sheetRef.current;
    if (el) {
      el.addEventListener('focusin', handleFocusIn);
      el.addEventListener('focusout', handleFocusOut);
      const active = document.activeElement as HTMLElement | null;
      if (active && el.contains(active) && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
        isInputFocusedRef.current = true;
      }
    }

    computeKeyboard();
    vv?.addEventListener('resize', computeKeyboard);
    vv?.addEventListener('scroll', computeKeyboard);
    window.addEventListener('resize', computeKeyboard);
    try {
      tg?.onEvent?.('viewportChanged', computeKeyboard);
    } catch {
      // ignore
    }

    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      if (el) {
        el.removeEventListener('focusin', handleFocusIn);
        el.removeEventListener('focusout', handleFocusOut);
      }
      vv?.removeEventListener('resize', computeKeyboard);
      vv?.removeEventListener('scroll', computeKeyboard);
      window.removeEventListener('resize', computeKeyboard);
      try {
        tg?.offEvent?.('viewportChanged', computeKeyboard);
      } catch {
        // ignore
      }
    };
  }, [isOpen]);

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
      handleCloseAll();
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
        className="fixed inset-x-0 top-0 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 !mt-0"
        style={{
          zIndex: computedZIndex,
          bottom: keyboardOffset > 0 ? `${keyboardOffset}px` : '0px',
          transition: 'bottom 0.2s ease-out',
        }}
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
            top: dragY > 0 ? `${dragY}px` : '0px',
            transition: isDragging ? 'none' : 'top 0.2s ease-out, height 0.25s ease-out, max-height 0.25s ease-out',
            ...(topOffset
              ? {
                  height: visualHeight ? `${Math.max(260, visualHeight - topOffset)}px` : `calc(100dvh - ${topOffset}px)`,
                  maxHeight: visualHeight ? `${Math.max(260, visualHeight - topOffset)}px` : `calc(100dvh - ${topOffset}px)`,
                }
              : {
                  maxHeight: visualHeight ? `${Math.max(260, visualHeight - 16)}px` : '92dvh',
                }),
          }}
          className={`relative w-full max-w-[480px] rounded-t-[32px] bg-background border-t border-border/60 px-4 pt-4 ${(topOffset || isScrollable) ? 'pb-0 flex flex-col' : 'pb-8 overflow-y-auto'} text-white shadow-2xl z-10 animate-in slide-in-from-bottom duration-300 ${className}`}
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
              <div className={`flex-1 overflow-y-auto space-y-2 scrollbar-none ${footer ? 'pb-36' : 'pb-8'}`}>
                {children}
              </div>
            ) : (
              children
            )}

            {footer && (
              <>
                <div className="absolute bottom-0 -left-4 -right-4 h-40 z-[155] pointer-events-none isolate">
                <div
                  className="absolute inset-0 backdrop-blur-md"
                  style={{
                    WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)',
                    maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)',
                    transform: 'translateZ(0)',
                    willChange: 'backdrop-filter',
                  }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
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
