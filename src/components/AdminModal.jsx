import React, { useState } from 'react';
import { X, Shield, Key, RefreshCw, CheckCircle2, User } from 'lucide-react';
import { StorageService } from '../services/storage';

export const AdminModal = ({ isOpen, onClose, currentUser, onDataReset }) => {
  if (!isOpen || currentUser?.role !== 'admin') return null;

  const [users, setUsers] = useState(StorageService.getUsers());
  const [selectedUser, setSelectedUser] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleResetPassword = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!selectedUser) {
      setMessage({ type: 'error', text: 'Vyberte uživatele pro reset hesla.' });
      return;
    }

    if (!newPassword || newPassword.length < 3) {
      setMessage({ type: 'error', text: 'Nové heslo musí mít alespoň 3 znaky.' });
      return;
    }

    try {
      StorageService.adminResetPassword(currentUser.id, selectedUser, newPassword);
      setUsers(StorageService.getUsers());
      setNewPassword('');
      setMessage({ type: 'success', text: 'Heslo bylo úspěšně změněno!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleResetAllDemo = () => {
    if (window.confirm('Opravdu chcete resetovat všechna data do původního demo stavu?')) {
      const reset = StorageService.resetDemoData();
      onDataReset(reset);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3><Shield size={20} className="header-icon-admin" /> Administrátorský Panel</h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {message.text && (
          <div className={message.type === 'error' ? 'error-alert' : 'success-alert'}>
            {message.text}
          </div>
        )}

        {/* User List Table */}
        <div className="admin-section">
          <h4>Seznam registrovaných účtů ({users.length})</h4>
          <div className="users-list-box">
            {users.map(u => (
              <div key={u.id} className="user-row">
                <div className="user-row-left">
                  <div className="avatar-dot" style={{ backgroundColor: u.color }}>
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-row-name">{u.username}</span>
                  {u.role === 'admin' && <span className="badge badge-admin">Admin</span>}
                </div>
                <span className="user-row-id">ID: {u.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Password Reset Form */}
        <form onSubmit={handleResetPassword} className="admin-section admin-form">
          <h4><Key size={16} /> Resetovat heslo uživateli</h4>

          <div className="input-group">
            <label className="input-label">Vyberte uživatele</label>
            <select 
              className="input-field" 
              value={selectedUser} 
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">-- Zvolte uživatele --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Nové heslo</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Zadejte nové heslo..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            <Key size={16} /> Uložit nové heslo
          </button>
        </form>

        {/* Reset Demo Data Button */}
        <div className="admin-footer-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleResetAllDemo}>
            <RefreshCw size={14} /> Obnovit demo data
          </button>
        </div>
      </div>
    </div>
  );
};
