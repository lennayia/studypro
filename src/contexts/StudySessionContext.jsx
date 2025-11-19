import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from './AuthContext';
import { useGamification } from './GamificationContext';
import { useNotification } from '../../shared/src/context/NotificationContext';

const StudySessionContext = createContext({});

export const useStudySession = () => {
  const context = useContext(StudySessionContext);
  if (!context) {
    throw new Error('useStudySession must be used within StudySessionProvider');
  }
  return context;
};

export const StudySessionProvider = ({ children }) => {
  const { user } = useAuth();
  const { addPoints } = useGamification();
  const { showSuccess } = useNotification();

  const [activeSession, setActiveSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [timer, setTimer] = useState(0); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Pomodoro settings
  const [pomodoroMode, setPomodoroMode] = useState(false);
  const [workDuration, setWorkDuration] = useState(25 * 60); // 25 min in seconds
  const [breakDuration, setBreakDuration] = useState(5 * 60); // 5 min
  const [isBreak, setIsBreak] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval;

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev + 1;

          // Check Pomodoro completion
          if (pomodoroMode) {
            const targetDuration = isBreak ? breakDuration : workDuration;
            if (newTime >= targetDuration) {
              handlePomodoroComplete();
              return 0;
            }
          }

          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, pomodoroMode, isBreak, workDuration, breakDuration]);

  // Pomodoro completion
  const handlePomodoroComplete = () => {
    if (isBreak) {
      // Break finished, start work
      setIsBreak(false);
      showSuccess('Přestávka skončila', 'Čas se vrátit ke studiu! 💪');
      playNotificationSound();
    } else {
      // Work finished, start break
      setIsBreak(true);
      setCompletedPomodoros((prev) => prev + 1);
      showSuccess('Pomodoro dokončeno!', 'Čas na přestávku ☕');
      playNotificationSound();

      // Award points for completed Pomodoro
      if (activeSession) {
        awardSessionPoints(workDuration / 60); // minutes
      }
    }
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.play().catch(() => {});
    } catch (error) {
      console.error('Sound error:', error);
    }
  };

  // Start session
  const startSession = async (courseId = null, notes = '') => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert([
          {
            user_id: user.user.id,
            course_id: courseId,
            start_time: new Date().toISOString(),
            notes,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setActiveSession(data);
      setIsRunning(true);
      setTimer(0);
      setCompletedPomodoros(0);

      showSuccess('Session started', 'Hodně štěstí se studiem! 📚');

      return { success: true, data };
    } catch (error) {
      console.error('Error starting session:', error);
      return { success: false, error };
    }
  };

  // End session
  const endSession = async (notes = '') => {
    if (!activeSession) return;

    try {
      const durationMinutes = Math.floor(timer / 60);

      const { data, error } = await supabase
        .from('study_sessions')
        .update({
          end_time: new Date().toISOString(),
          duration_minutes: durationMinutes,
          notes: notes || activeSession.notes,
        })
        .eq('id', activeSession.id)
        .select()
        .single();

      if (error) throw error;

      // Award points based on duration
      await awardSessionPoints(durationMinutes);

      setActiveSession(null);
      setIsRunning(false);
      setIsPaused(false);
      setTimer(0);
      setIsBreak(false);

      // Reload sessions
      await fetchSessions();

      showSuccess(
        'Session dokončena!',
        `Studoval jsi ${durationMinutes} minut a získal jsi ${Math.floor(durationMinutes / 5)} bodů 🎉`
      );

      return { success: true, data };
    } catch (error) {
      console.error('Error ending session:', error);
      return { success: false, error };
    }
  };

  // Award points for study session
  const awardSessionPoints = async (durationMinutes) => {
    // Award 1 point per 5 minutes
    const points = Math.floor(durationMinutes / 5);
    if (points > 0) {
      await addPoints(points, `Studium: ${durationMinutes} minut`);
    }
  };

  // Pause/Resume
  const pauseSession = () => {
    setIsPaused(true);
  };

  const resumeSession = () => {
    setIsPaused(false);
  };

  // Pomodoro controls
  const togglePomodoroMode = () => {
    setPomodoroMode((prev) => !prev);
    setTimer(0);
    setIsBreak(false);
  };

  const skipBreak = () => {
    if (isBreak) {
      setIsBreak(false);
      setTimer(0);
    }
  };

  // Fetch sessions
  const fetchSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*, courses(title)')
        .eq('user_id', user.user.id)
        .order('start_time', { ascending: false })
        .limit(50);

      if (error) throw error;

      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  // Get today's total study time
  const getTodayStudyTime = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(
      (s) => s.start_time?.startsWith(today) && s.duration_minutes
    );
    return todaySessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  };

  // Get this week's total study time
  const getWeekStudyTime = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoISO = weekAgo.toISOString();

    const weekSessions = sessions.filter(
      (s) => s.start_time >= weekAgoISO && s.duration_minutes
    );
    return weekSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  };

  // Format time display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Load sessions on mount
  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const value = {
    // Session state
    activeSession,
    sessions,
    timer,
    isRunning,
    isPaused,

    // Pomodoro
    pomodoroMode,
    isBreak,
    completedPomodoros,
    workDuration,
    breakDuration,
    setWorkDuration,
    setBreakDuration,

    // Actions
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    togglePomodoroMode,
    skipBreak,

    // Stats
    getTodayStudyTime,
    getWeekStudyTime,

    // Utils
    formatTime,
  };

  return (
    <StudySessionContext.Provider value={value}>
      {children}
    </StudySessionContext.Provider>
  );
};
