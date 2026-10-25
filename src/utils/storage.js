import { INITIAL_SAMPLE_TICKETS } from '../constants/issueData';

const TICKETS_STORAGE_KEY = 'campus_helpdesk_tickets_v1';
const THEME_STORAGE_KEY = 'campus_helpdesk_theme_v1';

/**
 * Return a deep clone of the initial sample tickets to prevent
 * in-memory mutation of module constants.
 */
function getInitialSampleTickets() {
  return JSON.parse(JSON.stringify(INITIAL_SAMPLE_TICKETS));
}

/**
 * Retrieve all tickets from localStorage. If no entry exists in storage,
 * initialize with sample tickets and persist them.
 */
export function getStoredTickets() {
  try {
    const raw = localStorage.getItem(TICKETS_STORAGE_KEY);
    if (raw === null) {
      const initial = getInitialSampleTickets();
      localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      const initial = getInitialSampleTickets();
      localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch (error) {
    console.error('Failed to load tickets from localStorage:', error);
    return getInitialSampleTickets();
  }
}

/**
 * Save tickets to localStorage
 */
export function saveTicketsToStorage(tickets) {
  try {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
    return true;
  } catch (error) {
    console.error('Failed to save tickets to localStorage:', error);
    return false;
  }
}

/**
 * Reset tickets back to initial realistic sample data
 */
export function resetTicketsStorage() {
  try {
    const initial = getInitialSampleTickets();
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch (error) {
    console.error('Failed to reset tickets in localStorage:', error);
    return getInitialSampleTickets();
  }
}

/**
 * Generate a unique, readable Ticket ID (e.g. TKT-2026-8492)
 */
export function generateTicketId(existingTickets = []) {
  const currentYear = new Date().getFullYear();
  const existingIds = new Set(
    Array.isArray(existingTickets) && existingTickets.length > 0
      ? existingTickets.map((t) => t?.id)
      : []
  );

  // If existingTickets was not passed or empty, check localStorage
  if (existingIds.size === 0) {
    try {
      const raw = localStorage.getItem(TICKETS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((t) => t?.id && existingIds.add(t.id));
        }
      }
    } catch {
      // Ignore storage read error during ID check
    }
  }

  let newId;
  let attempts = 0;
  do {
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    newId = `TKT-${currentYear}-${randomPart}`;
    attempts++;
  } while (existingIds.has(newId) && attempts < 100);

  return newId;
}

/**
 * Load saved theme preference ('light' | 'dark' | 'system')
 */
export function getSavedTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    // Check system OS dark mode preference for first-time visitors
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

/**
 * Save theme preference
 */
export function saveSavedTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme preference:', error);
  }
}

