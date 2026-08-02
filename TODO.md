# TODO - Oprava aplikace Kdy spolu

## Problémy
- [ ] Fix: Duplicitní účty - každé zařízení má náhodné ID (crypto.randomUUID)
- [ ] Fix: Každý vidí jen sebe - události se neukládají na sdílené místo pod stabilním uživatelem
- [ ] Fix: Chybí přihlášení jménem + heslem
- [ ] Fix: Design aplikace

## Kroky
- [x] 1. `src/services/storage.js` - Přepsat na auth systém: register, login, logout, resetPassword, deleteUser, hesla hashovat (SHA-256), stabilní user ID deterministicky z username
- [x] 2. `src/components/AuthModal.jsx` - Přidat pole pro heslo, režim Přihlásit/Registrace, validace
- [x] 3. `src/components/GroupOverview.jsx` - Admin panel: reset hesla, smazání uživatele
- [x] 4. `src/App.jsx` - Opravit login/logout na nový auth systém
- [x] 5. `src/index.css` - Kompletní redesign: strukturovaný CSS, lepší vizuál, auth formulář, admin panel, responzivita
- [x] 6. Test: `npm run build` a `npm run dev`
- [x] 7. Odstranění seed účtů - žádní random lidé na prvním spuštění
- [x] 8. Supabase cloud sync - cloudGetUsers, cloudGetUserByUsername, cloudSaveUser, cloudDeleteUser; login/register cloud-first s lokálním fallbackem
- [x] 9. SQL schema (`supabase-schema.sql`) - tabulky users + events, RLS politiky pro anon klíč
- [x] 10. `.env.example` - šablona pro konfiguraci Supabase

## Hotovo
- [x] Analýza kódu a příprava plánu
- [x] Oprava duplicitních účtů (deterministická ID z jména)
- [x] Autentizace jméno+heslo s SHA-256 hashováním
- [x] Admin účet (první registrovaný)
- [x] Sdílení mezi uživateli (cloud přes Supabase)
- [x] Redesign aplikace
