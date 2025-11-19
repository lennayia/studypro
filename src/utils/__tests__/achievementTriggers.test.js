import { describe, it, expect } from 'vitest';
import { calculateUserStats, ACHIEVEMENT_DEFINITIONS } from '../achievementTriggers';

describe('achievementTriggers', () => {
  describe('calculateUserStats', () => {
    it('should calculate basic stats correctly', () => {
      const courses = [
        { id: 1, status: 'in_progress', progress_percentage: 50 },
        { id: 2, status: 'completed', progress_percentage: 100 },
        { id: 3, status: 'not_started', progress_percentage: 0 },
      ];

      const studySessions = [
        { id: 1, duration_minutes: 30 },
        { id: 2, duration_minutes: 60 },
      ];

      const goals = [
        { id: 1, completed: true },
        { id: 2, completed: false },
      ];

      const profile = {
        total_points: 500,
        current_streak: 7,
        longest_streak: 10,
      };

      const stats = calculateUserStats(courses, studySessions, goals, profile);

      expect(stats.totalCourses).toBe(3);
      expect(stats.completedCourses).toBe(1);
      expect(stats.totalSessions).toBe(2);
      expect(stats.totalGoals).toBe(2);
      expect(stats.completedGoals).toBe(1);
      expect(stats.currentStreak).toBe(7);
      expect(stats.longestStreak).toBe(10);
      expect(stats.totalPoints).toBe(500);
    });

    it('should detect perfect course (100% progress)', () => {
      const courses = [
        { id: 1, progress_percentage: 100, status: 'completed' },
      ];

      const stats = calculateUserStats(courses, [], [], {});
      expect(stats.hasPerfectCourse).toBe(true);
    });

    it('should detect longest session', () => {
      const studySessions = [
        { id: 1, duration_minutes: 30 },
        { id: 2, duration_minutes: 150 }, // 2.5 hours
        { id: 3, duration_minutes: 60 },
      ];

      const stats = calculateUserStats([], studySessions, [], {});
      expect(stats.longestSession).toBe(150);
    });

    it('should handle empty data', () => {
      const stats = calculateUserStats([], [], [], {});

      expect(stats.totalCourses).toBe(0);
      expect(stats.completedCourses).toBe(0);
      expect(stats.totalSessions).toBe(0);
      expect(stats.totalGoals).toBe(0);
      expect(stats.completedGoals).toBe(0);
      expect(stats.hasPerfectCourse).toBe(false);
    });
  });

  describe('ACHIEVEMENT_DEFINITIONS', () => {
    it('should have correct achievement for first course', () => {
      const achievement = ACHIEVEMENT_DEFINITIONS.first_course;

      expect(achievement.id).toBe(1);
      expect(achievement.condition({ totalCourses: 1 })).toBe(true);
      expect(achievement.condition({ totalCourses: 0 })).toBe(false);
    });

    it('should have correct achievement for 7-day streak', () => {
      const achievement = ACHIEVEMENT_DEFINITIONS.streak_7;

      expect(achievement.id).toBe(7);
      expect(achievement.condition({ currentStreak: 7 })).toBe(true);
      expect(achievement.condition({ currentStreak: 6 })).toBe(false);
    });

    it('should have correct achievement for marathon session', () => {
      const achievement = ACHIEVEMENT_DEFINITIONS.marathon;

      expect(achievement.condition({ longestSession: 120 })).toBe(true);
      expect(achievement.condition({ longestSession: 119 })).toBe(false);
    });

    it('should have correct achievement for 100 points', () => {
      const achievement = ACHIEVEMENT_DEFINITIONS.points_100;

      expect(achievement.condition({ totalPoints: 100 })).toBe(true);
      expect(achievement.condition({ totalPoints: 99 })).toBe(false);
    });

    it('should have correct achievement for perfectionist', () => {
      const achievement = ACHIEVEMENT_DEFINITIONS.perfectionist;

      expect(achievement.condition({ hasPerfectCourse: true })).toBe(true);
      expect(achievement.condition({ hasPerfectCourse: false })).toBe(false);
    });
  });
});
