import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const EVENT_CATEGORIES = {
  free: { label: 'Mám čas', color: '#3d7a5c', bg: '#e8f3ec', border: '#c9dfd1' },
  busy: { label: 'Nemám čas', color: '#a44b43', bg: '#f9ecea', border: '#efd0cc' },
  maybe: { label: 'Ještě nevím', color: '#9a6b25', bg: '#faf3e4', border: '#ead9b4' },
  trip: { label: 'Mimo město', color: '#506f9d', bg: '#edf2f9', border: '#d3deee' },
};

export const USER_COLORS = ['#2f6fed', '#9d5c3d', '#69774c', '#8059a5', '#23857b', '#b05c71'];

const KEYS = {
  users: 'kdyspolu_users_v3',
  session: 'kdyspolu_session_v3',
  events: 'kdyspolu_events_v1',
};

const read = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch { return fallback; }
};
const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// --- SHA-256 hashování hesel (Web Crypto API) ---
const hashPassword = async (password) => {
  try {
    const data = new TextEncoder().encode('kdyspolu:' + password);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    const data = 'kdyspolu:' + password;
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < data.length; i++) {
      const ch = data.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
  }
};

// Deterministic ID z uživatelského jména – stejný účet má vždy stejné ID
// (na rozdíl od původního randomUUID, který vytvářel duplicity)
const deriveId = async (username) => {
  const normalized = username.trim().toLowerCase().replace(/\s+/g, '_');
  try {
    const data = new TextEncoder().encode('kdyspolu_user:' + normalized);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return 'u-' + Array.from(new Uint8Array(digest)).slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    let hash = 5381;
    const data = 'kdyspolu_user:' + normalized;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) + hash) ^ data.charCodeAt(i);
    }
    return 'u-' + (hash >>> 0).toString(16);
  }
};

const normalizeUsername = (name) => name.trim().replace(/\s+/g, ' ');

export class StorageService {
  static getCurrentUser() { return read(KEYS.session, null); }

  /** Přihlášení jménem a heslem. Vrací uživatele nebo vyhodí chybu. */
  static async login(username, password) {
    const name = normalizeUsername(username);
    if (name.length < 2) throw new Error('Napiš prosím jméno alespoň ze 2 znaků.');
    const users = read(KEYS.users, []);
    const user = users.find(item => item.username.toLowerCase() === name.toLowerCase());
    if (!user) throw new Error('Tento účet neexistuje. Zkontroluj jméno, nebo se zaregistruj.');
    const hash = await hashPassword(password);
    if (user.passwordHash !== hash) throw new Error('Nesprávné heslo. Zkus to znovu.');
    const session = { id: user.id, username: user.username, color: user.color, isAdmin: user.isAdmin };
    write(KEYS.session, session);
    return session;
  }

  /** Registrace nového účtu (heslo min. 4 znaky). */
  static async register(username, password) {
    const name = normalizeUsername(username);
    if (name.length < 2) throw new Error('Napiš prosím jméno alespoň ze 2 znaků.');
    if (password.length < 4) throw new Error('Heslo musí mít alespoň 4 znaky.');
    const users = read(KEYS.users, []);
    if (users.some(item => item.username.toLowerCase() === name.toLowerCase())) {
      throw new Error('Účet s tímto jménem už existuje. Přihlas se, nebo zvol jiné jméno.');
    }
    const user = {
      id: await deriveId(name),
      username: name,
      passwordHash: await hashPassword(password),
      color: USER_COLORS[users.length % USER_COLORS.length],
      isAdmin: false,
      createdAt: new Date().toISOString(),
    };
    write(KEYS.users, [...users, user]);
    const session = { id: user.id, username: user.username, color: user.color, isAdmin: false };
    write(KEYS.session, session);
    return session;
  }

  /** Odhlášení – smaže session, ale uchová účet. */
  static logout() {
    localStorage.removeItem(KEYS.session);
  }

  /** Změna hesla uživatele (admin funkce). */
  static async resetPassword(username, newPassword) {
    if (!newPassword || newPassword.length < 4) throw new Error('Heslo musí mít alespoň 4 znaky.');
    const users = read(KEYS.users, []);
    const index = users.findIndex(item => item.username.toLowerCase() === normalizeUsername(username).toLowerCase());
    if (index === -1) throw new Error('Uživatel nebyl nalezen.');
    const updated = [...users];
    updated[index] = { ...updated[index], passwordHash: await hashPassword(newPassword) };
    write(KEYS.users, updated);
  }

  /** Smazání uživatele a jeho událostí (admin funkce). */
  static async deleteUser(id) {
    const users = read(KEYS.users, []);
    const user = users.find(item => item.id === id);
    if (!user) throw new Error('Uživatel nebyl nalezen.');
    if (user.isAdmin) throw new Error('Admin účet nelze smazat.');
    write(KEYS.users, users.filter(item => item.id !== id));
    // Smažeme i jeho události
    const events = read(KEYS.events, []);
    write(KEYS.events, events.filter(item => item.userId !== id));
    // Pokud byl přihlášený, odhlásíme ho
    const session = read(KEYS.session, null);
    if (session?.id === id) localStorage.removeItem(KEYS.session);
  }

  /** Seznam všech uživatelů (bez hesel). */
  static getUsers() {
    const users = read(KEYS.users, []);
    return users.map(({ id, username, color, isAdmin }) => ({ id, username, color, isAdmin }));
  }

  /** Aktuální uživatel, pokud je přihlášen. */
  static getCurrentUserWithAdmin() {
    return read(KEYS.session, null);
  }

  // --- Události ---

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
    write(KEYS.events, updated);
    return event;
  }

  static async deleteEvent(id) {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw new Error('Záznam se nepodařilo smazat.');
    }
    write(KEYS.events, read(KEYS.events, []).filter(event => event.id !== id));
  }
}
