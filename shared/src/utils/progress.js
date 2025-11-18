/**
 * Progress utilities
 * Univerzální funkce pro výpočty pokroku a statusů
 */

export const calculateProgress = (completed, total) => {
  if (!total || total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const getProgressColor = (percentage) => {
  if (percentage >= 80) return 'success';
  if (percentage >= 50) return 'info';
  if (percentage >= 20) return 'warning';
  return 'error';
};

export const getProgressLabel = (percentage) => {
  if (percentage >= 100) return 'Hotovo';
  if (percentage >= 75) return 'Téměř hotovo';
  if (percentage >= 50) return 'Více než polovina';
  if (percentage >= 25) return 'V průběhu';
  if (percentage > 0) return 'Začátek';
  return 'Nezačato';
};

export const estimateTimeRemaining = (totalHours, progressPercent) => {
  if (!totalHours || progressPercent >= 100) return 0;
  const completedHours = (totalHours * progressPercent) / 100;
  const remainingHours = totalHours - completedHours;
  return Math.ceil(remainingHours);
};

export const formatDuration = (minutes) => {
  if (!minutes) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} h`;
  return `${hours} h ${mins} min`;
};
