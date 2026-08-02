import React from 'react';
import { EVENT_CATEGORIES } from '../services/storage';
import { Sparkles, Calendar as CalendarIcon } from 'lucide-react';

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

  return (
    <div className="timeline-card glass-card">
      <div className="timeline-header">
        <div className="timeline-title-group">
          <h3><Sparkles size={18} className="icon-glow" /> Osa dovolených a volných dnů</h3>
          <p className="subtitle">Přehledný časový diagram pro rychlé nalezení společných dnů</p>
        </div>
      </div>

      <div className="timeline-scroll-container">
        <div className="timeline-table">
          {/* Header Row (Days of Month) */}
          <div className="timeline-row timeline-header-row">
            <div className="timeline-user-col">Kamarád</div>
            <div className="timeline-days-grid">
              {daysArray.map(d => {
                const dateObj = new Date(year, month, d);
                const dayOfWeek = dateObj.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                return (
                  <div key={d} className={`timeline-day-header ${isWeekend ? 'weekend' : ''}`}>
                    <span className="timeline-day-num">{d}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Rows */}
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
                    // Find active event on dateStr
                    const activeEvt = userEvents.find(e => dateStr >= e.startDate && dateStr <= e.endDate);

                    if (!activeEvt) {
                      return <div key={d} className="timeline-cell empty" />;
                    }

                    const catConfig = EVENT_CATEGORIES[activeEvt.category] || EVENT_CATEGORIES.vacation;
                    const isStart = dateStr === activeEvt.startDate;
                    const isEnd = dateStr === activeEvt.endDate;

                    return (
                      <div 
                        key={d} 
                        className={`timeline-cell active ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''}`}
                        style={{
                          backgroundColor: catConfig.bg,
                          borderColor: u.color || catConfig.border
                        }}
                        onClick={() => onSelectEvent(activeEvt)}
                        title={`${u.username}: ${activeEvt.title} (${activeEvt.startDate} až ${activeEvt.endDate})`}
                      >
                        {isStart && (
                          <span className="timeline-pill-text">
                            {catConfig.emoji} {activeEvt.title}
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
