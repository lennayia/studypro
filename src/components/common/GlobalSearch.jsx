import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, Box, Typography, Chip, Stack } from '@mui/material';
import { Command } from 'cmdk';
import Fuse from 'fuse.js';
import {
  Search,
  BookOpen,
  Target,
  BarChart,
  Calendar,
  Settings,
  Trophy,
  Clock,
  FileText,
} from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';
import { useGamification } from '../../contexts/GamificationContext';
import './GlobalSearch.css';

/**
 * Global Command Palette (Cmd+K / Ctrl+K)
 * Fuzzy search across courses, lessons, notes, goals
 * Quick navigation and actions
 */
export const GlobalSearch = () => {
  const navigate = useNavigate();
  const { courses } = useCourses();
  const { goals } = useGamification();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Build searchable items
  const searchableItems = [
    // Navigation items
    { id: 'nav-dashboard', type: 'navigation', title: 'Dashboard', icon: <BarChart size={18} />, action: () => navigate('/dashboard') },
    { id: 'nav-courses', type: 'navigation', title: 'Kurzy', icon: <BookOpen size={18} />, action: () => navigate('/courses') },
    { id: 'nav-goals', type: 'navigation', title: 'Cíle', icon: <Target size={18} />, action: () => navigate('/goals') },
    { id: 'nav-stats', type: 'navigation', title: 'Statistiky', icon: <BarChart size={18} />, action: () => navigate('/stats') },
    { id: 'nav-calendar', type: 'navigation', title: 'Kalendář', icon: <Calendar size={18} />, action: () => navigate('/calendar') },
    { id: 'nav-study', type: 'navigation', title: 'Studijní timer', icon: <Clock size={18} />, action: () => navigate('/study') },
    { id: 'nav-gamification', type: 'navigation', title: 'Gamifikace', icon: <Trophy size={18} />, action: () => navigate('/gamification') },
    { id: 'nav-settings', type: 'navigation', title: 'Nastavení', icon: <Settings size={18} />, action: () => navigate('/settings') },

    // Courses
    ...courses.map((course) => ({
      id: `course-${course.id}`,
      type: 'course',
      title: course.title,
      subtitle: course.lecturer || course.category,
      icon: <BookOpen size={18} />,
      meta: `${course.progress_percentage || 0}% • ${course.status}`,
      action: () => navigate(`/courses/${course.id}`),
    })),

    // Goals
    ...goals.map((goal) => ({
      id: `goal-${goal.id}`,
      type: 'goal',
      title: goal.title,
      subtitle: goal.description,
      icon: <Target size={18} />,
      meta: goal.is_completed ? 'Splněno' : 'Aktivní',
      action: () => navigate('/goals'),
    })),
  ];

  // Fuzzy search setup
  const fuse = new Fuse(searchableItems, {
    keys: ['title', 'subtitle', 'meta'],
    threshold: 0.3,
    includeScore: true,
  });

  // Search handler
  useEffect(() => {
    if (!search) {
      setSearchResults(searchableItems.slice(0, 8)); // Show top 8 when empty
    } else {
      const results = fuse.search(search).map((result) => result.item);
      setSearchResults(results.slice(0, 10)); // Top 10 results
    }
  }, [search, courses, goals]);

  const handleSelect = useCallback((action) => {
    if (action) {
      action();
      setOpen(false);
      setSearch('');
    }
  }, []);

  const getTypeLabel = (type) => {
    const labels = {
      navigation: 'Navigace',
      course: 'Kurz',
      goal: 'Cíl',
      lesson: 'Lekce',
      note: 'Poznámka',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      navigation: 'primary',
      course: 'info',
      goal: 'success',
      lesson: 'warning',
      note: 'secondary',
    };
    return colors[type] || 'default';
  };

  return (
    <>
      {/* Trigger button (optional - can also just use keyboard) */}
      <Box
        onClick={() => setOpen(true)}
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
      >
        <Search size={18} color="#9ca3af" />
        <Typography variant="body2" color="text.secondary">
          Hledat...
        </Typography>
        <Chip
          label="⌘K"
          size="small"
          sx={{
            height: 20,
            fontSize: '0.7rem',
            bgcolor: 'action.selected',
            ml: 'auto',
          }}
        />
      </Box>

      {/* Command Dialog */}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setSearch('');
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '80vh',
            overflow: 'hidden',
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Command className="command-palette">
            {/* Search Input */}
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Search size={20} color="#9ca3af" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Hledat kurzy, cíle, stránky..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px',
                    width: '100%',
                    background: 'transparent',
                  }}
                />
              </Box>
            </Box>

            {/* Results */}
            <Command.List style={{ maxHeight: '400px', overflowY: 'auto', padding: '8px' }}>
              <Command.Empty>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Search size={48} color="#d1d5db" />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Nic nenalezeno
                  </Typography>
                </Box>
              </Command.Empty>

              {searchResults.map((item) => (
                <Command.Item
                  key={item.id}
                  value={item.title}
                  onSelect={() => handleSelect(item.action)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: '4px',
                  }}
                  className="command-item"
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ color: 'text.secondary' }}>{item.icon}</Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.title}
                      </Typography>
                      {item.subtitle && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                          }}
                        >
                          {item.subtitle}
                        </Typography>
                      )}
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {item.meta && (
                        <Typography variant="caption" color="text.secondary">
                          {item.meta}
                        </Typography>
                      )}
                      <Chip
                        label={getTypeLabel(item.type)}
                        size="small"
                        color={getTypeColor(item.type)}
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Stack>
                  </Stack>
                </Command.Item>
              ))}
            </Command.List>

            {/* Footer */}
            <Box
              sx={{
                p: 1.5,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Použij ↑↓ pro navigaci, Enter pro výběr
              </Typography>
              <Chip
                label="ESC pro zavření"
                size="small"
                sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'action.selected' }}
              />
            </Box>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
};
