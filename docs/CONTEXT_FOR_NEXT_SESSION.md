# Context pro další Claude session

## 🎯 Rychlý přehled projektu

**Název:** StudyPro - Modul pro správu kurzů a workshopů
**Tech stack:** React 18 + Vite + MUI + Supabase + React Query
**Aktuální branch:** `claude/studypro-course-module-01SHTjbX99fEcTiZXJYcxkro`
**Pokrok:** 28/36 tasků (78%)

---

## 📚 Co už je hotovo

### Kompletně implementované features:

#### Session #5-6 (předchozí):
- ✅ Dark Mode s auto-detect a persistence
- ✅ Error handling, toast notifications
- ✅ Study Timer (Pomodoro)
- ✅ Kalendář s deadlines
- ✅ CRUD operace pro Goals
- ✅ PWA manifest + Service Worker
- ✅ Pokročilé filtrování kurzů
- ✅ Drag & Drop pro priority
- ✅ CSV Import kurzů
- ✅ Pokročilé statistiky (8+ metrik)
- ✅ Notifikace (browser)
- ✅ Profil settings s avatar uploadem
- ✅ Data management (export/import/delete)
- ✅ Achievement system (20 achievementů)
- ✅ Rich Text Notes (Markdown editor)
- ✅ Code splitting & Bundle optimization
- ✅ Image optimization utils

#### Session #7 (právě dokončeno):
- ✅ **Leaderboard** - žebříček uživatelů (body, streak, kurzy)
- ✅ **Rewards Shop** - 10 odměn ve 5 kategoriích
- ✅ **React Query integrace** - QueryClient + custom hooks
- ✅ **Virtual Scrolling** - optimalizace long lists
- ✅ **Testing setup** - Vitest + 18 passing testů
- ✅ **Help & Tutorial** - floating button + 6-step průvodce + FAQ

---

## 🗂️ Struktura projektu

### Klíčové složky:
```
src/
├── components/
│   ├── common/           # Layout, LoadingSpinner, HelpButton
│   ├── courses/          # CourseCard, CourseFilters, DraggableCourseList, VirtualCourseList, CSVImport
│   ├── gamification/     # AchievementsList, Leaderboard, RewardsShop, AchievementUnlock
│   ├── goals/            # GoalsList, GoalForm
│   ├── notes/            # RichTextEditor
│   └── settings/         # ProfileSettings, NotificationSettings, DataManagement
├── contexts/             # AuthContext, CourseContext, GamificationContext, ThemeContext
├── hooks/                # useCourses (React Query hooks)
├── lib/                  # queryClient
├── pages/                # Dashboard, Courses, Goals, Stats, Study, Calendar, Gamification, Settings
├── test/                 # setup.js, test-utils.jsx
├── utils/                # supabase, courseUtils, achievementTriggers, imageOptimization, notifications, pwa
└── App.jsx
```

### Databázové tabulky (Supabase):
- `studypro_profiles` - uživatelské profily
- `studypro_courses` - kurzy
- `studypro_course_lessons` - lekce kurzů
- `studypro_course_notes` - poznámky
- `studypro_goals` - studijní cíle
- `studypro_study_sessions` - studijní sezení
- `studypro_achievements` - definice achievementů
- `studypro_user_achievements` - odemčené achievementy uživatelů
- `studypro_user_rewards` - zakoupené odměny ⚠️ POTŘEBUJE VYTVOŘIT

---

## ⚙️ Tech Stack & Knihovny

### Core:
- React 18.2 + React DOM
- Vite 5.0 (build tool)
- React Router 6.20

### UI:
- Material-UI 5.15
- Emotion (styled components)
- Framer Motion 10.16 (animace)
- Lucide React 0.263 (ikony)

### Data & State:
- Supabase 2.39 (backend, auth, storage)
- TanStack React Query 5.90 (server state) ⭐ NOVÉ
- Context API (client state)

### Gamifikace & Charts:
- Recharts 2.10 (grafy)
- date-fns 2.30 (datum handling)

### Features:
- @dnd-kit (drag & drop)
- PapaParse 5.5 (CSV parsing)
- react-markdown 10.1 (Markdown)
- react-syntax-highlighter 16.1 (code highlighting)
- react-window 2.2 (virtual scrolling) ⭐ NOVÉ

### Testing:
- Vitest 4.0 ⭐ NOVÉ
- Testing Library (React, Jest-DOM, User-Event) ⭐ NOVÉ
- jsdom 27.2

### Build:
- terser 5.44 (minifikace)
- rollup-plugin-visualizer 6.0 (bundle analyzer)

---

## 🚀 Jak začít

### 1. Instalace a spuštění:
```bash
cd /home/user/studypro
npm install
npm run dev
```

### 2. Testování:
```bash
npm test                  # Spustit testy
npm run test:ui           # UI mode
npm run test:coverage     # Coverage report
```

### 3. Build:
```bash
npm run build             # Production build
npm run build:analyze     # Build + analyzer
```

---

## 🎯 Co dělat dál - Priority

### HIGH Priority (důležité):

#### 1. Database Setup pro Rewards
Vytvořit tabulku `studypro_user_rewards`:
```sql
CREATE TABLE studypro_user_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES studypro_profiles(id) ON DELETE CASCADE,
  reward_id TEXT NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, reward_id)
);
```

#### 2. Integrace React Query do Contexts
- CourseContext stále používá direct Supabase fetch
- Mělo by migrovat na `useCourses()` hooks z `src/hooks/useCourses.js`
- Benefit: Automatický caching, optimistic updates, better UX

#### 3. Achievement Auto-unlock Integration
- `achievementTriggers.js` existuje, ale není propojený
- Přidat triggers do CourseContext při:
  - Vytvoření kurzu
  - Dokončení kurzu
  - Update pokroku
- Přidat triggers do GamificationContext při:
  - Dokončení study session
  - Update streaku

#### 4. Component Testing
- Přidat testy pro hlavní komponenty:
  - Leaderboard
  - RewardsShop
  - CourseFilters
  - DraggableCourseList
- Aktuálně jen 18 unit testů, žádné component testy

---

### MEDIUM Priority:

#### 5. Image Optimization Integration
- `imageOptimization.js` utils existují, ale nejsou používané
- Integrovat do ProfileSettings pro avatar upload
- Resize obrázky před uploadem (save storage & bandwidth)

#### 6. AI Doporučení (Priority 4.2)
- Integrace OpenAI API
- Doporučení kurzů based on user's progress
- Smart study planner
- Potřebuje: API key, backend endpoint

#### 7. Virtual Scrolling Integration
- `VirtualCourseList.jsx` je hotový, ale není použit
- Nahradit běžný seznam v CoursesPage při 50+ kurzech
- Performance benefit pro uživatele s mnoha kurzy

---

### LOW Priority:

#### 8. Real-time Collaboration (Priority 3.6)
- Supabase Realtime channels
- Sdílené studijní skupiny
- Live cursor positions
- Collaborative notes

#### 9. E2E Testing
- Playwright setup
- User flows (login, create course, study session)
- CI/CD integration

#### 10. Advanced Performance
- React Query migration (všechny contexts)
- Bundle splitting per route
- Service Worker optimization
- Lazy load heavy deps (syntax-highlighter)

---

## ⚠️ Známé problémy

### Databáze:
1. **Missing table:** `studypro_user_rewards` - potřebná pro RewardsShop
2. **Missing column?** `studypro_profiles.avatar_url` - ověřit existenci

### Code:
1. **CourseContext** - Nepřešel na React Query (stále direct fetch)
2. **Achievement triggers** - Nejsou propojené s akcemi
3. **VirtualCourseList** - Vytvořen, ale nepoužíván

### Testing:
1. **Low coverage** - Jen 18 unit testů, žádné component/E2E
2. **No integration tests** - Contexts, hooks

---

## 📁 Důležité soubory pro pochopení

### Pro pochopení architektury:
1. `src/App.jsx` - Routes, providers, lazy loading
2. `src/contexts/CourseContext.jsx` - State management kurzů
3. `src/contexts/GamificationContext.jsx` - Gamifikace state
4. `src/lib/queryClient.js` - React Query config

### Pro data fetching:
1. `src/hooks/useCourses.js` - React Query hooks (vzor)
2. `src/utils/supabase.js` - Supabase client

### Pro gamifikaci:
1. `src/utils/achievementTriggers.js` - Achievement system
2. `src/components/gamification/Leaderboard.jsx` - Žebříček
3. `src/components/gamification/RewardsShop.jsx` - Obchod

### Pro testing:
1. `vitest.config.js` - Test config
2. `src/test/setup.js` - Test setup
3. `src/test/test-utils.jsx` - Custom render

---

## 💡 Quick Wins (rychlé úspěchy)

Pokud chceš rychle přidat value:

1. **Integruj VirtualCourseList** do CoursesPage (15 min)
2. **Přidej achievement trigger** při vytvoření kurzu (30 min)
3. **Napiš 5 component testů** pro CourseCard (1 hodina)
4. **Vytvoř DB tabulku** `studypro_user_rewards` (5 min)
5. **Přidej loading states** s React Query (30 min)

---

## 🔍 Debugging Tips

### React Query Devtools:
- Otevřou se automaticky v dev módu (pravý dolní roh)
- Viditelné: queries, mutations, cache
- Lze invalidovat cache manuálně

### Vitest UI:
```bash
npm run test:ui
```
- Interaktivní test runner
- Watch mode
- Coverage vizualizace

### Bundle Analyzer:
```bash
npm run build:analyze
```
- Otevře HTML s treemap bundlu
- Identifikuj velké dependencies

---

## 📋 Checklist před commitem

- [ ] `npm run build` bez errors
- [ ] `npm test` všechny testy passing
- [ ] `npm run lint` bez errors
- [ ] Žádné console.log v production kódu
- [ ] Žádné TODO komentáře (nebo tracked)
- [ ] README aktuální
- [ ] CONTEXT_FOR_NEXT_SESSION.md aktuální

---

## 🎓 Learning Resources

Pokud potřebuješ pomoc s koncepty:

- **React Query:** https://tanstack.com/query/latest/docs/react/overview
- **Vitest:** https://vitest.dev/guide/
- **Testing Library:** https://testing-library.com/docs/react-testing-library/intro/
- **react-window:** https://github.com/bvaughn/react-window
- **Supabase Realtime:** https://supabase.com/docs/guides/realtime

---

## 🚀 Git Workflow

### Current branch:
```bash
git status
# On branch claude/studypro-course-module-01SHTjbX99fEcTiZXJYcxkro
```

### Push changes:
```bash
git add .
git commit -m "Message"
git push -u origin claude/studypro-course-module-01SHTjbX99fEcTiZXJYcxkro
```

### Create PR:
```bash
gh pr create --title "Title" --body "Description"
```

---

Hodně štěstí! 🍀 Projekt je ve skvělém stavu a blíží se k dokončení!
