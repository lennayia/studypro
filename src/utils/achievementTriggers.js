import { supabase } from '../utils/supabase';

/**
 * Achievement definitions with unlock conditions
 */
export const ACHIEVEMENT_DEFINITIONS = {
  // Course-related achievements
  first_course: {
    id: 1,
    condition: (data) => data.totalCourses >= 1,
    message: 'Vytvořil jsi svůj první kurz!',
  },
  five_courses: {
    id: 2,
    condition: (data) => data.totalCourses >= 5,
    message: 'Máš už 5 kurzů!',
  },
  ten_courses: {
    id: 3,
    condition: (data) => data.totalCourses >= 10,
    message: 'Sběratel kurzů - 10 kurzů!',
  },

  // Completion achievements
  first_completion: {
    id: 4,
    condition: (data) => data.completedCourses >= 1,
    message: 'Dokončil jsi svůj první kurz!',
  },
  five_completions: {
    id: 5,
    condition: (data) => data.completedCourses >= 5,
    message: 'Finisher! 5 dokončených kurzů!',
  },
  ten_completions: {
    id: 6,
    condition: (data) => data.completedCourses >= 10,
    message: 'Mistr dokončování - 10 kurzů!',
  },

  // Streak achievements
  streak_7: {
    id: 7,
    condition: (data) => data.currentStreak >= 7,
    message: 'Týdenní streak! 🔥',
  },
  streak_30: {
    id: 8,
    condition: (data) => data.currentStreak >= 30,
    message: 'Měsíční streak! Neuvěřitelné! 🔥🔥',
  },
  streak_100: {
    id: 9,
    condition: (data) => data.currentStreak >= 100,
    message: '100 denní streak! Jsi legenda! 🔥🔥🔥',
  },

  // Study session achievements
  first_session: {
    id: 10,
    condition: (data) => data.totalSessions >= 1,
    message: 'První studijní sezení!',
  },
  marathon: {
    id: 11,
    condition: (data) => data.longestSession >= 120,
    message: 'Marathon - 2+ hodiny v jednom sezení!',
  },
  early_bird: {
    id: 12,
    condition: (data) => data.hasEarlySession,
    message: 'Ranní ptáče - studoval jsi před 6:00!',
  },
  night_owl: {
    id: 13,
    condition: (data) => data.hasLateSession,
    message: 'Noční sova - studoval jsi po 22:00!',
  },

  // Points achievements
  points_100: {
    id: 14,
    condition: (data) => data.totalPoints >= 100,
    message: '100 bodů získáno!',
  },
  points_500: {
    id: 15,
    condition: (data) => data.totalPoints >= 500,
    message: '500 bodů! Pokračuj!',
  },
  points_1000: {
    id: 16,
    condition: (data) => data.totalPoints >= 1000,
    message: '1000 bodů! Úžasný výkon!',
  },

  // Goals achievements
  first_goal: {
    id: 17,
    condition: (data) => data.totalGoals >= 1,
    message: 'Vytvořil jsi svůj první cíl!',
  },
  goal_achiever: {
    id: 18,
    condition: (data) => data.completedGoals >= 5,
    message: 'Dosažitel cílů - 5 splněných cílů!',
  },

  // Special achievements
  perfectionist: {
    id: 19,
    condition: (data) => data.hasPerfectCourse,
    message: 'Perfekcionista - dokončil jsi kurz na 100%!',
  },
  speed_demon: {
    id: 20,
    condition: (data) => data.hasQuickCompletion,
    message: 'Rychlík - dokončil jsi kurz za méně než týden!',
  },
};

/**
 * Check which achievements should be unlocked based on current stats
 */
export const checkAchievements = async (userId, stats) => {
  try {
    // Get user's current achievements
    const { data: userAchievements, error } = await supabase
      .from('studypro_user_achievements')
      .select('achievement_id, unlocked_at')
      .eq('user_id', userId);

    if (error) throw error;

    // Get IDs of already unlocked achievements
    const unlockedIds = userAchievements
      .filter((ua) => ua.unlocked_at)
      .map((ua) => ua.achievement_id);

    // Check which achievements can be unlocked
    const newlyUnlocked = [];

    for (const [key, achievement] of Object.entries(ACHIEVEMENT_DEFINITIONS)) {
      // Skip if already unlocked
      if (unlockedIds.includes(achievement.id)) continue;

      // Check condition
      if (achievement.condition(stats)) {
        newlyUnlocked.push({
          id: achievement.id,
          key,
          message: achievement.message,
        });
      }
    }

    return newlyUnlocked;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
};

/**
 * Unlock an achievement for a user
 */
export const unlockAchievement = async (userId, achievementId) => {
  try {
    const { error } = await supabase
      .from('studypro_user_achievements')
      .update({ unlocked_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('achievement_id', achievementId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return { success: false, error };
  }
};

/**
 * Calculate user stats for achievement checking
 */
export const calculateUserStats = (courses, studySessions, goals, profile) => {
  const completedCourses = courses.filter((c) => c.status === 'completed');

  // Check for perfect course (100% progress)
  const hasPerfectCourse = courses.some((c) => c.progress_percentage === 100);

  // Check for quick completion (course completed in < 7 days)
  const hasQuickCompletion = completedCourses.some((course) => {
    if (!course.created_at || !course.updated_at) return false;
    const created = new Date(course.created_at);
    const completed = new Date(course.updated_at);
    const daysDiff = (completed - created) / (1000 * 60 * 60 * 24);
    return daysDiff < 7;
  });

  // Check for early/late sessions
  let hasEarlySession = false;
  let hasLateSession = false;
  let longestSession = 0;

  studySessions.forEach((session) => {
    if (session.duration_minutes > longestSession) {
      longestSession = session.duration_minutes;
    }

    // Check session time (would need session timestamp in DB)
    // For now, simplified check
    if (session.created_at) {
      const hour = new Date(session.created_at).getHours();
      if (hour < 6) hasEarlySession = true;
      if (hour >= 22) hasLateSession = true;
    }
  });

  const completedGoals = goals.filter((g) => g.completed).length;

  return {
    totalCourses: courses.length,
    completedCourses: completedCourses.length,
    currentStreak: profile?.current_streak || 0,
    longestStreak: profile?.longest_streak || 0,
    totalSessions: studySessions.length,
    longestSession,
    hasEarlySession,
    hasLateSession,
    totalPoints: profile?.total_points || 0,
    totalGoals: goals.length,
    completedGoals,
    hasPerfectCourse,
    hasQuickCompletion,
  };
};

/**
 * Trigger achievement check after an action
 */
export const triggerAchievementCheck = async (userId, context) => {
  const { courses, studySessions, goals, profile } = context;

  // Calculate stats
  const stats = calculateUserStats(courses, studySessions, goals, profile);

  // Check for new achievements
  const newAchievements = await checkAchievements(userId, stats);

  // Unlock new achievements
  const results = [];
  for (const achievement of newAchievements) {
    const result = await unlockAchievement(userId, achievement.id);
    if (result.success) {
      results.push(achievement);
    }
  }

  return results;
};
