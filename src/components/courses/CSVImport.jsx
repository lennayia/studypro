import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  IconButton,
} from '@mui/material';
import { Upload, FileText, CheckCircle, AlertCircle, X, Download } from 'lucide-react';
import Papa from 'papaparse';

const CSV_TEMPLATE = `title,lecturer,category,status,priority,deadline,description
"React základy","Jan Novák","Frontend","not_started",1,"2024-12-31","Základní kurz Reactu"
"TypeScript pokročilý","Marie Svobodová","Frontend","in_progress",2,"2024-11-30","Pokročilé TypeScript koncepty"
"Node.js API","Petr Dvořák","Backend","not_started",1,"2025-01-15","Tvorba REST API v Node.js"`;

export const CSVImport = ({ onImport, onClose }) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setErrors(['Prosím vyberte CSV soubor']);
      return;
    }

    setFile(selectedFile);
    setErrors([]);
    setParsedData(null);
    setImportSuccess(false);

    // Parse CSV
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setErrors(results.errors.map((e) => e.message));
          return;
        }

        // Validate data
        const validationErrors = validateData(results.data);
        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          return;
        }

        setParsedData(results.data);
      },
      error: (error) => {
        setErrors([error.message]);
      },
    });
  };

  const validateData = (data) => {
    const errors = [];
    const requiredFields = ['title'];

    if (data.length === 0) {
      errors.push('CSV soubor je prázdný');
      return errors;
    }

    data.forEach((row, index) => {
      // Check required fields
      requiredFields.forEach((field) => {
        if (!row[field] || row[field].trim() === '') {
          errors.push(`Řádek ${index + 1}: Povinné pole "${field}" chybí`);
        }
      });

      // Validate status
      if (row.status) {
        const validStatuses = ['not_started', 'in_progress', 'completed', 'paused'];
        if (!validStatuses.includes(row.status)) {
          errors.push(
            `Řádek ${index + 1}: Neplatný status "${row.status}". Povolené: ${validStatuses.join(', ')}`
          );
        }
      }

      // Validate priority
      if (row.priority) {
        const priority = parseInt(row.priority);
        if (isNaN(priority) || priority < 0 || priority > 5) {
          errors.push(`Řádek ${index + 1}: Priorita musí být číslo 0-5`);
        }
      }

      // Validate deadline format
      if (row.deadline) {
        const date = new Date(row.deadline);
        if (isNaN(date.getTime())) {
          errors.push(
            `Řádek ${index + 1}: Neplatný formát deadlinu. Použijte YYYY-MM-DD`
          );
        }
      }
    });

    return errors;
  };

  const handleImport = async () => {
    if (!parsedData || parsedData.length === 0) return;

    setImporting(true);
    setErrors([]);

    try {
      // Transform CSV data to course objects
      const courses = parsedData.map((row) => ({
        title: row.title,
        lecturer: row.lecturer || null,
        category: row.category || null,
        status: row.status || 'not_started',
        priority: row.priority ? parseInt(row.priority) : 0,
        deadline: row.deadline || null,
        description: row.description || null,
        progress_percentage: row.progress_percentage ? parseInt(row.progress_percentage) : 0,
        estimated_hours: row.estimated_hours ? parseFloat(row.estimated_hours) : null,
        course_type: row.course_type || null,
      }));

      // Call onImport callback with courses
      await onImport(courses);

      setImportSuccess(true);
      setImporting(false);

      // Auto-close after 2 seconds
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    } catch (error) {
      setErrors([error.message || 'Chyba při importu kurzů']);
      setImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_kurzy.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Import kurzů z CSV
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Nahrajte CSV soubor s daty kurzů pro hromadný import
          </Typography>
        </Box>
        {onClose && (
          <IconButton onClick={onClose}>
            <X size={24} />
          </IconButton>
        )}
      </Box>

      {/* Template Download */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>CSV Šablona</AlertTitle>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Povinné sloupce: <strong>title</strong>
          <br />
          Volitelné: lecturer, category, status, priority, deadline, description, progress_percentage,
          estimated_hours, course_type
        </Typography>
        <Button
          size="small"
          startIcon={<Download size={16} />}
          onClick={handleDownloadTemplate}
          variant="outlined"
        >
          Stáhnout šablonu
        </Button>
      </Alert>

      {/* File Upload */}
      {!parsedData && !importSuccess && (
        <Box
          sx={{
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 3,
            p: 4,
            textAlign: 'center',
            bgcolor: 'background.paper',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
          onClick={() => document.getElementById('csv-file-input').click()}
        >
          <Upload size={48} style={{ marginBottom: 16, color: '#6366f1' }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            {file ? file.name : 'Vyberte CSV soubor'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Klikněte nebo přetáhněte CSV soubor sem
          </Typography>
          <input
            id="csv-file-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </Box>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mt: 3 }}>
          <AlertTitle>Chyby při parsování CSV</AlertTitle>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {errors.map((error, index) => (
              <li key={index}>
                <Typography variant="body2">{error}</Typography>
              </li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Preview Data */}
      {parsedData && !importSuccess && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Náhled dat ({parsedData.length} kurzů)
          </Typography>

          <TableContainer component={Paper} sx={{ mb: 3, maxHeight: 400 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Název</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Lektor</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Kategorie</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Priorita</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Deadline</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parsedData.map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.lecturer || '-'}</TableCell>
                    <TableCell>
                      {row.category ? (
                        <Chip label={row.category} size="small" />
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status || 'not_started'}
                        size="small"
                        color={
                          row.status === 'completed'
                            ? 'success'
                            : row.status === 'in_progress'
                            ? 'primary'
                            : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>{row.priority || 0}</TableCell>
                    <TableCell>{row.deadline || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => setParsedData(null)} variant="outlined">
              Zrušit
            </Button>
            <Button
              onClick={handleImport}
              variant="contained"
              disabled={importing}
              startIcon={<Upload size={20} />}
            >
              {importing ? 'Importuji...' : `Importovat ${parsedData.length} kurzů`}
            </Button>
          </Stack>
        </Box>
      )}

      {/* Importing Progress */}
      {importing && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Importuji kurzy...
          </Typography>
          <LinearProgress />
        </Box>
      )}

      {/* Success */}
      {importSuccess && (
        <Alert severity="success" sx={{ mt: 3 }} icon={<CheckCircle size={24} />}>
          <AlertTitle>Import úspěšný!</AlertTitle>
          <Typography variant="body2">
            Kurzy byly úspěšně naimportovány. Dialog se automaticky zavře.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
