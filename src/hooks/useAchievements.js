import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../contexts/CourseContext';
import { useGamification } from '../contexts/GamificationContext';
import { triggerAchievementCheck } from '../utils/achievementTriggers';

/**
 * Hook for managing achievement unlocks
 */
export const useAchievements = () => {
  const { profile } = useAuth();
  const { courses } = useCourses();
  const { studySessions, achievements, goals, refreshGamification } = useGamification();

  const [unlockedQueue, setUnlockedQueue] = useState([]);
  const [checking, setChecking] = useState(false);

  /**
   * Check for new achievements
   */
  const checkAchievements = useCallback(async () => {
    if (!profile?.id || checking) return;

    setChecking(true);

    try {
      const context = {
        courses,
        studySessions,
        goals,
        profile,
      };

      const newAchievements = await triggerAchievementCheck(profile.id, context);

      if (newAchievements.length > 0) {
        setUnlockedQueue((prev) => [...prev, ...newAchievements]);

        // Refresh gamification data to get updated achievements
        if (refreshGamification) {
          await refreshGamification();
        }
      }

      return newAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    } finally {
      setChecking(false);
    }
  }, [profile, courses, studySessions, goals, checking, refreshGamification]);

  /**
   * Clear achievement queue
   */
  const clearQueue = useCallback(() => {
    setUnlockedQueue([]);
  }, []);

  /**
   * Remove first achievement from queue
   */
  const dequeueAchievement = useCallback(() => {
    setUnlockedQueue((prev) => prev.slice(1));
  }, []);

  return {
    unlockedQueue,
    checking,
    checkAchievements,
    clearQueue,
    dequeueAchievement,
  };
};
