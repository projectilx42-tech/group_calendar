import React from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { EVENT_CATEGORIES } from '../services/storage';

const CZECH_MONTHS = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
];

const WEEK_DAYS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

export const CalendarGrid = ({ 
  currentDate, 
  onDateChange, 
  events, 
  selectedUserFilter, 
  onUserFilterChange,
  onSelectEvent, 
  onDayClick,
  users 
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const formatDateString = (y, m, d) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startOffset = (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1);

  const prevMonth = () => onDateChange(new Date(year, month - 1, 1));
  const nextMonth = () => onDateChange(new Date(year, month + 1, 1));
  const goToToday = () => onDateChange(new Date());

  const filteredEvents = events.filter(e => {
    if (selectedUserFilter && e.userId !== selectedUserFilter) return false;
    return true;
  });

  const getEventsForDate = (dateStr) => {
    return filteredEvents.filter(e => dateStr >= e.startDate && dateStr <= e.endDate);
  };

  const todayStr = formatDateString(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  return (
    <div className="calendar-card glass-card">
      {/* Calendar Top Bar */}
      <div className="calendar-header">
        <div className="month-title-group">
          <h2 className="month-title">
            {CZECH_MONTHS[month]} <span className="year-title">{year}</span>
          </h2>
        </div>

        <div className="calendar-controls">
          {users.length > 0 && (
            <div className="filter-dropdown-wrapper">
              <Filter size={14} className="filter-icon" />
              <select 
                className="user-filter-select"
                value={selectedUserFilter || ''} 
                onChange={(e) => onUserFilterChange(e.target.value || null)}
              >
                <option value="">Všichni ({users.length})</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
            </div>
          )}

          <div className="nav-buttons">
            <button className="btn btn-secondary btn-sm" onClick={goToToday}>
              Dnes
            </button>
            <button className="btn btn-secondary btn-sm icon-only" onClick={prevMonth} aria-label="Předchozí měsíc">
              <ChevronLeft size={16} />
            </button>
            <button className="btn btn-secondary btn-sm icon-only" onClick={nextMonth} aria-label="Následující měsíc">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Weekdays Header */}
      <div className="weekdays-grid">
        {WEEK_DAYS.map((day, idx) => (
          <div key={day} className={`weekday-cell ${idx >= 5 ? 'weekend' : ''}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="days-grid">
        {Array.from({ length: startOffset }).map((_, idx) => (
          <div key={`blank-${idx}`} className="day-cell day-blank" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const dateStr = formatDateString(year, month, dayNum);
          const dayEvents = getEventsForDate(dateStr);
          const isToday = dateStr === todayStr;
          const dayOfWeekIndex = (startOffset + idx) % 7;
          const isWeekend = dayOfWeekIndex === 5 || dayOfWeekIndex === 6;

          return (
            <div 
              key={dateStr} 
              className={`day-cell ${isToday ? 'today' : ''} ${isWeekend ? 'weekend-day' : ''}`}
              onClick={() => onDayClick(dateStr)}
            >
              <div className="day-number-row">
                <span className={`day-number ${isToday ? 'today-number' : ''}`}>{dayNum}</span>
              </div>

              {/* Event Indicators */}
              <div className="day-events-container">
                {dayEvents.slice(0, 3).map(evt => {
                  const catConfig = EVENT_CATEGORIES[evt.category] || EVENT_CATEGORIES.vacation;
                  const isStart = dateStr === evt.startDate;
                  const isEnd = dateStr === evt.endDate;

                  return (
                    <div 
                      key={evt.id}
                      className={`event-bar ${isStart ? 'is-start' : ''} ${isEnd ? 'is-end' : ''}`}
                      style={{
                        backgroundColor: catConfig.bg,
                        borderLeftColor: evt.userColor || catConfig.color,
                        color: '#f8fafc'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(evt);
                      }}
                    >
                      <span className="user-dot" style={{ backgroundColor: evt.userColor || catConfig.color }} />
                      <span className="event-title-text">
                        {isStart ? `${evt.userName}: ${evt.title}` : evt.title}
                      </span>
                    </div>
                  );
                })}

                {dayEvents.length > 3 && (
                  <span className="more-count">+{dayEvents.length - 3} další</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
