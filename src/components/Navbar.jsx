import React from 'react';
import { Calendar, User, LogIn, LogOut, Shield, Plus, Sparkles } from 'lucide-react';

export const Navbar = ({ currentUser, onOpenAuth, onLogout, onOpenAdmin, onAddEvent }) => {
  return (
    <header className="glass-header">
      <div className="header-container">
        {/* Brand Logo */}
        <div className="brand-logo">
          <div className="logo-icon">
            <Calendar size={22} className="logo-svg" />
          </div>
          <div className="logo-text">
            <h1>Kámoši Kalendář <span className="summer-badge">Summer 2026 ☀️</span></h1>
            <p className="subtitle">Sdílené dovolené & víkendy s partou</p>
          </div>
        </div>

        {/* Action Buttons & User Menu */}
        <div className="header-actions">
          {currentUser ? (
            <>
              {/* Add Vacation Quick Button */}
              <button className="btn btn-primary btn-sm" onClick={onAddEvent}>
                <Plus size={16} />
                <span className="hide-mobile">Přidat akci / dovolenou</span>
              </button>

              {/* User Avatar & Info */}
              <div className="user-profile">
                <div 
                  className="user-avatar" 
                  style={{ backgroundColor: currentUser.color || '#3b82f6' }}
                >
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-details hide-mobile">
                  <span className="username">{currentUser.username}</span>
                  {currentUser.role === 'admin' && (
                    <span className="badge badge-admin">
                      <Shield size={10} /> Admin
                    </span>
                  )}
                </div>
              </div>

              {/* Admin Panel Button */}
              {currentUser.role === 'admin' && (
                <button className="btn btn-secondary btn-sm" onClick={onOpenAdmin} title="Správa uživatelů">
                  <Shield size={16} />
                  <span className="hide-mobile">Admin</span>
                </button>
              )}

              {/* Logout Button */}
              <button className="btn btn-secondary btn-sm" onClick={onLogout} title="Odhlásit se">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onOpenAuth}>
              <LogIn size={18} />
              <span>Přihlásit se / Registrovat</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
