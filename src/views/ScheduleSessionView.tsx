import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { BottomSheet } from '../components/ui/BottomSheet';
import { CustomTimePicker } from '../components/ui/CustomTimePicker';
import { CustomDatePicker } from '../components/ui/CustomDatePicker';
import { Plus, Trash2, Calendar, Clock } from 'lucide-react';

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

const INITIAL_SPECIAL: SpecialDateSchedule[] = [
  { id: 'sp-1', date: '2026-08-15', time: '14:00' },
  { id: 'sp-2', date: '2026-08-20', time: '10:30' },
];

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
    setDays((prev) =>
      prev.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d))
    );
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
    <div className="h-full min-h-screen flex flex-col bg-[#121212] text-white px-4 max-w-[480px] mx-auto select-none pb-24">
      {/* 1. Header */}
      <div className="sticky top-0 z-40 bg-[#121212] pt-[84px] pb-5 -mx-4 px-4">
        <PageHeader
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
              <Clock className="h-5 w-5 text-[#68BD44]" />
              <span>Regular Weekly Schedule</span>
            </h2>
          </div>

          <div className="space-y-2.5">
            {days.map((day) => (
              <div
                key={day.id}
                className={`rounded-[20px] bg-[#1C1C1E] p-4 transition-colors ${
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
                      day.enabled ? 'bg-[#68BD44]' : 'bg-[#2C2C2E]'
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
                        className="flex h-7 items-center gap-1.5 rounded-full bg-[#2C2C2E] px-3 text-xs font-semibold text-white"
                      >
                        <span>{slot}</span>
                        <button
                          onClick={() => removeSlot(day.id, idx)}
                          className="text-[#8E8E93] hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    {/* Add Slot Pill */}
                    <button
                      onClick={() => openTimePicker(day.id)}
                      className="flex h-7 items-center gap-1 rounded-full bg-[#68BD44]/15 px-3 text-xs font-bold text-[#68BD44] hover:bg-[#68BD44]/25 transition-all cursor-pointer"
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
              <Calendar className="h-5 w-5 text-[#68BD44]" />
              <span>Special Dates</span>
            </h2>

            <button
              onClick={() => setIsSpecialPickerOpen(true)}
              className="flex items-center gap-1 text-xs font-bold text-[#68BD44] hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3]" /> Add date
            </button>
          </div>

          <div className="space-y-2">
            {specialDates.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-[20px] bg-[#1C1C1E] p-4 border border-[#2C2C2E]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2C2C2E] text-[#68BD44]">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-display text-sm font-bold text-white">
                      {item.date}
                    </div>
                    <div className="text-xs text-[#8E8E93]">Start at {item.time}</div>
                  </div>
                </div>

                <button
                  onClick={() => removeSpecialDate(item.id)}
                  className="text-[#8E8E93] hover:text-rose-400 p-2 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Schedule CTA */}
        <div className="pt-4">
          <button
            onClick={onClose}
            className="w-full h-[52px] rounded-full bg-[#68BD44] text-[#050505] font-sans text-base font-bold transition-all active:scale-95 hover:bg-[#5AA739] cursor-pointer shadow-lg shadow-[#68BD44]/20"
          >
            Save schedule
          </button>
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
            <label className="text-xs font-semibold text-[#8E8E93]">Date</label>
            <div 
              onClick={() => setIsCustomDateOpen(true)}
              className="relative w-full h-[48px] rounded-full bg-[#1C1C1E] border border-transparent focus-within:border-[#68BD44] transition-all flex items-center px-4 cursor-pointer"
            >
              <Calendar className="h-5 w-5 text-[#8E8E93] mr-3" />
              <span className={`font-sans text-sm font-semibold ${specialDateVal ? 'text-white' : 'text-[#8E8E93]'}`}>
                {getFormattedDate(specialDateVal)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#8E8E93]">Start Time</label>
            <div 
              onClick={() => setIsCustomTimeOpen(true)}
              className="relative w-full h-[48px] rounded-full bg-[#1C1C1E] border border-transparent focus-within:border-[#68BD44] transition-all flex items-center px-4 cursor-pointer"
            >
              <Clock className="h-5 w-5 text-[#8E8E93] mr-3" />
              <span className={`font-sans text-sm font-semibold ${specialTimeVal ? 'text-white' : 'text-[#8E8E93]'}`}>
                {getFormattedTime(specialTimeVal)}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddSpecialDate}
            className="w-full h-[48px] rounded-full bg-[#68BD44] text-[#050505] font-sans text-sm font-bold transition-all active:scale-95 hover:bg-[#5AA739] cursor-pointer mt-4"
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
