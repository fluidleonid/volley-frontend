import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomDatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dateStr: string) => void; // YYYY-MM-DD
  initialDate?: string;
  title?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialDate,
  title
}) => {
  const { t, i18n } = useTranslation();
  const defaultTitle = title || t('common.selectDate', 'Select Date');
  const [currentDate, setCurrentDate] = useState(() => {
    return initialDate ? new Date(initialDate) : new Date();
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    return initialDate ? new Date(initialDate) : new Date();
  });

  if (!isOpen) return null;

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sun

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const handleSelectDate = (d: number) => {
    const newSelected = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
    setSelectedDate(newSelected);
  };

  const handleConfirm = () => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const d = String(selectedDate.getDate()).padStart(2, '0');
    onConfirm(`${y}-${m}-${d}`);
  };

  const amMonths = ['Հունվար', 'Փետրվար', 'Մարտ', 'Ապրիլ', 'Մայիս', 'Հունիս', 'Հուլիս', 'Օգոստոս', 'Սեպտեմբեր', 'Հոկտեմբեր', 'Նոյեմբեր', 'Դեկտեմբեր'];
  const ruMonths = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const enMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getMonthName = (date: Date) => {
    const month = date.getMonth();
    if (i18n.language === 'am') return amMonths[month];
    if (i18n.language === 'ru') return ruMonths[month];
    return enMonths[month];
  };

  const amWeekDays = ['Կիր', 'Երկ', 'Երք', 'Չրք', 'Հնգ', 'Ուր', 'Շբթ'];
  const ruWeekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const enWeekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const weekDays = i18n.language === 'am' ? amWeekDays : i18n.language === 'ru' ? ruWeekDays : enWeekDays;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-[380px] bg-background rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 p-6 pt-5">
        
        {/* Header Row */}
        <div className="relative flex h-[44px] items-center justify-center pt-0 mb-[24px] select-none shrink-0">
          <h3 className="font-display text-lg font-bold text-white tracking-tight">
            {defaultTitle}
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
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button onClick={prevMonth} className="p-2 text-muted-foreground hover:text-white bg-secondary rounded-full cursor-pointer">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-display text-lg font-bold text-white tracking-tight">
              {getMonthName(currentDate)} {currentDate.getFullYear()}
            </span>
            <button onClick={nextMonth} className="p-2 text-muted-foreground hover:text-white bg-secondary rounded-full cursor-pointer">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div>
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-semibold text-muted-foreground">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-2">
              {blanks.map(b => (
                <div key={`blank-${b}`} className="h-10 w-10" />
              ))}
              {days.map(d => {
                const isSelected = 
                  selectedDate.getDate() === d && 
                  selectedDate.getMonth() === currentDate.getMonth() && 
                  selectedDate.getFullYear() === currentDate.getFullYear();
                  
                const isToday = 
                  new Date().getDate() === d && 
                  new Date().getMonth() === currentDate.getMonth() && 
                  new Date().getFullYear() === currentDate.getFullYear();

                return (
                  <button
                    key={d}
                    onClick={() => handleSelectDate(d)}
                    className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground' 
                        : isToday
                          ? 'text-primary hover:bg-secondary'
                          : 'text-white hover:bg-secondary'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
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
      </div>
    </div>,
    document.body
  );
};
