import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Box,
  Chip,
  InputAdornment,
} from '@mui/material';

const CATEGORIES = [
  'Programování',
  'Design',
  'Business',
  'Jazyk',
  'Věda',
  'Umění',
  'Zdraví',
  'Škola',
  'Jiné',
];

const COURSE_TYPES = [
  { value: 'paid', label: 'Placený kurz' },
  { value: 'free', label: 'Zdarma' },
  { value: 'school', label: 'Škola' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'book', label: 'Kniha' },
  { value: 'article', label: 'Článek' },
  { value: 'video', label: 'Video' },
  { value: 'other', label: 'Jiné' },
];

const PRIORITIES = [
  { value: 0, label: 'Nízká' },
  { value: 1, label: 'Střední' },
  { value: 2, label: 'Vysoká' },
];

export const CourseForm = ({ open, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      description: '',
      instructor: '',
      platform: '',
      category: '',
      course_type: 'paid',
      purchase_date: '',
      start_date: '',
      access_until: '',
      estimated_hours: '',
      total_lessons: '',
      price: '',
      currency: 'CZK',
      course_url: '',
      cover_image_url: '',
      priority: 1,
      notes: '',
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{initialData ? 'Upravit kurz' : 'Přidat nový kurz'}</DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Název */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Název kurzu"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>

            {/* Popis */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Popis"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            {/* Lektor & Platforma */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lektor/Autor"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Platforma (Udemy, Coursera, ...)"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
              />
            </Grid>

            {/* Kategorie & Typ */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Kategorie"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Typ"
                name="course_type"
                value={formData.course_type}
                onChange={handleChange}
              >
                {COURSE_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Data */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="date"
                label="Datum nákupu"
                name="purchase_date"
                value={formData.purchase_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="date"
                label="Začátek studia"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="date"
                label="Přístup do"
                name="access_until"
                value={formData.access_until}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Hodinový odhad & Počet lekcí */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Odhadované hodiny"
                name="estimated_hours"
                value={formData.estimated_hours}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">h</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Počet lekcí"
                name="total_lessons"
                value={formData.total_lessons}
                onChange={handleChange}
              />
            </Grid>

            {/* Cena */}
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                type="number"
                label="Cena"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Měna"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <MenuItem value="CZK">CZK</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
              </TextField>
            </Grid>

            {/* Priorita */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Priorita"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                {PRIORITIES.map((p) => (
                  <MenuItem key={p.value} value={p.value}>
                    {p.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* URL kurzu */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL kurzu"
                name="course_url"
                value={formData.course_url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </Grid>

            {/* Cover image */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL obrázku"
                name="cover_image_url"
                value={formData.cover_image_url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </Grid>

            {/* Poznámky */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Poznámky"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Zrušit</Button>
          <Button type="submit" variant="contained">
            {initialData ? 'Uložit změny' : 'Přidat kurz'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
