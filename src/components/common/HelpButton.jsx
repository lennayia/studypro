import { useState } from 'react';
import { Fab, Tooltip } from '@mui/material';
import { HelpCircle } from 'lucide-react';
import { HelpTutorial } from './HelpTutorial';

/**
 * Floating help button that opens tutorial/FAQ dialog
 * Positioned at bottom-right of screen
 */
export const HelpButton = () => {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <Tooltip title="Nápověda & Tutoriál" placement="left">
        <Fab
          color="primary"
          aria-label="help"
          onClick={() => setHelpOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: '0 12px 32px rgba(99, 102, 241, 0.4)',
            },
            transition: 'all 0.2s',
          }}
        >
          <HelpCircle size={28} />
        </Fab>
      </Tooltip>

      {/* Help Dialog */}
      <HelpTutorial open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
};
