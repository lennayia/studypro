/**
 * Centralized Icon Configuration for StudyPro
 *
 * Single source of truth for all icons used across StudyPro.
 * Uses Lucide React icons for consistency with ProApp ecosystem.
 *
 * @created 18.11.2025
 */

import {
  Home,
  BookOpen,
  GraduationCap,
  Target,
  Calendar,
  Clock,
  TrendingUp,
  BarChart,
  Award,
  Trophy,
  Star,
  Flame,
  CheckCircle,
  Circle,
  XCircle,
  Pause,
  Play,
  FileText,
  Video,
  Link,
  Download,
  Upload,
  Image,
  User,
  Users,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  SortAsc,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  ExternalLink,
  BookMarked,
  Library,
  FolderOpen,
  Tag,
  Zap,
  Activity,
  TrendingDown,
  Percent,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

/**
 * Navigation Icons - used in main navigation
 */
export const NAVIGATION_ICONS = {
  dashboard: Home,
  courses: BookOpen,
  goals: Target,
  calendar: Calendar,
  profile: User,
  settings: Settings,
};

/**
 * Course & Learning Icons
 */
export const COURSE_ICONS = {
  course: BookOpen,
  lesson: FileText,
  video: Video,
  book: BookMarked,
  library: Library,
  graduation: GraduationCap,
  folder: FolderOpen,
  tag: Tag,
};

/**
 * Progress & Status Icons
 */
export const PROGRESS_ICONS = {
  notStarted: Circle,
  inProgress: Play,
  completed: CheckCircle,
  paused: Pause,
  expired: XCircle,
  trending: TrendingUp,
  trendingDown: TrendingDown,
};

/**
 * Gamification Icons
 */
export const GAMIFICATION_ICONS = {
  achievement: Award,
  trophy: Trophy,
  star: Star,
  streak: Flame,
  zap: Zap,
  activity: Activity,
};

/**
 * Stats & Analytics Icons
 */
export const STATS_ICONS = {
  chart: BarChart,
  trending: TrendingUp,
  activity: Activity,
  percent: Percent,
  clock: Clock,
  calendar: Calendar,
};

/**
 * Action Icons
 */
export const ACTION_ICONS = {
  add: Plus,
  edit: Edit,
  delete: Trash2,
  search: Search,
  filter: Filter,
  sort: SortAsc,
  upload: Upload,
  download: Download,
  link: Link,
  externalLink: ExternalLink,
  close: X,
  check: Check,
  image: Image,
};

/**
 * Navigation Arrows
 */
export const ARROW_ICONS = {
  right: ChevronRight,
  left: ChevronLeft,
  down: ChevronDown,
  up: ChevronUp,
};

/**
 * User & Auth Icons
 */
export const USER_ICONS = {
  user: User,
  users: Users,
  profile: User,
  logout: LogOut,
  settings: Settings,
};

/**
 * Alert & Info Icons
 */
export const ALERT_ICONS = {
  info: Info,
  help: HelpCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
};

/**
 * Priority Icons
 */
export const PRIORITY_ICONS = {
  low: Circle,
  medium: AlertCircle,
  high: AlertTriangle,
};

/**
 * Course Type Icons
 */
export const COURSE_TYPE_ICONS = {
  paid: DollarSign,
  free: Star,
  school: GraduationCap,
  workshop: Users,
  book: BookMarked,
  article: FileText,
  video: Video,
  other: BookOpen,
};

/**
 * Helper: Get icon for course status
 * @param {string} status - Status name
 * @returns {React.Component} Lucide icon component
 */
export const getStatusIcon = (status) => {
  return PROGRESS_ICONS[status] || Circle;
};

/**
 * Helper: Get icon for course type
 * @param {string} type - Course type
 * @returns {React.Component} Lucide icon component
 */
export const getCourseTypeIcon = (type) => {
  return COURSE_TYPE_ICONS[type] || BookOpen;
};

/**
 * Helper: Get icon for priority
 * @param {number} priority - Priority level (0-2)
 * @returns {React.Component} Lucide icon component
 */
export const getPriorityIcon = (priority) => {
  const priorityMap = {
    0: PRIORITY_ICONS.low,
    1: PRIORITY_ICONS.medium,
    2: PRIORITY_ICONS.high,
  };
  return priorityMap[priority] || Circle;
};
