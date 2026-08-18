import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { Keyboard, Clock as ClockIcon, X } from 'lucide-react';

const CLOCK_RADIUS = 100;
const NUMBER_RADIUS = CLOCK_RADIUS - 24;

interface CustomTimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (timeStr: string) => void;
  initialTime?: string;
  title?: string;
}

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialTime = '12:00',
  title
}) => {
  const { t } = useTranslation();
  const defaultTitle = title || t('common.selectTime', 'Select time');
  const [selectedHour, setSelectedHour] = useState<number | string>(12);
  const [selectedMinute, setSelectedMinute] = useState<number | string>(0);
  const [isPM, setIsPM] = useState(false);
  const [activeTab, setActiveTab] = useState<'hour' | 'minute'>('hour');
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const clockRef = useRef<HTMLDivElement>(null);

  const [dragAngle, setDragAngle] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && initialTime) {
      const [hStr, mStr] = initialTime.split(':');
      let h = parseInt(hStr, 10);
      const m = parseInt(mStr, 10);
      setIsPM(h >= 12);
      if (h === 0) h = 12;
      else if (h > 12) h -= 12;
      setSelectedHour(h);
      setSelectedMinute(m);
      setActiveTab('hour');
      setIsKeyboardMode(false);
    }
  }, [isOpen, initialTime]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    let finalHour = Number(selectedHour);
    if (isNaN(finalHour) || finalHour < 0) finalHour = 0;
    if (finalHour > 12) finalHour = 12;
    
    if (isPM && finalHour < 12) finalHour += 12;
    if (!isPM && finalHour === 12) finalHour = 0;

    let finalMin = Number(selectedMinute);
    if (isNaN(finalMin) || finalMin < 0) finalMin = 0;
    if (finalMin > 59) finalMin = 59;
    const hStr = String(finalHour).padStart(2, '0');
    const mStr = String(finalMin).padStart(2, '0');
    onConfirm(`${hStr}:${mStr}`);
  };

  const angleFromEvent = (clientX: number, clientY: number): number => {
    if (!clockRef.current) return 0;
    const rect = clockRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    return angle;
  };

  const applyAngle = (angle: number, isDraggingPhase: boolean) => {
    if (isDraggingPhase) {
      setDragAngle(angle);
    } else {
      setDragAngle(null);
    }

    if (activeTab === 'hour') {
      const rawHour = Math.round(angle / 30) % 12 || 12;
      setSelectedHour(rawHour);
    } else {
      const rawMin = Math.round(angle / 6) % 60;
      setSelectedMinute(rawMin);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    clockRef.current?.setPointerCapture(e.pointerId);
    applyAngle(angleFromEvent(e.clientX, e.clientY), true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    applyAngle(angleFromEvent(e.clientX, e.clientY), true);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    applyAngle(angleFromEvent(e.clientX, e.clientY), false);
    if (activeTab === 'hour') {
      setTimeout(() => setActiveTab('minute'), 200);
    }
  };

  const renderClockFace = () => {
    const isHour = activeTab === 'hour';
    const items = Array.from({ length: 12 }, (_, i) => (isHour ? (i === 0 ? 12 : i) : i * 5));

    let activeValue = isHour ? Number(selectedHour) : Number(selectedMinute);
    if (isNaN(activeValue)) activeValue = isHour ? 12 : 0;

    let targetAngle = 0;
    if (isHour) {
      targetAngle = (activeValue % 12) * 30;
    } else {
      targetAngle = activeValue * 6;
    }

    const currentAngle = dragAngle !== null ? dragAngle : targetAngle;
    const theta = currentAngle * (Math.PI / 180);
    const selectorCx = 116 + Math.sin(theta) * NUMBER_RADIUS;
    const selectorCy = 116 - Math.cos(theta) * NUMBER_RADIUS;

    const renderNumbers = (color: string) => items.map((num, i) => {
      const numTheta = (i * 30) * (Math.PI / 180);
      const x = Math.sin(numTheta) * NUMBER_RADIUS;
      const y = -Math.cos(numTheta) * NUMBER_RADIUS;

      return (
        <span
          key={num}
          className="absolute w-10 h-10 flex items-center justify-center text-sm font-medium rounded-full pointer-events-none select-none"
          style={{
            left: `calc(50% + ${x}px - 20px)`,
            top: `calc(50% + ${y}px - 20px)`,
            color: color,
          }}
        >
          {num === 0 && !isHour ? '00' : num}
        </span>
      );
    });

    return (
      <div
        ref={clockRef}
        className="relative w-[232px] h-[232px] rounded-full bg-secondary mx-auto flex items-center justify-center cursor-pointer select-none touch-none overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="w-2 h-2 rounded-full bg-primary absolute z-10 pointer-events-none" />

        {/* Base layer numbers (white) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {renderNumbers('#FFFFFF')}
        </div>

        {/* Selector Arm */}
        <div
          className="absolute w-[2px] bg-primary origin-bottom z-10 pointer-events-none"
          style={{
            height: NUMBER_RADIUS,
            bottom: '50%',
            left: 'calc(50% - 1px)',
            transform: `rotate(${currentAngle}deg)`,
            transformOrigin: 'bottom center',
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="w-10 h-10 rounded-full bg-primary absolute -top-5 -left-[19px]" />
        </div>

        {/* Inverted numbers (dark color) masked by the selector circle */}
        <div 
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            clipPath: `circle(20px at ${selectorCx}px ${selectorCy}px)`,
            transition: isDragging ? 'none' : 'clip-path 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            WebkitClipPath: `circle(20px at ${selectorCx}px ${selectorCy}px)`,
            WebkitTransition: isDragging ? 'none' : '-webkit-clip-path 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {renderNumbers('#050505')}
        </div>
      </div>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-[340px] bg-background rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 p-6 pt-5">

        <div className="relative flex h-[44px] items-center justify-center mb-[24px] select-none shrink-0">
          <h3 className="font-display text-lg font-bold text-white tracking-tight">{defaultTitle}</h3>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 flex h-[44px] w-[44px] items-center justify-center rounded-full bg-card text-white transition-colors hover:bg-brand-surfaceElevated cursor-pointer active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-1">
            <div
              onClick={() => { if (!isKeyboardMode) setActiveTab('hour'); }}
              className={`relative w-[84px] h-[72px] rounded-xl flex items-center justify-center transition-colors overflow-hidden ${
                activeTab === 'hour' && !isKeyboardMode ? 'bg-primary/20 text-primary' : 'bg-secondary text-white hover:bg-secondary/80'
              } ${!isKeyboardMode ? 'cursor-pointer' : ''}`}
            >
              {isKeyboardMode ? (
                <input
                  type="number"
                  value={selectedHour}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') { setSelectedHour(''); return; }
                    const num = parseInt(val);
                    if (!isNaN(num)) setSelectedHour(num);
                  }}
                  onBlur={() => {
                    let val = Number(selectedHour);
                    if (isNaN(val) || val < 0) val = 0;
                    if (val > 12) val = 12;
                    setSelectedHour(val);
                  }}
                  className="w-full h-full bg-transparent text-center text-[40px] font-bold focus:outline-none appearance-none"
                />
              ) : (
                <span className="text-[40px] font-bold leading-none">{String(Number(selectedHour) || 0).padStart(2, '0')}</span>
              )}
            </div>

            <span className="text-[40px] font-bold text-white mb-1 leading-none">:</span>

            <div
              onClick={() => { if (!isKeyboardMode) setActiveTab('minute'); }}
              className={`relative w-[84px] h-[72px] rounded-xl flex items-center justify-center transition-colors overflow-hidden ${
                activeTab === 'minute' && !isKeyboardMode ? 'bg-primary/20 text-primary' : 'bg-secondary text-white hover:bg-secondary/80'
              } ${!isKeyboardMode ? 'cursor-pointer' : ''}`}
            >
              {isKeyboardMode ? (
                <input
                  type="number"
                  value={selectedMinute}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') { setSelectedMinute(''); return; }
                    const num = parseInt(val);
                    if (!isNaN(num)) setSelectedMinute(num);
                  }}
                  onBlur={() => {
                    let val = Number(selectedMinute);
                    if (isNaN(val) || val < 0) val = 0;
                    if (val > 59) val = 59;
                    setSelectedMinute(val);
                  }}
                  className="w-full h-full bg-transparent text-center text-[40px] font-bold focus:outline-none appearance-none"
                />
              ) : (
                <span className="text-[40px] font-bold leading-none">{String(Number(selectedMinute) || 0).padStart(2, '0')}</span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5 justify-center ml-2">
            <button
              onClick={() => setIsPM(false)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border ${!isPM ? 'bg-primary/20 text-primary border-primary/30' : 'border-border/50 text-muted-foreground hover:bg-secondary'}`}
            >
              AM
            </button>
            <button
              onClick={() => setIsPM(true)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border ${isPM ? 'bg-primary/20 text-primary border-primary/30' : 'border-border/50 text-muted-foreground hover:bg-secondary'}`}
            >
              PM
            </button>
          </div>
        </div>

        {!isKeyboardMode && (
          <div className="h-[232px] flex items-center justify-center">
            {renderClockFace()}
          </div>
        )}

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => setIsKeyboardMode(!isKeyboardMode)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-white transition-all active:scale-95 hover:bg-secondary/80 cursor-pointer"
          >
            {isKeyboardMode ? <ClockIcon className="h-5 w-5" /> : <Keyboard className="h-5 w-5" />}
          </button>

          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-full bg-secondary text-white font-sans text-sm font-bold transition-all active:scale-95 hover:bg-secondary/80 cursor-pointer"
          >
            {t('common.cancel', 'Cancel')}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 h-12 rounded-full bg-primary text-primary-foreground font-sans text-sm font-bold transition-all active:scale-95 hover:bg-primary/90 cursor-pointer"
          >
            {t('common.done', 'OK')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
