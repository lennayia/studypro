import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { AddButtonIcon } from '../../../shared/src/components/icons';

const GOAL_TYPES = [
  { value: 'courses', label: 'Dokončit kurzy' },
  { value: 'lessons', label: 'Dokončit lekce' },
  { value: 'study_time', label: 'Čas strávený studiem (minuty)' },
  { value: 'streak', label: 'Streak (dny v řadě)' },
  { value: 'points', label: 'Získat body' },
  { value: 'custom', label: 'Vlastní cíl' },
];

const GOAL_STATUS = [
  { value: 'active', label: 'Aktivní' },
  { value: 'completed', label: 'Dokončeno' },
  { value: 'cancelled', label: 'Zrušeno' },
];

export const GoalForm = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal_type: 'courses',
    target_value: '',
    current_value: 0,
    deadline: '',
    status: 'active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        goal_type: initialData.goal_type || 'courses',
        target_value: initialData.target_value || '',
        current_value: initialData.current_value || 0,
        deadline: initialData.deadline || '',
        status: initialData.status || 'active',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        goal_type: 'courses',
        target_value: '',
        current_value: 0,
        deadline: '',
        status: 'active',
      });
    }
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Název cíle je povinný';
    }

    if (!formData.target_value || formData.target_value <= 0) {
      newErrors.target_value = 'Cílová hodnota musí být větší než 0';
    }

    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline musí být v budoucnosti';
      }
    }

    if (formData.current_value < 0) {
      newErrors.current_value = 'Aktuální hodnota nemůže být záporná';
    }

    if (formData.current_value > formData.target_value) {
      newErrors.current_value = 'Aktuální hodnota nemůže být větší než cílová';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      ...formData,
      target_value: parseInt(formData.target_value, 10),
      current_value: parseInt(formData.current_value, 10),
    });
  };

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const getTargetLabel = () => {
    const type = GOAL_TYPES.find((t) => t.value === formData.goal_type);
    return type ? type.label : 'Cílová hodnota';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddButtonIcon />
            {initialData ? 'Upravit cíl' : 'Nový cíl'}
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Název cíle"
              value={formData.title}
              onChange={handleChange('title')}
              error={!!errors.title}
              helperText={errors.title}
              placeholder="Např. Dokončit React kurz"
              required
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Popis"
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Volitelný popis cíle..."
            />

            <TextField
              select
              fullWidth
              label="Typ cíle"
              value={formData.goal_type}
              onChange={handleChange('goal_type')}
            >
              {GOAL_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                type="number"
                label={getTargetLabel()}
                value={formData.target_value}
                onChange={handleChange('target_value')}
                error={!!errors.target_value}
                helperText={errors.target_value}
                inputProps={{ min: 1 }}
                required
              />

              <TextField
                fullWidth
                type="number"
                label="Aktuální hodnota"
                value={formData.current_value}
                onChange={handleChange('current_value')}
                error={!!errors.current_value}
                helperText={errors.current_value}
                inputProps={{ min: 0 }}
              />
            </Box>

            <TextField
              fullWidth
              type="date"
              label="Deadline"
              value={formData.deadline}
              onChange={handleChange('deadline')}
              error={!!errors.deadline}
              helperText={errors.deadline || 'Volitelné'}
              InputLabelProps={{ shrink: true }}
            />

            {initialData && (
              <TextField
                select
                fullWidth
                label="Status"
                value={formData.status}
                onChange={handleChange('status')}
              >
                {GOAL_STATUS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <Box
              sx={{
                bgcolor: 'info.lighter',
                p: 2,
                borderRadius: 1,
                border: 1,
                borderColor: 'info.light',
              }}
            >
              <Typography variant="caption" color="info.dark">
                💡 Tip: Nastav si realistický cíl a deadline. Aktuální hodnota se bude automaticky
                aktualizovat podle tvého pokroku.
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Zrušit</Button>
          <Button type="submit" variant="contained">
            {initialData ? 'Uložit změny' : 'Vytvořit cíl'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
