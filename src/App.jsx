import React, { useEffect, useState } from 'react';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { CalendarGrid } from './components/CalendarGrid';
import { TimelineView } from './components/TimelineView';
import { GroupOverview } from './components/GroupOverview';
import { EventModal } from './components/EventModal';
import { AuthModal } from './components/AuthModal';
import './App.css';

const collectUsers = (events, registeredUsers) => {
  const fromEvents = events.reduce((all, event) => all.some(person => person.id === event.userId) ? all : [...all, { id: event.userId, username: event.userName, color: event.userColor }], []);
  const all = [...fromEvents];
  for (const user of registeredUsers) {
    if (!all.some(person => person.id === user.id)) all.push(user);
  }
  return all;
};

export function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentUser, setCurrentUser] = useState(StorageService.getCurrentUser());
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('kdyspolu_theme') === 'dark');
  const [events, setEvents] = useState([]); const [users, setUsers] = useState([]);
  const [selectedUserFilter, setSelectedUserFilter] = useState(null); const [activeMobileTab, setActiveMobileTab] = useState('calendar');
  const [isAuthOpen, setIsAuthOpen] = useState(false); const [isEventOpen, setIsEventOpen] = useState(false); const [eventToEdit, setEventToEdit] = useState(null); const [prefilledDate, setPrefilledDate] = useState('');
  const reload = async () => {
    const nextEvents = await StorageService.getEvents();
    setEvents(nextEvents);
    setUsers(collectUsers(nextEvents, StorageService.getUsers()));
  };
  useEffect(() => { StorageService.init().then(reload); if (!StorageService.getCurrentUser()) setIsAuthOpen(true); }, []);
  useEffect(() => { document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light'; localStorage.setItem('kdyspolu_theme', isDarkMode ? 'dark' : 'light'); }, [isDarkMode]);
  const openAdd = (date = '') => { if (!currentUser) return setIsAuthOpen(true); setPrefilledDate(date); setEventToEdit(null); setIsEventOpen(true); };
  const login = user => { setCurrentUser(user); reload(); };
  const logout = () => { StorageService.logout(); setCurrentUser(null); reload(); };
  return <div className="app-container">
    <Navbar currentUser={currentUser} isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(value => !value)} onOpenAuth={() => setIsAuthOpen(true)} onLogout={logout} onAddEvent={() => openAdd()} />
    <main className="main-content">
      <section className="primary-view-column">
        {activeMobileTab === 'calendar' && <><CalendarGrid currentDate={currentDate} onDateChange={setCurrentDate} events={events} selectedUserFilter={selectedUserFilter} onUserFilterChange={setSelectedUserFilter} onSelectEvent={event => { setEventToEdit(event); setIsEventOpen(true); }} onDayClick={openAdd} users={users} /><div className="desktop-timeline-wrapper"><TimelineView currentDate={currentDate} events={events} users={users} onSelectEvent={event => { setEventToEdit(event); setIsEventOpen(true); }} /></div></>}
        {activeMobileTab === 'timeline' && <TimelineView currentDate={currentDate} events={events} users={users} onSelectEvent={event => { setEventToEdit(event); setIsEventOpen(true); }} />}
      </section>
      <aside className={`sidebar-column ${activeMobileTab === 'group' ? 'mobile-show' : ''}`}><GroupOverview users={users} events={events} currentDate={currentDate} onSelectUser={setSelectedUserFilter} selectedUserFilter={selectedUserFilter} currentUser={currentUser} /></aside>
    </main>
    <MobileNav activeTab={activeMobileTab} setActiveTab={setActiveMobileTab} currentUser={currentUser} onAddEvent={() => openAdd()} />
    <EventModal isOpen={isEventOpen} onClose={() => setIsEventOpen(false)} eventToEdit={eventToEdit} prefilledDate={prefilledDate} currentUser={currentUser} onSave={async event => { await StorageService.saveEvent(event); await reload(); }} onDelete={async id => { await StorageService.deleteEvent(id); await reload(); }} />
    <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={user => { login(user); setIsAuthOpen(false); }} />
  </div>;
}
export default App;
