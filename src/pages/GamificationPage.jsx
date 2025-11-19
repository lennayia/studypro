import { useState } from 'react';
import { Box, Container, Typography, Tabs, Tab, Paper } from '@mui/material';
import { Trophy, Gift, Award } from 'lucide-react';
import { Leaderboard } from '../components/gamification/Leaderboard';
import { RewardsShop } from '../components/gamification/RewardsShop';
import { AchievementsList } from '../components/gamification/AchievementsList';

export const GamificationPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Gamifikace & Soutěže
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Soutěž s ostatními, odemykej achievementy a získávej odměny! 🏆
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              py: 2,
              fontSize: '1rem',
              fontWeight: 600,
            },
          }}
        >
          <Tab icon={<Trophy size={20} />} label="Žebříček" iconPosition="start" />
          <Tab icon={<Award size={20} />} label="Achievementy" iconPosition="start" />
          <Tab icon={<Gift size={20} />} label="Obchod" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {activeTab === 0 && <Leaderboard />}
        {activeTab === 1 && <AchievementsList />}
        {activeTab === 2 && <RewardsShop />}
      </Box>
    </Container>
  );
};
