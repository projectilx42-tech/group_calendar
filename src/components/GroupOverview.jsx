import React from 'react';
import { Users, Info } from 'lucide-react';
import { EVENT_CATEGORIES } from '../services/storage';

export const GroupOverview = ({ users, events, currentDate, onSelectUser, selectedUserFilter }) => {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;

  const monthEvents = events.filter(e => e.startDate.startsWith(monthStr) || e.endDate.startsWith(monthStr));

  const userStats = users.map(u => {
    const userEvts = monthEvents.filter(e => e.userId === u.id);
    return {
      user: u,
      eventCount: userEvts.length
    };
  });

  return (
    <div className="sidebar-container">
      {/* Users Card */}
      <div className="glass-card sidebar-card">
        <div className="card-header-sm">
          <Users size={16} className="header-icon" />
          <h3>Uživatelé ({users.length})</h3>
        </div>

        {users.length === 0 ? (
          <p className="subtitle" style={{ fontSize: '0.8rem' }}>Zatím nejsou všichni registrovaní. Zaregistrujte se tlačítkem Vstoupit.</p>
        ) : (
          <div className="friends-list">
            {userStats.map(({ user, eventCount }) => {
              const isSelected = selectedUserFilter === user.id;

              return (
                <div 
                  key={user.id} 
                  className={`friend-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectUser(isSelected ? null : user.id)}
                >
                  <div className="friend-info">
                    <div className="avatar-dot" style={{ backgroundColor: user.color }}>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="friend-name">{user.username}</span>
                  </div>

                  <div className="friend-meta">
                    {eventCount > 0 ? (
                      <span className="badge badge-admin" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                        {eventCount} {eventCount === 1 ? 'akce' : 'akcí'}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Legend */}
      <div className="glass-card sidebar-card">
        <div className="card-header-sm">
          <Info size={16} className="header-icon" />
          <h3>Kategorie akcí</h3>
        </div>

        <div className="categories-grid">
          {Object.entries(EVENT_CATEGORIES).map(([key, cat]) => (
            <div key={key} className="category-chip" style={{ backgroundColor: cat.bg, borderColor: cat.border, color: cat.color }}>
              <span className="cat-label">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
