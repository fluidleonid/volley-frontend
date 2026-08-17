import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from './badge';

export interface DateRange {
  label: string;
  start: string | null;
  end: string | null;
}

interface CustomDateRangePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (range: DateRange) => void;
  initialRange?: DateRange;
  title?: string;
}

export const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialRange,
  title = 'Select Period'
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [startDate, setStartDate] = useState<Date | null>(() => {
    return initialRange?.start ? new Date(initialRange.start) : null;
  });
  const [endDate, setEndDate] = useState<Date | null>(() => {
    return initialRange?.end ? new Date(initialRange.end) : null;
  });
  const [selectedLabel, setSelectedLabel] = useState<string>(initialRange?.label || 'All time');

  // When opening, reset the grid view to the start date if exists
  useEffect(() => {
    if (isOpen && startDate) {
      setCurrentDate(new Date(startDate.getFullYear(), startDate.getMonth(), 1));
    } else if (isOpen) {
      setCurrentDate(new Date());
    }
  }, [isOpen, startDate]);

  if (!isOpen) return null;

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sun

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const handleSelectDate = (d: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), d, 12, 0, 0, 0); // Noon to avoid timezone issues
    
    setSelectedLabel('Custom');
    
    if (!startDate || (startDate && endDate)) {
      // Start fresh
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (startDate && !endDate) {
      // Set end date
      if (clickedDate.getTime() < startDate.getTime()) {
        setEndDate(startDate);
        setStartDate(clickedDate);
      } else {
        setEndDate(clickedDate);
      }
    }
  };

  const handlePresetClick = (preset: string) => {
    setSelectedLabel(preset);
    const now = new Date();
    
    if (preset === 'All time') {
      setStartDate(null);
      setEndDate(null);
    } else if (preset === 'This month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1, 12);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 12);
      setStartDate(start);
      setEndDate(end);
      setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    } else if (preset === 'Last month') {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 12);
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 12);
      setStartDate(start);
      setEndDate(end);
      setCurrentDate(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    } else if (preset === 'This year') {
      const start = new Date(now.getFullYear(), 0, 1, 12);
      const end = new Date(now.getFullYear(), 11, 31, 12);
      setStartDate(start);
      setEndDate(end);
      setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1)); // keep current month view
    } else if (preset === 'Last year') {
      const start = new Date(now.getFullYear() - 1, 0, 1, 12);
      const end = new Date(now.getFullYear() - 1, 11, 31, 12);
      setStartDate(start);
      setEndDate(end);
      setCurrentDate(new Date(now.getFullYear() - 1, 11, 1)); // move to end of last year view
    }
  };

  const handleConfirm = () => {
    const format = (date: Date | null) => {
      if (!date) return null;
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    onConfirm({
      label: selectedLabel,
      start: format(startDate),
      end: format(endDate),
    });
    onClose();
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const presets = ['All time', 'This month', 'Last month', 'This year', 'Last year'];

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-[340px] bg-background rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 p-6 pt-5">
        
        {/* Header Row */}
        <div className="relative flex h-[44px] items-center justify-center pt-0 mb-[16px] select-none shrink-0">
          <h3 className="font-display text-lg font-bold text-white tracking-tight">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 flex h-[44px] w-[44px] items-center justify-center rounded-full bg-card text-white transition-colors hover:bg-brand-surfaceElevated cursor-pointer active:scale-95"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          
          {/* Calendar Navigation */}
          <div className="flex items-center justify-between px-2">
            <button onClick={prevMonth} className="p-2 text-muted-foreground hover:text-white bg-secondary rounded-full cursor-pointer">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-display text-[16px] font-bold text-white tracking-tight">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button onClick={nextMonth} className="p-2 text-muted-foreground hover:text-white bg-secondary rounded-full cursor-pointer">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="px-1">
            <div className="grid grid-cols-7 mb-1">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center text-[10px] font-semibold text-muted-foreground uppercase">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
              {blanks.map(b => (
                <div key={`blank-${b}`} className="h-[36px] w-full" />
              ))}
              {days.map(d => {
                const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), d, 12, 0, 0, 0);
                const t = dateObj.getTime();
                const st = startDate?.getTime();
                const et = endDate?.getTime();
                
                const isStart = st === t;
                const isEnd = et === t;
                
                // For rounded corners on range
                const isRangeStart = isStart && endDate;
                const isRangeEnd = isEnd && startDate;
                const isMidRange = st && et && t > st && t < et;

                return (
                  <div key={d} className="relative h-[36px] w-full flex items-center justify-center">
                    {/* Range Background Highlights */}
                    {isRangeStart && <div className="absolute inset-0 left-1/2 bg-primary/20" />}
                    {isRangeEnd && <div className="absolute inset-0 right-1/2 bg-primary/20" />}
                    {isMidRange && <div className="absolute inset-0 bg-primary/20" />}

                    <button
                      onClick={() => handleSelectDate(d)}
                      className={`relative h-8 w-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer z-10 ${
                        isStart || isEnd
                          ? 'bg-primary text-primary-foreground scale-105' 
                          : isMidRange
                            ? 'text-primary'
                            : 'text-white hover:bg-secondary'
                      }`}
                    >
                      {d}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Presets */}
          <div className="pt-2 border-t border-border/60">
            <div className="flex flex-wrap gap-1.5 justify-start mt-2">
              {presets.map(preset => (
                <Badge
                  key={preset}
                  variant={selectedLabel === preset ? 'default' : 'neutral'}
                  onClick={() => handlePresetClick(preset)}
                  className={`px-2.5 py-1 cursor-pointer hover:opacity-90 active:scale-95 transition-all text-[12px] ${selectedLabel !== preset ? 'text-white hover:bg-brand-surfaceElevated bg-card' : ''}`}
                >
                  {preset}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 h-12 rounded-full bg-secondary text-white font-sans text-sm font-bold transition-all active:scale-95 hover:bg-secondary/80 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 h-12 rounded-full bg-primary text-primary-foreground font-sans text-sm font-bold transition-all active:scale-95 hover:bg-primary/90 cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
