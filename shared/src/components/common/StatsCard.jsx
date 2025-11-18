import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * StatsCard - Univerzální statistická karta
 *
 * @param {string} title - Titulek karty
 * @param {string|number} value - Hlavní hodnota
 * @param {ReactNode} icon - Ikona (emoji nebo MUI icon)
 * @param {string} color - MUI barva ('primary', 'secondary', 'success', atd.)
 * @param {number} trend - Trend v procentech (zobrazí šipku a %)
 * @param {string} trendText - Text vedle trendu (default: "tento týden")
 * @param {string} subtitle - Podtitulek pod hodnotou
 */
export const StatsCard = ({
  title,
  value,
  icon,
  color = 'primary',
  trend,
  trendText = 'tento týden',
  subtitle
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}.main 0%, ${color}.dark 100%)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
            }}
          >
            {icon}
          </Box>
        </Box>

        {trend !== undefined && trend !== null && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2 }}>
            {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <Typography variant="caption">
              {trend > 0 ? '+' : ''}{trend}% {trendText}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Decorative background circles */}
      <Box
        sx={{
          position: 'absolute',
          right: -20,
          bottom: -20,
          width: 120,
          height: 120,
          borderRadius: '50%',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          right: 40,
          bottom: 40,
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
        }}
      />
    </Card>
  );
};
