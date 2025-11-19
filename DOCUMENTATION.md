# 📚 StudyPro - Dokumentace

**Verze:** 1.1.0
**Datum:** 19.11.2025
**Status:** Beta Development

---

## 📋 Obsah

1. [Přehled projektu](#přehled-projektu)
2. [Architektura](#architektura)
3. [Modulární design systém](#modulární-design-systém)
4. [Dark Mode](#dark-mode)
5. [Error Handling & Loading States](#error-handling--loading-states)
6. [Study Session Tracking](#study-session-tracking)
7. [Kalendář s deadliny](#kalendář-s-deadliny)
8. [Database schema](#database-schema)
9. [Komponenty](#komponenty)
10. [Stránky](#stránky)
11. [Kontexty a stavy](#kontexty-a-stavy)
12. [Instalace a spuštění](#instalace-a-spuštění)
13. [Deployment](#deployment)
14. [Best practices](#best-practices)

---

## 🎯 Přehled projektu

**StudyPro** je pokročilý studijní CRM systém postavený na moderních webových technologiích. Umožňuje studentům efektivně sledovat kurzy, měřit pokrok, motivovat se pomocí gamifikace a dosahovat studijních cílů.

### Klíčové funkce

- ✅ **Správa kurzů** - Kompletní CRUD operace, sledování pokroku, deadliny
- ✅ **Gamifikace** - Streaky, úspěchy (achievements), body, levely
- ✅ **Cíle** - Nastavení a sledování studijních cílů
- ✅ **Dashboard** - Přehled pokroku, aktivní kurzy, statistiky
- ✅ **Autentizace** - Google OAuth přes Supabase
- ✅ **Modulární design** - Centralizovaný systém ikon a barev
- ✅ **Dark Mode** - Tmavý režim s auto-detect a persistence
- ✅ **Study Timer** - Pomodoro technika, automatické body
- ✅ **Kalendář** - Vizualizace deadlinů, upomínky
- ✅ **Error Handling** - Offline detection, retry mechanismus, skeletony

### Tech Stack

```
Frontend:
├── React 18
├── Vite
├── Material-UI (MUI) v5
├── Lucide React Icons
├── React Router v6
├── Recharts
└── React Hook Form

Backend:
├── Supabase (PostgreSQL)
├── Row Level Security (RLS)
└── Real-time subscriptions

Shared:
└── @proapp/shared (sdílené komponenty)
```

---

## 🏗️ Architektura

### Struktura projektu

```
studypro/
├── src/
│   ├── components/          # Aplikační komponenty
│   │   ├── common/          # Layout, navigace
│   │   ├── courses/         # CourseCard, CourseForm
│   │   ├── dashboard/       # StreakDisplay, ProgressChart
│   │   └── goals/           # GoalCard
│   ├── contexts/            # React Contexts
│   │   ├── AuthContext.jsx
│   │   ├── CourseContext.jsx
│   │   └── GamificationContext.jsx
│   ├── pages/               # Stránky aplikace
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── CoursesPage.jsx
│   │   ├── GoalsPage.jsx
│   │   └── StatsPage.jsx
│   ├── utils/               # Utility funkce
│   │   ├── helpers.js
│   │   └── supabase.js
│   └── App.jsx
│
├── shared/                   # Sdílené moduly s ProApp
│   └── src/
│       ├── components/
│       │   ├── common/      # StatsCard, EmptyState, LoadingSpinner
│       │   └── icons/       # 50+ styled icon komponenty
│       └── constants/
│           └── iconTheme.js # Centrální konfigurace barev a velikostí
│
└── supabase/
    └── migrations/          # SQL migrace
```

### Data flow

```
User Interaction
     ↓
  Component
     ↓
  Context (AuthContext, CourseContext, GamificationContext)
     ↓
  Supabase Client
     ↓
  PostgreSQL Database (studypro schema)
     ↓
  RLS Policy Check
     ↓
  Response
```

---

## 🎨 Modulární design systém

### Architektura

StudyPro používá **třístupňový modulární systém ikon**:

```
1. iconTheme.js (konstanty)
   ↓
2. icons/index.jsx (styled komponenty)
   ↓
3. Použití v aplikaci
```

### 1. Theme konstanty

**Soubor:** `shared/src/constants/iconTheme.js`

```javascript
// Centrální konfigurace barev
export const ICON_COLORS = {
  primary: '#6366f1',      // Modrá - hlavní akce, kurzy
  secondary: '#8b5cf6',    // Fialová - statistiky, odznaky
  success: '#10b981',      // Zelená - dokončeno, deadlines
  warning: '#f97316',      // Oranžová - streaks, aktivita
  golden: '#eab308',       // Zlatá - trofeje, úspěchy
  pink: '#ec4899',         // Růžová - cíle
  neutral: '#6b7280',      // Šedá - metadata
};

// Centrální konfigurace velikostí
export const ICON_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  base: 18,
  lg: 20,
  xl: 22,
  '2xl': 24,
  '3xl': 28,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

// Sémantické styly pro běžné use cases
export const SEMANTIC_ICON_STYLES = {
  pageTitle: { size: ICON_SIZES['3xl'], color: ICON_COLORS.primary },
  feature: { size: ICON_SIZES.lg, color: ICON_COLORS.primary },
  button: { size: ICON_SIZES.base, color: 'inherit' },
  navigation: { size: ICON_SIZES.lg, color: 'inherit' },
  metadata: { size: ICON_SIZES.sm, color: ICON_COLORS.neutral },
  // ... další
};
```

### 2. Styled icon komponenty

**Soubor:** `shared/src/components/icons/index.jsx`

Obsahuje **50+ pre-styled komponent** organizovaných do kategorií:

```javascript
// Page Title Icons
export const CoursesPageIcon = (props) => (
  <BookOpen size={ICON_SIZES['3xl']} color={ICON_COLORS.primary} {...props} />
);

// Section Icons
export const ActiveCoursesSectionIcon = (props) => (
  <Flame size={ICON_SIZES.xl} color={ICON_COLORS.warning} {...props} />
);

// Button Icons
export const AddButtonIcon = (props) => (
  <Plus size={ICON_SIZES.base} {...props} />
);

// Navigation Icons
export const HomeNavIcon = (props) => (
  <Home size={ICON_SIZES.lg} {...props} />
);

// Stats Icons
export const CoursesTotalIcon = (props) => (
  <GraduationCap size={ICON_SIZES['2xl']} {...props} />
);

// Gamification Icons
export const StreakDisplayIcon = (props) => (
  <Flame size={ICON_SIZES['4xl']} {...props} />
);

// Empty State Icons
export const EmptyCoursesIcon = (props) => (
  <BookOpen size={ICON_SIZES['6xl']} color={ICON_COLORS.primary} {...props} />
);
```

### 3. Použití v aplikaci

**PŘED refaktoringem** (hardcodované hodnoty):
```jsx
import { BookOpen, Flame } from 'lucide-react';

<BookOpen size={28} color="#6366f1" />
<Flame size={24} color="#f97316" />
```

**PO refaktoringu** (modulární):
```jsx
import { CoursesPageIcon, ActiveCoursesSectionIcon } from '@shared/components/icons';

<CoursesPageIcon />
<ActiveCoursesSectionIcon />
```

### Výhody modulárního systému

✅ **Single source of truth** - Změna na 1 místě → projeví se všude
✅ **Konzistence** - Stejné barvy a velikosti napříč aplikací
✅ **Sémantické názvy** - `CoursesPageIcon` místo `<BookOpen size={28} />`
✅ **Type-safe** - Props typing přes TypeScript/PropTypes
✅ **Snížení duplicity** - -190 řádků kódu
✅ **Snadná údržba** - Vše na jednom místě

### Jak změnit design

Chceš změnit primární barvu z modré na zelenou?

```javascript
// shared/src/constants/iconTheme.js

export const ICON_COLORS = {
  primary: '#10b981',  // ← Změň zde, změní se VŠUDE
  // ...
};
```

Chceš zvětšit všechny page title ikony?

```javascript
export const SEMANTIC_ICON_STYLES = {
  pageTitle: { size: ICON_SIZES['4xl'], color: ICON_COLORS.primary },  // ← 3xl → 4xl
  // ...
};
```

---

## 🌓 Dark Mode

StudyPro podporuje **tmavý režim** s automatickou detekcí systémové preference a manuálním přepínáním.

### Implementace

**Architektura:**
```
ThemeContext (localStorage + system preference)
   ↓
lightTheme.js / darkTheme.js
   ↓
MUI ThemeProvider
   ↓
Celá aplikace
```

**Soubory:**
- `src/contexts/ThemeContext.jsx` - Context pro správu režimu
- `src/theme/lightTheme.js` - Světlé téma
- `src/theme/darkTheme.js` - Tmavé téma

### Funkce

✅ **Auto-detect** - Automatická detekce systémové preference (`prefers-color-scheme`)
✅ **Persistence** - Uložení preference v `localStorage`
✅ **Manual toggle** - Přepínač v Settings stránce
✅ **Real-time switch** - Okamžitá změna bez refreshe

### ThemeContext API

```javascript
import { useTheme } from '../contexts/ThemeContext';

const { mode, toggleTheme, isDark } = useTheme();

// mode: 'light' | 'dark'
// toggleTheme: () => void
// isDark: boolean
```

### Použití

**V Settings stránce:**
```jsx
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const { isDark, toggleTheme } = useTheme();

<Switch checked={isDark} onChange={toggleTheme} />
{isDark ? <Moon /> : <Sun />}
```

### Rozdíly mezi tématy

| Vlastnost | Light Theme | Dark Theme |
|-----------|-------------|------------|
| Background default | `#f9fafb` | `#0f172a` |
| Background paper | `#ffffff` | `#1e293b` |
| Text primary | `#1f2937` | `#f1f5f9` |
| Text secondary | `#6b7280` | `#94a3b8` |
| Primary color | `#6366f1` | `#818cf8` (světlejší) |
| Success color | `#10b981` | `#34d399` (světlejší) |

**Poznámka:** Tmavé téma používá světlejší varianty barev pro lepší kontrast na tmavém pozadí.

### Přizpůsobení

Chceš změnit tmavé pozadí?

```javascript
// src/theme/darkTheme.js

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',  // ← Změň zde
      paper: '#111111',    // ← Změň zde
    },
    // ...
  },
});
```

---

## ⚠️ Error Handling & Loading States

StudyPro má robustní error handling systém pro lepší UX.

### Komponenty

**ErrorBoundary:**
- Catches React errors a zobrazuje fallback UI
- Development mode: ukazuje stack trace
- Production mode: user-friendly error message
- Actions: Reload page | Zpět na úvod

**Loading Skeletons:**
- `CourseCardSkeleton` - Pro course cards
- `GoalCardSkeleton` - Pro goal cards
- `StatsCardSkeleton` - Pro stats
- `ListItemSkeleton` - Universal pro lists
- `TableSkeleton` - Pro tabulky
- `DashboardSkeleton` - Complex dashboard skeleton
- `ProfileSkeleton` - Pro profil

**Offline Detection:**
- `useOffline()` hook - Detekuje online/offline status
- `OfflineIndicator` - Banner když je app offline
- Auto-detection při network změně

**Retry Mechanism:**
```javascript
import { retry, retryWithCondition, withRetry } from '../utils/retry';

// Basic retry (3 attempts, exponential backoff)
const data = await retry(() => fetchData());

// Retry with custom condition
const data = await retryWithCondition(
  () => fetchData(),
  (error) => error.status >= 500,
  { maxAttempts: 5 }
);

// Wrap function with retry
const fetchWithRetry = withRetry(fetchData, { maxAttempts: 3 });
```

### Soubory

- `shared/src/components/common/ErrorBoundary.jsx`
- `shared/src/components/common/Skeleton.jsx`
- `src/components/common/OfflineIndicator.jsx`
- `src/hooks/useOffline.js`
- `src/utils/retry.js`

---

## ⏱️ Study Session Tracking

Timer pro sledování studijních sezení s Pomodoro technikou.

### Features

✅ **Study Timer** - Start/pause/stop tracking
✅ **Pomodoro Mode** - Konfigurovatelné work/break intervaly (default: 25/5 min)
✅ **Automatické body** - 1 bod za každých 5 minut studia
✅ **Course tracking** - Volitelné propojení s konkrétním kurzem
✅ **Session history** - Historie všech study sessions
✅ **Stats** - Dnes/týden/celkem čas strávený studiem
✅ **Sound notifications** - Zvuk při dokončení Pomodora

### StudySessionContext API

```javascript
import { useStudySession } from '../contexts/StudySessionContext';

const {
  // State
  activeSession,     // Current running session | null
  sessions,          // All sessions (last 50)
  timer,             // Current timer value (seconds)
  isRunning,         // Is timer running?
  isPaused,          // Is timer paused?

  // Pomodoro
  pomodoroMode,      // Is Pomodoro mode enabled?
  isBreak,           // Is current interval a break?
  completedPomodoros,// Count of completed Pomodoros
  workDuration,      // Work interval duration (seconds)
  breakDuration,     // Break interval duration (seconds)

  // Actions
  startSession,      // (courseId?, notes?) => Promise
  endSession,        // (notes?) => Promise
  pauseSession,      // () => void
  resumeSession,     // () => void
  togglePomodoroMode,// () => void
  skipBreak,         // () => void

  // Stats
  getTodayStudyTime, // () => number (minutes)
  getWeekStudyTime,  // () => number (minutes)

  // Utils
  formatTime,        // (seconds) => string ('HH:MM:SS')
} = useStudySession();
```

### Usage Example

```javascript
// Start new session
await startSession(courseId, 'React hooks');

// Toggle Pomodoro mode (before starting)
togglePomodoroMode();

// Pause/Resume
pauseSession();
resumeSession();

// End session
await endSession('Completed 3 chapters');
```

### Database

Sessions are stored in `study_sessions` table with:
- `user_id`, `course_id` (nullable)
- `start_time`, `end_time`
- `duration_minutes` (auto-calculated)
- `notes`

Points are automatically awarded via `addPoints()` from GamificationContext.

### Soubory

- `src/contexts/StudySessionContext.jsx`
- `src/components/study/StudyTimer.jsx`
- `src/pages/StudyPage.jsx`

---

## 📅 Kalendář s deadliny

Vizualizace deadlinů kurzů v kalendářním pohledu.

### Features

✅ **Měsíční pohled** - Grid layout s dny
✅ **Deadline indicators** - Tečky na dnech s deadliny
✅ **Urgency highlighting** - Červená pro deadliny do 3 dnů
✅ **Today highlighting** - Zvýrazněný dnešní den
✅ **Upcoming list** - Seznam nadcházejících deadlinů (7 dní)
✅ **Overdue list** - Seznam prošlých deadlinů
✅ **Date click** - Detail kurzů na vybraný den
✅ **Navigation** - Předchozí/následující měsíc, "Dnes" button

### CalendarView Component

```jsx
import { CalendarView } from '../components/calendar/CalendarView';

<CalendarView
  onDateClick={(date) => {
    console.log('Clicked:', date);
  }}
/>
```

**Props:**
- `onDateClick` - Callback when date is clicked

**Features:**
- Auto-loads courses with deadlines
- Color coding by urgency
- Responsive grid layout
- Czech day names

### CalendarPage

Fullpage view s kalendářem + stats:
- Nadcházející deadliny (7 dní)
- Prošlé deadliny
- Stats cards (celkem deadlinů, prošlé, nadcházející)
- Dialog s detailem dne

### Soubory

- `src/components/calendar/CalendarView.jsx`
- `src/pages/CalendarPage.jsx`

---

## 💾 Database Schema

StudyPro používá **Supabase PostgreSQL** se schématem `studypro`.

### Tabulky

#### 1. `profiles`
Uživatelské profily (rozšíření auth.users)

```sql
CREATE TABLE studypro.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `courses`
Kurzy uživatele

```sql
CREATE TABLE studypro.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES studypro.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  category TEXT,
  course_type TEXT CHECK (course_type IN ('paid', 'free', 'school', 'workshop', 'book', 'article', 'video', 'other')),
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')),
  priority INTEGER DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'CZK',
  platform TEXT,
  url TEXT,
  cover_image_url TEXT,
  start_date DATE,
  access_until DATE,
  total_lessons INTEGER DEFAULT 0,
  completed_lessons INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. `study_sessions`
Studijní sezení (gamifikace)

```sql
CREATE TABLE studypro.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES studypro.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES studypro.courses(id) ON DELETE SET NULL,
  session_date DATE NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4. `achievements`
Definice úspěchů (achievements)

```sql
CREATE TABLE studypro.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  points INTEGER DEFAULT 0,
  requirement_type TEXT,
  requirement_value INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5. `user_achievements`
Odemčené achievements uživatele

```sql
CREATE TABLE studypro.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES studypro.profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES studypro.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

#### 6. `goals`
Studijní cíle

```sql
CREATE TABLE studypro.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES studypro.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  goal_type TEXT,
  target_value INTEGER,
  current_value INTEGER DEFAULT 0,
  deadline DATE,
  status TEXT CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 7. `lessons`
Lekce v rámci kurzů

```sql
CREATE TABLE studypro.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES studypro.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_number INTEGER,
  duration_minutes INTEGER,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 8. `course_notes`
Poznámky ke kurzům

```sql
CREATE TABLE studypro.course_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES studypro.courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES studypro.profiles(id) ON DELETE CASCADE,
  content TEXT,
  note_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

Všechny tabulky mají zapnuté RLS politiky:

```sql
-- Příklad pro courses
CREATE POLICY "Users can view own courses"
  ON studypro.courses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own courses"
  ON studypro.courses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own courses"
  ON studypro.courses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own courses"
  ON studypro.courses FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 🧩 Komponenty

### Shared komponenty (`@proapp/shared`)

#### `StatsCard`
Karta se statistikou

```jsx
<StatsCard
  title="Celkem kurzů"
  value={totalCourses}
  icon={<CoursesTotalIcon />}
  color="primary"
  trend={5}  // volitelné
/>
```

**Props:**
- `title` (string) - Název statistiky
- `value` (string|number) - Hodnota
- `icon` (ReactNode) - Ikona
- `color` (string) - Barva pozadí ikony
- `trend` (number) - Změna v % (volitelné)

#### `EmptyState`
Prázdný stav

```jsx
<EmptyState
  icon={<EmptyCoursesIcon />}
  title="Zatím žádné kurzy"
  description="Přidej svůj první kurz a začni studovat!"
  actionLabel="Přidat kurz"
  onAction={() => navigate('/courses')}
/>
```

#### `LoadingSpinner`
Načítání

```jsx
<LoadingSpinner size={60} message="Načítám data..." />
```

#### `Icon` (univerzální)
Univerzální ikonová komponenta

```jsx
<Icon name="BookOpen" semantic="pageTitle" />
<Icon name="Flame" size={40} color="#f97316" />
```

### Aplikační komponenty

#### `CourseCard`
Karta kurzu

```jsx
<CourseCard
  course={course}
  onClick={() => navigate(`/courses/${course.id}`)}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

**Zobrazuje:**
- Cover image / gradient pozadí
- Status badge
- Kategorie a typ kurzu
- Progress bar
- Deadline warning
- Cena
- Akční tlačítka (edit, delete)

#### `StreakDisplay`
Display pro streak gamifikaci

```jsx
<StreakDisplay
  currentStreak={7}
  longestStreak={14}
  lastActivityDate="2025-11-18"
/>
```

**Features:**
- Aktuální streak
- Longest streak
- Progress bar
- Motivační zprávy
- Emoji podle délky streaku

#### `ProgressChart`
Graf pokroku (Recharts)

```jsx
<ProgressChart
  title="Studijní aktivita"
  data={last7Days}
  type="area"
  dataKey="value"
/>
```

#### `Layout`
Hlavní layout aplikace

```jsx
<Layout>
  <YourPageContent />
</Layout>
```

**Obsahuje:**
- AppBar s profilem
- Drawer s navigací
- User info (level, streak, body)
- Responsive mobile menu

---

## 📄 Stránky

### `LoginPage`
- Google OAuth přihlášení
- Feature list s modulárními ikonami
- Logo a branding

### `DashboardPage`
**Sekce:**
1. **Header** - Uvítání uživatele
2. **Stats Cards** - 4 statistiky (celkem kurzů, dokončeno, probíhá, průměrný pokrok)
3. **Streak & Chart** - StreakDisplay + ProgressChart (poslední týden)
4. **Aktivní kurzy** - Top 3 kurzy dle priority
5. **Quick Actions** - Rychlé navigační tlačítka

### `CoursesPage`
**Funkce:**
- Přidání nového kurzu (FAB + desktop tlačítko)
- Filtry (search, status, kategorie, typ, řazení)
- Grid kurzů s CourseCard
- Edit/Delete akce
- Empty states (žádné kurzy / nenalezeno)

### `GoalsPage`
**Sekce:**
1. **Level Card** - Aktuální level, body, streak
2. **Achievements** - Grid odemčených/zamčených odznaků
3. **Goals** - Seznam aktivních cílů s progress bary

### `StatsPage`
- Zatím základní implementace
- Připraveno pro rozšíření o grafy a statistiky

---

## 🔄 Kontexty a stavy

### `AuthContext`
Správa autentizace a profilu

```jsx
const { user, profile, signInWithGoogle, signOut, loading } = useAuth();
```

**State:**
- `user` - Supabase auth user
- `profile` - Profil z `profiles` tabulky
- `loading` - Stav načítání

**Metody:**
- `signInWithGoogle()` - Google OAuth login
- `signOut()` - Odhlášení

### `CourseContext`
Správa kurzů

```jsx
const { courses, loading, createCourse, updateCourse, deleteCourse } = useCourses();
```

**State:**
- `courses` - Pole všech kurzů
- `loading` - Načítání

**Metody:**
- `createCourse(data)` - Vytvoření kurzu
- `updateCourse(id, data)` - Update kurzu
- `deleteCourse(id)` - Smazání kurzu

### `GamificationContext`
Gamifikace (achievements, goals, sessions)

```jsx
const {
  achievements,
  userAchievements,
  goals,
  studySessions,
  loading
} = useGamification();
```

**State:**
- `achievements` - Všechny definované achievements
- `userAchievements` - Odemčené achievements uživatele
- `goals` - Cíle uživatele
- `studySessions` - Studijní sezení

---

## 🚀 Instalace a spuštění

### Prerequisites
- Node.js 18+
- npm nebo yarn
- Supabase projekt

### 1. Instalace

```bash
# Clone repository
git clone https://github.com/lennayia/studypro.git
cd studypro

# Install dependencies
npm install
```

### 2. Environment variables

Vytvoř `.env` soubor:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database setup

```bash
# Spusť SQL migrace v Supabase SQL editoru
# Soubory v supabase/migrations/
```

### 4. Development

```bash
npm run dev
```

Aplikace běží na `http://localhost:5173`

### 5. Build

```bash
npm run build
```

Build vytvoří optimalizovanou produkční verzi v `dist/`.

---

## 🌐 Deployment

### Vercel (doporučeno)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build
npm run build

# Deploy dist/ folder
netlify deploy --prod --dir=dist
```

### Environment variables
Nezapomeň nastavit v deployment platformě:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## ✨ Best Practices

### Ikony
✅ **Používej styled komponenty z `@shared/components/icons`**
```jsx
import { CoursesPageIcon } from '@shared/components/icons';
<CoursesPageIcon />
```

❌ **NE hardcodované hodnoty**
```jsx
<BookOpen size={28} color="#6366f1" />
```

### Komponenty
✅ **Používej sdílené komponenty**
```jsx
import { StatsCard, EmptyState } from '@shared/components/common';
```

✅ **Prop validation**
```jsx
CourseCard.propTypes = {
  course: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};
```

### State management
✅ **Používej Contexts pro globální state**
```jsx
const { courses } = useCourses();
```

❌ **NE prop drilling**
```jsx
<Parent courses={courses}>
  <Child courses={courses}>
    <GrandChild courses={courses} />
  </Child>
</Parent>
```

### Supabase
✅ **Používej RLS pro security**
```sql
CREATE POLICY "Users can view own data"
  ON table_name FOR SELECT
  USING (auth.uid() = user_id);
```

✅ **Error handling**
```javascript
const { data, error } = await supabase
  .from('courses')
  .select('*');

if (error) {
  console.error('Error:', error);
  return { success: false, error };
}
```

### Git
✅ **Descriptive commit messages**
```bash
git commit -m "Feat: Add course filtering by category"
git commit -m "Fix: Resolve deadline calculation bug"
git commit -m "Refactor: Implement modular icon system"
```

---

## 📞 Kontakt & Podpora

**Developer:** Claude (Anthropic AI)
**Project Owner:** Lenka
**Repository:** https://github.com/lennayia/studypro

---

**Poslední update:** 18.11.2025
**Verze dokumentace:** 1.0.0
