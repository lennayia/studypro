/**
 * Styled Icons - Předpřipravené ikony pro StudyPro
 *
 * Tyto komponenty zapouzdřují běžně používané ikony
 * s jejich výchozími styly pro konzistenci napříč aplikací
 *
 * @example
 * import { CoursesIcon, FlameIcon, TrophyIcon } from '@shared/components/icons';
 * <CoursesIcon /> // Automaticky správná velikost a barva
 */

import {
  BookOpen,
  GraduationCap,
  Flame,
  Trophy,
  Award,
  Target,
  BarChart,
  Zap,
  Settings,
  Clock,
  Star,
  Plus,
  Search,
  User,
  DollarSign,
  Home,
  LogOut,
  Menu,
  Edit,
  Trash2,
  Play,
  Calendar,
  MoreVertical,
  CheckCircle,
  TrendingUp,
  Percent,
  LogIn,
} from 'lucide-react';

import { ICON_COLORS, ICON_SIZES } from '../../constants/iconTheme';

/**
 * Page Title Icons - Velké ikony pro hlavní nadpisy stránek
 */
export const CoursesPageIcon = (props) => (
  <BookOpen size={ICON_SIZES['3xl']} color={ICON_COLORS.primary} {...props} />
);

export const GoalsPageIcon = (props) => (
  <Trophy size={ICON_SIZES['3xl']} color={ICON_COLORS.golden} {...props} />
);

export const DashboardPageIcon = (props) => (
  <Home size={ICON_SIZES['3xl']} color={ICON_COLORS.primary} {...props} />
);

/**
 * Logo Icons
 */
export const LogoIcon = (props) => (
  <GraduationCap size={ICON_SIZES['5xl']} color={ICON_COLORS.primary} {...props} />
);

export const LogoIconSmall = (props) => (
  <GraduationCap size={ICON_SIZES['3xl']} color={ICON_COLORS.primary} {...props} />
);

/**
 * Feature Icons - Pro feature listy (LoginPage, atd.)
 */
export const CoursesFeatureIcon = (props) => (
  <BookOpen size={ICON_SIZES.lg} color={ICON_COLORS.primary} {...props} />
);

export const StatsFeatureIcon = (props) => (
  <BarChart size={ICON_SIZES.lg} color={ICON_COLORS.secondary} {...props} />
);

export const GoalsFeatureIcon = (props) => (
  <Target size={ICON_SIZES.lg} color={ICON_COLORS.pink} {...props} />
);

export const StreakFeatureIcon = (props) => (
  <Flame size={ICON_SIZES.lg} color={ICON_COLORS.warning} {...props} />
);

export const DeadlineFeatureIcon = (props) => (
  <Clock size={ICON_SIZES.lg} color={ICON_COLORS.success} {...props} />
);

/**
 * Section Icons - Pro sekce nadpisy
 */
export const ActiveCoursesSectionIcon = (props) => (
  <Flame size={ICON_SIZES.xl} color={ICON_COLORS.warning} {...props} />
);

export const QuickActionsSectionIcon = (props) => (
  <Zap size={ICON_SIZES.xl} color={ICON_COLORS.golden} {...props} />
);

export const AchievementsSectionIcon = (props) => (
  <Award size={ICON_SIZES.xl} color={ICON_COLORS.secondary} {...props} />
);

export const GoalsSectionIcon = (props) => (
  <Target size={ICON_SIZES.xl} color={ICON_COLORS.pink} {...props} />
);

/**
 * Button Icons - Pro tlačítka
 */
export const AddButtonIcon = (props) => (
  <Plus size={ICON_SIZES.base} {...props} />
);

export const SearchButtonIcon = (props) => (
  <Search size={ICON_SIZES.base} {...props} />
);

export const SettingsButtonIcon = (props) => (
  <Settings size={ICON_SIZES.base} {...props} />
);

export const LoginButtonIcon = (props) => (
  <LogIn size={ICON_SIZES['2xl']} {...props} />
);

/**
 * Navigation Icons - Pro menu
 */
export const HomeNavIcon = (props) => (
  <Home size={ICON_SIZES.lg} {...props} />
);

export const CoursesNavIcon = (props) => (
  <BookOpen size={ICON_SIZES.lg} {...props} />
);

export const GoalsNavIcon = (props) => (
  <Trophy size={ICON_SIZES.lg} {...props} />
);

export const StatsNavIcon = (props) => (
  <BarChart size={ICON_SIZES.lg} {...props} />
);

export const SettingsNavIcon = (props) => (
  <Settings size={ICON_SIZES.lg} {...props} />
);

export const LogoutNavIcon = (props) => (
  <LogOut size={ICON_SIZES.lg} {...props} />
);

export const MenuNavIcon = (props) => (
  <Menu size={ICON_SIZES['2xl']} {...props} />
);

/**
 * Metadata Icons - Malé ikony pro detaily
 */
export const UserMetaIcon = (props) => (
  <User size={ICON_SIZES.sm} color={ICON_COLORS.neutral} {...props} />
);

export const PriceMetaIcon = (props) => (
  <DollarSign size={ICON_SIZES.sm} color={ICON_COLORS.neutral} {...props} />
);

export const CalendarMetaIcon = (props) => (
  <Calendar size={ICON_SIZES.md} color={ICON_COLORS.neutral} {...props} />
);

/**
 * Action Icons - Pro akce v UI
 */
export const EditActionIcon = (props) => (
  <Edit size={ICON_SIZES.base} {...props} />
);

export const DeleteActionIcon = (props) => (
  <Trash2 size={ICON_SIZES.base} {...props} />
);

export const PlayActionIcon = (props) => (
  <Play size={ICON_SIZES.base} {...props} />
);

export const MoreActionIcon = (props) => (
  <MoreVertical size={ICON_SIZES.lg} {...props} />
);

/**
 * Stats Icons - Pro statistické karty
 */
export const CoursesTotalIcon = (props) => (
  <GraduationCap size={ICON_SIZES['2xl']} {...props} />
);

export const CompletedIcon = (props) => (
  <CheckCircle size={ICON_SIZES['2xl']} {...props} />
);

export const ProgressIcon = (props) => (
  <TrendingUp size={ICON_SIZES['2xl']} {...props} />
);

export const PercentIcon = (props) => (
  <Percent size={ICON_SIZES['2xl']} {...props} />
);

/**
 * Gamification Icons - Pro gamifikaci
 */
export const StreakDisplayIcon = (props) => (
  <Flame size={ICON_SIZES['4xl']} {...props} />
);

export const TrophyDisplayIcon = (props) => (
  <Trophy size={ICON_SIZES['3xl']} color={ICON_COLORS.golden} {...props} />
);

export const StarDisplayIcon = (props) => (
  <Star size={ICON_SIZES['4xl']} {...props} />
);

/**
 * Empty State Icons
 */
export const EmptyCoursesIcon = (props) => (
  <BookOpen size={ICON_SIZES['6xl']} color={ICON_COLORS.primary} {...props} />
);

export const EmptySearchIcon = (props) => (
  <Search size={ICON_SIZES['6xl']} color={ICON_COLORS.secondary} {...props} />
);

export const EmptyGraduationIcon = (props) => (
  <GraduationCap size={ICON_SIZES['6xl']} color={ICON_COLORS.primary} {...props} />
);

/**
 * Chart Icons
 */
export const ChartTitleIcon = (props) => (
  <BarChart size={ICON_SIZES.lg} {...props} />
);

/**
 * Export všech - pro snadný import
 */
export const StyledIcons = {
  // Page titles
  CoursesPageIcon,
  GoalsPageIcon,
  DashboardPageIcon,

  // Logo
  LogoIcon,
  LogoIconSmall,

  // Features
  CoursesFeatureIcon,
  StatsFeatureIcon,
  GoalsFeatureIcon,
  StreakFeatureIcon,
  DeadlineFeatureIcon,

  // Sections
  ActiveCoursesSectionIcon,
  QuickActionsSectionIcon,
  AchievementsSectionIcon,
  GoalsSectionIcon,

  // Buttons
  AddButtonIcon,
  SearchButtonIcon,
  SettingsButtonIcon,
  LoginButtonIcon,

  // Navigation
  HomeNavIcon,
  CoursesNavIcon,
  GoalsNavIcon,
  StatsNavIcon,
  SettingsNavIcon,
  LogoutNavIcon,
  MenuNavIcon,

  // Metadata
  UserMetaIcon,
  PriceMetaIcon,
  CalendarMetaIcon,

  // Actions
  EditActionIcon,
  DeleteActionIcon,
  PlayActionIcon,
  MoreActionIcon,

  // Stats
  CoursesTotalIcon,
  CompletedIcon,
  ProgressIcon,
  PercentIcon,

  // Gamification
  StreakDisplayIcon,
  TrophyDisplayIcon,
  StarDisplayIcon,

  // Empty States
  EmptyCoursesIcon,
  EmptySearchIcon,
  EmptyGraduationIcon,

  // Charts
  ChartTitleIcon,
};
