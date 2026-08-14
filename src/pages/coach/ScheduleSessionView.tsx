import React, { useState } from 'react';
import { Header } from '../../widgets/layout/Header';
import { BottomSheet } from '../../shared/ui/BottomSheet';
import { CustomTimePicker } from '../../shared/ui/CustomTimePicker';
import { CustomDatePicker } from '../../shared/ui/CustomDatePicker';
import { Plus, Trash2, Calendar, Clock } from 'lucide-react';
import { EmptyState } from '../../shared/ui/EmptyState';

export interface ScheduleSessionViewProps {
  onClose: () => void;
}

interface DaySchedule {
  id: string;
  dayName: string;
  enabled: boolean;
  slots: string[];
}

interface SpecialDateSchedule {
  id: string;
  date: string;
  time: string;
}

const INITIAL_DAYS: DaySchedule[] = [
  { id: 'mon', dayName: 'Monday', enabled: true, slots: ['10:00', '18:00'] },
  { id: 'tue', dayName: 'Tuesday', enabled: false, slots: ['12:00'] },
  { id: 'wed', dayName: 'Wednesday', enabled: true, slots: ['16:00'] },
  { id: 'thu', dayName: 'Thursday', enabled: false, slots: [] },
  { id: 'fri', dayName: 'Friday', enabled: true, slots: ['17:00', '19:00'] },
  { id: 'sat', dayName: 'Saturday', enabled: true, slots: ['11:00'] },
  { id: 'sun', dayName: 'Sunday', enabled: false, slots: [] },
];

const INITIAL_SPECIAL: SpecialDateSchedule[] = [];

export const ScheduleSessionView: React.FC<ScheduleSessionViewProps> = ({ onClose }) => {
  const [days, setDays] = useState<DaySchedule[]>(INITIAL_DAYS);
  const [specialDates, setSpecialDates] = useState<SpecialDateSchedule[]>(INITIAL_SPECIAL);

  // Time Picker Sheet State
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [targetDayId, setTargetDayId] = useState<string | null>(null);

  // Special Date Picker Sheet State
  const todayStr = new Date().toISOString().split('T')[0];
  const [isSpecialPickerOpen, setIsSpecialPickerOpen] = useState(false);
  const [specialDateVal, setSpecialDateVal] = useState(todayStr);
  const [specialTimeVal, setSpecialTimeVal] = useState('');
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const [isCustomTimeOpen, setIsCustomTimeOpen] = useState(false);

  const getFormattedDate = (dateStr: string) => {
    if (!dateStr) return 'Pick a date';
    const parts = dateStr.split('-');
    const localDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return localDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getFormattedTime = (timeStr: string) => {
    if (!timeStr) return 'Pick a time';
    const [h, m] = timeStr.split(':');
    const date = new Date();
    date.setHours(Number(h), Number(m));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const toggleDay = (id: string) => {
    const day = days.find((d) => d.id === id);
    if (!day) return;
    const newlyEnabled = !day.enabled;
    
    setDays((prev) =>
      prev.map((d) => (d.id === id ? { ...d, enabled: newlyEnabled } : d))
    );

    if (newlyEnabled && day.slots.length === 0) {
      openTimePicker(id);
    }
  };

  const removeSlot = (dayId: string, slotIndex: number) => {
    setDays((prev) =>
      prev.map((d) => {
        if (d.id === dayId) {
          const nextSlots = [...d.slots];
          nextSlots.splice(slotIndex, 1);
          return { ...d, slots: nextSlots };
        }
        return d;
      })
    );
  };

  const openTimePicker = (dayId: string) => {
    setTargetDayId(dayId);
    setIsTimePickerOpen(true);
  };

  const handleAddTimeSlot = (timeStr: string) => {
    if (!targetDayId) return;
    setDays((prev) =>
      prev.map((d) => {
        if (d.id === targetDayId) {
          return { ...d, slots: [...d.slots, timeStr], enabled: true };
        }
        return d;
      })
    );
    setIsTimePickerOpen(false);
  };

  const handleAddSpecialDate = () => {
    const newItem: SpecialDateSchedule = {
      id: `sp-${Date.now()}`,
      date: specialDateVal,
      time: specialTimeVal,
    };
    setSpecialDates((prev) => [...prev, newItem]);
    setIsSpecialPickerOpen(false);
  };

  const removeSpecialDate = (id: string) => {
    setSpecialDates((prev) => prev.filter((item) => item.id !== id));
  };



  return (
    <div className="h-full min-h-screen flex flex-col bg-background text-white px-4 max-w-[480px] mx-auto select-none pb-36">
      {/* 1. Header */}
      <div className="sticky top-0 z-40 bg-background pt-[84px] pb-5 -mx-4 px-4">
        <Header
          variant="page"
          title="Schedule public session"
          onBack={onClose}
          onClose={onClose}
        />
      </div>

      <div className="flex-1 space-y-6 pt-2 overflow-y-auto scrollbar-none pb-8">
        {/* SECTION 1: Regular Weekly Days & Time Slots */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Regular Weekly Schedule</span>
            </h2>
          </div>

          <div className="space-y-2.5">
            {days.map((day) => (
              <div
                key={day.id}
                className={`rounded-[20px] bg-card p-4 transition-colors ${
                  day.enabled ? '' : 'opacity-60'
                }`}
              >
                {/* Day Header Row with Toggle Switch */}
                <div className="flex items-center justify-between">
                  <span className="font-display text-base font-bold text-white">
                    {day.dayName}
                  </span>

                  <button
                    onClick={() => toggleDay(day.id)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                      day.enabled ? 'bg-primary' : 'bg-secondary'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        day.enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Slots Row */}
                {day.enabled && (
                  <div className="flex flex-wrap items-center gap-2 pt-3">
                    {day.slots.map((slot, idx) => (
                      <div
                        key={idx}
                        className="flex h-7 items-center gap-1.5 rounded-full bg-secondary px-3 text-xs font-semibold text-white"
                      >
                        <span>{slot}</span>
                        <button
                          onClick={() => removeSlot(day.id, idx)}
                          className="text-muted-foreground hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    {/* Add Slot Pill */}
                    <button
                      onClick={() => openTimePicker(day.id)}
                      className="flex h-7 items-center gap-1 rounded-full bg-primary/15 px-3 text-xs font-bold text-primary hover:bg-primary/25 transition-all cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add slot</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Special Dates */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Special Dates</span>
            </h2>

            <button
              onClick={() => setIsSpecialPickerOpen(true)}
              className="flex items-center gap-1 text-xs font-bold text-primary hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3]" /> Add date
            </button>
          </div>

          <div className="space-y-2">
            {specialDates.length === 0 ? (
              <EmptyState message="No special dates yet" icon={Calendar} />
            ) : (
              specialDates.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-[20px] bg-card p-4 border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-display text-sm font-bold text-white">
                        {item.date}
                      </div>
                      <div className="text-xs text-muted-foreground">Start at {item.time}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeSpecialDate(item.id)}
                    className="text-muted-foreground hover:text-rose-400 p-2 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Progressive Blur — fixed, max-w matches main content container, under button */}
        <div className="fixed bottom-0 inset-x-0 h-[100px] z-[50] pointer-events-none">
          <div
            className="mx-auto max-w-[480px] h-full bg-gradient-to-t from-background via-background/85 to-transparent backdrop-blur-md"
            style={{
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)',
            }}
          />
        </div>

        {/* Action Button — fixed, max-w matches main content container, above blur */}
        <div className="fixed bottom-[48px] inset-x-0 z-[60] pointer-events-none">
          <div className="mx-auto max-w-[480px] px-4">
            <button
              onClick={onClose}
              className="w-full h-[52px] rounded-full bg-primary text-primary-foreground font-sans text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 hover:bg-primary/90 cursor-pointer pointer-events-auto"
            >
              Save schedule
            </button>
          </div>
        </div>
      </div>

      {/* Time Picker Modal for Regular Slots */}
      <CustomTimePicker
        isOpen={isTimePickerOpen}
        onClose={() => setIsTimePickerOpen(false)}
        onConfirm={handleAddTimeSlot}
      />

      {/* Special Date Picker Sheet Modal */}
      <BottomSheet
        isOpen={isSpecialPickerOpen}
        onClose={() => setIsSpecialPickerOpen(false)}
        title="Add special date session"
      >
        <div className="space-y-4 pt-2 pb-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Date</label>
            <div 
              onClick={() => setIsCustomDateOpen(true)}
              className="relative w-full h-[48px] rounded-full bg-card border border-transparent focus-within:border-primary transition-all flex items-center px-4 cursor-pointer"
            >
              <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
              <span className={`font-sans text-sm font-semibold ${specialDateVal ? 'text-white' : 'text-muted-foreground'}`}>
                {getFormattedDate(specialDateVal)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Start Time</label>
            <div 
              onClick={() => setIsCustomTimeOpen(true)}
              className="relative w-full h-[48px] rounded-full bg-card border border-transparent focus-within:border-primary transition-all flex items-center px-4 cursor-pointer"
            >
              <Clock className="h-5 w-5 text-muted-foreground mr-3" />
              <span className={`font-sans text-sm font-semibold ${specialTimeVal ? 'text-white' : 'text-muted-foreground'}`}>
                {getFormattedTime(specialTimeVal)}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddSpecialDate}
            className="w-full h-[48px] rounded-full bg-primary text-primary-foreground font-sans text-sm font-bold transition-all active:scale-95 hover:bg-primary/90 cursor-pointer mt-4"
          >
            Add special session
          </button>
        </div>
      </BottomSheet>

      {/* Custom Picker Modals for Special Dates */}
      <CustomDatePicker
        isOpen={isCustomDateOpen}
        onClose={() => setIsCustomDateOpen(false)}
        initialDate={specialDateVal}
        onConfirm={(val) => {
          setSpecialDateVal(val);
          setIsCustomDateOpen(false);
        }}
      />

      <CustomTimePicker
        isOpen={isCustomTimeOpen}
        onClose={() => setIsCustomTimeOpen(false)}
        initialTime={specialTimeVal || '12:00'}
        onConfirm={(val) => {
          setSpecialTimeVal(val);
          setIsCustomTimeOpen(false);
        }}
      />
    </div>
  );
};
