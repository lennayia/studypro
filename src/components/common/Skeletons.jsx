import { Box, Skeleton, Card, CardContent, Stack, Grid } from '@mui/material';

/**
 * Collection of skeleton loaders for different components
 * Provides smooth loading experience
 */

/**
 * Course card skeleton
 */
export const CourseCardSkeleton = () => (
  <Card sx={{ borderRadius: 3 }}>
    <CardContent>
      <Stack spacing={2}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="70%" height={32} />
            <Skeleton variant="text" width="40%" height={20} sx={{ mt: 0.5 }} />
          </Box>
          <Skeleton variant="circular" width={48} height={48} />
        </Box>

        {/* Progress bar */}
        <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4 }} />

        {/* Meta info */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

/**
 * Course list skeleton (multiple cards)
 */
export const CourseListSkeleton = ({ count = 3 }) => (
  <Grid container spacing={3}>
    {Array.from({ length: count }).map((_, index) => (
      <Grid item xs={12} key={index}>
        <CourseCardSkeleton />
      </Grid>
    ))}
  </Grid>
);

/**
 * Stats card skeleton
 */
export const StatsCardSkeleton = () => (
  <Card sx={{ borderRadius: 3 }}>
    <CardContent>
      <Stack spacing={1}>
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="50%" height={40} />
        <Skeleton variant="text" width="40%" height={20} />
      </Stack>
    </CardContent>
  </Card>
);

/**
 * Stats grid skeleton
 */
export const StatsGridSkeleton = ({ count = 4 }) => (
  <Grid container spacing={3}>
    {Array.from({ length: count }).map((_, index) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <StatsCardSkeleton />
      </Grid>
    ))}
  </Grid>
);

/**
 * Goal card skeleton
 */
export const GoalCardSkeleton = () => (
  <Card sx={{ borderRadius: 3 }}>
    <CardContent>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" width="60%" height={28} />
          <Skeleton variant="rectangular" width={60} height={28} sx={{ borderRadius: 1 }} />
        </Box>
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="rectangular" height={6} sx={{ borderRadius: 3 }} />
      </Stack>
    </CardContent>
  </Card>
);

/**
 * Leaderboard item skeleton
 */
export const LeaderboardItemSkeleton = () => (
  <Box
    sx={{
      p: 2,
      borderRadius: 2,
      bgcolor: 'background.default',
      border: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <Skeleton variant="text" width={40} height={32} />
      <Skeleton variant="circular" width={48} height={48} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="text" width="40%" height={16} />
      </Box>
      <Skeleton variant="text" width={60} height={32} />
    </Stack>
  </Box>
);

/**
 * Leaderboard list skeleton
 */
export const LeaderboardListSkeleton = ({ count = 10 }) => (
  <Stack spacing={1.5}>
    {Array.from({ length: count }).map((_, index) => (
      <LeaderboardItemSkeleton key={index} />
    ))}
  </Stack>
);

/**
 * Achievement card skeleton
 */
export const AchievementCardSkeleton = () => (
  <Card sx={{ borderRadius: 3, height: '100%' }}>
    <CardContent>
      <Box sx={{ textAlign: 'center' }}>
        <Skeleton variant="circular" width={64} height={64} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width="80%" height={24} sx={{ mx: 'auto' }} />
        <Skeleton variant="rectangular" width="60%" height={24} sx={{ mx: 'auto', mt: 2, borderRadius: 1 }} />
      </Box>
    </CardContent>
  </Card>
);

/**
 * Achievement grid skeleton
 */
export const AchievementGridSkeleton = ({ count = 12 }) => (
  <Grid container spacing={2}>
    {Array.from({ length: count }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <AchievementCardSkeleton />
      </Grid>
    ))}
  </Grid>
);

/**
 * Calendar skeleton
 */
export const CalendarSkeleton = () => (
  <Card sx={{ borderRadius: 3 }}>
    <CardContent>
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
      <Grid container spacing={1}>
        {Array.from({ length: 35 }).map((_, index) => (
          <Grid item xs={1.7} key={index}>
            <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
);

/**
 * Profile skeleton
 */
export const ProfileSkeleton = () => (
  <Card sx={{ borderRadius: 3 }}>
    <CardContent>
      <Stack spacing={3} alignItems="center">
        <Skeleton variant="circular" width={120} height={120} />
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Skeleton variant="text" width="60%" height={32} sx={{ mx: 'auto' }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mx: 'auto', mt: 1 }} />
        </Box>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Skeleton variant="rectangular" width="50%" height={60} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" width="50%" height={60} sx={{ borderRadius: 2 }} />
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

/**
 * Generic page skeleton
 */
export const PageSkeleton = () => (
  <Box>
    <Skeleton variant="text" width="30%" height={48} sx={{ mb: 3 }} />
    <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 3 }} />
  </Box>
);
