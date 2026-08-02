import React, { useState } from 'react';
import { X, ArrowRight, Smartphone } from 'lucide-react';
import { StorageService } from '../services/storage';

export const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  if (!isOpen) return null;
  const submit = (event) => {
    event.preventDefault();
    try {
      const user = StorageService.createDeviceIdentity(name);
      onLoginSuccess(user); onClose();
    } catch (err) { setError(err.message); }
  };
  return <div className="modal-overlay" onClick={onClose}>
    <form className="modal-content auth-modal" onClick={event => event.stopPropagation()} onSubmit={submit}>
      <button type="button" className="btn-close" onClick={onClose} aria-label="Zavřít"><X size={18} /></button>
      <div className="auth-icon"><Smartphone size={24} /></div>
      <div><p className="eyebrow">VÍTEJ V KDY SPOLU</p><h2>Jak ti máme říkat?</h2><p className="modal-copy">Zapamatujeme si tě v tomto zařízení. Příště rovnou pokračuješ do kalendáře.</p></div>
      {error && <div className="error-alert">{error}</div>}
      <label className="input-group"><span className="input-label">Tvoje jméno</span><input className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="Třeba Aneta" autoFocus autoComplete="name" /></label>
      <button className="btn btn-primary btn-block" type="submit">Pokračovat <ArrowRight size={17} /></button>
      <p className="privacy-note">Žádné heslo, žádné složité přihlašování.</p>
    </form>
  </div>;
};
