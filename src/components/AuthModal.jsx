import React, { useState } from 'react';
import { X, ArrowRight, Lock, UserPlus } from 'lucide-react';
import { StorageService } from '../services/storage';

export const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setPassword('');
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = mode === 'login'
        ? await StorageService.login(name, password)
        : await StorageService.register(name, password);
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-content auth-modal" onClick={event => event.stopPropagation()} onSubmit={submit}>
        <button type="button" className="btn-close" onClick={onClose} aria-label="Zavřít"><X size={18} /></button>
        <div className="auth-icon">{mode === 'login' ? <Lock size={24} /> : <UserPlus size={24} />}</div>
        <div>
          <p className="eyebrow">VÍTEJ V KDY SPOLU</p>
          <h2>{mode === 'login' ? 'Přihlas se' : 'Vytvoř si účet'}</h2>
          <p className="modal-copy">
            {mode === 'login'
              ? 'Zadej své jméno a heslo a pokračuj do kalendáře.'
              : 'Zvol si jméno a heslo (min. 4 znaky). Kamarádi tě uvidí ve skupině.'}
          </p>
        </div>
        {error && <div className="error-alert">{error}</div>}
        <label className="input-group">
          <span className="input-label">Jméno</span>
          <input
            className="input-field"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Třeba Aneta"
            autoFocus
            autoComplete="username"
          />
        </label>
        <label className="input-group">
          <span className="input-label">Heslo</span>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </label>
        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? 'Chvilku…' : mode === 'login' ? 'Přihlásit se' : 'Registrovat'} <ArrowRight size={17} />
        </button>
        <button type="button" className="auth-switch" onClick={switchMode}>
          {mode === 'login' ? 'Nemáš účet? Zaregistruj se' : 'Už máš účet? Přihlas se'}
        </button>
        <p className="privacy-note">Stejné jméno a heslo = stejný účet na všech zařízeních.</p>
      </form>
    </div>
  );
};
