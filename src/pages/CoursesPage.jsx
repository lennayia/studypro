import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Fab,
  Dialog,
  DialogContent,
  Stack,
} from '@mui/material';
import { GripVertical, FileUp } from 'lucide-react';
import {
  CoursesPageIcon,
  AddButtonIcon,
  EmptyGraduationIcon,
  EmptySearchIcon,
} from '../../shared/src/components/icons';
import { useCourses } from '../contexts/CourseContext';
import { CourseCard } from '../components/courses/CourseCard';
import { CourseForm } from '../components/courses/CourseForm';
import { CourseFilters } from '../components/courses/CourseFilters';
import { DraggableCourseList } from '../components/courses/DraggableCourseList';
import { CSVImport } from '../components/courses/CSVImport';
import { LoadingSpinner, EmptyState } from '../../shared/src/components/common';
import { useNavigate } from 'react-router-dom';
import { applyFilters } from '../utils/courseUtils';

export const CoursesPage = () => {
  const navigate = useNavigate();
  const { courses, loading, createCourse, updateCourse, deleteCourse } = useCourses();

  const [formOpen, setFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false);
  const [csvImportOpen, setCsvImportOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    priority: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

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

  const handlePriorityReorder = async (reorderedCourses) => {
    // Update each course's priority in the database
    for (const course of reorderedCourses) {
      await updateCourse(course.id, { priority: course.priority });
    }
  };

  const handleCSVImport = async (courses) => {
    // Import each course
    for (const courseData of courses) {
      await createCourse(courseData);
    }
  };

  if (loading) return <LoadingSpinner size={60} message="Načítám kurzy..." />;

  // Filtrování a řazení
  const filteredCourses = applyFilters(courses, filters);

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

        <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<FileUp size={20} />}
            onClick={() => setCsvImportOpen(true)}
          >
            Import CSV
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<GripVertical size={20} />}
            onClick={() => setPriorityDialogOpen(true)}
            disabled={courses.length === 0}
          >
            Uspořádat priority
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddButtonIcon />}
            onClick={() => setFormOpen(true)}
          >
            Přidat kurz
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
      {courses.length > 0 && (
        <CourseFilters onFilterChange={setFilters} courses={courses} />
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

      {/* Priority Reorder Dialog */}
      <Dialog
        open={priorityDialogOpen}
        onClose={() => setPriorityDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 3 }}>
          <DraggableCourseList
            courses={courses.slice().sort((a, b) => (a.priority || 999) - (b.priority || 999))}
            onReorder={handlePriorityReorder}
            onClose={() => setPriorityDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* CSV Import Dialog */}
      <Dialog
        open={csvImportOpen}
        onClose={() => setCsvImportOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 3 }}>
          <CSVImport
            onImport={handleCSVImport}
            onClose={() => setCsvImportOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
