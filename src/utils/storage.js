import { INITIAL_SAMPLE_TICKETS } from '../constants/issueData';

const TICKETS_STORAGE_KEY = 'campus_helpdesk_tickets_v1';
const THEME_STORAGE_KEY = 'campus_helpdesk_theme_v1';

/**
 * Retrieve all tickets from localStorage. If no tickets are found,
 * initialize with sample tickets and persist them.
 */
export function getStoredTickets() {
  try {
    const raw = localStorage.getItem(TICKETS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_TICKETS));
      return INITIAL_SAMPLE_TICKETS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_TICKETS));
      return INITIAL_SAMPLE_TICKETS;
    }
    return parsed;
  } catch (error) {
    console.error('Failed to load tickets from localStorage:', error);
    return INITIAL_SAMPLE_TICKETS;
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
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_TICKETS));
    return INITIAL_SAMPLE_TICKETS;
  } catch (error) {
    console.error('Failed to reset tickets in localStorage:', error);
    return INITIAL_SAMPLE_TICKETS;
  }
}

/**
 * Generate a unique, readable Ticket ID (e.g. TKT-2026-8492)
 */
export function generateTicketId() {
  const currentYear = new Date().getFullYear();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `TKT-${currentYear}-${randomPart}`;
}

/**
 * Load saved theme preference ('light' | 'dark' | 'system')
 */
export function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
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

