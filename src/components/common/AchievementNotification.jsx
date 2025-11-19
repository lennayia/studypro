import { useEffect, useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * Achievement unlock notification
 * Displays when user unlocks a new achievement
 * Shows confetti animation and plays sound
 */
export const AchievementNotification = ({ achievement, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (achievement) {
      // Trigger confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      // Auto-close after 6 seconds
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for animation
      }, 6000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [achievement, onClose]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  if (!achievement) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 10000,
            maxWidth: 400,
          }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 20px 60px rgba(102, 126, 234, 0.5)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background sparkles effect */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                backgroundImage:
                  'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 50%)',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 0.1 },
                  '50%': { opacity: 0.2 },
                },
              }}
            />

            {/* Close button */}
            <Box
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                cursor: 'pointer',
                opacity: 0.7,
                transition: 'opacity 0.2s',
                '&:hover': { opacity: 1 },
              }}
            >
              <X size={20} />
            </Box>

            <Stack spacing={2} sx={{ position: 'relative' }}>
              {/* Icon */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Trophy size={32} />
                  <Sparkles size={24} />
                </Box>
              </motion.div>

              {/* Text */}
              <Box>
                <Typography variant="overline" sx={{ opacity: 0.9, fontWeight: 700 }}>
                  Achievement odemčen!
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {achievement.message || achievement.key}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +25 bodů získáno! 🎉
                </Typography>
              </Box>

              {/* Progress indicator */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 6 }}
                style={{
                  height: 3,
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: 3,
                  transformOrigin: 'left',
                }}
              />
            </Stack>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
