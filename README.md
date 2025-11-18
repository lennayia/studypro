# 🎓 StudyPro

**Nejlepší studijní CRM na světě - Interaktivní, motivující a zábavná aplikace pro správu všech tvých studijních materiálů!**

## 📚 Co je StudyPro?

StudyPro je komplexní CRM pro správu tvého studia:

### ✨ Hlavní funkce
- 📚 **Evidence všech kurzů** - Placené, zdarma, škola, workshopy, knihy, atd.
- 📊 **Real-time progress tracking** - Sleduj pokrok v jednotlivých lekcích
- 🎮 **Gamifikace** - Body, levely, odznaky, streaky - uděláme ze studia hru!
- 🔥 **Streak system** - Studuj každý den a buduj šňůru
- 🏆 **Achievements** - Odemkni odznaky za dosažení milníků
- 🎯 **Studijní cíle** - Nastav si cíle a dosahuj jich
- ⏰ **Smart deadlines** - Nezmeškej žádný přístup ke kurzu
- 📈 **Statistiky & grafy** - Vizualizuj svůj studijní pokrok
- 📱 **Responzivní design** - Funguje na mobilu i počítači
- 🎨 **Moderní UI** - Krásné, barevné a motivující rozhraní

## 🚀 Quick Start

### 1. Instalace

```bash
npm install
```

### 2. Nastavení Supabase

#### A) Vytvoř `.env` soubor:
```bash
cp .env.example .env
```

#### B) Vyplň Supabase credentials do `.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### C) Spusť SQL migrace:
1. Otevři Supabase Dashboard (https://app.supabase.com)
2. Jdi do SQL Editor
3. Zkopíruj obsah souboru `docs/migrations/001_initial_schema.sql`
4. Spusť SQL (Run)
5. Hotovo! 🎉

#### D) Nastav Google OAuth:
1. V Supabase Dashboard jdi do **Authentication** → **Providers**
2. Zapni **Google**
3. Přidej své Google OAuth credentials
4. Hotovo!

### 3. Spuštění

```bash
npm run dev
```

Aplikace běží na `http://localhost:3004` 🚀

### 4. Build (Production)

```bash
npm run build
```

## 🏗️ Struktura Projektu

```
studypro/
├── src/
│   ├── contexts/               # React Contexts (State Management)
│   │   ├── AuthContext.jsx     # Autentizace + profil uživatele
│   │   ├── CourseContext.jsx   # Správa kurzů a lekcí
│   │   └── GamificationContext.jsx  # Gamifikace, body, achievements
│   ├── components/
│   │   ├── common/             # Sdílené komponenty
│   │   │   ├── Layout.jsx      # Hlavní layout s menu
│   │   │   ├── Loading.jsx     # Loading spinner
│   │   │   └── EmptyState.jsx  # Prázdný stav
│   │   ├── dashboard/          # Dashboard komponenty
│   │   │   ├── StatsCard.jsx   # Statistické karty
│   │   │   ├── ProgressChart.jsx  # Grafy
│   │   │   └── StreakDisplay.jsx  # Zobrazení streak
│   │   └── courses/            # Komponenty pro kurzy
│   │       ├── CourseCard.jsx  # Karta kurzu
│   │       └── CourseForm.jsx  # Formulář pro kurz
│   ├── pages/                  # Stránky aplikace
│   │   ├── LoginPage.jsx       # Přihlášení
│   │   ├── DashboardPage.jsx   # Dashboard
│   │   ├── CoursesPage.jsx     # Seznam kurzů
│   │   ├── GoalsPage.jsx       # Cíle a achievements
│   │   ├── StatsPage.jsx       # Statistiky
│   │   └── SettingsPage.jsx    # Nastavení
│   ├── utils/
│   │   ├── supabase.js         # Supabase client
│   │   └── helpers.js          # Helper funkce
│   ├── theme/
│   │   └── theme.js            # MUI custom theme
│   ├── App.jsx                 # Hlavní App s routingem
│   └── main.jsx                # Entry point
├── docs/
│   └── migrations/
│       └── 001_initial_schema.sql  # SQL migrace
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

## 🎯 Technologie

- **Frontend:** React 18 + Vite
- **UI Framework:** Material-UI (MUI) v5
- **Backend:** Supabase
- **Auth:** Supabase Auth (Google OAuth)
- **Database:** PostgreSQL (Supabase)
- **Routing:** React Router v6
- **Charts:** Recharts
- **Date handling:** date-fns
- **Styling:** Emotion (CSS-in-JS)

## 📊 Databázové tabulky

- `studypro_users` - Uživatelé (profil, body, streak)
- `studypro_courses` - Kurzy a workshopy
- `studypro_lessons` - Lekce v kurzech
- `studypro_study_sessions` - Studijní sezení
- `studypro_achievements` - Definice odznaků
- `studypro_user_achievements` - Odemčené odznaky
- `studypro_goals` - Studijní cíle
- `studypro_materials` - Studijní materiály

## 🎮 Gamifikační systém

### 🔥 Streaky
- Studuj každý den a buduj svou šňůru
- Automatické sledování aktivity
- Motivační emoji podle délky streak

### ⭐ Bodování
- +10 bodů za dokončenou lekci
- +100 bodů za dokončený kurz
- +5 bodů za studijní sezení (+ bonus za minuty)
- +20 bodů za daily streak
- +50 bodů za weekly streak

### 🏆 Odznaky (Achievements)
- 🎓 První kurz
- 🔥 Týdenní šňůra (7 dní)
- 💪 Měsíční šňůra (30 dní)
- 🏆 První dokončení
- 🌅 Ranní ptáče (studuješ před 8:00)
- 🦉 Noční sova (studuješ po 22:00)
- ⚡ Rychlík (dokončíš kurz za <7 dní)
- 📚 Hledač poznání (10 dokončených kurzů)

### 📈 Levely
- Každých 1000 bodů = +1 level
- Zobrazení aktuálního levelu v profilu
- Progress bar k dalšímu levelu

## 🚀 Features

### ✨ Správa kurzů
- Přidávání kurzů všech typů (placené, zdarma, škola, workshop, kniha, atd.)
- Kategorizace (programování, design, business, jazyk, věda, atd.)
- Prioritizace (nízká, střední, vysoká)
- Tracking pokroku v %
- Deadline management
- Cover obrázky
- Poznámky

### 📊 Dashboard
- Přehled všech kurzů
- Statistiky (celkem, dokončeno, probíhá, průměrný pokrok)
- Streak display
- Graf studijní aktivity
- Rychlé akce

### 🔍 Filtrování & Řazení
- Hledání podle názvu
- Filtr podle statusu (nezačato, probíhá, dokončeno, pozastaveno)
- Filtr podle kategorie
- Filtr podle typu
- Řazení (priorita, pokrok, deadline, nejnovější, A-Z)

### 📱 Responzivní design
- Mobile-first přístup
- Drawer menu na mobilu
- Optimalizace pro všechny obrazovky
- Touch-friendly UI

## 🎨 Design

- **Moderní** - Material Design 3 inspirované rozhraní
- **Barevné** - Gradientní barvy, živé akcenty
- **Motivující** - Emoji, gamifikace, pozitivní zpětná vazba
- **Přehledné** - Čisté layout, dobré kontrasty
- **Animace** - Smooth transitions, hover efekty

## 📝 Další vývoj

Plánované funkce:
- [ ] Course viewer s detailem kurzu
- [ ] Studijní plánovač (kalendář)
- [ ] Notifikace a připomínky
- [ ] Export dat (CSV, PDF)
- [ ] Dark mode
- [ ] Pomodoro timer
- [ ] Poznámkový blok
- [ ] Flashcards
- [ ] Sdílení progress na sociálních sítích

## 🤝 Contributing

Pull requesty vítány! Pro větší změny prosím nejdřív otevři issue.

## 📝 License

© 2025 Lenka Roubalová • Made with ❤️ for learners everywhere
