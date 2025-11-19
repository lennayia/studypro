import { describe, it, expect } from 'vitest';
import { applyFilters } from '../courseUtils';

describe('courseUtils', () => {
  const mockCourses = [
    {
      id: 1,
      title: 'React Basics',
      lecturer: 'John Doe',
      category: 'Frontend',
      status: 'in_progress',
      priority: 1,
      progress_percentage: 50,
      created_at: '2024-01-01',
    },
    {
      id: 2,
      title: 'Node.js Advanced',
      lecturer: 'Jane Smith',
      category: 'Backend',
      status: 'not_started',
      priority: 2,
      progress_percentage: 0,
      created_at: '2024-01-02',
    },
    {
      id: 3,
      title: 'React Advanced',
      lecturer: 'John Doe',
      category: 'Frontend',
      status: 'completed',
      priority: 3,
      progress_percentage: 100,
      created_at: '2024-01-03',
    },
  ];

  describe('applyFilters', () => {
    it('should return all courses when no filters are applied', () => {
      const filters = {
        search: '',
        category: '',
        status: '',
        priority: '',
        sortBy: 'created_at',
        sortOrder: 'desc',
      };

      const result = applyFilters(mockCourses, filters);
      expect(result).toHaveLength(3);
    });

    it('should filter courses by search term', () => {
      const filters = {
        search: 'react',
        category: '',
        status: '',
        priority: '',
        sortBy: 'created_at',
        sortOrder: 'desc',
      };

      const result = applyFilters(mockCourses, filters);
      expect(result).toHaveLength(2);
      expect(result[0].title).toContain('React');
      expect(result[1].title).toContain('React');
    });

    it('should filter courses by category', () => {
      const filters = {
        search: '',
        category: 'Frontend',
        status: '',
        priority: '',
        sortBy: 'created_at',
        sortOrder: 'desc',
      };

      const result = applyFilters(mockCourses, filters);
      expect(result).toHaveLength(2);
      expect(result.every((c) => c.category === 'Frontend')).toBe(true);
    });

    it('should filter courses by status', () => {
      const filters = {
        search: '',
        category: '',
        status: 'completed',
        priority: '',
        sortBy: 'created_at',
        sortOrder: 'desc',
      };

      const result = applyFilters(mockCourses, filters);
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('completed');
    });

    it('should filter courses by priority', () => {
      const filters = {
        search: '',
        category: '',
        status: '',
        priority: '1',
        sortBy: 'created_at',
        sortOrder: 'desc',
      };

      const result = applyFilters(mockCourses, filters);
      expect(result).toHaveLength(1);
      expect(result[0].priority).toBe(1);
    });

    it('should sort courses by title ascending', () => {
      const filters = {
        search: '',
        category: '',
        status: '',
        priority: '',
        sortBy: 'title',
        sortOrder: 'asc',
      };

      const result = applyFilters(mockCourses, filters);
      expect(result[0].title).toBe('Node.js Advanced');
      expect(result[1].title).toBe('React Advanced');
      expect(result[2].title).toBe('React Basics');
    });

    it('should sort courses by progress descending', () => {
      const filters = {
        search: '',
        category: '',
        status: '',
        priority: '',
        sortBy: 'progress',
        sortOrder: 'desc',
      };

      const result = applyFilters(mockCourses, filters);
      expect(result[0].progress_percentage).toBe(100);
      expect(result[1].progress_percentage).toBe(50);
      expect(result[2].progress_percentage).toBe(0);
    });

    it('should combine multiple filters', () => {
      const filters = {
        search: 'react',
        category: 'Frontend',
        status: 'in_progress',
        priority: '',
        sortBy: 'title',
        sortOrder: 'asc',
      };

      const result = applyFilters(mockCourses, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('React Basics');
      expect(result[0].category).toBe('Frontend');
      expect(result[0].status).toBe('in_progress');
    });
  });
});
