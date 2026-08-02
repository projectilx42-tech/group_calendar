import React from 'react';
import { Calendar, BarChart2, Users, Shield, Plus } from 'lucide-react';

export const MobileNav = ({ activeTab, setActiveTab, currentUser, onAddEvent, onOpenAdmin }) => {
  return (
    <nav className="mobile-bottom-nav">
      <button 
        className={`mobile-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
        onClick={() => setActiveTab('calendar')}
      >
        <Calendar size={20} />
        <span>Kalendář</span>
      </button>

      <button 
        className={`mobile-nav-item ${activeTab === 'timeline' ? 'active' : ''}`}
        onClick={() => setActiveTab('timeline')}
      >
        <BarChart2 size={20} />
        <span>Osa</span>
      </button>

      {/* Center Action Button */}
      <button className="mobile-nav-add-btn" onClick={onAddEvent} title="Přidat dovolenou">
        <Plus size={24} />
      </button>

      <button 
        className={`mobile-nav-item ${activeTab === 'group' ? 'active' : ''}`}
        onClick={() => setActiveTab('group')}
      >
        <Users size={20} />
        <span>Přátelé</span>
      </button>

      {currentUser?.role === 'admin' ? (
        <button 
          className="mobile-nav-item"
          onClick={onOpenAdmin}
        >
          <Shield size={20} />
          <span>Admin</span>
        </button>
      ) : null}
    </nav>
  );
};
