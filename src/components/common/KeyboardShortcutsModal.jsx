import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import { Keyboard, X } from 'lucide-react';
import { KEYBOARD_SHORTCUTS } from '../../hooks/useKeyboardShortcuts';

/**
 * Modal displaying all keyboard shortcuts
 * Triggered by "?" key or from help menu
 */
export const KeyboardShortcutsModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleShow = () => setOpen(true);
    window.addEventListener('show-shortcuts-help', handleShow);

    return () => {
      window.removeEventListener('show-shortcuts-help', handleShow);
    };
  }, []);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Keyboard size={24} color="#6366f1" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Klávesové zkratky
          </Typography>
        </Box>
        <Box
          onClick={() => setOpen(false)}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            p: 0.5,
            borderRadius: 1,
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <X size={20} />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {KEYBOARD_SHORTCUTS.map((category, index) => (
            <Box key={index}>
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 700,
                  color: 'text.secondary',
                  letterSpacing: 1,
                  mb: 1.5,
                  display: 'block',
                }}
              >
                {category.category}
              </Typography>

              <Stack spacing={1.5}>
                {category.shortcuts.map((shortcut, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'background.default',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <Typography variant="body2">{shortcut.description}</Typography>

                    <Stack direction="row" spacing={0.5}>
                      {shortcut.keys.map((key, keyIdx) => (
                        <Chip
                          key={keyIdx}
                          label={key}
                          size="small"
                          sx={{
                            height: 28,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            bgcolor: 'action.selected',
                            fontFamily: 'monospace',
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>

              {index < KEYBOARD_SHORTCUTS.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Stack>

        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: 'primary.lighter',
            border: '1px solid',
            borderColor: 'primary.main',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            💡 <strong>Tip:</strong> Kombinace kláves jako "G D" znamenají stisknout "G", pak "D"
            (ne současně).
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
