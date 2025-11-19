import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
  Slide,
  Stack,
  Avatar,
} from '@mui/material';
import { Trophy, Star, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AchievementUnlock = ({ achievement, onClose }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      setTimeout(onClose, 300); // Wait for animation
    }
  };

  if (!achievement) return null;

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={Slide}
      sx={{ mt: 8 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: -50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: -50 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
      >
        <Card
          sx={{
            minWidth: 350,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              {/* Icon with animation */}
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
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Trophy size={32} />
                </Avatar>
              </motion.div>

              {/* Content */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 600,
                    letterSpacing: 1.5,
                  }}
                >
                  🎉 Achievement Unlocked!
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {achievement.message}
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </Stack>
              </Box>
            </Stack>

            {/* Sparkles animation */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
              }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: [0, (i % 2 === 0 ? 1 : -1) * 50],
                    y: [0, -50],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Snackbar>
  );
};

/**
 * Queue component for showing multiple achievements one by one
 */
export const AchievementQueue = ({ achievements = [] }) => {
  const [queue, setQueue] = useState([...achievements]);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (achievements.length > 0) {
      setQueue([...achievements]);
    }
  }, [achievements]);

  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue((prev) => prev.slice(1));
    }
  }, [current, queue]);

  const handleClose = () => {
    setCurrent(null);
  };

  return (
    <AnimatePresence>
      {current && <AchievementUnlock achievement={current} onClose={handleClose} />}
    </AnimatePresence>
  );
};

/**
 * Simple notification for achievements
 */
export const AchievementNotification = ({ achievement, open, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        icon={<Award size={24} />}
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          '& .MuiAlert-icon': {
            color: 'white',
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Achievement Unlocked!
        </Typography>
        <Typography variant="body2">{achievement?.message}</Typography>
      </Alert>
    </Snackbar>
  );
};
