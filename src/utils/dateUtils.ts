export const parseLocalDateString = (date: string): Date => {
  const [yearText, monthText, dayText] = date.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (Number.isInteger(year) && Number.isInteger(month) && Number.isInteger(day)) {
    return new Date(year, month - 1, day);
  }

  return new Date(date);
};

export const toLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayLocalDateString = (): string => {
  return toLocalDateString(new Date());
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseLocalDateString(date) : date;
  return dateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (time: string): string => {
  return time.substring(0, 5);
};

export const isDateInPast = (date: string): boolean => {
  const dateObj = parseLocalDateString(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dateObj < today;
};

export const getDayOfWeek = (date: string): number => {
  return parseLocalDateString(date).getDay();
};

export const isSundayOrTuesday = (date: string): boolean => {
  const day = getDayOfWeek(date);
  return day === 0 || day === 2;
};

export const addMinutesToTime = (time: string, minutes: number): string => {
  const [hours, mins] = time.split(':').map(Number);
  const totalMins = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMins / 60);
  const newMins = totalMins % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
};
