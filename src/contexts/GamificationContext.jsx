import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from './AuthContext';
import { calculatePoints } from '../utils/helpers';
import useSoundFeedback from '../../shared/src/hooks/useSoundFeedback';
import { checkAchievements as checkAchievementTriggers, calculateUserStats, ACHIEVEMENT_DEFINITIONS } from '../utils/achievementTriggers';

const GamificationContext = createContext({});

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};

export const GamificationProvider = ({ children }) => {
  const { user, profile, updateProfile } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [goals, setGoals] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔊 Sound feedback pro gamifikaci!
  const { playClick, playSuccess, playError, playAchievement } = useSoundFeedback({
    volume: 0.3,
    enabled: true,
  });

  useEffect(() => {
    if (user) {
      loadGamificationData();
    } else {
      setAchievements([]);
      setUserAchievements([]);
      setGoals([]);
      setStudySessions([]);
      setLoading(false);
    }
  }, [user]);

  const loadGamificationData = async () => {
    try {
      setLoading(true);

      // Načtení všech achievementů
      const { data: achievementsData } = await supabase
        .from('studypro_achievements')
        .select('*')
        .order('points', { ascending: true });

      setAchievements(achievementsData || []);

      // Načtení odemčených achievementů
      const { data: userAchievementsData } = await supabase
        .from('studypro_user_achievements')
        .select('*, achievement:studypro_achievements(*)')
        .eq('user_id', user.id);

      setUserAchievements(userAchievementsData || []);

      // Načtení cílů
      const { data: goalsData } = await supabase
        .from('studypro_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('deadline', { ascending: true });

      setGoals(goalsData || []);

      // Načtení studijních sezení (poslední měsíc)
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const { data: sessionsData } = await supabase
        .from('studypro_study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('session_date', oneMonthAgo.toISOString().split('T')[0])
        .order('session_date', { ascending: false });

      setStudySessions(sessionsData || []);
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // BODY A LEVELY
  // ============================================

  const addPoints = async (activityType, value = 1) => {
    try {
      const points = calculatePoints(activityType, value);

      await updateProfile({
        total_points: (profile?.total_points || 0) + points,
      });

      // ✨ Zvuk pro získání bodů
      if (points > 50) {
        playSuccess();
      }

      return points;
    } catch (error) {
      console.error('Error adding points:', error);
    }
  };

  // ============================================
  // ACHIEVEMENTY
  // ============================================

  const unlockAchievement = async (achievementCode) => {
    try {
      // Zkontrolovat, jestli už není odemčený
      const alreadyUnlocked = userAchievements.some(
        (ua) => ua.achievement.code === achievementCode
      );

      if (alreadyUnlocked) return;

      // Najít achievement
      const achievement = achievements.find((a) => a.code === achievementCode);
      if (!achievement) return;

      // Odemknout
      const { data, error } = await supabase
        .from('studypro_user_achievements')
        .insert([
          {
            user_id: user.id,
            achievement_id: achievement.id,
          },
        ])
        .select('*, achievement:studypro_achievements(*)')
        .single();

      if (error) throw error;

      setUserAchievements((prev) => [...prev, data]);

      // 🎉 Zvuk pro achievement!
      playAchievement();

      // Přidat body
      await addPoints('achievement', achievement.points / 10);

      return data;
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };

  const checkAchievements = async (stats) => {
    try {
      // Kontrola různých achievementů na základě statistik
      const { courseCount, completedCourses, currentStreak } = stats;

      // První kurz
      if (courseCount >= 1) {
        await unlockAchievement('first_course');
      }

      // První dokončení
      if (completedCourses >= 1) {
        await unlockAchievement('first_completion');
      }

      // Streaky
      if (currentStreak >= 7) {
        await unlockAchievement('week_streak');
      }
      if (currentStreak >= 30) {
        await unlockAchievement('month_streak');
      }

      // Knowledge seeker
      if (completedCourses >= 10) {
        await unlockAchievement('knowledge_seeker');
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  // ============================================
  // STUDIJNÍ SEZENÍ
  // ============================================

  const logStudySession = async (courseId, lessonId, durationMinutes, notes = '') => {
    try {
      const points = calculatePoints('study_session', durationMinutes);

      const { data, error } = await supabase
        .from('studypro_study_sessions')
        .insert([
          {
            user_id: user.id,
            course_id: courseId,
            lesson_id: lessonId,
            session_date: new Date().toISOString().split('T')[0],
            start_time: new Date().toISOString(),
            duration_minutes: durationMinutes,
            points_earned: points,
            notes,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setStudySessions((prev) => [data, ...prev]);

      // Reload gamification data to update streak
      await loadGamificationData();

      return { success: true, data };
    } catch (error) {
      console.error('Error logging study session:', error);
      return { success: false, error: error.message };
    }
  };

  // ============================================
  // CÍLE
  // ============================================

  const createGoal = async (goalData) => {
    try {
      const newGoal = {
        ...goalData,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('studypro_goals')
        .insert([newGoal])
        .select()
        .single();

      if (error) throw error;

      setGoals((prev) => [...prev, data]);

      await addPoints('add_goal');

      return { success: true, data };
    } catch (error) {
      console.error('Error creating goal:', error);
      return { success: false, error: error.message };
    }
  };

  const updateGoal = async (goalId, updates) => {
    try {
      const { data, error } = await supabase
        .from('studypro_goals')
        .update(updates)
        .eq('id', goalId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setGoals((prev) => prev.map((g) => (g.id === goalId ? data : g)));

      // Pokud byl cíl dokončen, přidat bonus body
      if (updates.is_completed && !goals.find((g) => g.id === goalId)?.is_completed) {
        await addPoints('complete_goal');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error updating goal:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      const { error } = await supabase
        .from('studypro_goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;

      setGoals((prev) => prev.filter((g) => g.id !== goalId));

      return { success: true };
    } catch (error) {
      console.error('Error deleting goal:', error);
      return { success: false, error: error.message };
    }
  };

  // ============================================
  // AUTO-UNLOCK ACHIEVEMENTS
  // ============================================

  /**
   * Check and unlock achievements based on current user stats
   * Returns array of newly unlocked achievements
   */
  const checkAndUnlockAchievements = async (coursesOverride = null) => {
    try {
      if (!user || !profile) return [];

      // Fetch current data (or use override from context)
      const { data: courses } = await supabase
        .from('studypro_courses')
        .select('*')
        .eq('user_id', user.id);

      const { data: sessions } = await supabase
        .from('studypro_study_sessions')
        .select('*')
        .eq('user_id', user.id);

      const { data: goalsData } = await supabase
        .from('studypro_goals')
        .select('*')
        .eq('user_id', user.id);

      // Calculate user stats
      const stats = calculateUserStats(
        coursesOverride || courses || [],
        sessions || [],
        goalsData || [],
        profile
      );

      // Check which achievements should be unlocked
      const newlyUnlocked = await checkAchievementTriggers(user.id, stats);

      // Unlock each new achievement
      const unlockedAchievements = [];
      for (const achievement of newlyUnlocked) {
        const { data, error } = await supabase
          .from('studypro_user_achievements')
          .insert({
            user_id: user.id,
            achievement_id: achievement.id,
            unlocked_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (!error && data) {
          unlockedAchievements.push({
            ...achievement,
            unlocked_at: data.unlocked_at,
          });

          // Add points for achievement
          await addPoints('achievement', 25);

          // Play achievement sound
          playAchievement();
        }
      }

      // Reload user achievements
      if (unlockedAchievements.length > 0) {
        await loadGamificationData();
      }

      return unlockedAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  };

  const value = {
    achievements,
    userAchievements,
    goals,
    studySessions,
    loading,
    addPoints,
    unlockAchievement,
    checkAchievements,
    checkAndUnlockAchievements, // ⭐ NEW: Auto-unlock achievements
    logStudySession,
    createGoal,
    updateGoal,
    deleteGoal,
    loadGamificationData,
    refreshGamification: loadGamificationData, // Alias for hook compatibility
    // 🔊 Export sound feedback hooks
    playClick,
    playSuccess,
    playError,
    playAchievement,
  };

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
};
