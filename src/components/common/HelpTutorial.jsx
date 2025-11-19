import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
} from '@mui/material';
import {
  HelpCircle,
  BookOpen,
  Target,
  Trophy,
  Calendar,
  BarChart,
  ChevronRight,
  ChevronLeft,
  X,
} from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    title: 'Vítej v StudyPro! 👋',
    icon: <HelpCircle size={48} color="#6366f1" />,
    content: (
      <>
        <Typography variant="body1" paragraph>
          StudyPro je tvůj osobní asistent pro správu studia a kurzů.
        </Typography>
        <Typography variant="body1" paragraph>
          Pomůže ti organizovat kurzy, sledovat pokrok, dosahovat cílů a gamifikovat studium! 🎯
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Projeď si rychlý tutoriál a zjisti, jak StudyPro funguje.
        </Typography>
      </>
    ),
  },
  {
    title: 'Správa kurzů 📚',
    icon: <BookOpen size={48} color="#6366f1" />,
    content: (
      <>
        <Typography variant="body1" paragraph>
          Na stránce <strong>Kurzy</strong> můžeš:
        </Typography>
        <Stack spacing={1.5} sx={{ pl: 2 }}>
          <Box>
            <Chip label="+" size="small" color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2" component="span">
              Vytvářet nové kurzy s detaily (název, lektor, deadline, priorita)
            </Typography>
          </Box>
          <Box>
            <Chip label="📊" size="small" sx={{ mr: 1 }} />
            <Typography variant="body2" component="span">
              Sledovat pokrok každého kurzu s progress barem
            </Typography>
          </Box>
          <Box>
            <Chip label="🔍" size="small" sx={{ mr: 1 }} />
            <Typography variant="body2" component="span">
              Filtrovat a řadit kurzy podle statusu, kategorie, priority
            </Typography>
          </Box>
          <Box>
            <Chip label="📥" size="small" sx={{ mr: 1 }} />
            <Typography variant="body2" component="span">
              Importovat kurzy z CSV souboru (hromadný import)
            </Typography>
          </Box>
        </Stack>
      </>
    ),
  },
  {
    title: 'Cíle a úkoly 🎯',
    icon: <Target size={48} color="#6366f1" />,
    content: (
      <>
        <Typography variant="body1" paragraph>
          Nastav si <strong>studijní cíle</strong> a drž se plánu:
        </Typography>
        <Stack spacing={1.5} sx={{ pl: 2 }}>
          <Box>
            <Typography variant="body2">
              ✅ <strong>Denní cíle</strong> - např. "Studovat 2 hodiny denně"
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              ✅ <strong>Týdenní cíle</strong> - např. "Dokončit 3 lekce tento týden"
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              ✅ <strong>Měsíční cíle</strong> - např. "Dokončit celý kurz React"
            </Typography>
          </Box>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Sleduj svůj pokrok a získávej body za splněné cíle!
        </Typography>
      </>
    ),
  },
  {
    title: 'Gamifikace 🏆',
    icon: <Trophy size={48} color="#6366f1" />,
    content: (
      <>
        <Typography variant="body1" paragraph>
          Studuj zábavně a motivovaně:
        </Typography>
        <Stack spacing={1.5} sx={{ pl: 2 }}>
          <Box>
            <Typography variant="body2">
              🏅 <strong>Achievementy</strong> - Odemkni 20+ achievementů za různé úkony
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              🔥 <strong>Streaky</strong> - Studuj každý den a udrž si streak
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              ⭐ <strong>Body</strong> - Získávej body za studium, dokončené kurzy a cíle
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              🎁 <strong>Odměny</strong> - Utrať body v obchodě za motivy, odznaky a power-upy
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              🏆 <strong>Žebříček</strong> - Soutěž s ostatními uživateli
            </Typography>
          </Box>
        </Stack>
      </>
    ),
  },
  {
    title: 'Statistiky 📊',
    icon: <BarChart size={48} color="#6366f1" />,
    content: (
      <>
        <Typography variant="body1" paragraph>
          Sleduj svůj pokrok v detailu:
        </Typography>
        <Stack spacing={1.5} sx={{ pl: 2 }}>
          <Box>
            <Typography variant="body2">
              📈 <strong>Studijní aktivita</strong> - Graf posledních 30 dní
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              ⏱️ <strong>Celkový čas</strong> - Kolik hodin jsi studoval(a)
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              🎯 <strong>Míra dokončení</strong> - Procento dokončených kurzů
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              📊 <strong>Distribuce</strong> - Kurzy podle statusu a priority
            </Typography>
          </Box>
        </Stack>
      </>
    ),
  },
  {
    title: 'Kalendář & Timer ⏰',
    icon: <Calendar size={48} color="#6366f1" />,
    content: (
      <>
        <Typography variant="body1" paragraph>
          Organizuj svůj čas efektivně:
        </Typography>
        <Stack spacing={1.5} sx={{ pl: 2 }}>
          <Box>
            <Typography variant="body2">
              📅 <strong>Kalendář</strong> - Zobrazení deadlinů a studijních sezení
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              ⏱️ <strong>Study Timer</strong> - Pomodoro technika (25 min práce + 5 min pauza)
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">
              🔔 <strong>Notifikace</strong> - Připomínky deadlinů a studijního času
            </Typography>
          </Box>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Získej body za každé dokončené studijní sezení!
        </Typography>
      </>
    ),
  },
];

const FAQ_ITEMS = [
  {
    question: 'Jak získám body?',
    answer:
      'Body získáš za: dokončení studijních sezení (10 bodů), splnění cílů (20 bodů), dokončení kurzů (50 bodů), odemčení achievementů (25 bodů) a udržení streaku (5 bodů denně).',
  },
  {
    question: 'Co jsou achievementy?',
    answer:
      'Achievementy jsou odznaky za dosažení určitých milníků. Existuje 20+ achievementů - od prvního kurzu, přes 7denní streak, až po marathon 2h sezení. Achievementy se odemykají automaticky!',
  },
  {
    question: 'Jak funguje streak?',
    answer:
      'Streak je počet po sobě jdoucích dní, kdy jsi studoval(a). Studuj každý den alespoň 15 minut, aby sis streak udržel(a). Při 7denním streaku získáš achievement! 🔥',
  },
  {
    question: 'Mohu importovat kurzy?',
    answer:
      'Ano! Na stránce Kurzy klikni na "Import CSV" a nahraj soubor s kurzy. Šablonu CSV můžeš stáhnout v dialogu importu.',
  },
  {
    question: 'Jak exportovat moje data?',
    answer:
      'V Nastavení → Správa dat můžeš exportovat všechna data do JSON nebo kurzy do CSV. Také je tam možnost smazat účet (opatrně!).',
  },
  {
    question: 'Funguje aplikace offline?',
    answer:
      'Ano! StudyPro je PWA (Progressive Web App), takže můžeš aplikaci nainstalovat a základní funkce fungují i offline. Data se synchronizují, když se znovu připojíš.',
  },
];

export const HelpTutorial = ({ open, onClose, startWithTutorial = false }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(startWithTutorial);

  const handleNext = () => {
    if (activeStep < TUTORIAL_STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      setShowTutorial(false);
      setActiveStep(0);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
    setActiveStep(0);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <HelpCircle size={24} color="#6366f1" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {showTutorial ? 'Průvodce aplikací' : 'Nápověda & FAQ'}
          </Typography>
        </Box>
        <Button
          onClick={onClose}
          size="small"
          sx={{ minWidth: 'auto', p: 0.5 }}
          color="inherit"
        >
          <X size={20} />
        </Button>
      </DialogTitle>

      <DialogContent>
        {showTutorial ? (
          <>
            {/* Tutorial Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {TUTORIAL_STEPS.map((step, index) => (
                <Step key={index}>
                  <StepLabel>{index + 1}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Tutorial Content */}
            <Card sx={{ bgcolor: 'background.default', borderRadius: 3, mb: 3 }}>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  {TUTORIAL_STEPS[activeStep].icon}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
                  {TUTORIAL_STEPS[activeStep].title}
                </Typography>
                {TUTORIAL_STEPS[activeStep].content}
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Tutorial Start Button */}
            <Card
              sx={{
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                cursor: 'pointer',
                '&:hover': { transform: 'scale(1.02)' },
                transition: 'all 0.2s',
              }}
              onClick={() => setShowTutorial(true)}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <HelpCircle size={40} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Začít tutoriál
                    </Typography>
                    <Typography variant="body2">
                      Procházej krok po kroku funkcemi StudyPro
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Často kladené otázky (FAQ)
            </Typography>
            {FAQ_ITEMS.map((item, index) => (
              <Accordion key={index} sx={{ mb: 1, borderRadius: 2 }}>
                <AccordionSummary>
                  <Typography sx={{ fontWeight: 600 }}>{item.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {showTutorial ? (
          <>
            <Button onClick={handleSkipTutorial}>Přeskočit</Button>
            <Box sx={{ flex: 1 }} />
            <Button onClick={handleBack} disabled={activeStep === 0} startIcon={<ChevronLeft size={18} />}>
              Zpět
            </Button>
            <Button onClick={handleNext} variant="contained" endIcon={<ChevronRight size={18} />}>
              {activeStep === TUTORIAL_STEPS.length - 1 ? 'Dokončit' : 'Další'}
            </Button>
          </>
        ) : (
          <Button onClick={onClose} variant="contained">
            Zavřít
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
