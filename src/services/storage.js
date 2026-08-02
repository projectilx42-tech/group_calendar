import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Categorization presets with colors and icons
export const EVENT_CATEGORIES = {
  vacation: { label: 'Dovolená', emoji: '🏖️', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: '#d97706' },
  chata: { label: 'Chata / Víkend', emoji: '🏡', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: '#059669' },
  festival: { label: 'Festival / Akce', emoji: '🎪', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)', border: '#db2777' },
  trip: { label: 'Výlet / Cestování', emoji: '🚀', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', border: '#2563eb' },
  work: { label: 'Práce / Služebka', emoji: '💼', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.15)', border: '#4b5563' },
  free: { label: 'Volný den', emoji: '☀️', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', border: '#7c3aed' },
};

// Preset user colors for vibrant visual differentiation
export const USER_COLORS = [
  '#f59e0b', '#10b981', '#ec4899', '#3b82f6', 
  '#8b5cf6', '#06b6d4', '#f97316', '#a855f7'
];

// Initial demo users
const INITIAL_USERS = [
  { id: 'u_admin', username: 'Admin', role: 'admin', color: '#ec4899', passwordHash: 'admin123' },
  { id: 'u_kuba', username: 'Kuba', role: 'user', color: '#3b82f6', passwordHash: 'kuba123' },
  { id: 'u_anet', username: 'Anet', role: 'user', color: '#10b981', passwordHash: 'anet123' },
  { id: 'u_pavel', username: 'Pavel', role: 'user', color: '#f59e0b', passwordHash: 'pavel123' },
  { id: 'u_terka', username: 'Terka', role: 'user', color: '#8b5cf6', passwordHash: 'terka123' },
];

// Initial demo events for August 2026
const INITIAL_EVENTS = [
  {
    id: 'e1',
    userId: 'u_kuba',
    userName: 'Kuba',
    userColor: '#3b82f6',
    title: 'Chorvatsko - Makarska',
    startDate: '2026-08-05',
    endDate: '2026-08-14',
    category: 'vacation',
    notes: 'Jedeme autem z Brna! 🚗'
  },
  {
    id: 'e2',
    userId: 'u_anet',
    userName: 'Anet',
    userColor: '#10b981',
    title: 'Letní Festival',
    startDate: '2026-08-14',
    endDate: '2026-08-16',
    category: 'festival',
    notes: 'Kempování s partou'
  },
  {
    id: 'e3',
    userId: 'u_pavel',
    userName: 'Pavel',
    userColor: '#f59e0b',
    title: 'Víkend na Chatě',
    startDate: '2026-08-21',
    endDate: '2026-08-23',
    category: 'chata',
    notes: 'Grilovačka u jezera 🥩🍻'
  },
  {
    id: 'e4',
    userId: 'u_terka',
    userName: 'Terka',
    userColor: '#8b5cf6',
    title: 'Tatry Turistika',
    startDate: '2026-08-24',
    endDate: '2026-08-29',
    category: 'trip',
    notes: 'Výstup na Rysy'
  }
];

// Helper Keys for LocalStorage
const STORAGE_KEYS = {
  USERS: 'group_cal_users_v1',
  EVENTS: 'group_cal_events_v1',
  CURRENT_USER: 'group_cal_current_user_v1'
};

export class StorageService {
  // Load users from storage
  static getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
        return INITIAL_USERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_USERS;
    }
  }

  // Save users to storage
  static saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // Load events from storage
  static async getEvents() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('events').select('*').order('startDate', { ascending: true });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase fetch failed, using fallback storage:', err);
      }
    }

    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
        return INITIAL_EVENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_EVENTS;
    }
  }

  // Save/Update event
  static async saveEvent(event) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('events').upsert([event]).select();
        if (!error && data) return data[0];
      } catch (err) {
        console.warn('Supabase save failed:', err);
      }
    }

    const events = await this.getEvents();
    const existingIndex = events.findIndex(e => e.id === event.id);
    let updatedEvents;

    if (existingIndex >= 0) {
      updatedEvents = [...events];
      updatedEvents[existingIndex] = event;
    } else {
      updatedEvents = [...events, event];
    }

    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updatedEvents));
    return event;
  }

  // Delete event
  static async deleteEvent(eventId) {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('events').delete().eq('id', eventId);
      } catch (err) {
        console.warn('Supabase delete failed:', err);
      }
    }

    const events = await this.getEvents();
    const updatedEvents = events.filter(e => e.id !== eventId);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updatedEvents));
  }

  // Get logged in user
  static getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  // Set logged in user
  static setCurrentUser(user) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  // User Auth - Login
  static login(username, password) {
    const users = this.getUsers();
    const cleanName = username.trim().toLowerCase();
    const user = users.find(u => u.username.toLowerCase() === cleanName);

    if (!user) {
      throw new Error('Uživatel s tímto jménem neexistuje.');
    }

    if (user.passwordHash !== password) {
      throw new Error('Nespravné heslo.');
    }

    // Save session
    const sessionUser = { id: user.id, username: user.username, role: user.role, color: user.color };
    this.setCurrentUser(sessionUser);
    return sessionUser;
  }

  // User Auth - Register
  static register(username, password) {
    const users = this.getUsers();
    const cleanName = username.trim();

    if (!cleanName || cleanName.length < 2) {
      throw new Error('Jméno musí mít alespoň 2 znaky.');
    }

    if (!password || password.length < 3) {
      throw new Error('Heslo musí mít alespoň 3 znaky.');
    }

    if (users.some(u => u.username.toLowerCase() === cleanName.toLowerCase())) {
      throw new Error('Uživatel s tímto jménem již existuje.');
    }

    // Assign random user color
    const userColor = USER_COLORS[users.length % USER_COLORS.length];

    const newUser = {
      id: `u_${Date.now()}`,
      username: cleanName,
      role: 'user',
      color: userColor,
      passwordHash: password
    };

    const updatedUsers = [...users, newUser];
    this.saveUsers(updatedUsers);

    const sessionUser = { id: newUser.id, username: newUser.username, role: newUser.role, color: newUser.color };
    this.setCurrentUser(sessionUser);
    return sessionUser;
  }

  // Admin - Reset user password
  static adminResetPassword(adminUserId, targetUserId, newPassword) {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Pouze administrátor může resetovat hesla.');
    }

    const users = this.getUsers();
    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) {
      throw new Error('Uživatel nenalezen.');
    }

    targetUser.passwordHash = newPassword;
    this.saveUsers(users);
    return true;
  }

  // Admin - Reset all data back to demo
  static resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    const admin = INITIAL_USERS[0];
    const sessionUser = { id: admin.id, username: admin.username, role: admin.role, color: admin.color };
    this.setCurrentUser(sessionUser);
    return { users: INITIAL_USERS, events: INITIAL_EVENTS, currentUser: sessionUser };
  }
}
