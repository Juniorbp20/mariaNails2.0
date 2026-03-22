import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { availabilityService } from '../services/availabilityService';
import { appointmentService } from '../services/appointmentService';
import type { AvailabilitySlot } from '../types';
import { formatTime, getDayOfWeek } from '../utils/dateUtils';

interface TimeSlotsProps {
  selectedDate: string;
  onTimeSelect: (time: string) => void;
  serviceDuration: number;
}

export default function TimeSlots({ selectedDate, onTimeSelect }: TimeSlotsProps) {
  const [availability, setAvailability] = useState<AvailabilitySlot | null>(null);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAvailability = async () => {
      setLoading(true);
      try {
        const dayOfWeek = getDayOfWeek(selectedDate);

        const slot = await availabilityService.getAvailabilityByDayOfWeek(dayOfWeek);
        setAvailability(slot);

        const booked = await appointmentService.getBookedTimesByDate(selectedDate);
        setBookedTimes(booked.map(formatTime));
      } catch (error) {
        console.error('Error loading availability:', error);
        setBookedTimes([]);
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, [selectedDate]);

  const generateTimeSlots = (): string[] => {
    if (!availability) return [];

    const slots: string[] = [];
    const startTime = availability.start_time;
    const endTime = availability.end_time;
    const breakStart = availability.break_start;
    const breakEnd = availability.break_end;

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    let currentHour = startHour;
    let currentMin = startMin;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMin < endMin)
    ) {
      const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;

      if (breakStart && breakEnd) {
        const [breakStartHour, breakStartMin] = breakStart.split(':').map(Number);
        const [breakEndHour, breakEndMin] = breakEnd.split(':').map(Number);
        const breakStartTime = breakStartHour * 60 + breakStartMin;
        const breakEndTime = breakEndHour * 60 + breakEndMin;
        const currentTime = currentHour * 60 + currentMin;

        if (currentTime < breakStartTime || currentTime >= breakEndTime) {
          slots.push(timeString);
        }
      } else {
        slots.push(timeString);
      }

      currentMin += 30;
      if (currentMin >= 60) {
        currentHour += 1;
        currentMin = 0;
      }
    }

    return slots;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-600">Cargando horarios disponibles...</p>
      </div>
    );
  }

  if (!availability) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-600">No hay disponibilidad para esta fecha.</p>
      </div>
    );
  }

  const timeSlots = generateTimeSlots();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
        <Clock className="w-5 h-5 text-pink-600" />
        <span>Horarios disponibles</span>
      </h3>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {timeSlots.map(time => {
          const isBooked = bookedTimes.includes(time);
          return (
            <button
              key={time}
              onClick={() => onTimeSelect(time)}
              disabled={isBooked}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition ${
                isBooked
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-pink-100 hover:text-pink-700'
              }`}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
}
