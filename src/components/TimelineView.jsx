import React from 'react';
import { EVENT_CATEGORIES } from '../services/storage';

export const TimelineView = ({ currentDate, events, users, onSelectEvent }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const formatDateString = (d) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  if (users.length === 0) {
    return (
      <div className="timeline-card glass-card empty-state-card">
        Zatím zde nejsou žádní uživatelé. Přihlaste se a vytvořte svůj účet.
      </div>
    );
  }

  return (
    <div className="timeline-card glass-card">
      <div className="timeline-header">
        <div className="timeline-title-group">
          <h3>Časový přehled (Timeline)</h3>
        </div>
      </div>

      <div className="timeline-scroll-container">
        <div className="timeline-table">
          <div className="timeline-row timeline-header-row">
            <div className="timeline-user-col">Uživatel</div>
            <div className="timeline-days-grid">
              {daysArray.map(d => (
                <div key={d} className="timeline-day-header">
                  {d}
                </div>
              ))}
            </div>
          </div>

          {users.map(u => {
            const userEvents = events.filter(e => e.userId === u.id);

            return (
              <div key={u.id} className="timeline-row">
                <div className="timeline-user-col">
                  <span className="user-badge-avatar" style={{ backgroundColor: u.color }}>
                    {u.username.charAt(0).toUpperCase()}
                  </span>
                  <span className="user-name">{u.username}</span>
                </div>

                <div className="timeline-days-grid">
                  {daysArray.map(d => {
                    const dateStr = formatDateString(d);
                    const activeEvt = userEvents.find(e => dateStr >= e.startDate && dateStr <= e.endDate);

                    if (!activeEvt) {
                      return <div key={d} className="timeline-cell empty" />;
                    }

                    const catConfig = EVENT_CATEGORIES[activeEvt.category] || EVENT_CATEGORIES.vacation;
                    const isStart = dateStr === activeEvt.startDate;

                    return (
                      <div 
                        key={d} 
                        className={`timeline-cell active ${isStart ? 'start' : ''}`}
                        style={{
                          backgroundColor: catConfig.bg,
                          borderColor: u.color || catConfig.color
                        }}
                        onClick={() => onSelectEvent(activeEvt)}
                        title={`${u.username}: ${activeEvt.title}`}
                      >
                        {isStart && (
                          <span className="timeline-pill-text">
                            {activeEvt.title}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
