import React, { useState } from 'react';
import { X } from 'lucide-react';

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
  title = 'Select Time'
}) => {
  const [selectedHour, setSelectedHour] = useState(initialTime.split(':')[0] || '12');
  const [selectedMinute, setSelectedMinute] = useState(initialTime.split(':')[1] || '00');

  if (!isOpen) return null;

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-[360px] bg-[#1C1C1E] rounded-[24px] border border-[#2C2C2E] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2C2C2E]">
          <h3 className="font-display text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-[#8E8E93] hover:text-white transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-5 space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <span className="text-xs font-semibold text-[#8E8E93] text-center">Hour</span>
              <div className="h-48 overflow-y-auto snap-y snap-mandatory scrollbar-none rounded-2xl bg-[#121212] border border-[#2C2C2E] relative flex flex-col">
                <div className="h-[72px] shrink-0" />
                {hours.map(h => (
                  <button
                    key={h}
                    onClick={() => setSelectedHour(h)}
                    className={`h-12 shrink-0 snap-center flex items-center justify-center text-xl font-bold transition-colors cursor-pointer ${
                      selectedHour === h ? 'text-[#68BD44] bg-[#68BD44]/10' : 'text-[#8E8E93] hover:text-white'
                    }`}
                  >
                    {h}
                  </button>
                ))}
                <div className="h-[72px] shrink-0" />
              </div>
            </div>

            <span className="text-2xl font-bold text-[#8E8E93] pt-6">:</span>

            <div className="flex flex-col gap-2 flex-1">
              <span className="text-xs font-semibold text-[#8E8E93] text-center">Minute</span>
              <div className="h-48 overflow-y-auto snap-y snap-mandatory scrollbar-none rounded-2xl bg-[#121212] border border-[#2C2C2E] relative flex flex-col">
                <div className="h-[72px] shrink-0" />
                {minutes.map(m => (
                  <button
                    key={m}
                    onClick={() => setSelectedMinute(m)}
                    className={`h-12 shrink-0 snap-center flex items-center justify-center text-xl font-bold transition-colors cursor-pointer ${
                      selectedMinute === m ? 'text-[#68BD44] bg-[#68BD44]/10' : 'text-[#8E8E93] hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
                <div className="h-[72px] shrink-0" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-12 rounded-full bg-[#2C2C2E] text-white font-sans text-sm font-bold transition-all active:scale-95 hover:bg-[#3A3A3C] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(`${selectedHour}:${selectedMinute}`)}
              className="flex-1 h-12 rounded-full bg-[#68BD44] text-[#050505] font-sans text-sm font-bold transition-all active:scale-95 hover:bg-[#5AA739] cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
