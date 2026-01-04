/**
 * Creates a reusable theme controller that manages dark/light mode.
 * @param {{ toggleSelector?: string, storageKey?: string }} options
 */
export function createThemeController(options = {}) {
  const {
    toggleSelector = '#themeToggle',
    storageKey = 'ishThemePref',
  } = options;

  const prefersDarkQuery = window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

  const syncSystemTheme = (event) => {
    if (localStorage.getItem(storageKey)) return;
    applyTheme(event.matches ? 'dark' : 'light', { persist: false });
  };

  const onDocumentClick = (event) => {
    const toggleBtn = event.target.closest(toggleSelector);
    if (!toggleBtn) return;
    const next = document.documentElement.classList.contains('theme-dark')
      ? 'light'
      : 'dark';
    applyTheme(next);
  };

  function syncThemeToggle(isDark) {
    const btn = document.querySelector(toggleSelector);
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(isDark));
    btn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  }

  function applyTheme(mode, { persist = true } = {}) {
    const isDark = mode === 'dark';
    document.documentElement.classList.toggle('theme-dark', isDark);
    syncThemeToggle(isDark);
    if (persist) {
      localStorage.setItem(storageKey, mode);
    }
  }

  function initFromPreferences() {
    const stored = localStorage.getItem(storageKey);
    if (stored === 'dark' || stored === 'light') {
      applyTheme(stored, { persist: false });
    } else {
      const fallback = prefersDarkQuery?.matches ? 'dark' : 'light';
      applyTheme(fallback, { persist: false });
    }
  }

  function init() {
    document.addEventListener('click', onDocumentClick);
    if (prefersDarkQuery) {
      if (typeof prefersDarkQuery.addEventListener === 'function') {
        prefersDarkQuery.addEventListener('change', syncSystemTheme);
      } else if (typeof prefersDarkQuery.addListener === 'function') {
        prefersDarkQuery.addListener(syncSystemTheme);
      }
    }
    initFromPreferences();
  }

  return { init, applyTheme };
}
