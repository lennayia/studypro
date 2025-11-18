# 🎓 StudyPro

**Modul pro správu online kurzů a workshopů v ProApp ekosystému**

## 📚 Co je StudyPro?

StudyPro je CRM pro správu vašich online kurzů:
- 📚 Evidence zakoupených kurzů a workshopů
- 📊 Sledování pokroku ve studiu
- ⏰ Přehled deadlinů přístupu ke kurzům
- 📝 Správa studijních materiálů
- 🎯 Osobní studijní cíle
- 📈 Statistiky a analytika

## 🚀 Quick Start

### Instalace

```bash
npm install
```

### Development

```bash
npm run dev
```

Aplikace běží na `http://localhost:3004`

### Build

```bash
npm run build
```

## 🏗️ Struktura Projektu

```
studypro/
├── src/
│   ├── client/              # Klientská sekce (studenti)
│   │   ├── ClientView.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CoursesPage.jsx
│   │   └── CourseViewer.jsx
│   ├── provider/            # Provider sekce (lektoři)
│   │   ├── ProviderView.jsx
│   │   ├── Dashboard.jsx
│   │   └── CoursesManagement.jsx
│   ├── contexts/            # React Contexts
│   │   ├── ClientAuthContext.jsx
│   │   ├── ProviderAuthContext.jsx
│   │   └── CourseContext.jsx
│   ├── components/          # Sdílené komponenty
│   ├── pages/               # Statické stránky
│   └── utils/               # Utility funkce
├── package.json
├── vite.config.js
└── index.html
```

## 🔑 Konfigurace

### Supabase

1. Vytvořte `.env` soubor:
```bash
cp .env.example .env
```

2. Vyplňte Supabase credentials do `.env`

3. Vytvořte tabulky v Supabase (viz SQL migrace v `/docs/migrations.sql`)

## 🎯 Technologie

- **Frontend:** React 18 + Vite
- **UI:** Material-UI (MUI)
- **Backend:** Supabase
- **Auth:** Supabase Auth (Google OAuth)
- **Routing:** React Router v6
- **Charts:** Recharts

## 📖 Dokumentace

Více informací o ProApp ekosystému:
- [PROAPP_COMPLETE_STRUCTURE.md](../docs/PROAPP_COMPLETE_STRUCTURE.md)
- [PROAPP_MONOREPO_MIGRATION.md](../docs/PROAPP_MONOREPO_MIGRATION.md)

## 📝 License

© 2025 Lenka Roubalová
