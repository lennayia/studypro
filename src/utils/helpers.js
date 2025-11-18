import { format, formatDistanceToNow, differenceInDays, isPast, isToday, isTomorrow } from 'date-fns';
import { cs } from 'date-fns/locale';

// Import univerzálních funkcí ze shared
export {
  validateEmail,
  validateUrl,
} from '../../shared/src/utils/validation';

export {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
} from '../../shared/src/utils/storage';

export {
  formatPrice,
  formatNumber,
  truncateText,
  capitalize,
  formatPercent,
  formatFileSize,
} from '../../shared/src/utils/formatting';

export {
  calculateProgress,
  getProgressColor,
  estimateTimeRemaining,
  formatDuration,
} from '../../shared/src/utils/progress';

// ============================================
// DATUM A ČAS (StudyPro-specifické)
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

// calculateProgress, getProgressColor, estimateTimeRemaining, formatDuration
// jsou importované ze shared/src/utils/progress.js

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

// validateEmail, validateUrl - importované ze shared/src/utils/validation.js
// formatPrice, formatNumber, truncateText - importované ze shared/src/utils/formatting.js

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

export const getCategoryColor = (category) => {
  const colors = {
    programming: '#667eea',
    design: '#f093fb',
    business: '#4facfe',
    marketing: '#43e97b',
    language: '#fa709a',
    personal_development: '#30cfd0',
    health: '#a8edea',
    music: '#ff9a9e',
  };

  return colors[category] || '#667eea';
};

export const getStatusColor = (status) => {
  const colors = {
    not_started: '#9e9e9e',
    in_progress: '#2196f3',
    completed: '#4caf50',
    paused: '#ff9800',
    expired: '#f44336',
  };

  return colors[status] || '#9e9e9e';
};

// saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage
// jsou importované ze shared/src/utils/storage.js
