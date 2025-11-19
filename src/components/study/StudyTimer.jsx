import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Stack,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Play,
  Pause,
  Square,
  Timer as TimerIcon,
  Coffee,
  BookOpen,
  SkipForward,
} from 'lucide-react';
import { useStudySession } from '../../contexts/StudySessionContext';
import { useCourses } from '../../contexts/CourseContext';

export const StudyTimer = () => {
  const {
    activeSession,
    timer,
    isRunning,
    isPaused,
    pomodoroMode,
    isBreak,
    completedPomodoros,
    workDuration,
    breakDuration,
    setWorkDuration,
    setBreakDuration,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    togglePomodoroMode,
    skipBreak,
    formatTime,
  } = useStudySession();

  const { courses } = useCourses();

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [notes, setNotes] = useState('');

  const handleStart = () => {
    startSession(selectedCourseId || null, notes);
    setNotes('');
  };

  const handleEnd = () => {
    endSession(notes);
    setSelectedCourseId('');
  };

  // Calculate progress for Pomodoro
  const getProgress = () => {
    if (!pomodoroMode) return 0;
    const targetDuration = isBreak ? breakDuration : workDuration;
    return (timer / targetDuration) * 100;
  };

  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent>
        <Stack spacing={3}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TimerIcon size={28} color="#6366f1" />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Study Timer
              </Typography>
            </Box>

            {/* Pomodoro toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={pomodoroMode}
                  onChange={togglePomodoroMode}
                  disabled={isRunning}
                />
              }
              label="Pomodoro"
            />
          </Box>

          {/* Pomodoro settings */}
          {pomodoroMode && !isRunning && (
            <Stack direction="row" spacing={2}>
              <TextField
                label="Práce (min)"
                type="number"
                value={workDuration / 60}
                onChange={(e) => setWorkDuration(Number(e.target.value) * 60)}
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Přestávka (min)"
                type="number"
                value={breakDuration / 60}
                onChange={(e) => setBreakDuration(Number(e.target.value) * 60)}
                size="small"
                sx={{ flex: 1 }}
              />
            </Stack>
          )}

          {/* Timer display */}
          <Box sx={{ textAlign: 'center', py: 3 }}>
            {isBreak && (
              <Chip
                icon={<Coffee size={16} />}
                label="Přestávka"
                color="warning"
                sx={{ mb: 2 }}
              />
            )}

            <Typography
              variant="h1"
              sx={{
                fontFamily: 'monospace',
                fontSize: { xs: '3rem', md: '4.5rem' },
                fontWeight: 700,
                color: isBreak ? 'warning.main' : 'primary.main',
              }}
            >
              {formatTime(timer)}
            </Typography>

            {pomodoroMode && (
              <>
                <LinearProgress
                  variant="determinate"
                  value={getProgress()}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    mt: 2,
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Dokončeno Pomodoro: {completedPomodoros}
                </Typography>
              </>
            )}
          </Box>

          {/* Course selection (when not running) */}
          {!isRunning && (
            <FormControl fullWidth size="small">
              <InputLabel>Kurz (volitelné)</InputLabel>
              <Select
                value={selectedCourseId}
                label="Kurz (volitelné)"
                onChange={(e) => setSelectedCourseId(e.target.value)}
                startAdornment={<BookOpen size={18} style={{ marginRight: 8 }} />}
              >
                <MenuItem value="">
                  <em>Bez kurzu</em>
                </MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Notes */}
          <TextField
            label="Poznámky"
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Co budeš studovat?"
            fullWidth
            size="small"
          />

          {/* Controls */}
          <Stack direction="row" spacing={2} justifyContent="center">
            {!isRunning ? (
              <Button
                variant="contained"
                size="large"
                startIcon={<Play size={20} />}
                onClick={handleStart}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Start
              </Button>
            ) : (
              <>
                {isPaused ? (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Play size={20} />}
                    onClick={resumeSession}
                    sx={{ px: 4, borderRadius: 3, textTransform: 'none' }}
                  >
                    Resume
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Pause size={20} />}
                    onClick={pauseSession}
                    sx={{ px: 4, borderRadius: 3, textTransform: 'none' }}
                  >
                    Pause
                  </Button>
                )}

                <Button
                  variant="outlined"
                  color="error"
                  size="large"
                  startIcon={<Square size={20} />}
                  onClick={handleEnd}
                  sx={{ px: 4, borderRadius: 3, textTransform: 'none' }}
                >
                  Stop
                </Button>

                {isBreak && (
                  <IconButton onClick={skipBreak} color="primary" size="large">
                    <SkipForward size={24} />
                  </IconButton>
                )}
              </>
            )}
          </Stack>

          {/* Session info */}
          {activeSession && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Session started: {new Date(activeSession.start_time).toLocaleTimeString('cs-CZ')}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
