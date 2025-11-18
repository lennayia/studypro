import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Fab,
} from '@mui/material';
import {
  CoursesPageIcon,
  AddButtonIcon,
  SearchButtonIcon,
  EmptyGraduationIcon,
  EmptySearchIcon,
} from '../../shared/src/components/icons';
import { useCourses } from '../contexts/CourseContext';
import { CourseCard } from '../components/courses/CourseCard';
import { CourseForm } from '../components/courses/CourseForm';
import { LoadingSpinner, EmptyState } from '../../shared/src/components/common';
import { useNavigate } from 'react-router-dom';
import { filterCourses, sortCourses } from '../utils/helpers';

export const CoursesPage = () => {
  const navigate = useNavigate();
  const { courses, loading, createCourse, updateCourse, deleteCourse } = useCourses();

  const [formOpen, setFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
    type: 'all',
  });
  const [sortBy, setSortBy] = useState('priority');

  const handleCreateCourse = async (data) => {
    const result = await createCourse(data);
    if (result.success) {
      setFormOpen(false);
    }
  };

  const handleUpdateCourse = async (data) => {
    const result = await updateCourse(editingCourse.id, data);
    if (result.success) {
      setFormOpen(false);
      setEditingCourse(null);
    }
  };

  const handleDeleteCourse = async (course) => {
    if (window.confirm(`Opravdu chceš smazat kurz "${course.title}"?`)) {
      await deleteCourse(course.id);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingCourse(null);
  };

  if (loading) return <LoadingSpinner size={60} message="Načítám kurzy..." />;

  // Filtrování a řazení
  const filteredCourses = sortCourses(filterCourses(courses, filters), sortBy);

  const categories = [...new Set(courses.map((c) => c.category).filter(Boolean))];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <CoursesPageIcon />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Moje kurzy
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Celkem {courses.length} {courses.length === 1 ? 'kurz' : courses.length < 5 ? 'kurzy' : 'kurzů'}
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={<AddButtonIcon />}
          onClick={() => setFormOpen(true)}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          Přidat kurz
        </Button>
      </Box>

      {/* Filters */}
      {courses.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Hledat kurz..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchButtonIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              select
              label="Status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <MenuItem value="all">Všechny</MenuItem>
              <MenuItem value="not_started">Nezačato</MenuItem>
              <MenuItem value="in_progress">Probíhá</MenuItem>
              <MenuItem value="completed">Dokončeno</MenuItem>
              <MenuItem value="paused">Pozastaveno</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              select
              label="Kategorie"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <MenuItem value="all">Všechny</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6} sm={6} md={2}>
            <TextField
              fullWidth
              select
              label="Typ"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <MenuItem value="all">Všechny</MenuItem>
              <MenuItem value="paid">Placené</MenuItem>
              <MenuItem value="free">Zdarma</MenuItem>
              <MenuItem value="school">Škola</MenuItem>
              <MenuItem value="workshop">Workshop</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6} sm={6} md={2}>
            <TextField
              fullWidth
              select
              label="Řadit podle"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="progress">Pokroku</MenuItem>
              <MenuItem value="deadline">Deadline</MenuItem>
              <MenuItem value="recent">Nejnovější</MenuItem>
              <MenuItem value="alphabetical">A-Z</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      )}

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <Grid container spacing={3}>
          {filteredCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <CourseCard
                course={course}
                onClick={() => navigate(`/courses/${course.id}`)}
                onEdit={handleEdit}
                onDelete={handleDeleteCourse}
              />
            </Grid>
          ))}
        </Grid>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={<EmptyGraduationIcon />}
          title="Zatím žádné kurzy"
          description="Přidej svůj první kurz a začni sledovat svůj studijní pokrok!"
          actionLabel="Přidat první kurz"
          onAction={() => setFormOpen(true)}
        />
      ) : (
        <EmptyState
          icon={<EmptySearchIcon />}
          title="Žádné kurzy nenalezeny"
          description="Zkus upravit filtry nebo hledání"
        />
      )}

      {/* Course Form Dialog */}
      <CourseForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
        initialData={editingCourse}
      />

      {/* Floating Action Button (mobile) */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: { xs: 'flex', sm: 'none' },
        }}
        onClick={() => setFormOpen(true)}
      >
        <AddButtonIcon size={24} />
      </Fab>
    </Box>
  );
};
