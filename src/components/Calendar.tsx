import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { availabilityService } from '../services/availabilityService';
import { toLocalDateString } from '../utils/dateUtils';

interface CalendarProps {
  onDateSelect: (date: string) => void;
  blockedDates: string[];
  minDate?: Date;
}

export default function Calendar({ onDateSelect, blockedDates, minDate = new Date() }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(minDate));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableDays, setAvailableDays] = useState<number[]>([]);
  const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());

  useEffect(() => {
    const loadAvailableDays = async () => {
      try {
        const slots = await availabilityService.getAvailabilitySlots();
        const days = slots.map(slot => slot.day_of_week);
        setAvailableDays(days);
      } catch (error) {
        console.error('Error loading available days:', error);
      }
    };

    loadAvailableDays();
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = toLocalDateString(date);

    // Skip if date is blocked or in the past
    if (blockedDates.includes(dateString) || date < minDateOnly) {
      return;
    }

    // Skip if day is not available
    if (!availableDays.includes(date.getDay())) {
      return;
    }

    setSelectedDate(dateString);
    onDateSelect(dateString);
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = toLocalDateString(date);
      const isBlocked = blockedDates.includes(dateString);
      const isPast = date < minDateOnly;
      const isUnavailableDay = !availableDays.includes(date.getDay());
      const isSelected = selectedDate === dateString;
      const isDisabled = isBlocked || isPast || isUnavailableDay;

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isDisabled}
          className={`p-2 text-sm font-medium rounded-lg transition ${
            isDisabled
              ? 'text-gray-300 cursor-not-allowed bg-gray-50'
              : isSelected
              ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
              : 'hover:bg-pink-100 text-gray-700'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
        <p>Días disponibles para reserva: Lun, Mié, Jue, Vie, Sab</p>
      </div>
    </div>
  );
}
