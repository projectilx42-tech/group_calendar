import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const EVENT_CATEGORIES = {
  free: { label: 'Mám čas', color: '#3d7a5c', bg: '#e8f3ec', border: '#c9dfd1' },
  busy: { label: 'Nemám čas', color: '#a44b43', bg: '#f9ecea', border: '#efd0cc' },
  maybe: { label: 'Ještě nevím', color: '#9a6b25', bg: '#faf3e4', border: '#ead9b4' },
  trip: { label: 'Mimo město', color: '#506f9d', bg: '#edf2f9', border: '#d3deee' },
};

export const USER_COLORS = ['#2f6fed', '#9d5c3d', '#69774c', '#8059a5', '#23857b', '#b05c71'];

const KEYS = {
  user: 'kdyspolu_device_identity_v1',
  events: 'kdyspolu_events_v1',
};

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};

export class StorageService {
  static getCurrentUser() { return read(KEYS.user, null); }
  static setCurrentUser(user) {
    if (user) localStorage.setItem(KEYS.user, JSON.stringify(user));
    else localStorage.removeItem(KEYS.user);
  }
  static getUsers() {
    const me = this.getCurrentUser();
    const events = read(KEYS.events, []);
    const fromEvents = events.reduce((all, event) => {
      if (event.userId && !all.some(user => user.id === event.userId)) {
        all.push({ id: event.userId, username: event.userName, color: event.userColor });
      }
      return all;
    }, []);
    return me && !fromEvents.some(user => user.id === me.id) ? [me, ...fromEvents] : fromEvents;
  }
  static async getEvents() {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('events').select('*').order('startDate', { ascending: true });
      if (!error && data) return data;
      console.warn('Cloud data could not be loaded, using this device only.', error);
    }
    return read(KEYS.events, []);
  }
  static async saveEvent(event) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('events').upsert(event).select().single();
      if (!error && data) return data;
      if (error) throw new Error('Změnu se nepodařilo uložit do společného kalendáře.');
    }
    const events = read(KEYS.events, []);
    const index = events.findIndex(item => item.id === event.id);
    const updated = index === -1 ? [...events, event] : events.map(item => item.id === event.id ? event : item);
    localStorage.setItem(KEYS.events, JSON.stringify(updated));
    return event;
  }
  static async deleteEvent(id) {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw new Error('Záznam se nepodařilo smazat.');
    }
    localStorage.setItem(KEYS.events, JSON.stringify(read(KEYS.events, []).filter(event => event.id !== id)));
  }
  static createDeviceIdentity(name) {
    const username = name.trim();
    if (username.length < 2) throw new Error('Napiš prosím jméno alespoň ze 2 znaků.');
    const user = {
      id: crypto.randomUUID?.() || `device_${Date.now()}`,
      username,
      color: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)],
    };
    this.setCurrentUser(user);
    return user;
  }
}
