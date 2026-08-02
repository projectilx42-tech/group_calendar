import React, { useState } from 'react';
import { CheckCircle2, KeyRound, Trash2, Users, ShieldCheck } from 'lucide-react';
import { EVENT_CATEGORIES, StorageService } from '../services/storage';

export const GroupOverview = ({ users, events, currentDate, onSelectUser, selectedUserFilter, currentUser }) => {
  const [adminMsg, setAdminMsg] = useState('');
  const [resetTarget, setResetTarget] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const month = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const isAdmin = Boolean(currentUser?.isAdmin);

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await StorageService.resetPassword(resetTarget, newPassword);
      setAdminMsg(`Heslo pro ${resetTarget} bylo změněno.`);
      setResetTarget('');
      setNewPassword('');
    } catch (err) {
      setAdminMsg(err.message);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await StorageService.deleteUser(pendingDelete.id);
      setAdminMsg(`Uživatel ${pendingDelete.username} byl smazán.`);
      setPendingDelete(null);
    } catch (err) {
      setAdminMsg(err.message);
      setPendingDelete(null);
    }
  };

  return (
    <div className="sidebar-container">
      <section className="glass-card sidebar-card">
        <p className="eyebrow">VAŠE PARTA</p>
        <h2><Users size={19} /> Lidé v kalendáři</h2>
        <div className="friends-list">
          {users.length ? users.map(user => {
            const count = events.filter(event => event.userId === user.id && (event.startDate.startsWith(month) || event.endDate.startsWith(month))).length;
            const label = count === 1 ? 'záznam' : count > 1 && count < 5 ? 'záznamy' : 'záznamů';
            return (
              <button key={user.id} className={`friend-item ${selectedUserFilter === user.id ? 'selected' : ''}`} onClick={() => onSelectUser(selectedUserFilter === user.id ? null : user.id)}>
                <span><i style={{ background: user.color }}>{user.username[0]}</i>{user.username}{user.isAdmin && <ShieldCheck size={13} className="admin-badge" />}</span>
                <small>{count || '—'} {label}</small>
              </button>
            );
          }) : <p className="empty-copy">Až někdo označí termín, objeví se tady.</p>}
        </div>
      </section>

      {isAdmin && (
        <section className="glass-card sidebar-card admin-panel">
          <p className="eyebrow">ADMIN</p>
          <h2><KeyRound size={17} /> Správa lidí</h2>
          {adminMsg && <div className="admin-msg">{adminMsg}</div>}

          <form className="admin-form" onSubmit={handleReset}>
            <label className="input-group">
              <span className="input-label">Změnit heslo uživateli</span>
              <select className="input-field" value={resetTarget} onChange={e => setResetTarget(e.target.value)} required>
                <option value="">— vyber uživatele —</option>
                {users.filter(u => !u.isAdmin).map(u => (
                  <option key={u.id} value={u.username}>{u.username}</option>
                ))}
              </select>
            </label>
            <div className="admin-password-row">
              <input className="input-field" type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Nové heslo (min. 4)" required />
              <button className="btn btn-primary" type="submit"><KeyRound size={15} /> Reset</button>
            </div>
          </form>

          <div className="admin-user-list">
            {users.filter(u => !u.isAdmin).map(user => (
              <div className="admin-user-row" key={user.id}>
                <span><i style={{ background: user.color }}>{user.username[0]}</i>{user.username}</span>
                <button className="btn btn-danger btn-small" type="button" onClick={() => setPendingDelete(user)}><Trash2 size={13} /></button>
              </div>
            ))}
          </div>

          {pendingDelete && (
            <div className="confirm-box">
              <p>Smazat {pendingDelete.username}? Smažou se i jeho záznamy.</p>
              <div className="confirm-actions">
                <button className="btn btn-danger btn-small" onClick={handleDelete}>Smazat</button>
                <button className="btn btn-ghost btn-small" onClick={() => setPendingDelete(null)}>Zrušit</button>
              </div>
            </div>
          )}
        </section>
      )}

      <section className="glass-card sidebar-card legend">
        <p className="eyebrow">JAK ČÍST KALENDÁŘ</p>
        {Object.entries(EVENT_CATEGORIES).map(([key, status]) => (
          <div key={key}><i style={{ background: status.color }} /><span>{status.label}</span></div>
        ))}
        <p className="sidebar-tip"><CheckCircle2 size={16} /> Klikni na libovolný den a hotovo.</p>
      </section>
    </div>
  );
};
