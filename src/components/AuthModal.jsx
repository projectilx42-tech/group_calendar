import React, { useState } from 'react';
import { X, LogIn, UserPlus, Shield, Eye, EyeOff, KeyRound } from 'lucide-react';
import { StorageService } from '../services/storage';

export const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState('login'); // 'login' or 'register'
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

  const fillDemoUser = (user, pass) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{mode === 'login' ? 'Přihlášení do kalendáře' : 'Vytvořit nový účet'}</h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            <LogIn size={16} /> Přihlásit se
          </button>
          <button 
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            <UserPlus size={16} /> Založit účet
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label className="input-label">Uživatelské jméno *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Zadejte jméno..."
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
                placeholder="Zadejte heslo..."
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            {mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
            <span>{mode === 'login' ? 'Vstoupit do kalendáře' : 'Vytvořit účet a vstoupit'}</span>
          </button>
        </form>

        {/* Quick Demo Login Preset Buttons */}
        <div className="demo-login-box">
          <span className="demo-label"><KeyRound size={14} /> Rychlé vyzkoušení demo účtů:</span>
          <div className="demo-buttons">
            <button className="btn btn-secondary btn-sm" onClick={() => fillDemoUser('Admin', 'admin123')}>
              🛡️ Admin
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => fillDemoUser('Kuba', 'kuba123')}>
              👤 Kuba
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => fillDemoUser('Anet', 'anet123')}>
              👤 Anet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
