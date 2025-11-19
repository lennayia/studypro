import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { Gift, Star, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';

// Reward definitions
const REWARDS = [
  {
    id: 'theme_purple',
    name: 'Fialový motiv',
    description: 'Odemkni fialové barevné schéma pro aplikaci',
    cost: 100,
    icon: '🎨',
    category: 'theme',
  },
  {
    id: 'theme_green',
    name: 'Zelený motiv',
    description: 'Odemkni zelené barevné schéma',
    cost: 100,
    icon: '🌿',
    category: 'theme',
  },
  {
    id: 'avatar_frame_gold',
    name: 'Zlatý rámeček avataru',
    description: 'Zlatý rámeček kolem tvého profilového obrázku',
    cost: 200,
    icon: '👑',
    category: 'avatar',
  },
  {
    id: 'avatar_frame_rainbow',
    name: 'Duhový rámeček',
    description: 'Duhový animovaný rámeček avataru',
    cost: 300,
    icon: '🌈',
    category: 'avatar',
  },
  {
    id: 'badge_early_bird',
    name: 'Early Bird badge',
    description: 'Zobraz svůj ranní studijní režim',
    cost: 150,
    icon: '🐦',
    category: 'badge',
  },
  {
    id: 'badge_night_owl',
    name: 'Night Owl badge',
    description: 'Pro ty, kteří studují v noci',
    cost: 150,
    icon: '🦉',
    category: 'badge',
  },
  {
    id: 'power_2x_xp',
    name: '2x XP na 24h',
    description: 'Dvojnásobné body po dobu 24 hodin',
    cost: 250,
    icon: '⚡',
    category: 'powerup',
    consumable: true,
  },
  {
    id: 'power_streak_freeze',
    name: 'Streak Freeze',
    description: 'Ochrana streaku na 1 den (i když nebudeš studovat)',
    cost: 200,
    icon: '❄️',
    category: 'powerup',
    consumable: true,
  },
  {
    id: 'custom_title',
    name: 'Vlastní titul',
    description: 'Nastav si vlastní titul k jménu (např. "Study Master")',
    cost: 500,
    icon: '✨',
    category: 'special',
  },
  {
    id: 'confetti_celebration',
    name: 'Konfety při achievementu',
    description: 'Animované konfety při odemčení achievementu',
    cost: 300,
    icon: '🎊',
    category: 'special',
  },
];

export const RewardsShop = () => {
  const { profile, updateProfile } = useAuth();
  const [selectedReward, setSelectedReward] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [ownedRewards, setOwnedRewards] = useState([]);

  const userPoints = profile?.total_points || 0;

  const handlePurchase = async () => {
    if (!selectedReward) return;

    setPurchasing(true);
    setError(null);

    try {
      // Check if user has enough points
      if (userPoints < selectedReward.cost) {
        setError('Nemáš dostatek bodů!');
        setPurchasing(false);
        return;
      }

      // Deduct points
      const newPoints = userPoints - selectedReward.cost;
      await updateProfile({ total_points: newPoints });

      // Store purchased reward in user's inventory
      const { error: insertError } = await supabase.from('studypro_user_rewards').insert({
        user_id: profile.id,
        reward_id: selectedReward.id,
        purchased_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      setOwnedRewards([...ownedRewards, selectedReward.id]);
      setSuccess(`${selectedReward.name} byla úspěšně zakoupena! 🎉`);
      setDialogOpen(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Purchase error:', err);
      setError(err.message || 'Chyba při nákupu odměny');
    } finally {
      setPurchasing(false);
    }
  };

  const isOwned = (rewardId) => ownedRewards.includes(rewardId);
  const canAfford = (cost) => userPoints >= cost;

  const categories = {
    theme: { label: 'Motivy', icon: '🎨' },
    avatar: { label: 'Avatary', icon: '👤' },
    badge: { label: 'Odznaky', icon: '🏅' },
    powerup: { label: 'Power-upy', icon: '⚡' },
    special: { label: 'Speciální', icon: '✨' },
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Gift size={24} color="#6366f1" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Obchod s odměnami
          </Typography>
        </Box>
        <Chip
          icon={<Star size={16} />}
          label={`${userPoints} bodů`}
          color="primary"
          sx={{ fontWeight: 600, px: 1 }}
        />
      </Box>

      {/* Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Rewards by Category */}
      {Object.entries(categories).map(([categoryKey, categoryData]) => {
        const categoryRewards = REWARDS.filter((r) => r.category === categoryKey);

        return (
          <Box key={categoryKey} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>{categoryData.icon}</span>
              {categoryData.label}
            </Typography>

            <Grid container spacing={2}>
              {categoryRewards.map((reward) => {
                const owned = isOwned(reward.id);
                const affordable = canAfford(reward.cost);

                return (
                  <Grid item xs={12} sm={6} md={4} key={reward.id}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: owned ? 'success.main' : 'divider',
                        bgcolor: owned ? 'success.lighter' : 'background.paper',
                        position: 'relative',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 3,
                        },
                      }}
                    >
                      {owned && (
                        <Chip
                          icon={<Check size={16} />}
                          label="Vlastníš"
                          color="success"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            fontWeight: 600,
                          }}
                        />
                      )}

                      <CardContent>
                        {/* Icon */}
                        <Box
                          sx={{
                            fontSize: 48,
                            textAlign: 'center',
                            mb: 2,
                            filter: owned || affordable ? 'none' : 'grayscale(1) opacity(0.5)',
                          }}
                        >
                          {reward.icon}
                        </Box>

                        {/* Name */}
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}
                        >
                          {reward.name}
                        </Typography>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2, textAlign: 'center', minHeight: 40 }}
                        >
                          {reward.description}
                        </Typography>

                        {/* Price & Button */}
                        <Box sx={{ textAlign: 'center' }}>
                          <Chip
                            icon={<Star size={16} />}
                            label={`${reward.cost} bodů`}
                            color={affordable ? 'primary' : 'default'}
                            sx={{ mb: 2 }}
                          />
                          <Button
                            variant={owned ? 'outlined' : 'contained'}
                            fullWidth
                            disabled={owned || !affordable}
                            onClick={() => {
                              setSelectedReward(reward);
                              setDialogOpen(true);
                            }}
                            sx={{ borderRadius: 2 }}
                          >
                            {owned ? 'Vlastníš' : affordable ? 'Koupit' : 'Málo bodů'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      })}

      {/* Purchase Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => !purchasing && setDialogOpen(false)} maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Sparkles size={24} color="#6366f1" />
          Potvrdit nákup
        </DialogTitle>
        <DialogContent>
          {selectedReward && (
            <Box>
              <Box sx={{ textAlign: 'center', mb: 2, fontSize: 64 }}>{selectedReward.icon}</Box>
              <Typography variant="h6" sx={{ textAlign: 'center', mb: 1 }}>
                {selectedReward.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
                {selectedReward.description}
              </Typography>

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Cena: <strong>{selectedReward.cost} bodů</strong>
                </Typography>
                <Typography variant="body2">
                  Tvoje body po nákupu: <strong>{userPoints - selectedReward.cost} bodů</strong>
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={purchasing}>
            Zrušit
          </Button>
          <Button
            onClick={handlePurchase}
            variant="contained"
            disabled={purchasing}
            startIcon={<Gift size={18} />}
          >
            {purchasing ? 'Kupuji...' : 'Koupit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
