import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { CalendarGrid } from './components/CalendarGrid';
import { TimelineView } from './components/TimelineView';
import { GroupOverview } from './components/GroupOverview';
import { EventModal } from './components/EventModal';
import { AuthModal } from './components/AuthModal';
import { AdminModal } from './components/AdminModal';
import './App.css';

export function App() {
  // Default to August 2026 for summer calendar focus
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1));
  const [currentUser, setCurrentUser] = useState(StorageService.getCurrentUser());
  const [users, setUsers] = useState(StorageService.getUsers());
  const [events, setEvents] = useState([]);
  
  // UI Filters and Mobile Navigation
  const [selectedUserFilter, setSelectedUserFilter] = useState(null);
  const [activeMobileTab, setActiveMobileTab] = useState('calendar'); // 'calendar' | 'timeline' | 'group'

  // Modal States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [prefilledDate, setPrefilledDate] = useState('');

  // Initial Data Fetch
  const reloadData = async () => {
    setUsers(StorageService.getUsers());
    const loadedEvents = await StorageService.getEvents();
    setEvents(loadedEvents);
  };

  useEffect(() => {
    reloadData();
    // Auto prompt login if not logged in
    if (!StorageService.getCurrentUser()) {
      setIsAuthOpen(true);
    }
  }, []);

  // Handlers for Event Management
  const handleOpenAddEvent = (dateStr = '') => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    setEventToEdit(null);
    setPrefilledDate(dateStr);
    setIsEventModalOpen(true);
  };

  const handleSelectEvent = (evt) => {
    setEventToEdit(evt);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (eventData) => {
    await StorageService.saveEvent(eventData);
    await reloadData();
  };

  const handleDeleteEvent = async (eventId) => {
    await StorageService.deleteEvent(eventId);
    await reloadData();
  };

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    reloadData();
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
  };

  const handleDataReset = (resetData) => {
    setUsers(resetData.users);
    setEvents(resetData.events);
    setCurrentUser(resetData.currentUser);
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar 
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onAddEvent={() => handleOpenAddEvent()}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <div className="primary-view-column">
          {/* Mobile view switcher or Desktop layout */}
          {activeMobileTab === 'calendar' && (
            <CalendarGrid 
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              events={events}
              selectedUserFilter={selectedUserFilter}
              onUserFilterChange={setSelectedUserFilter}
              onSelectEvent={handleSelectEvent}
              onDayClick={(dateStr) => handleOpenAddEvent(dateStr)}
              users={users}
            />
          )}

          {activeMobileTab === 'timeline' && (
            <TimelineView 
              currentDate={currentDate}
              events={events}
              users={users}
              onSelectEvent={handleSelectEvent}
            />
          )}

          {/* Desktop Timeline Section always visible below calendar if tab is calendar */}
          {activeMobileTab === 'calendar' && (
            <div className="desktop-timeline-wrapper" style={{ marginTop: '24px' }}>
              <TimelineView 
                currentDate={currentDate}
                events={events}
                users={users}
                onSelectEvent={handleSelectEvent}
              />
            </div>
          )}
        </div>

        {/* Sidebar / Group Overview Column */}
        <div className={`sidebar-column ${activeMobileTab === 'group' ? 'mobile-show' : 'mobile-hide-on-desktop'}`}>
          <GroupOverview 
            users={users}
            events={events}
            currentDate={currentDate}
            onSelectUser={(uId) => setSelectedUserFilter(uId)}
            selectedUserFilter={selectedUserFilter}
          />
        </div>
      </main>

      {/* Mobile Touch Bottom Navigation Bar */}
      <MobileNav 
        activeTab={activeMobileTab}
        setActiveTab={setActiveMobileTab}
        currentUser={currentUser}
        onAddEvent={() => handleOpenAddEvent()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modals */}
      <EventModal 
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        eventToEdit={eventToEdit}
        prefilledDate={prefilledDate}
        currentUser={currentUser}
        users={users}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AdminModal 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentUser={currentUser}
        onDataReset={handleDataReset}
      />
    </div>
  );
}

export default App;
