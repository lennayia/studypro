import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../utils/supabase';
import { useAuth } from '../contexts/AuthContext';

// Query keys
export const courseKeys = {
  all: ['courses'],
  lists: () => [...courseKeys.all, 'list'],
  list: (userId) => [...courseKeys.lists(), userId],
  details: () => [...courseKeys.all, 'detail'],
  detail: (id) => [...courseKeys.details(), id],
  lessons: (courseId) => [...courseKeys.detail(courseId), 'lessons'],
  notes: (courseId) => [...courseKeys.detail(courseId), 'notes'],
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

// Create course mutation
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

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
    onSuccess: () => {
      // Invalidate courses query to refetch
      queryClient.invalidateQueries({ queryKey: courseKeys.list(user.id) });
    },
  });
};

// Update course mutation
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

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
    onSuccess: (data) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: courseKeys.list(user.id) });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(data.id) });
    },
  });
};

// Delete course mutation
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.list(user.id) });
    },
  });
};

// Create lesson mutation
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lessons(data.course_id) });
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
