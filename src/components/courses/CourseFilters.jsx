import { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  InputAdornment,
  IconButton,
  Collapse,
  Button,
} from '@mui/material';
import { Search, X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

export const CourseFilters = ({ onFilterChange, courses }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    priority: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [...new Set(courses.map((c) => c.category).filter(Boolean))];
  const statuses = ['not_started', 'in_progress', 'completed', 'paused'];
  const priorities = [0, 1, 2];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      search: '',
      category: '',
      status: '',
      priority: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const activeFiltersCount =
    (filters.search ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.status ? 1 : 0) +
    (filters.priority !== '' ? 1 : 0);

  return (
    <Box sx={{ mb: 3 }}>
      <Stack spacing={2}>
        {/* Search + Advanced Toggle */}
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            placeholder="Hledat kurzy..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
              endAdornment: filters.search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => handleFilterChange('search', '')}>
                    <X size={18} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant={showAdvanced ? 'contained' : 'outlined'}
            onClick={() => setShowAdvanced(!showAdvanced)}
            startIcon={<SlidersHorizontal size={18} />}
            endIcon={showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            sx={{ whiteSpace: 'nowrap', minWidth: 160 }}
          >
            Filtry {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
        </Stack>

        {/* Advanced Filters */}
        <Collapse in={showAdvanced}>
          <Stack spacing={2} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {/* Category */}
              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>Kategorie</InputLabel>
                <Select
                  value={filters.category}
                  label="Kategorie"
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <MenuItem value="">
                    <em>Všechny</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Status */}
              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">
                    <em>Všechny</em>
                  </MenuItem>
                  <MenuItem value="not_started">Nezačato</MenuItem>
                  <MenuItem value="in_progress">Probíhá</MenuItem>
                  <MenuItem value="completed">Dokončeno</MenuItem>
                  <MenuItem value="paused">Pozastaveno</MenuItem>
                </Select>
              </FormControl>

              {/* Priority */}
              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>Priorita</InputLabel>
                <Select
                  value={filters.priority}
                  label="Priorita"
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                >
                  <MenuItem value="">
                    <em>Všechny</em>
                  </MenuItem>
                  <MenuItem value={0}>Nízká</MenuItem>
                  <MenuItem value={1}>Střední</MenuItem>
                  <MenuItem value={2}>Vysoká</MenuItem>
                </Select>
              </FormControl>

              {/* Sort By */}
              <FormControl sx={{ minWidth: 200, flex: 1 }}>
                <InputLabel>Řadit podle</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="Řadit podle"
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <MenuItem value="created_at">Datum vytvoření</MenuItem>
                  <MenuItem value="title">Název</MenuItem>
                  <MenuItem value="progress_percentage">Pokrok</MenuItem>
                  <MenuItem value="priority">Priorita</MenuItem>
                  <MenuItem value="deadline">Deadline</MenuItem>
                </Select>
              </FormControl>

              {/* Sort Order */}
              <FormControl sx={{ minWidth: 150, flex: 1 }}>
                <InputLabel>Pořadí</InputLabel>
                <Select
                  value={filters.sortOrder}
                  label="Pořadí"
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                >
                  <MenuItem value="asc">Vzestupně</MenuItem>
                  <MenuItem value="desc">Sestupně</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* Active Filters & Clear */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {filters.category && (
                  <Chip
                    label={`Kategorie: ${filters.category}`}
                    onDelete={() => handleFilterChange('category', '')}
                    size="small"
                  />
                )}
                {filters.status && (
                  <Chip
                    label={`Status: ${filters.status}`}
                    onDelete={() => handleFilterChange('status', '')}
                    size="small"
                  />
                )}
                {filters.priority !== '' && (
                  <Chip
                    label={`Priorita: ${['Nízká', 'Střední', 'Vysoká'][filters.priority]}`}
                    onDelete={() => handleFilterChange('priority', '')}
                    size="small"
                  />
                )}
              </Stack>

              {activeFiltersCount > 0 && (
                <Button size="small" onClick={handleClearFilters} startIcon={<X size={16} />}>
                  Vymazat vše
                </Button>
              )}
            </Stack>
          </Stack>
        </Collapse>
      </Stack>
    </Box>
  );
};
