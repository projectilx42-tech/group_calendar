import React from 'react';
import { Users, Calendar, Sun, CheckCircle2, Info, Sparkles } from 'lucide-react';
import { EVENT_CATEGORIES } from '../services/storage';

export const GroupOverview = ({ users, events, currentDate, onSelectUser, selectedUserFilter }) => {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;

  // Filter events in current month
  const monthEvents = events.filter(e => e.startDate.startsWith(monthStr) || e.endDate.startsWith(monthStr));

  // Count vacation days per user
  const userStats = users.map(u => {
    const userEvts = monthEvents.filter(e => e.userId === u.id);
    return {
      user: u,
      eventCount: userEvts.length
    };
  });

  return (
    <div className="sidebar-container">
      {/* Friends Card */}
      <div className="glass-card sidebar-card">
        <div className="card-header-sm">
          <Users size={18} className="header-icon" />
          <h3>Parta & Přátelé ({users.length})</h3>
        </div>

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
                    <span className="badge badge-user">
                      {eventCount} {eventCount === 1 ? 'akce' : eventCount < 5 ? 'akce' : 'akcí'}
                    </span>
                  ) : (
                    <span className="no-events-tag">Žádné akce</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Legend */}
      <div className="glass-card sidebar-card">
        <div className="card-header-sm">
          <Info size={18} className="header-icon" />
          <h3>Legenda kategorií</h3>
        </div>

        <div className="categories-grid">
          {Object.entries(EVENT_CATEGORIES).map(([key, cat]) => (
            <div key={key} className="category-chip" style={{ backgroundColor: cat.bg, borderColor: cat.border }}>
              <span className="cat-emoji">{cat.emoji}</span>
              <span className="cat-label">{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summer Tip Box */}
      <div className="glass-card sidebar-card summer-tip-card">
        <div className="tip-header">
          <Sparkles size={20} className="tip-icon" />
          <h4>Tipy pro organizaci prázdnin</h4>
        </div>
        <p className="tip-text">
          Klikněte na jakýkoliv den v kalendáři pro rychlé vložení vaší dovolené nebo výletu. Ostatní kamarádi tak hned uvidí, kdy jste dostupní!
        </p>
      </div>
    </div>
  );
};
