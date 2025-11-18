import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from './AuthContext';

const CourseContext = createContext({});

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within CourseProvider');
  }
  return context;
};

export const CourseProvider = ({ children }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState({});
  const [materials, setMaterials] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Načtení kurzů při přihlášení
  useEffect(() => {
    if (user) {
      loadCourses();
    } else {
      setCourses([]);
      setLessons({});
      setMaterials({});
      setLoading(false);
    }
  }, [user]);

  // ============================================
  // KURZY
  // ============================================

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('studypro_courses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData) => {
    try {
      setError(null);

      const newCourse = {
        ...courseData,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('studypro_courses')
        .insert([newCourse])
        .select()
        .single();

      if (error) throw error;

      setCourses((prev) => [data, ...prev]);
      return { success: true, data };
    } catch (error) {
      console.error('Error creating course:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const updateCourse = async (courseId, updates) => {
    try {
      setError(null);

      const { data, error } = await supabase
        .from('studypro_courses')
        .update(updates)
        .eq('id', courseId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setCourses((prev) => prev.map((c) => (c.id === courseId ? data : c)));
      return { success: true, data };
    } catch (error) {
      console.error('Error updating course:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      setError(null);

      const { error } = await supabase
        .from('studypro_courses')
        .delete()
        .eq('id', courseId)
        .eq('user_id', user.id);

      if (error) throw error;

      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting course:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // ============================================
  // LEKCE
  // ============================================

  const loadLessons = async (courseId) => {
    try {
      const { data, error } = await supabase
        .from('studypro_lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;

      setLessons((prev) => ({
        ...prev,
        [courseId]: data || [],
      }));

      return { success: true, data };
    } catch (error) {
      console.error('Error loading lessons:', error);
      return { success: false, error: error.message };
    }
  };

  const createLesson = async (courseId, lessonData) => {
    try {
      const newLesson = {
        ...lessonData,
        course_id: courseId,
      };

      const { data, error } = await supabase
        .from('studypro_lessons')
        .insert([newLesson])
        .select()
        .single();

      if (error) throw error;

      setLessons((prev) => ({
        ...prev,
        [courseId]: [...(prev[courseId] || []), data],
      }));

      return { success: true, data };
    } catch (error) {
      console.error('Error creating lesson:', error);
      return { success: false, error: error.message };
    }
  };

  const toggleLessonComplete = async (lessonId, courseId) => {
    try {
      const currentLessons = lessons[courseId] || [];
      const lesson = currentLessons.find((l) => l.id === lessonId);

      const { data, error } = await supabase
        .from('studypro_lessons')
        .update({
          is_completed: !lesson.is_completed,
          completed_at: !lesson.is_completed ? new Date().toISOString() : null,
        })
        .eq('id', lessonId)
        .select()
        .single();

      if (error) throw error;

      setLessons((prev) => ({
        ...prev,
        [courseId]: prev[courseId].map((l) => (l.id === lessonId ? data : l)),
      }));

      // Reload course to update progress
      await loadCourses();

      return { success: true, data };
    } catch (error) {
      console.error('Error toggling lesson:', error);
      return { success: false, error: error.message };
    }
  };

  // ============================================
  // MATERIÁLY
  // ============================================

  const loadMaterials = async (courseId) => {
    try {
      const { data, error } = await supabase
        .from('studypro_materials')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMaterials((prev) => ({
        ...prev,
        [courseId]: data || [],
      }));

      return { success: true, data };
    } catch (error) {
      console.error('Error loading materials:', error);
      return { success: false, error: error.message };
    }
  };

  const createMaterial = async (courseId, materialData) => {
    try {
      const newMaterial = {
        ...materialData,
        course_id: courseId,
      };

      const { data, error } = await supabase
        .from('studypro_materials')
        .insert([newMaterial])
        .select()
        .single();

      if (error) throw error;

      setMaterials((prev) => ({
        ...prev,
        [courseId]: [data, ...(prev[courseId] || [])],
      }));

      return { success: true, data };
    } catch (error) {
      console.error('Error creating material:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    courses,
    lessons,
    materials,
    loading,
    error,
    loadCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    loadLessons,
    createLesson,
    toggleLessonComplete,
    loadMaterials,
    createMaterial,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};
