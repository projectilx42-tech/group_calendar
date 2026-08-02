# TODO - Oprava aplikace Kdy spolu

## Problémy
- [ ] Fix: Duplicitní účty - každé zařízení má náhodné ID (crypto.randomUUID)
- [ ] Fix: Každý vidí jen sebe - události se neukládají na sdílené místo pod stabilním uživatelem
- [ ] Fix: Chybí přihlášení jménem + heslem
- [ ] Fix: Design aplikace

## Kroky
- [x] 1. `src/services/storage.js` - Přepsat na auth systém: register, login, logout, resetPassword, deleteUser, seed účty (Admin/admin123, Kuba/kuba123, Anet/anet123, Pavel/pavel123, Terka/terka123), hesla hashovat (SHA-256), stabilní user ID z účtů
- [x] 2. `src/components/AuthModal.jsx` - Přidat pole pro heslo, režim Přihlásit/Registrace, validace
- [x] 3. `src/components/GroupOverview.jsx` - Admin panel: reset hesla, smazání uživatele
- [x] 4. `src/App.jsx` - Opravit login/logout na nový auth systém
- [x] 5. `src/index.css` - Kompletní redesign: strukturovaný CSS, lepší vizuál, auth formulář, admin panel, responzivita
- [x] 6. Test: `npm run build` a `npm run dev`

## Hotovo
- [x] Analýza kódu a příprava plánu
