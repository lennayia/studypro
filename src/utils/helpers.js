import { format, formatDistanceToNow, differenceInDays, isPast, isToday, isTomorrow } from 'date-fns';
import { cs } from 'date-fns/locale';

// ============================================
// DATUM A ČAS
// ============================================

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'd. M. yyyy', { locale: cs });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'd. M. yyyy HH:mm', { locale: cs });
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: cs });
};

export const getDaysUntil = (date) => {
  if (!date) return null;
  return differenceInDays(new Date(date), new Date());
};

export const getDeadlineStatus = (deadline) => {
  if (!deadline) return null;

  const daysUntil = getDaysUntil(deadline);

  if (daysUntil < 0) return { status: 'expired', color: 'error', text: 'Vypršelo' };
  if (daysUntil === 0) return { status: 'today', color: 'error', text: 'Dnes!' };
  if (daysUntil === 1) return { status: 'tomorrow', color: 'warning', text: 'Zítra' };
  if (daysUntil <= 7) return { status: 'week', color: 'warning', text: `${daysUntil} dní` };
  if (daysUntil <= 30) return { status: 'month', color: 'info', text: `${daysUntil} dní` };

  return { status: 'safe', color: 'success', text: formatDate(deadline) };
};

// ============================================
// GAMIFIKACE
// ============================================

export const calculatePoints = (activityType, value = 1) => {
  const pointsMap = {
    complete_lesson: 10,
    complete_course: 100,
    study_session: 5, // + 1 bod za každých 15 minut
    daily_streak: 20,
    weekly_streak: 50,
    add_course: 5,
    add_goal: 10,
    complete_goal: 50,
  };

  const basePoints = pointsMap[activityType] || 0;

  // Speciální výpočty
  if (activityType === 'study_session') {
    const minutesBonus = Math.floor(value / 15);
    return basePoints + minutesBonus;
  }

  return basePoints * value;
};

export const getStreakEmoji = (streak) => {
  if (streak >= 100) return '🔥💎';
  if (streak >= 50) return '🔥🏆';
  if (streak >= 30) return '🔥🔥🔥';
  if (streak >= 14) return '🔥🔥';
  if (streak >= 7) return '🔥';
  if (streak >= 3) return '✨';
  return '⭐';
};

export const getLevelFromPoints = (points) => {
  // Každých 1000 bodů = 1 level
  return Math.floor(points / 1000) + 1;
};

export const getPointsToNextLevel = (points) => {
  const currentLevel = getLevelFromPoints(points);
  const nextLevelPoints = currentLevel * 1000;
  return nextLevelPoints - points;
};

export const getLevelProgress = (points) => {
  const level = getLevelFromPoints(points);
  const levelStartPoints = (level - 1) * 1000;
  const levelEndPoints = level * 1000;
  const currentLevelPoints = points - levelStartPoints;
  const totalLevelPoints = levelEndPoints - levelStartPoints;

  return (currentLevelPoints / totalLevelPoints) * 100;
};

// ============================================
// PROGRESS & STATISTIKY
// ============================================

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

export const estimateTimeRemaining = (totalHours, progress) => {
  if (!totalHours || progress >= 100) return 0;

  const completedHours = (totalHours * progress) / 100;
  const remainingHours = totalHours - completedHours;

  return Math.ceil(remainingHours);
};

export const formatDuration = (minutes) => {
  if (!minutes) return '0 min';

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${mins} min`;
};

// ============================================
// KURZY
// ============================================

export const getCourseTypeLabel = (type) => {
  const labels = {
    paid: 'Placený',
    free: 'Zdarma',
    school: 'Škola',
    workshop: 'Workshop',
    book: 'Kniha',
    article: 'Článek',
    video: 'Video',
    other: 'Jiné',
  };

  return labels[type] || type;
};

export const getCourseStatusLabel = (status) => {
  const labels = {
    not_started: 'Nezačato',
    in_progress: 'Probíhá',
    completed: 'Dokončeno',
    paused: 'Pozastaveno',
    expired: 'Vypršelo',
  };

  return labels[status] || status;
};

export const getPriorityLabel = (priority) => {
  const labels = {
    0: 'Nízká',
    1: 'Střední',
    2: 'Vysoká',
  };

  return labels[priority] || 'Nízká';
};

export const sortCourses = (courses, sortBy = 'priority') => {
  const sorted = [...courses];

  switch (sortBy) {
    case 'priority':
      return sorted.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    case 'progress':
      return sorted.sort((a, b) => (b.progress_percentage || 0) - (a.progress_percentage || 0));

    case 'deadline':
      return sorted.sort((a, b) => {
        if (!a.access_until) return 1;
        if (!b.access_until) return -1;
        return new Date(a.access_until) - new Date(b.access_until);
      });

    case 'recent':
      return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    case 'alphabetical':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    default:
      return sorted;
  }
};

export const filterCourses = (courses, filters) => {
  let filtered = [...courses];

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter((c) => c.status === filters.status);
  }

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((c) => c.category === filters.category);
  }

  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter((c) => c.course_type === filters.type);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(searchLower) ||
        c.description?.toLowerCase().includes(searchLower) ||
        c.instructor?.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

// ============================================
// VALIDACE
// ============================================

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ============================================
// FORMÁTOVÁNÍ
// ============================================

export const formatPrice = (price, currency = 'CZK') => {
  if (!price) return 'Zdarma';

  const formatted = new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price);

  return formatted;
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('cs-CZ').format(num);
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// ============================================
// COLORS & THEMES
// ============================================

export const getRandomGradient = () => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  ];

  return gradients[Math.floor(Math.random() * gradients.length)];
};

// ============================================
// LOCAL STORAGE
// ============================================

export const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};
