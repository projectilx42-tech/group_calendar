import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Refined, subtle category color system (sleek & minimalist)
export const EVENT_CATEGORIES = {
  vacation: { label: 'Dovolená', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.3)' },
  chata: { label: 'Chata / Víkend', color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)', border: 'rgba(52, 211, 153, 0.3)' },
  festival: { label: 'Festival / Akce', color: '#f472b6', bg: 'rgba(244, 114, 182, 0.12)', border: 'rgba(244, 114, 182, 0.3)' },
  trip: { label: 'Výlet', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)', border: 'rgba(251, 191, 36, 0.3)' },
  work: { label: 'Práce', color: '#9ca3af', bg: 'rgba(156, 163, 175, 0.12)', border: 'rgba(156, 163, 175, 0.3)' },
  free: { label: 'Volno', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.12)', border: 'rgba(167, 139, 250, 0.3)' },
};

export const USER_COLORS = [
  '#38bdf8', '#34d399', '#f472b6', '#fbbf24', 
  '#a78bfa', '#fb7185', '#818cf8', '#2dd4bf'
];

// Clean initial state without fake sample data
const INITIAL_USERS = [];
const INITIAL_EVENTS = [];

const STORAGE_KEYS = {
  USERS: 'group_cal_users_v2',
  EVENTS: 'group_cal_events_v2',
  CURRENT_USER: 'group_cal_current_user_v2'
};

export class StorageService {
  static getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  }

  static saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static async getEvents() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('events').select('*').order('startDate', { ascending: true });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase fetch failed:', err);
      }
    }

    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return data ? JSON.parse(data) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  }

  static async saveEvent(event) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('events').upsert([event]).select();
        if (!error && data) return data[0];
      } catch (err) {
        console.warn('Supabase save error:', err);
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

  static async deleteEvent(eventId) {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('events').delete().eq('id', eventId);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }

    const events = await this.getEvents();
    const updatedEvents = events.filter(e => e.id !== eventId);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updatedEvents));
  }

  static getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static setCurrentUser(user) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  static login(username, password) {
    const users = this.getUsers();
    const cleanName = username.trim().toLowerCase();
    const user = users.find(u => u.username.toLowerCase() === cleanName);

    if (!user) {
      throw new Error('Uživatel s tímto jménem neexistuje. Založte si nový účet.');
    }

    if (user.passwordHash !== password) {
      throw new Error('Nesprávné heslo.');
    }

    const sessionUser = { id: user.id, username: user.username, role: user.role, color: user.color };
    this.setCurrentUser(sessionUser);
    return sessionUser;
  }

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

    const isFirstUser = users.length === 0;
    const userColor = USER_COLORS[users.length % USER_COLORS.length];

    const newUser = {
      id: `u_${Date.now()}`,
      username: cleanName,
      role: isFirstUser ? 'admin' : 'user', // First registered user is Admin automatically!
      color: userColor,
      passwordHash: password
    };

    const updatedUsers = [...users, newUser];
    this.saveUsers(updatedUsers);

    const sessionUser = { id: newUser.id, username: newUser.username, role: newUser.role, color: newUser.color };
    this.setCurrentUser(sessionUser);
    return sessionUser;
  }

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
}
