const FILTER_PREFIX = 'filters_';

/**
 * Reads persisted filters for a verb or returns sensible defaults.
 * @param {string} verbId
 * @returns {{ mood: string, tense: string }}
 */
export function getFilters(verbId) {
  try {
    return (
      JSON.parse(localStorage.getItem(`${FILTER_PREFIX}${verbId}`)) || {
        mood: 'all',
        tense: 'all',
      }
    );
  } catch {
    return { mood: 'all', tense: 'all' };
  }
}

/**
 * Persists filters for a verb so the deck can restore its state.
 * @param {string} verbId
 * @param {{ mood: string, tense: string }} filters
 */
export function setFilters(verbId, filters) {
  localStorage.setItem(`${FILTER_PREFIX}${verbId}`, JSON.stringify(filters));
}
