// Course filtering and sorting utilities

export const applyFilters = (courses, filters) => {
  let filtered = [...courses];

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (course) =>
        course.title?.toLowerCase().includes(searchLower) ||
        course.lecturer?.toLowerCase().includes(searchLower) ||
        course.category?.toLowerCase().includes(searchLower)
    );
  }

  // Category filter
  if (filters.category) {
    filtered = filtered.filter((course) => course.category === filters.category);
  }

  // Status filter
  if (filters.status) {
    filtered = filtered.filter((course) => course.status === filters.status);
  }

  // Priority filter
  if (filters.priority !== '') {
    filtered = filtered.filter((course) => course.priority === parseInt(filters.priority));
  }

  // Sort
  const { sortBy, sortOrder } = filters;
  filtered.sort((a, b) => {
    let aVal, bVal;

    switch (sortBy) {
      case 'title':
        aVal = a.title || '';
        bVal = b.title || '';
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);

      case 'progress_percentage':
        aVal = a.progress_percentage || 0;
        bVal = b.progress_percentage || 0;
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;

      case 'priority':
        aVal = a.priority || 0;
        bVal = b.priority || 0;
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;

      case 'deadline':
        aVal = a.deadline ? new Date(a.deadline).getTime() : 0;
        bVal = b.deadline ? new Date(b.deadline).getTime() : 0;
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;

      case 'created_at':
      default:
        aVal = a.created_at ? new Date(a.created_at).getTime() : 0;
        bVal = b.created_at ? new Date(b.created_at).getTime() : 0;
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
  });

  return filtered;
};
