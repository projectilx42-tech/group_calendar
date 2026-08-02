import React, { useState } from 'react';
import { X, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { StorageService } from '../services/storage';

export const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState('register'); // Default to register for new clean install
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        const user = StorageService.login(username, password);
        onLoginSuccess(user);
        onClose();
      } else {
        const user = StorageService.register(username, password);
        onLoginSuccess(user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Chyba při autentizaci.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{mode === 'login' ? 'Přihlášení' : 'Vytvořit účet'}</h3>
          <button className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            <UserPlus size={15} /> Registrace
          </button>
          <button 
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            <LogIn size={15} /> Přihlášení
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label className="input-label">Uživatelské jméno *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Tvoje jméno..."
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          <div className="input-group">
            <label className="input-label">Heslo *</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="input-field" 
                placeholder="Zadej heslo..."
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            {mode === 'login' ? 'Vstoupit' : 'Založit účet'}
          </button>
        </form>
      </div>
    </div>
  );
};
