# ☀️ Skupinový Kalendář Přátel (Summer 2026)

Moderní webová aplikace pro sdílení plánů, dovolených a volných dnů mezi kamarády. Navrženo pro perfektní zobrazení jak na **počítači**, tak na mobilních telefonech **Android** a **iPhone** (iOS touch-friendly UI).

---

## 🚀 Hlavní Funkce

- **Měsíční a Časové zobrazení (Timeline)**: Okamžitě vidíte, kdo má kdy dovolenou a kdy se vám překrývá volný čas.
- **Kategorie Akcí**: Dovolené 🏖️, Chata / Víkend 🏡, Festivaly 🎪, Výlety 🚀, Práce 💼, Volno ☀️.
- **Uživatelské Účty & Admin Panel**:
  - Registrace a přihlášení jménem a heslem.
  - Administrátorský účet s možností resetu hesel pro ostatní kamarády.
- **Responzivní Mobilní UI**: Vyhrazená spodní navigační lišta pro mobilní zařízení s velkými dotykovými prvky.
- **Příprava pro Vercel & Supabase**: Funguje ihned out-of-the-box (s demo daty a LocalStorage) i s cloudovou Supabase databází.

---

## 🔑 Přednastavené Účty pro Testování

- **Administrátor**: `Admin` / Heslo: `admin123` *(Správa uživatelů, reset hesel)*
- **Kamarád 1**: `Kuba` / Heslo: `kuba123`
- **Kamarád 2**: `Anet` / Heslo: `anet123`
- **Kamarád 3**: `Pavel` / Heslo: `pavel123`
- **Kamarád 4**: `Terka` / Heslo: `terka123`

---

## 📦 Návod: Jak nahrát na GitHub a nasadit na Vercel

### 1. Inicializace Git a Commit
V terminálu v adresáři projektu spusťte:
```bash
git init
git add .
git commit -m "Initial commit - Skupinový kalendář"
```

### 2. Vytvoření Repozitáře na GitHubu
1. Otevřete [GitHub.com](https://github.com) a klikněte na **New Repository**.
2. Pojmenujte repozitář např. `group-calendar`.
3. Zkopírujte příkazy pro nahrání existujícího repozitáře:
```bash
git remote add origin https://github.com/TVOJE_JMENO/group-calendar.git
git branch -M main
git push -u origin main
```

### 3. Nasazení na Vercel (Zadarmo)
1. Přejděte na [Vercel.com](https://vercel.com) a přihlaste se přes GitHub.
2. Klikněte na **Add New...** -> **Project**.
3. Vyberte váš repozitář `group-calendar` a klikněte na **Import**.
4. Ponechte výchozí nastavení (Vite) a klikněte na **Deploy**.
5. Za minutu máte hotovou vlastní webovou adresu (např. `https://group-calendar-xxx.vercel.app`), kterou můžete poslat kamarádům!

---

## 🛠️ Lokální Spuštění Vývoje

```bash
npm install
npm run dev
```

Po spuštění otevřete v prohlížeči `http://localhost:5173`.

---

## 🧪 Ověření buildu
```bash
npm run build
```
