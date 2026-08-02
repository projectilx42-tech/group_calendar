import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sun, Calendar as CalendarIcon, Filter, Eye } from 'lucide-react';
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

  // Helper to format date string YYYY-MM-DD
  const formatDateString = (y, m, d) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // Get total days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get starting day of week (0 = Sun, 1 = Mon, ... converted to Mon=0)
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startOffset = (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1);

  // Month navigation
  const prevMonth = () => onDateChange(new Date(year, month - 1, 1));
  const nextMonth = () => onDateChange(new Date(year, month + 1, 1));
  const goToAugust = () => onDateChange(new Date(2026, 7, 1)); // August 2026

  // Filter events
  const filteredEvents = events.filter(e => {
    if (selectedUserFilter && e.userId !== selectedUserFilter) return false;
    return true;
  });

  // Helper to check if event falls on date YYYY-MM-DD
  const getEventsForDate = (dateStr) => {
    return filteredEvents.filter(e => {
      return dateStr >= e.startDate && dateStr <= e.endDate;
    });
  };

  const todayStr = formatDateString(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  return (
    <div className="calendar-card glass-card">
      {/* Calendar Header Controls */}
      <div className="calendar-header">
        <div className="month-title-group">
          <h2 className="month-title">
            {CZECH_MONTHS[month]} <span className="year-title">{year}</span>
          </h2>
          {month === 7 && year === 2026 && (
            <span className="summer-highlight-pill">
              <Sun size={14} /> Vrchol Prázdnin!
            </span>
          )}
        </div>

        <div className="calendar-controls">
          {/* Filter by Friend Dropdown */}
          <div className="filter-dropdown-wrapper">
            <Filter size={15} className="filter-icon" />
            <select 
              className="user-filter-select"
              value={selectedUserFilter || ''} 
              onChange={(e) => onUserFilterChange(e.target.value || null)}
            >
              <option value="">Všichni přátelé</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
          </div>

          <div className="nav-buttons">
            <button className="btn btn-secondary btn-sm" onClick={goToAugust} title="Skočit na Srpen 2026">
              <Sun size={14} /> <span className="hide-mobile">Srpen 2026</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={prevMonth}>
              <ChevronLeft size={16} />
            </button>
            <button className="btn btn-secondary btn-sm" onClick={nextMonth}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Weekdays Row */}
      <div className="weekdays-grid">
        {WEEK_DAYS.map((day, idx) => (
          <div key={day} className={`weekday-cell ${idx >= 5 ? 'weekend' : ''}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="days-grid">
        {/* Blank offset cells for previous month */}
        {Array.from({ length: startOffset }).map((_, idx) => (
          <div key={`blank-${idx}`} className="day-cell day-blank" />
        ))}

        {/* Month Days */}
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
                {dayEvents.length > 0 && (
                  <span className="event-count-dot" title={`${dayEvents.length} akce`}>
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* Event Cards inside Day Cell */}
              <div className="day-events-container">
                {dayEvents.slice(0, 3).map(evt => {
                  const catConfig = EVENT_CATEGORIES[evt.category] || EVENT_CATEGORIES.vacation;
                  return (
                    <div 
                      key={evt.id}
                      className="event-pill"
                      style={{
                        backgroundColor: catConfig.bg,
                        borderColor: evt.userColor || catConfig.border,
                        color: '#ffffff'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(evt);
                      }}
                    >
                      <span className="user-dot" style={{ backgroundColor: evt.userColor }} />
                      <span className="event-emoji">{catConfig.emoji}</span>
                      <span className="event-name">{evt.userName}: {evt.title}</span>
                    </div>
                  );
                })}

                {dayEvents.length > 3 && (
                  <div className="more-events-indicator">
                    +{dayEvents.length - 3} další
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
