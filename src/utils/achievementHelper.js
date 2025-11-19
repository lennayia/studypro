import { supabase } from './supabase';
import { checkAchievements, calculateUserStats } from './achievementTriggers';

/**
 * Standalone achievement checker that doesn't depend on context
 * Can be called from anywhere (including CourseContext)
 * Returns newly unlocked achievements with notification data
 */
export const checkAndTriggerAchievements = async (userId, profileData) => {
  try {
    if (!userId) return [];

    // Fetch all necessary data
    const [coursesRes, sessionsRes, goalsRes] = await Promise.all([
      supabase.from('studypro_courses').select('*').eq('user_id', userId),
      supabase.from('studypro_study_sessions').select('*').eq('user_id', userId),
      supabase.from('studypro_goals').select('*').eq('user_id', userId),
    ]);

    const courses = coursesRes.data || [];
    const sessions = sessionsRes.data || [];
    const goals = goalsRes.data || [];

    // Calculate user stats
    const stats = calculateUserStats(courses, sessions, goals, profileData);

    // Check which achievements should be unlocked
    const newlyUnlocked = await checkAchievements(userId, stats);

    // Unlock each achievement and add points
    const results = [];
    for (const achievement of newlyUnlocked) {
      // Insert achievement
      const { data, error } = await supabase
        .from('studypro_user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievement.id,
          unlocked_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (!error && data) {
        // Add points to profile (25 points per achievement)
        const { data: profile } = await supabase
          .from('studypro_profiles')
          .select('total_points')
          .eq('id', userId)
          .single();

        await supabase
          .from('studypro_profiles')
          .update({
            total_points: (profile?.total_points || 0) + 25,
          })
          .eq('id', userId);

        results.push({
          ...achievement,
          unlocked_at: data.unlocked_at,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
};
