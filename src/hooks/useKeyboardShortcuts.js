import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Global keyboard shortcuts hook
 * Power user features for quick navigation and actions
 *
 * Shortcuts:
 * - Cmd/Ctrl + K: Global search (handled in GlobalSearch)
 * - G then D: Go to Dashboard
 * - G then C: Go to Courses
 * - G then G: Go to Goals
 * - G then S: Go to Stats
 * - G then T: Go to Study Timer
 * - G then A: Go to Calendar
 * - G then M: Go to Gamification
 * - N: New course (when on courses page)
 * - ?: Show keyboard shortcuts help
 */
export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let lastKey = null;
    let lastKeyTime = 0;

    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input/textarea
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        return;
      }

      const currentTime = Date.now();
      const timeSinceLastKey = currentTime - lastKeyTime;

      // "G then X" pattern (within 1 second)
      if (lastKey === 'g' && timeSinceLastKey < 1000) {
        e.preventDefault();

        switch (e.key.toLowerCase()) {
          case 'd':
            navigate('/dashboard');
            break;
          case 'c':
            navigate('/courses');
            break;
          case 'g':
            navigate('/goals');
            break;
          case 's':
            navigate('/stats');
            break;
          case 't':
            navigate('/study');
            break;
          case 'a':
            navigate('/calendar');
            break;
          case 'm':
            navigate('/gamification');
            break;
          default:
            break;
        }

        lastKey = null;
        lastKeyTime = 0;
        return;
      }

      // Store "g" key for sequence
      if (e.key.toLowerCase() === 'g') {
        lastKey = 'g';
        lastKeyTime = currentTime;
        return;
      }

      // Single key shortcuts
      switch (e.key) {
        case '?':
          // Show keyboard shortcuts modal
          e.preventDefault();
          showShortcutsHelp();
          break;

        case 'Escape':
          // Close any open modals (handled by components)
          break;

        default:
          // Reset sequence
          lastKey = null;
          lastKeyTime = 0;
          break;
      }
    };

    const showShortcutsHelp = () => {
      // Dispatch custom event that can be caught by a modal component
      window.dispatchEvent(new CustomEvent('show-shortcuts-help'));
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);
};

/**
 * Keyboard shortcuts reference
 * Can be displayed in a modal
 */
export const KEYBOARD_SHORTCUTS = [
  {
    category: 'Navigace',
    shortcuts: [
      { keys: ['⌘', 'K'], description: 'Otevřít globální vyhledávání' },
      { keys: ['G', 'D'], description: 'Přejít na Dashboard' },
      { keys: ['G', 'C'], description: 'Přejít na Kurzy' },
      { keys: ['G', 'G'], description: 'Přejít na Cíle' },
      { keys: ['G', 'S'], description: 'Přejít na Statistiky' },
      { keys: ['G', 'T'], description: 'Přejít na Studijní timer' },
      { keys: ['G', 'A'], description: 'Přejít na Kalendář' },
      { keys: ['G', 'M'], description: 'Přejít na Gamifikaci' },
    ],
  },
  {
    category: 'Obecné',
    shortcuts: [
      { keys: ['?'], description: 'Zobrazit klávesové zkratky' },
      { keys: ['ESC'], description: 'Zavřít dialog/modal' },
    ],
  },
];
