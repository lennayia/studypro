import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Stack,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Chip,
  Grid,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, BookOpen, Target, Trophy, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../../utils/toast';

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Vítej v StudyPro! 👋',
    icon: <Rocket size={64} color="#6366f1" />,
    content: (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body1" paragraph>
          StudyPro je tvůj osobní asistent pro efektivní studium a správu kurzů.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Za pár minut tě provedeme základy a nastav title s te tvůj první kurz!
        </Typography>
      </Box>
    ),
  },
  {
    id: 'profile',
    title: 'Řekni nám o sobě',
    icon: <BookOpen size={64} color="#6366f1" />,
    fields: [
      { name: 'full_name', label: 'Tvoje jméno', placeholder: 'Jan Novák' },
      { name: 'bio', label: 'Něco o tobě (volitelné)', placeholder: 'Student informatiky na VŠ...', multiline: true },
    ],
  },
  {
    id: 'goals',
    title: 'Co chceš dosáhnout?',
    icon: <Target size={64} color="#6366f1" />,
    content: (
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Vyber si své studijní cíle (můžeš vybrat více):
        </Typography>
        <Grid container spacing={2}>
          {[
            '📚 Dokončit online kurzy',
            '🎓 Připravit se na zkoušky',
            '💼 Rozvinout kariérní dovednosti',
            '🚀 Učit se nové technologie',
            '📖 Číst více knih',
            '🎯 Zlepšit studijní návyky',
          ].map((goal, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Chip
                label={goal}
                clickable
                sx={{ width: '100%', justifyContent: 'flex-start', py: 2 }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    ),
  },
  {
    id: 'complete',
    title: 'Vše připraveno! 🎉',
    icon: <Trophy size={64} color="#6366f1" />,
    content: (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body1" paragraph>
          Gratuluji! Tvůj účet je nastavený a připravený k použití.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Začni přidáním svého prvního kurzu a objevuj všechny funkce StudyPro!
        </Typography>
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: 'success.lighter',
            border: '1px solid',
            borderColor: 'success.main',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Check size={20} color="#10b981" />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              +50 bodů za dokončení onboardingu!
            </Typography>
          </Stack>
        </Box>
      </Box>
    ),
  },
];

export const OnboardingWizard = ({ open, onComplete }) => {
  const { profile, updateProfile } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
  });

  const currentStep = ONBOARDING_STEPS[activeStep];

  const handleNext = async () => {
    // Save profile data on profile step
    if (currentStep.id === 'profile') {
      await updateProfile(formData);
    }

    if (activeStep === ONBOARDING_STEPS.length - 1) {
      // Complete onboarding
      await updateProfile({ onboarding_completed: true });
      showToast.success('Onboarding dokončen! +50 bodů! 🎉');
      onComplete();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      disableEscapeKeyDown
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Progress */}
        <Box sx={{ px: 3, pt: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {ONBOARDING_STEPS.map((step) => (
              <Step key={step.id}>
                <StepLabel />
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{ padding: '32px 24px' }}
          >
            {/* Icon */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>{currentStep.icon}</Box>

            {/* Title */}
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, textAlign: 'center', mb: 3 }}
            >
              {currentStep.title}
            </Typography>

            {/* Content */}
            {currentStep.fields ? (
              <Stack spacing={2}>
                {currentStep.fields.map((field) => (
                  <TextField
                    key={field.name}
                    label={field.label}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    fullWidth
                    multiline={field.multiline}
                    rows={field.multiline ? 3 : 1}
                  />
                ))}
              </Stack>
            ) : (
              currentStep.content
            )}
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <Box
          sx={{
            px: 3,
            pb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: 2,
          }}
        >
          <Button onClick={handleBack} disabled={activeStep === 0}>
            Zpět
          </Button>
          <Button variant="contained" onClick={handleNext}>
            {activeStep === ONBOARDING_STEPS.length - 1 ? 'Začít používat StudyPro' : 'Další'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
