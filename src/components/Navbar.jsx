import React from 'react';
import { Calendar, User, LogIn, LogOut, Shield, Plus } from 'lucide-react';

export const Navbar = ({ currentUser, onOpenAuth, onLogout, onOpenAdmin, onAddEvent }) => {
  return (
    <header className="glass-header">
      <div className="header-container">
        {/* Brand Logo */}
        <div className="brand-logo">
          <div className="logo-icon">
            <Calendar size={18} />
          </div>
          <div className="logo-text">
            <h1>Skupinový Kalendář</h1>
            <p className="subtitle">Sdílené dovolené a akce</p>
          </div>
        </div>

        {/* Action Buttons & User Menu */}
        <div className="header-actions">
          {currentUser ? (
            <>
              <button className="btn btn-primary btn-sm" onClick={onAddEvent}>
                <Plus size={15} />
                <span className="hide-mobile">Přidat akcí</span>
              </button>

              <div className="user-profile">
                <div 
                  className="user-avatar" 
                  style={{ backgroundColor: currentUser.color || '#38bdf8' }}
                >
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-details hide-mobile">
                  <span className="username">{currentUser.username}</span>
                </div>
              </div>

              {currentUser.role === 'admin' && (
                <button className="btn btn-secondary btn-sm" onClick={onOpenAdmin} title="Správa uživatelů">
                  <Shield size={14} />
                  <span className="hide-mobile">Admin</span>
                </button>
              )}

              <button className="btn btn-secondary btn-sm" onClick={onLogout} title="Odhlásit se">
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={onOpenAuth}>
              <LogIn size={15} />
              <span>Přihlásit se</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
