# 🚀 Instrukce pro Push do GitHubu

## ⚡ Rychlý Push (jednoduchý)

```bash
cd /Users/lenkaroubalova/Documents/Projekty/studypro
git push -u origin claude/studypro-course-module-01SHTjbX99fEcTiZXJYcxkro
```

---

## 📋 Krok za Krokem

### 1. Otevři terminál
```bash
cd /Users/lenkaroubalova/Documents/Projekty/studypro
```

### 2. Ověř git status
```bash
git status
```
**Mělo by zobrazit:**
```
On branch claude/studypro-course-module-01SHTjbX99fEcTiZXJYcxkro
Your branch is ahead of 'origin/claude/studypro-course-module-01SHTjbX99fEcTiZXJYcxkro' by 1 commit.
```

### 3. Zobraz commity k push
```bash
git log --oneline -3
```
**Mělo by zobrazit:**
```
5e2f1e5 Refactor: Kompletní odstranění emoji a použití Lucide ikon napříč aplikací
77ca1fe Fix: Přejmenování Lucide Menu ikony na MenuIcon kvůli konfliktu s MUI Menu komponentou
7880e5a Refactor: Kompletní migrace z MUI icons na Lucide React ikony
```

### 4. Push do GitHubu
```bash
git push -u origin claude/studypro-course-module-01SHTjbX99fEcTiZXJYcxkro
```

### 5. Ověř úspěch
```bash
git status
```
**Mělo by zobrazit:**
```
On branch claude/studypro-course-module-01SHTjbX99fEcTiZXJYcxkro
Your branch is up to date with 'origin/claude/studypro-course-module-01SHTjbX99fEcTiZXJYcxkro'.
nothing to commit, working tree clean
```

---

## 🔧 Pokud Push Selže

### Případ A: Network Error / Timeout
```bash
# Počkej 30 sekund a zkus znovu
sleep 30
git push -u origin claude/studypro-course-module-01SHTjbX99fEcTiZXJYcxkro
```

### Případ B: 504 Gateway Timeout
```bash
# 1. Restartuj Docker/Git server (pokud používáš)
# 2. Nebo použij patch soubor:

# Zobraz patch
cat unpushed-changes.patch

# Patch bude fungovat i později, až server poběží
```

### Případ C: Rejected (non-fast-forward)
```bash
# Někdo pushil do stejného branchu
git pull --rebase origin claude/studypro-course-module-01SHTjbX99fEcTiZXJYcxkro
git push -u origin claude/studypro-course-module-01SHTjbX99fEcTiZXJYcxkro
```

---

## 📦 Záložní Plán: Použití Patch Souboru

Pokud push opakovaně selhává:

### 1. Patch soubor je již vytvořen:
```bash
ls -lh unpushed-changes.patch
```

### 2. Aplikuj patch později:
```bash
# Na jiném počítači nebo později:
cd /path/to/studypro
git apply unpushed-changes.patch
git add -A
git commit -m "Apply Lucide icons refactoring"
git push
```

### 3. Nebo pošli patch emailem/Slackem
```bash
# Patch soubor můžeš zkopírovat kamkoliv
cp unpushed-changes.patch ~/Desktop/
```

---

## ✅ Co Se Stane Po Úspěšném Push

1. ✅ GitHub dostane 1 nový commit (5e2f1e5)
2. ✅ Branch bude synced s remote
3. ✅ Můžeš vytvořit Pull Request
4. ✅ Kolega může pulln tvoje změny

---

## 🔍 Troubleshooting

### "Permission denied"
```bash
# Zkontroluj git credentials
git config --list | grep user
```

### "Branch doesn't exist"
```bash
# Vytvoř branch na remote
git push -u origin claude/studypro-course-module-01SHTjbX99fEcTiZXJYcxkro
```

### "fatal: unable to access"
```bash
# Zkontroluj remote URL
git remote -v

# Mělo by být:
# origin  http://127.0.0.1:XXXXX/git/lennayia/studypro
```

---

## 📞 Help Commands

```bash
# Zobraz help pro push
git push --help

# Zobraz status
git status -v

# Zobraz log s detaily
git log --oneline --graph -10

# Zobraz změny v commitu
git show 5e2f1e5
```

---

## 🎯 Po Úspěšném Push

### Pull na druhém počítači:
```bash
cd /path/to/studypro
git fetch origin
git checkout claude/studypro-course-module-01SHTjbX99fEcTiZXJYcxkro
git pull origin claude/studypro-course-module-01SHTjbX99fEcTiZXJYcxkro
```

### Vytvoř Pull Request:
```bash
# Na GitHubu:
# 1. Přejdi na repository
# 2. Klikni "Compare & pull request"
# 3. Vyplň popis
# 4. Create pull request
```

---

**💡 TIP:** Pokud máš jakékoliv problémy, máš patch soubor jako zálohu!
