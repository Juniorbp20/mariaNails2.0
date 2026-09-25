/**
 * dateUtils.ts — Ayudas de fechas para el calendario de reservas.
 *
 * Qué hace: evita errores de zona horaria al leer "YYYY-MM-DD",
 * formatea fechas en español y calcula horarios según la duración
 * de cada servicio. Lo usa el panel admin para fechas de citas.
 */

/** Convierte "2026-09-24" en Date local (sin desfase de UTC). */
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

/** Convierte un Date a "YYYY-MM-DD" para guardar en la BD. */
export const toLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** Devuelve la fecha de hoy como "YYYY-MM-DD" (para bloquear el pasado). */
export const getTodayLocalDateString = (): string => {
  return toLocalDateString(new Date());
};

/** Formatea una fecha en español largo (ej: "miércoles, 24 de septiembre de 2026"). */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseLocalDateString(date) : date;
  return dateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/** Recorta una hora "HH:MM:SS" a "HH:MM" para mostrarla. */
export const formatTime = (time: string): string => {
  return time.substring(0, 5);
};

/** Dice si una fecha ya pasó (para deshabilitarla en el calendario). */
export const isDateInPast = (date: string): boolean => {
  const dateObj = parseLocalDateString(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dateObj < today;
};

/** Devuelve el día de la semana 0-6 (0=domingo) de una fecha. */
export const getDayOfWeek = (date: string): number => {
  return parseLocalDateString(date).getDay();
};

/** El salón cierra domingo y martes: true si la fecha cae en esos días. */
export const isSundayOrTuesday = (date: string): boolean => {
  const day = getDayOfWeek(date);
  return day === 0 || day === 2;
};

/** Suma minutos a una hora (ej: "09:00"+90 → "10:30") para calcular fin de cita. */
export const addMinutesToTime = (time: string, minutes: number): string => {
  const [hours, mins] = time.split(':').map(Number);
  const totalMins = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMins / 60);
  const newMins = totalMins % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
};
