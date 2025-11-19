import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Chip,
  LinearProgress,
  Tab,
  Tabs,
  Divider,
} from '@mui/material';
import { Trophy, Medal, Crown, TrendingUp, Flame } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';

export const Leaderboard = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeframe, setTimeframe] = useState('all'); // 'all', 'week', 'month'
  const [category, setCategory] = useState('points'); // 'points', 'streak', 'courses'

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe, category]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('studypro_profiles')
        .select('id, full_name, avatar_url, total_points, current_streak, longest_streak');

      // Sort by category
      if (category === 'points') {
        query = query.order('total_points', { ascending: false });
      } else if (category === 'streak') {
        query = query.order('current_streak', { ascending: false });
      }

      // Limit to top 50
      query = query.limit(50);

      const { data, error } = await query;
      if (error) throw error;

      // For courses, we need to count separately
      if (category === 'courses') {
        const usersWithCourses = await Promise.all(
          data.map(async (user) => {
            const { count } = await supabase
              .from('studypro_courses')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id)
              .eq('status', 'completed');
            return { ...user, completedCourses: count || 0 };
          })
        );
        setLeaderboard(usersWithCourses.sort((a, b) => b.completedCourses - a.completedCourses));
      } else {
        setLeaderboard(data || []);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={24} color="#FFD700" />;
    if (rank === 2) return <Medal size={24} color="#C0C0C0" />;
    if (rank === 3) return <Medal size={24} color="#CD7F32" />;
    return null;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return 'text.secondary';
  };

  const getValue = (user) => {
    if (category === 'points') return user.total_points || 0;
    if (category === 'streak') return user.current_streak || 0;
    if (category === 'courses') return user.completedCourses || 0;
    return 0;
  };

  const getLabel = () => {
    if (category === 'points') return 'bodů';
    if (category === 'streak') return 'dní 🔥';
    if (category === 'courses') return 'kurzů';
    return '';
  };

  const currentUserRank = leaderboard.findIndex((user) => user.id === profile?.id) + 1;

  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Trophy size={24} color="#6366f1" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Žebříček
          </Typography>
        </Box>

        {/* Category Tabs */}
        <Tabs
          value={category}
          onChange={(e, newValue) => setCategory(newValue)}
          sx={{ mb: 3 }}
          variant="fullWidth"
        >
          <Tab label="Body" value="points" />
          <Tab label="Streak" value="streak" />
          <Tab label="Kurzy" value="courses" />
        </Tabs>

        {/* Current User Rank */}
        {currentUserRank > 0 && (
          <Box
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              bgcolor: 'primary.lighter',
              border: '2px solid',
              borderColor: 'primary.main',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  #{currentUserRank}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Tvoje pozice
                </Typography>
              </Box>
              <Chip
                label={`${getValue(leaderboard[currentUserRank - 1])} ${getLabel()}`}
                color="primary"
                size="small"
              />
            </Stack>
          </Box>
        )}

        {/* Loading */}
        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Leaderboard List */}
        <Stack spacing={1.5} sx={{ maxHeight: 600, overflowY: 'auto' }}>
          {leaderboard.map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = user.id === profile?.id;

            return (
              <Box
                key={user.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: isCurrentUser ? 'primary.lighter' : 'background.default',
                  border: '1px solid',
                  borderColor: isCurrentUser ? 'primary.main' : 'divider',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: isCurrentUser ? 'primary.lighter' : 'action.hover',
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  {/* Rank */}
                  <Box
                    sx={{
                      minWidth: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getRankIcon(rank) || (
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: getRankColor(rank) }}
                      >
                        #{rank}
                      </Typography>
                    )}
                  </Box>

                  {/* Avatar */}
                  <Avatar
                    src={user.avatar_url}
                    sx={{
                      width: 48,
                      height: 48,
                      border: rank <= 3 ? `2px solid ${getRankColor(rank)}` : 'none',
                    }}
                  >
                    {user.full_name?.charAt(0).toUpperCase()}
                  </Avatar>

                  {/* User Info */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {user.full_name || 'Anonymní uživatel'}
                      {isCurrentUser && (
                        <Chip label="Ty" size="small" color="primary" sx={{ ml: 1 }} />
                      )}
                    </Typography>
                    {category === 'streak' && (
                      <Typography variant="caption" color="text.secondary">
                        Nejdelší: {user.longest_streak || 0} dní
                      </Typography>
                    )}
                  </Box>

                  {/* Score */}
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {getValue(user)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getLabel()}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            );
          })}
        </Stack>

        {/* Empty State */}
        {!loading && leaderboard.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Trophy size={48} color="#d1d5db" />
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Žebříček je zatím prázdný
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
