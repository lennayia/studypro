import { Box, Card, CardContent, Skeleton as MuiSkeleton, Stack } from '@mui/material';

/**
 * CourseCardSkeleton - Loading skeleton pro CourseCard
 */
export const CourseCardSkeleton = () => (
  <Card sx={{ borderRadius: 4 }}>
    <CardContent>
      <Stack spacing={2}>
        {/* Cover image placeholder */}
        <MuiSkeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />

        {/* Title */}
        <MuiSkeleton variant="text" width="80%" height={32} />

        {/* Metadata row */}
        <Stack direction="row" spacing={2}>
          <MuiSkeleton variant="text" width={100} />
          <MuiSkeleton variant="text" width={120} />
        </Stack>

        {/* Progress bar */}
        <MuiSkeleton variant="rectangular" height={8} sx={{ borderRadius: 1 }} />

        {/* Actions */}
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <MuiSkeleton variant="circular" width={32} height={32} />
          <MuiSkeleton variant="circular" width={32} height={32} />
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

/**
 * GoalCardSkeleton - Loading skeleton pro GoalCard
 */
export const GoalCardSkeleton = () => (
  <Card sx={{ borderRadius: 4 }}>
    <CardContent>
      <Stack spacing={2}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <MuiSkeleton variant="text" width="60%" height={28} />
          <MuiSkeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: 1 }} />
        </Stack>

        {/* Description */}
        <MuiSkeleton variant="text" width="90%" />

        {/* Progress */}
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <MuiSkeleton variant="text" width={60} />
            <MuiSkeleton variant="text" width={60} />
          </Stack>
          <MuiSkeleton variant="rectangular" height={8} sx={{ borderRadius: 1 }} />
        </Stack>

        {/* Footer */}
        <MuiSkeleton variant="text" width={120} />
      </Stack>
    </CardContent>
  </Card>
);

/**
 * StatsCardSkeleton - Loading skeleton pro StatsCard
 */
export const StatsCardSkeleton = () => (
  <Card sx={{ borderRadius: 4 }}>
    <CardContent>
      <Stack spacing={1.5}>
        {/* Icon + Label */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <MuiSkeleton variant="circular" width={24} height={24} />
          <MuiSkeleton variant="text" width={100} />
        </Stack>

        {/* Value */}
        <MuiSkeleton variant="text" width={80} height={40} />
      </Stack>
    </CardContent>
  </Card>
);

/**
 * ListItemSkeleton - Universal skeleton pro list items
 */
export const ListItemSkeleton = ({ count = 5 }) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index} sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <MuiSkeleton variant="text" width="70%" height={24} />
            <MuiSkeleton variant="circular" width={20} height={20} />
          </Stack>
          <MuiSkeleton variant="text" width="50%" />
        </Stack>
      </Box>
    ))}
  </>
);

/**
 * TableSkeleton - Loading skeleton pro tabulky
 */
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <Stack spacing={1}>
    {/* Header */}
    <Stack direction="row" spacing={2} sx={{ pb: 2, borderBottom: '2px solid', borderColor: 'divider' }}>
      {Array.from({ length: columns }).map((_, index) => (
        <MuiSkeleton key={index} variant="text" width={`${100 / columns}%`} height={24} />
      ))}
    </Stack>

    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <Stack key={rowIndex} direction="row" spacing={2} sx={{ py: 1.5 }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <MuiSkeleton key={colIndex} variant="text" width={`${100 / columns}%`} />
        ))}
      </Stack>
    ))}
  </Stack>
);

/**
 * DashboardSkeleton - Complex skeleton pro dashboard
 */
export const DashboardSkeleton = () => (
  <Stack spacing={4}>
    {/* Header */}
    <Stack spacing={2}>
      <MuiSkeleton variant="text" width={250} height={40} />
      <MuiSkeleton variant="text" width={400} />
    </Stack>

    {/* Stats grid */}
    <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Box key={index} sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <StatsCardSkeleton />
        </Box>
      ))}
    </Stack>

    {/* Chart */}
    <MuiSkeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />

    {/* Cards */}
    <Stack spacing={3}>
      {Array.from({ length: 3 }).map((_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </Stack>
  </Stack>
);

/**
 * ProfileSkeleton - Loading skeleton pro profil
 */
export const ProfileSkeleton = () => (
  <Card sx={{ borderRadius: 4 }}>
    <CardContent>
      <Stack spacing={3} alignItems="center">
        {/* Avatar */}
        <MuiSkeleton variant="circular" width={120} height={120} />

        {/* Name */}
        <MuiSkeleton variant="text" width={200} height={32} />

        {/* Stats */}
        <Stack direction="row" spacing={4}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Stack key={index} spacing={1} alignItems="center">
              <MuiSkeleton variant="text" width={60} height={28} />
              <MuiSkeleton variant="text" width={80} />
            </Stack>
          ))}
        </Stack>

        {/* Bio */}
        <Stack spacing={1} width="100%">
          <MuiSkeleton variant="text" width="100%" />
          <MuiSkeleton variant="text" width="90%" />
          <MuiSkeleton variant="text" width="70%" />
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);
