// Notification utilities for StudyPro

/**
 * Request notification permission from the browser
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * Check if notifications are supported and permitted
 */
export const areNotificationsEnabled = () => {
  return 'Notification' in window && Notification.permission === 'granted';
};

/**
 * Send a notification
 */
export const sendNotification = (title, options = {}) => {
  if (!areNotificationsEnabled()) {
    console.warn('Notifications are not enabled');
    return null;
  }

  const notification = new Notification(title, {
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    ...options,
  });

  return notification;
};

/**
 * Notification types and their configurations
 */
export const NOTIFICATION_TYPES = {
  DEADLINE_REMINDER: {
    title: 'Blížící se deadline!',
    icon: '⏰',
    tag: 'deadline',
  },
  STUDY_REMINDER: {
    title: 'Čas na studium!',
    icon: '📚',
    tag: 'study',
  },
  MILESTONE_50: {
    title: 'Gratulujeme! 🎉',
    icon: '🎯',
    tag: 'milestone',
  },
  MILESTONE_75: {
    title: 'Už jsi skoro u cíle! 🚀',
    icon: '🎯',
    tag: 'milestone',
  },
  MILESTONE_100: {
    title: 'Kurz dokončen! 🏆',
    icon: '🏆',
    tag: 'milestone',
  },
  STREAK_REMINDER: {
    title: 'Nezapomeň na svůj streak!',
    icon: '🔥',
    tag: 'streak',
  },
};

/**
 * Send a deadline reminder notification
 */
export const sendDeadlineReminder = (courseName, hoursRemaining) => {
  const config = NOTIFICATION_TYPES.DEADLINE_REMINDER;

  let body = '';
  if (hoursRemaining <= 24) {
    body = `Kurz "${courseName}" má deadline za méně než ${Math.round(hoursRemaining)} hodin!`;
  } else {
    const days = Math.round(hoursRemaining / 24);
    body = `Kurz "${courseName}" má deadline za ${days} dní.`;
  }

  return sendNotification(config.title, {
    body,
    tag: config.tag,
    requireInteraction: hoursRemaining <= 24,
  });
};

/**
 * Send a study reminder notification
 */
export const sendStudyReminder = (message = 'Je čas na studium! Udržuj svůj streak aktivní.') => {
  const config = NOTIFICATION_TYPES.STUDY_REMINDER;

  return sendNotification(config.title, {
    body: message,
    tag: config.tag,
  });
};

/**
 * Send a milestone notification
 */
export const sendMilestoneNotification = (courseName, percentage) => {
  let config;
  let body;

  if (percentage >= 100) {
    config = NOTIFICATION_TYPES.MILESTONE_100;
    body = `Dokončil jsi kurz "${courseName}"! Skvělá práce!`;
  } else if (percentage >= 75) {
    config = NOTIFICATION_TYPES.MILESTONE_75;
    body = `Dosáhl jsi 75% v kurzu "${courseName}". Pokračuj!`;
  } else if (percentage >= 50) {
    config = NOTIFICATION_TYPES.MILESTONE_50;
    body = `Jsi v polovině kurzu "${courseName}"!`;
  } else {
    return null;
  }

  return sendNotification(config.title, {
    body,
    tag: config.tag,
  });
};

/**
 * Send a streak reminder notification
 */
export const sendStreakReminder = (currentStreak) => {
  const config = NOTIFICATION_TYPES.STREAK_REMINDER;

  return sendNotification(config.title, {
    body: `Máš ${currentStreak} denní streak! Zastuduj si dnes něco, aby jsi ho neztratil.`,
    tag: config.tag,
  });
};

/**
 * Check for upcoming deadlines and send notifications
 */
export const checkDeadlines = (courses) => {
  if (!areNotificationsEnabled()) return;

  const now = new Date();
  const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  courses.forEach((course) => {
    if (!course.deadline || course.status === 'completed') return;

    const deadline = new Date(course.deadline);

    // Notify if deadline is within 24 hours
    if (deadline <= oneDayFromNow && deadline > now) {
      const hoursRemaining = (deadline - now) / (1000 * 60 * 60);
      sendDeadlineReminder(course.title, hoursRemaining);
    }
    // Or if deadline is within 3 days (less urgent)
    else if (deadline <= threeDaysFromNow && deadline > oneDayFromNow) {
      const hoursRemaining = (deadline - now) / (1000 * 60 * 60);
      sendDeadlineReminder(course.title, hoursRemaining);
    }
  });
};

/**
 * Schedule a study reminder
 */
export const scheduleStudyReminder = (hours = 24) => {
  if (!areNotificationsEnabled()) return null;

  const timeoutMs = hours * 60 * 60 * 1000;

  return setTimeout(() => {
    sendStudyReminder();
  }, timeoutMs);
};

/**
 * Get notification permission status
 */
export const getNotificationStatus = () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};
