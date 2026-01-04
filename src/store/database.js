import { defaultData, uid } from '../data/default-data.js';

const LS_KEY = 'verbsDataV1';
const APP_VERSION = '0.1.6';

/**
 * Ensures persisted data matches the current schema and version.
 * Wipes incompatible caches so seeds can load cleanly.
 */
function checkVersion() {
  const storedVersion = localStorage.getItem('appVersion');
  if (storedVersion !== APP_VERSION) {
    localStorage.removeItem(LS_KEY);
    localStorage.setItem('appVersion', APP_VERSION);
    console.log(`Updated to version ${APP_VERSION} - cache reset.`);
  }
}

/**
 * Boots the database: run version check, load (or seed) data, normalize.
 * @returns {{ verbs: Array }}
 */
export function bootDatabase() {
  checkVersion();
  return loadDatabase();
}

/**
 * Reads the verbs database from localStorage, falling back to the seeds.
 * @returns {{ verbs: Array }}
 */
export function loadDatabase() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return normalizeDB(raw ? JSON.parse(raw) : defaultData);
  } catch {
    return normalizeDB(defaultData);
  }
}

/**
 * Persists the current DB snapshot to localStorage.
 * @param {{ verbs: Array }} db
 */
export function saveDatabase(db) {
  localStorage.setItem(LS_KEY, JSON.stringify(db));
}

/**
 * Normalizes an entire DB payload.
 * @param {{ verbs?: Array }} data
 * @returns {{ verbs: Array }}
 */
export function normalizeDB(data = {}) {
  const verbs = Array.isArray(data.verbs) ? data.verbs : [];
  return { verbs: verbs.map(normalizeVerb) };
}

/**
 * Normalizes a single verb entry for consistent downstream use.
 * @param {object} verb
 * @returns {object}
 */
export function normalizeVerb(verb = {}) {
  const verbKnown = !!verb.known;
  const tenses = Array.isArray(verb.tenses)
    ? verb.tenses.map((t) => {
        const forms =
          typeof t.forms === 'object' && t.forms !== null ? { ...t.forms } : {};
        return {
          ...t,
          id: t.id ?? uid(),
          known: t.known !== undefined ? !!t.known : verbKnown,
          forms,
        };
      })
    : [];
  return {
    ...verb,
    id: verb.id ?? uid(),
    known: verbKnown,
    tenses,
  };
}

export { LS_KEY };
