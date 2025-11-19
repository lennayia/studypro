# 📋 StudyPro - Master TODO List

**Verze:** 1.0.0
**Datum:** 18.11.2025
**Poslední update:** 19.11.2025

---

## 📊 Přehled stavu

| Kategorie | Dokončeno | Probíhá | Plánováno | Celkem |
|-----------|-----------|---------|-----------|--------|
| **Základní funkce** | 10 | 0 | 0 | 10 |
| **Rozšířené funkce** | 0 | 0 | 7 | 7 |
| **UI/UX vylepšení** | 2 | 0 | 5 | 7 |
| **Performance** | 0 | 0 | 5 | 5 |
| **Testing** | 0 | 0 | 4 | 4 |
| **Dokumentace** | 3 | 0 | 0 | 3 |
| **CELKEM** | **15** | **0** | **21** | **36** |

**Progress:** █████░░░░░ 41.7%

---

## ✅ Dokončeno (15)

### Základní funkce (10/10 = 100%)
- ✅ **Autentizace** - Google OAuth přes Supabase
- ✅ **Správa kurzů** - CRUD operace (Create, Read, Update, Delete)
- ✅ **Dashboard** - Přehled pokroku, aktivní kurzy, statistiky
- ✅ **Goals page** - Zobrazení achievements a cílů
- ✅ **Database schema** - 8 tabulek s RLS
- ✅ **Kontexty** - AuthContext, CourseContext, GamificationContext
- ✅ **Responsive layout** - Desktop + mobile navigace
- ✅ **Gamifikace (read-only)** - Zobrazení achievements, streaks, bodů
- ✅ **Detail kurzu** - CourseDetailPage s lekcemi a poznámkami (1.1)
- ✅ **CRUD pro Goals** - GoalForm a plná správa cílů (1.2)

### UI/UX (2/7 = 28.6%)
- ✅ **Modulární systém ikon** - Centralizované barvy a velikosti
- ✅ **Dark mode** - ThemeContext, light/dark themes, toggle v Settings (2.5)

### Dokumentace (3/3 = 100%)
- ✅ **DOCUMENTATION.md** - Kompletní dokumentace projektu
- ✅ **MASTER_TODO.md** - Master TODO list
- ✅ **CONTEXT_FOR_NEXT_SESSION.md** - Kontext pro další session

---

## 🚧 V práci (0)

_Momentálně nejsou žádné rozpracované úkoly._

---

## 📝 Plánováno (21)

### 🎯 Priorita 1 - CRITICAL (nutné pro produkci)

#### 1.3 Error handling & loading states
**Popis:** Jednotné zpracování chyb a loading stavů

**Features:**
- Error boundaries
- Toast notifications pro úspěch/chybu
- Loading skeletony místo spinnerů
- Retry mechanismus pro failed requests
- Offline detection

**Soubory:**
- `src/components/common/ErrorBoundary.jsx` (nový)
- `src/components/common/Toast.jsx` (nový)
- `src/components/common/Skeleton.jsx` (nový)

**Odhadovaná práce:** 3-4 hodiny

---

### 🎨 Priorita 2 - HIGH (důležité pro UX)

#### 2.1 Kalendář s deadliny
**Popis:** Kalendářové zobrazení kurzů a deadlinů

**Features:**
- Měsíční/týdenní pohled
- Zvýraznění deadlinů
- Click na den → detail událostí
- Export do Google Calendar
- Notifikace před deadlinem

**Soubory:**
- `src/pages/CalendarPage.jsx` (nový)
- `src/components/calendar/CalendarView.jsx` (nový)

**Knihovny:** react-big-calendar nebo date-fns + custom UI

**Odhadovaná práce:** 5-7 hodin

---

#### 2.2 Pokročilé statistiky
**Popis:** Detailní statistiky a grafy pokroku

**Features:**
- Celkový čas strávený studiem
- Pokrok za týden/měsíc/rok
- Produktivita (nejlepší dny, hodiny)
- Kategorie kurzů (pie chart)
- Streak history (line chart)
- Export statistik (CSV, PDF)

**Soubory:**
- `src/pages/StatsPage.jsx` (upgrade stávající)
- `src/components/stats/TimeStats.jsx` (nový)
- `src/components/stats/ProductivityChart.jsx` (nový)
- `src/components/stats/CategoryBreakdown.jsx` (nový)

**Odhadovaná práce:** 6-8 hodin

---

#### 2.3 Study session tracking
**Popis:** Ruční/automatické logování studijních sezení

**Features:**
- Timer pro studijní sezení
- Pomodoro technika (25/5 min)
- Manuální přidání sezení
- Přiřazení k kurzu
- Poznámky k sezení
- Automatické body za sezení

**Soubory:**
- `src/components/dashboard/StudyTimer.jsx` (nový)
- `src/components/dashboard/SessionForm.jsx` (nový)
- `src/contexts/GamificationContext.jsx` (update)

**Odhadovaná práce:** 4-5 hodin

---

#### 2.4 Notifikace
**Popis:** Push notifikace pro deadliny a cíle

**Features:**
- Browser push notifications
- Notifikace před deadlinem (1 den, 1 týden)
- Denní reminder pro streak
- Custom reminder pro cíle
- Nastavení frekvence v Settings

**Soubory:**
- `src/utils/notifications.js` (nový)
- `src/pages/SettingsPage.jsx` (update)

**Knihovny:** Web Push API nebo firebase-messaging

**Odhadovaná práce:** 3-4 hodiny

---

#### 2.5 Profil a nastavení
**Popis:** Kompletní stránka nastavení uživatele

**Features:**
- Edit profilu (jméno, avatar)
- Upload avatara (Supabase Storage)
- Nastavení notifikací
- Jazykové preference
- Export/import dat
- Smazání účtu

**Soubory:**
- `src/pages/SettingsPage.jsx` (upgrade)
- `src/components/settings/ProfileSettings.jsx` (nový)
- `src/components/settings/NotificationSettings.jsx` (nový)
- `src/components/settings/DataManagement.jsx` (nový)

**Odhadovaná práce:** 4-6 hodin

---

### 🚀 Priorita 3 - MEDIUM (vylepšení funkcionality)

#### 3.1 Pokročilé filtrování kurzů
**Popis:** Další filtry a možnosti řazení

**Features:**
- Multi-select filtry
- Date range picker pro deadliny
- Hledání v poznámkách
- Custom tagy
- Uložené filtry (presets)
- URL query params pro sdílení filtrů

**Soubory:**
- `src/pages/CoursesPage.jsx` (update)
- `src/components/courses/AdvancedFilters.jsx` (nový)

**Odhadovaná práce:** 3-4 hodiny

---

#### 3.2 Drag & drop pro priority
**Popis:** Přetahování kurzů pro změnu priority

**Features:**
- Drag & drop v Dashboard (aktivní kurzy)
- Drag & drop v CoursesPage
- Visual feedback při tažení
- Auto-save při drop

**Knihovny:** @dnd-kit/core nebo react-beautiful-dnd

**Odhadovaná práce:** 2-3 hodiny

---

#### 3.3 Gamifikace - odměny
**Popis:** Systém pro odemykání achievements

**Features:**
- Auto-unlock achievements při splnění podmínek
- Animace při odemčení
- Badge notifications
- Leaderboard (pokud multi-user)
- Custom achievements

**Soubory:**
- `src/utils/achievementTriggers.js` (nový)
- `src/components/gamification/AchievementUnlock.jsx` (nový)

**Odhadovaná práce:** 5-6 hodin

---

#### 3.4 Import kurzů
**Popis:** Hromadný import kurzů z různých zdrojů

**Features:**
- CSV import
- Udemy/Coursera link parser
- Bulk add formulář
- Preview před importem
- Duplicate detection

**Soubory:**
- `src/components/courses/ImportDialog.jsx` (nový)
- `src/utils/courseImport.js` (nový)

**Odhadovaná práce:** 4-5 hodin

---

#### 3.5 Pokročilé poznámky
**Popis:** Rich text editor pro poznámky

**Features:**
- Markdown support
- Code highlighting
- Inline images
- Links
- Tags/categories pro poznámky
- Search v poznámkách

**Knihovny:** TipTap, Slate, nebo Quill

**Odhadovaná práce:** 3-4 hodiny

---

#### 3.6 Real-time collaboration
**Popis:** Sdílení kurzů s ostatními (pokud multi-user)

**Features:**
- Share kurz s read-only
- Share kurz s edit permissions
- Real-time updates
- Comments
- Activity log

**Supabase:** Realtime subscriptions

**Odhadovaná práce:** 6-8 hodin

---

### ⚡ Priorita 4 - LOW (nice to have)

#### 4.1 Mobile app (PWA)
**Popis:** Progressive Web App pro mobile

**Features:**
- Service worker pro offline
- App manifest
- Install prompt
- Push notifications
- Camera pro upload
- Share API

**Odhadovaná práce:** 3-5 hodin

---

#### 4.2 AI doporučení
**Popis:** AI-powered doporučení kurzů a studijního plánu

**Features:**
- Doporučení podobných kurzů
- Optimální studijní plán
- Predikce dokončení
- Smart reminders

**API:** OpenAI GPT-4, Anthropic Claude

**Odhadovaná práce:** 8-10 hodin

---

## 🧪 Testing (plánováno)

### T.1 Unit testy
**Framework:** Vitest
**Coverage cíl:** 80%

**Priority testy:**
- ✅ `helpers.js` utility funkce
- ⬜ Context providers
- ⬜ Custom hooks
- ⬜ Form validations

**Odhadovaná práce:** 6-8 hodin

---

### T.2 Integration testy
**Framework:** Vitest + React Testing Library

**Priority testy:**
- ⬜ Course CRUD flow
- ⬜ Authentication flow
- ⬜ Gamification triggers

**Odhadovaná práce:** 4-6 hodin

---

### T.3 E2E testy
**Framework:** Playwright nebo Cypress

**Priority scenarios:**
- ⬜ User login → create course → mark lesson complete
- ⬜ Filter courses → edit course → delete course
- ⬜ View goals → create goal → complete goal

**Odhadovaná práce:** 5-7 hodin

---

### T.4 Performance testy
**Tools:** Lighthouse, Web Vitals

**Metriky:**
- ⬜ LCP < 2.5s
- ⬜ FID < 100ms
- ⬜ CLS < 0.1
- ⬜ Bundle size < 500KB

**Odhadovaná práce:** 2-3 hodiny

---

## ⚙️ Performance optimalizace (plánováno)

### P.1 Code splitting
**Popis:** Lazy loading stránek a komponent

```javascript
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const GoalsPage = lazy(() => import('./pages/GoalsPage'));
```

**Odhadovaná práce:** 2-3 hodiny

---

### P.2 Image optimization
**Popis:** Optimalizace cover images

**Features:**
- Resize na upload
- WebP format
- Lazy loading images
- Placeholder blur
- CDN caching

**Odhadovaná práce:** 2-3 hodiny

---

### P.3 React Query
**Popis:** Migrace na React Query pro data fetching

**Výhody:**
- Automatic caching
- Background refetching
- Optimistic updates
- Devtools

**Knihovna:** @tanstack/react-query

**Odhadovaná práce:** 4-5 hodin

---

### P.4 Virtualizace
**Popis:** Virtualized lists pro velké datasety

**Use cases:**
- CoursesList (100+ kurzů)
- AchievementsList
- LessonsList

**Knihovna:** react-window nebo @tanstack/react-virtual

**Odhadovaná práce:** 2-3 hodiny

---

### P.5 Bundle optimization
**Popis:** Redukce bundle size

**Akce:**
- Tree-shaking
- Remove unused dependencies
- Dynamic imports
- Analyze bundle (rollup-plugin-visualizer)

**Odhadovaná práce:** 2-3 hodiny

---

## 🐛 Známé bugy

_Momentálně nejsou známy žádné kritické bugy._

### Malé problémy (nice to fix)
- ⬜ Mobile menu nezavírá při navigate (někdy)
- ⬜ Empty state ikony nemají consistent sizing
- ⬜ Favicon chybí

---

## 📅 Roadmap

### Q4 2025 (Prosinec)
- ✅ Modulární systém ikon
- 🎯 Detail kurzu (1.1)
- 🎯 CRUD pro Goals (1.2)
- 🎯 Error handling (1.3)
- 🎯 Dark mode (2.5)

### Q1 2026 (Leden - Březen)
- 📆 Kalendář s deadliny (2.1)
- 📊 Pokročilé statistiky (2.2)
- ⏱️ Study session tracking (2.3)
- 🔔 Notifikace (2.4)
- ⚙️ Profil a nastavení (2.6)

### Q2 2026 (Duben - Červen)
- 🏆 Gamifikace - odměny (3.3)
- 📥 Import kurzů (3.4)
- 🧪 Testing (T.1, T.2, T.3)
- ⚡ Performance optimalizace (P.1-P.5)

### Q3 2026 (Červenec - Září)
- 📱 Mobile app PWA (4.1)
- 🤖 AI doporučení (4.2)
- 👥 Real-time collaboration (3.6)
- 📝 Pokročilé poznámky (3.5)

---

## 🎯 Sprint plán (aktuální)

### Sprint #4 (18.11 - 24.11.2025)

**Cíl:** Detail kurzu + CRUD pro Goals

**Tasks:**
1. ⬜ Vytvořit CourseDetailPage layout
2. ⬜ Implementovat LessonList komponentu
3. ⬜ Přidat CourseNotes komponentu
4. ⬜ Vytvořit GoalForm dialog
5. ⬜ Implementovat create/update/delete goals
6. ⬜ Přidat validace pro goals

**Story points:** 13
**Kapacita:** 15 hodin

---

## 📊 Metriky pokroku

### Code metrics (aktuální)
- **LOC:** ~8,500 řádků
- **Komponenty:** 25
- **Stránky:** 5
- **Kontexty:** 3
- **Utils:** 2

### Database metrics
- **Tabulky:** 8
- **RLS policies:** 32 (4 na tabulku)
- **Functions:** 0 (plánováno)
- **Triggers:** 0 (plánováno)

---

## 💡 Náměty na features (backlog)

_Features které přišly během vývoje, ale nejsou ještě prioritizované_

- 📧 Email digest (týdenní/měsíční report)
- 🎨 Custom themes (nejen dark/light)
- 🔗 Integrace s Notion/Obsidian
- 📱 Native mobile app (React Native)
- 🎙️ Voice notes
- 📷 Screenshot notes
- 🔄 Sync across devices
- 🌍 i18n (internationalization)
- ♿ Accessibility audit (WCAG 2.1)
- 🔐 2FA authentication
- 💾 Automatic backups
- 🗂️ Archive completed courses
- 🎯 Smart goals (SMART criteria validation)
- 📈 Habit tracking
- 🧠 Spaced repetition flashcards

---

## 🤝 Contributing guidelines

### Jak přidat nový task do TODO

1. Přidej do příslušné priority sekce
2. Uveď jasný popis a features
3. Odhadni pracnost (hodiny)
4. Označ soubory které se změní
5. Update progress table nahoře

### Task states
- ⬜ Naplánováno
- 🚧 V práci
- ✅ Dokončeno
- ❌ Zrušeno
- 🔄 Blokováno

### Jak označit dokončený task
1. Změň ⬜ → ✅
2. Přesuň do sekce "Dokončeno"
3. Update progress table
4. Commit s popisem

---

## 📞 Kontakt

**Questions?** Kontaktuj project ownera nebo přidej issue do GitHub repository.

**Repository:** https://github.com/lennayia/studypro

---

**Poslední update:** 19.11.2025
**Next review:** 25.11.2025
**Version:** 1.0.0
