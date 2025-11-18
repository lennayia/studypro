# 🚀 StudyPro - Setup Guide

Kompletní návod na nastavení a spuštění StudyPro aplikace.

## 📋 Prerekvizity

Ujisti se, že máš nainstalované:
- **Node.js** (v18 nebo vyšší) - [Download](https://nodejs.org/)
- **npm** nebo **yarn**
- **Supabase účet** (zdarma) - [Registrace](https://app.supabase.com)
- **Google OAuth credentials** (pro přihlášení)

## 🎯 Krok za krokem

### 1️⃣ Klonování repozitáře

```bash
git clone <repository-url>
cd studypro
```

### 2️⃣ Instalace závislostí

```bash
npm install
```

### 3️⃣ Vytvoření Supabase projektu

1. Jdi na https://app.supabase.com
2. Klikni na **"New project"**
3. Zadej název projektu (např. "StudyPro")
4. Zadej silné heslo pro databázi
5. Vyber region (nejlépe Europe - Frankfurt)
6. Počkej, než se projekt vytvoří (~2 minuty)

### 4️⃣ Získání Supabase credentials

1. V Supabase Dashboard jdi do **Settings** → **API**
2. Zkopíruj:
   - **Project URL** (např. `https://xxxxx.supabase.co`)
   - **anon public** API key

### 5️⃣ Konfigurace .env souboru

1. Vytvoř `.env` soubor v kořenovém adresáři:

```bash
cp .env.example .env
```

2. Otevři `.env` a vyplň credentials:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**⚠️ DŮLEŽITÉ:**
- `.env` soubor je v `.gitignore` a **NESMÍ být nikdy commitnutý do gitu**
- Anon key je veřejný klíč, ale i tak je dobré ho nesdílet zbytečně
- Service role key NIKDY nesdílet a nedávat do frontendu!

### 6️⃣ Spuštění SQL migrací

1. V Supabase Dashboard otevři **SQL Editor** (vlevo v menu)
2. Klikni na **"New query"**
3. Otevři soubor `docs/migrations/001_initial_schema.sql`
4. Zkopíruj **celý obsah** souboru
5. Vlož do SQL Editoru v Supabase
6. Klikni **"Run"** (nebo Ctrl+Enter)
7. Počkej, než se migrace dokončí
8. Zkontroluj, že se vytvořily tabulky v **Database** → **Tables**

✅ Měly by se zobrazit tyto tabulky:
- studypro_users
- studypro_courses
- studypro_lessons
- studypro_study_sessions
- studypro_achievements
- studypro_user_achievements
- studypro_goals
- studypro_materials

### 7️⃣ Nastavení Google OAuth

#### A) Vytvoř Google OAuth credentials

1. Jdi na [Google Cloud Console](https://console.cloud.google.com/)
2. Vytvoř nový projekt (nebo vyber existující)
3. Zapni **Google+ API**
4. Jdi do **Credentials** → **Create Credentials** → **OAuth client ID**
5. Typ aplikace: **Web application**
6. Authorized redirect URIs - přidej:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
   (Project ref najdeš v Supabase Settings)
7. Zkopíruj **Client ID** a **Client Secret**

#### B) Nastav OAuth v Supabase

1. V Supabase Dashboard jdi do **Authentication** → **Providers**
2. Najdi **Google** a klikni **Enable**
3. Vyplň:
   - Client ID (z Google Console)
   - Client Secret (z Google Console)
4. Klikni **Save**

#### C) Nastav Redirect URLs

1. V Supabase jdi do **Authentication** → **URL Configuration**
2. Přidej do **Redirect URLs**:
   ```
   http://localhost:3004
   ```
3. Save

### 8️⃣ Spuštění aplikace

```bash
npm run dev
```

Aplikace se spustí na: **http://localhost:3004**

### 9️⃣ První přihlášení

1. Otevři http://localhost:3004
2. Klikni **"Přihlásit se přes Google"**
3. Vyber Google účet
4. Povol přístup
5. Měl/a by ses přesměrovat na Dashboard! 🎉

## ✅ Kontrola, že vše funguje

Po přihlášení zkontroluj:
- ✅ Vidíš Dashboard s nulou kurzů
- ✅ Můžeš přidat nový kurz
- ✅ Vidíš své jméno a email v profilu
- ✅ Vidíš level 1 a 0 bodů
- ✅ Můžeš se odhlásit

## 🐛 Řešení problémů

### Problém: "Chybí Supabase credentials"
**Řešení:** Zkontroluj `.env` soubor - musí obsahovat správné URL a API key

### Problém: "Error loading profile"
**Řešení:** Ujisti se, že jsi spustil/a SQL migrace správně

### Problém: "Google OAuth nefunguje"
**Řešení:**
1. Zkontroluj, že jsou správně vyplněné Client ID a Secret
2. Zkontroluj Redirect URL v Google Console
3. Zkus vypnout/zapnout Google provider v Supabase

### Problém: Port 3004 je obsazený
**Řešení:** V `vite.config.js` změň port na jiný (např. 3005)

### Problém: Tabulky se nevytvořily
**Řešení:**
1. V SQL Editoru zkontroluj chybové hlášky
2. Ujisti se, že jsi zkopíroval/a celý SQL soubor
3. Zkus migrace spustit znovu

## 🎉 Hotovo!

Máš funkční StudyPro aplikaci! Můžeš začít:
- ➕ Přidávat kurzy
- 📚 Sledovat pokrok
- 🏆 Sbírat odznaky
- 🔥 Budovat streaky

## 📚 Další kroky

- Přečti si celý [README.md](../README.md) pro podrobnosti o funkcích
- Podívej se na plán dalšího vývoje
- Přispěj do projektu (Pull Request vítány!)

---

**Máš problém?** Otevři issue na GitHubu!

**Máš nápad na vylepšení?** Pošli Pull Request!

🎓 Happy learning! 📚
