import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../utils/supabase';
import { useAuth } from '../contexts/AuthContext';
import { checkAndTriggerAchievements } from '../utils/achievementHelper';
import { showToast } from '../utils/toast';

// Query keys - Hierarchical structure for efficient invalidation
export const courseKeys = {
  all: ['courses'],
  lists: () => [...courseKeys.all, 'list'],
  list: (userId) => [...courseKeys.lists(), userId],
  details: () => [...courseKeys.all, 'detail'],
  detail: (id) => [...courseKeys.details(), id],
  lessons: (courseId) => [...courseKeys.detail(courseId), 'lessons'],
  notes: (courseId) => [...courseKeys.detail(courseId), 'notes'],
  materials: (courseId) => [...courseKeys.detail(courseId), 'materials'],
};

// Fetch all courses for user
export const useCourses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: courseKeys.list(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('studypro_courses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

// Fetch single course
export const useCourse = (courseId) => {
  return useQuery({
    queryKey: courseKeys.detail(courseId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('studypro_courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
};

// Fetch course lessons
export const useCourseLessons = (courseId) => {
  return useQuery({
    queryKey: courseKeys.lessons(courseId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('studypro_course_lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
};

// Fetch course notes
export const useCourseNotes = (courseId) => {
  return useQuery({
    queryKey: courseKeys.notes(courseId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('studypro_course_notes')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
};

// Create course mutation with optimistic updates
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();

  return useMutation({
    mutationFn: async (courseData) => {
      const { data, error } = await supabase
        .from('studypro_courses')
        .insert([{ ...courseData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    // Optimistic update - immediately update UI
    onMutate: async (newCourse) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: courseKeys.list(user.id) });

      // Snapshot previous value
      const previousCourses = queryClient.getQueryData(courseKeys.list(user.id));

      // Optimistically update
      const optimisticCourse = {
        id: `temp-${Date.now()}`,
        ...newCourse,
        user_id: user.id,
        created_at: new Date().toISOString(),
        progress_percentage: 0,
      };

      queryClient.setQueryData(courseKeys.list(user.id), (old) =>
        [optimisticCourse, ...(old || [])]
      );

      return { previousCourses };
    },
    onError: (err, newCourse, context) => {
      // Rollback on error
      queryClient.setQueryData(courseKeys.list(user.id), context.previousCourses);
      showToast.error(`Chyba při vytváření kurzu: ${err.message}`);
    },
    onSuccess: async (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: courseKeys.list(user.id) });

      // Show success toast
      showToast.success('Kurz byl vytvořen! 📚');

      // Check for achievements
      if (user && profile) {
        const achievements = await checkAndTriggerAchievements(user.id, profile);
        if (achievements.length > 0) {
          achievements.forEach((achievement) => {
            showToast.achievement(achievement.message || achievement.key);
          });
        }
      }
    },
  });
};

// Update course mutation with optimistic updates
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from('studypro_courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    // Optimistic update
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: courseKeys.list(user.id) });
      await queryClient.cancelQueries({ queryKey: courseKeys.detail(id) });

      const previousCourses = queryClient.getQueryData(courseKeys.list(user.id));
      const previousCourse = queryClient.getQueryData(courseKeys.detail(id));

      // Optimistically update list
      queryClient.setQueryData(courseKeys.list(user.id), (old) =>
        old?.map((course) => (course.id === id ? { ...course, ...updates } : course))
      );

      // Optimistically update detail
      queryClient.setQueryData(courseKeys.detail(id), (old) =>
        old ? { ...old, ...updates } : null
      );

      return { previousCourses, previousCourse };
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(courseKeys.list(user.id), context.previousCourses);
      queryClient.setQueryData(courseKeys.detail(id), context.previousCourse);
      showToast.error(`Chyba při aktualizaci: ${err.message}`);
    },
    onSuccess: async (data, { updates }) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.list(user.id) });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(data.id) });

      showToast.success('Kurz aktualizován! ✅');

      // Check for achievements on course completion
      if (updates.status === 'completed' && user && profile) {
        const achievements = await checkAndTriggerAchievements(user.id, profile);
        if (achievements.length > 0) {
          achievements.forEach((achievement) => {
            showToast.achievement(achievement.message || achievement.key);
          });
        }
      }
    },
  });
};

// Delete course mutation with optimistic updates
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (courseId) => {
      const { error } = await supabase
        .from('studypro_courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
      return courseId;
    },
    // Optimistic delete
    onMutate: async (courseId) => {
      await queryClient.cancelQueries({ queryKey: courseKeys.list(user.id) });

      const previousCourses = queryClient.getQueryData(courseKeys.list(user.id));

      // Optimistically remove from list
      queryClient.setQueryData(courseKeys.list(user.id), (old) =>
        old?.filter((course) => course.id !== courseId)
      );

      return { previousCourses };
    },
    onError: (err, courseId, context) => {
      queryClient.setQueryData(courseKeys.list(user.id), context.previousCourses);
      showToast.error(`Chyba při mazání: ${err.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.list(user.id) });
      showToast.success('Kurz byl smazán! 🗑️');
    },
  });
};

// Create lesson mutation with optimistic updates
export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, lessonData }) => {
      const { data, error } = await supabase
        .from('studypro_course_lessons')
        .insert([{ ...lessonData, course_id: courseId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ courseId, lessonData }) => {
      await queryClient.cancelQueries({ queryKey: courseKeys.lessons(courseId) });
      const previousLessons = queryClient.getQueryData(courseKeys.lessons(courseId));

      const optimisticLesson = {
        id: `temp-${Date.now()}`,
        ...lessonData,
        course_id: courseId,
        is_completed: false,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData(courseKeys.lessons(courseId), (old) =>
        [...(old || []), optimisticLesson]
      );

      return { previousLessons };
    },
    onError: (err, { courseId }, context) => {
      queryClient.setQueryData(courseKeys.lessons(courseId), context.previousLessons);
      showToast.error(`Chyba při vytváření lekce: ${err.message}`);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lessons(data.course_id) });
      showToast.success('Lekce přidána! 📝');
    },
  });
};

// Update lesson mutation
export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates, courseId }) => {
      const { data, error } = await supabase
        .from('studypro_course_lessons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lessons(data.course_id) });
    },
  });
};

// Create note mutation
export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, noteData }) => {
      const { data, error } = await supabase
        .from('studypro_course_notes')
        .insert([{ ...noteData, course_id: courseId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.notes(data.course_id) });
    },
  });
};
