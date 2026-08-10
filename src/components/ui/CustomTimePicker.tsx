import React, { useState, useEffect } from 'react';
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
  title = 'Select time'
}) => {
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isPM, setIsPM] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'hour' | 'minute'>('hour');
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);

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
    let finalHour = selectedHour;
    if (isPM && finalHour < 12) finalHour += 12;
    if (!isPM && finalHour === 12) finalHour = 0;
    
    const hStr = String(finalHour).padStart(2, '0');
    const mStr = String(selectedMinute).padStart(2, '0');
    onConfirm(`${hStr}:${mStr}`);
  };

  const renderClockFace = () => {
    const isHour = activeTab === 'hour';
    const items = isHour 
      ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    const currentVal = isHour ? selectedHour : selectedMinute;
    
    let angle = 0;
    if (isHour) {
      angle = (selectedHour % 12) * 30;
    } else {
      angle = selectedMinute * 6;
    }
    
    return (
      <div className="relative w-[232px] h-[232px] rounded-full bg-[#2C2C2E] mx-auto flex items-center justify-center">
        {/* Center Dot */}
        <div className="w-2 h-2 rounded-full bg-[#68BD44] absolute z-10" />
        
        {/* Clock Hand */}
        <div 
          className="absolute w-[2px] bg-[#68BD44] origin-bottom z-0 transition-transform duration-300 ease-out"
          style={{
            height: NUMBER_RADIUS,
            bottom: '50%',
            left: 'calc(50% - 1px)',
            transform: `rotate(${angle}deg)`,
            transformOrigin: 'bottom center',
          }}
        >
          {/* Knob */}
          <div className="w-10 h-10 rounded-full bg-[#68BD44] absolute -top-5 -left-[19px] flex items-center justify-center text-[#050505] font-bold text-base">
            {currentVal === 0 && !isHour ? '00' : currentVal}
          </div>
        </div>

        {/* Numbers */}
        {items.map((num, i) => {
          const theta = (i * 30) * (Math.PI / 180);
          const x = Math.sin(theta) * NUMBER_RADIUS;
          const y = -Math.cos(theta) * NUMBER_RADIUS;
          const isSelected = currentVal === num;

          return (
            <button
              key={num}
              onClick={() => {
                if (isHour) {
                  setSelectedHour(num);
                  // Optionally auto-switch to minute
                  setTimeout(() => setActiveTab('minute'), 250);
                } else {
                  setSelectedMinute(num);
                }
              }}
              className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center text-sm z-10 transition-colors ${isSelected ? 'text-transparent' : 'text-white hover:bg-white/10'}`}
              style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
            >
              {!isSelected && (num === 0 && !isHour ? '00' : num)}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-[340px] bg-[#121212] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 p-6 pt-5">
        
        {/* Header Row */}
        <div className="relative flex h-[44px] items-center justify-center pt-0 mb-[24px] select-none shrink-0">
          <h3 className="font-display text-lg font-bold text-white tracking-tight">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#1C1C1E] text-white transition-colors hover:bg-[#242426] cursor-pointer active:scale-95"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Digital Time Display */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-1">
            <div 
              onClick={() => { if (!isKeyboardMode) setActiveTab('hour'); }}
              className={`relative w-[84px] h-[72px] rounded-xl flex items-center justify-center transition-colors overflow-hidden ${
                activeTab === 'hour' && !isKeyboardMode ? 'bg-[#68BD44]/20 text-[#68BD44]' : 'bg-[#2C2C2E] text-white hover:bg-[#3A3A3C]'
              } ${!isKeyboardMode ? 'cursor-pointer' : ''}`}
            >
              {isKeyboardMode ? (
                <input 
                  type="number" 
                  value={selectedHour === 0 ? '' : selectedHour}
                  onChange={(e) => {
                    let val = parseInt(e.target.value);
                    if (isNaN(val)) val = 12;
                    if (val > 12) val = 12;
                    if (val < 1) val = 1;
                    setSelectedHour(val);
                  }}
                  className="w-full h-full bg-transparent text-center text-[40px] font-bold focus:outline-none appearance-none"
                />
              ) : (
                <span className="text-[40px] font-bold leading-none">{String(selectedHour).padStart(2, '0')}</span>
              )}
            </div>

            <span className="text-[40px] font-bold text-white mb-1 leading-none">:</span>
            
            <div 
              onClick={() => { if (!isKeyboardMode) setActiveTab('minute'); }}
              className={`relative w-[84px] h-[72px] rounded-xl flex items-center justify-center transition-colors overflow-hidden ${
                activeTab === 'minute' && !isKeyboardMode ? 'bg-[#68BD44]/20 text-[#68BD44]' : 'bg-[#2C2C2E] text-white hover:bg-[#3A3A3C]'
              } ${!isKeyboardMode ? 'cursor-pointer' : ''}`}
            >
              {isKeyboardMode ? (
                <input 
                  type="number" 
                  value={selectedMinute === 0 ? '00' : selectedMinute}
                  onChange={(e) => {
                    let val = parseInt(e.target.value);
                    if (isNaN(val)) val = 0;
                    if (val > 59) val = 59;
                    if (val < 0) val = 0;
                    setSelectedMinute(val);
                  }}
                  className="w-full h-full bg-transparent text-center text-[40px] font-bold focus:outline-none appearance-none"
                />
              ) : (
                <span className="text-[40px] font-bold leading-none">{String(selectedMinute).padStart(2, '0')}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1 ml-1">
            <button 
              onClick={() => setIsPM(false)}
              className={`px-3 py-[9px] rounded-[10px] border text-xs font-bold transition-colors ${!isPM ? 'bg-[#68BD44]/20 border-[#68BD44] text-[#68BD44]' : 'border-[#2C2C2E] text-[#8E8E93] hover:text-white bg-[#2C2C2E]/50'}`}
            >
              AM
            </button>
            <button 
              onClick={() => setIsPM(true)}
              className={`px-3 py-[9px] rounded-[10px] border text-xs font-bold transition-colors ${isPM ? 'bg-[#68BD44]/20 border-[#68BD44] text-[#68BD44]' : 'border-[#2C2C2E] text-[#8E8E93] hover:text-white bg-[#2C2C2E]/50'}`}
            >
              PM
            </button>
          </div>
        </div>

        {/* Clock Face or empty space */}
        <div className="h-[232px] flex items-center justify-center">
          {!isKeyboardMode ? renderClockFace() : (
             <div className="text-[#8E8E93] text-sm text-center">
               Enter time manually
             </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between mt-6">
          <button 
            onClick={() => setIsKeyboardMode(!isKeyboardMode)}
            className="p-2 -ml-2 text-[#8E8E93] hover:text-white transition-colors rounded-full"
          >
            {isKeyboardMode ? <ClockIcon className="h-5 w-5" /> : <Keyboard className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[#68BD44] font-bold text-sm hover:bg-[#68BD44]/10 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-[#68BD44] font-bold text-sm hover:bg-[#68BD44]/10 rounded-full transition-colors"
            >
              OK
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
