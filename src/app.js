import { bootDatabase, normalizeDB, saveDatabase } from './store/database.js';
import { getFilters, setFilters } from './store/filters.js';
import { createThemeController } from './ui/theme.js';
import { renderSidebar } from './ui/sidebar.js';
import { renderMainView } from './ui/main-view.js';
import { createVerbModal } from './ui/verb-modal.js';

let DB = bootDatabase();
let ACTIVE_VERB_ID = DB.verbs[0]?.id ?? null;

// ---------- DOM Elements ----------
const verbListEl = document.getElementById('verbList');
const mainEl = document.getElementById('main');
const searchEl = document.getElementById('search');
const addVerbBtn = document.getElementById('addVerbBtn');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');

const modalElements = {
  backdrop: document.getElementById('modalBackdrop'),
  title: document.getElementById('modalTitle'),
  infInput: document.getElementById('vInf'),
  enInput: document.getElementById('vEn'),
  tenseContainer: document.getElementById('tenseContainer'),
  addTenseBtn: document.getElementById('addTenseBtn'),
  saveBtn: document.getElementById('saveVerbBtn'),
  closeBtn: document.getElementById('closeModal'),
  deleteBtn: document.getElementById('deleteVerbBtn'),
};

const themeController = createThemeController();
themeController.init();

const verbModal = createVerbModal({
  elements: modalElements,
  onSave: handleVerbSave,
  onDelete: handleVerbDelete,
});

/**
 * Persists the DB and re-renders the UI.
 * @param {string} [sidebarFilter]
 */
function persistAndRefresh(sidebarFilter = searchEl?.value ?? '') {
  saveDatabase(DB);
  renderSidebarView(sidebarFilter);
  renderMainViewSection();
}

/**
 * Handles saving a verb coming from the modal.
 * @param {object} verb
 * @param {boolean} isExisting
 */
function handleVerbSave(verb, isExisting) {
  if (isExisting) {
    const idx = DB.verbs.findIndex((v) => v.id === verb.id);
    if (idx !== -1) {
      DB.verbs[idx] = verb;
    }
  } else {
    DB.verbs.push(verb);
  }
  ACTIVE_VERB_ID = verb.id;
  persistAndRefresh();
}

/**
 * Deletes the selected verb (triggered by the modal).
 * @param {string} verbId
 */
function handleVerbDelete(verbId) {
  DB.verbs = DB.verbs.filter((v) => v.id !== verbId);
  if (ACTIVE_VERB_ID === verbId) {
    ACTIVE_VERB_ID = DB.verbs[0]?.id ?? null;
  }
  persistAndRefresh();
}

/**
 * Opens the modal for a new or existing verb.
 * @param {string|null} verbId
 * @param {string|null} focusTenseId
 */
function openVerbModal(verbId = null, focusTenseId = null) {
  const verb = verbId ? DB.verbs.find((v) => v.id === verbId) ?? null : null;
  verbModal.open({ verb, focusTenseId });
}

/**
 * Renders the sidebar with filtering + selection handlers.
 * @param {string} filter
 */
function renderSidebarView(filter = '') {
  renderSidebar({
    container: verbListEl,
    verbs: DB.verbs,
    activeVerbId: ACTIVE_VERB_ID,
    filterText: filter,
    onSelect: (verbId) => {
      ACTIVE_VERB_ID = verbId;
      renderSidebarView(filter);
      renderMainViewSection();
    },
  });
}

/**
 * Renders the main section (verb detail + deck).
 */
function renderMainViewSection() {
  const verb = DB.verbs.find((v) => v.id === ACTIVE_VERB_ID) ?? null;
  const filters = verb ? getFilters(verb.id) : { mood: 'all', tense: 'all' };
  renderMainView({
    container: mainEl,
    verb,
    filters,
    onFiltersChange: (nextFilters) => {
      if (!verb) return;
      setFilters(verb.id, nextFilters);
      renderMainViewSection();
    },
    onRequestEdit: (verbId) => openVerbModal(verbId),
    onSave: () => saveDatabase(DB),
  });
}

// ---------- Events ----------
addVerbBtn?.addEventListener('click', () => openVerbModal());

searchEl?.addEventListener('input', (event) => {
  renderSidebarView(event.target.value);
});

exportBtn?.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(DB, null, 2)], {
    type: 'application/json',
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'italian-verbs.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
});

importFile?.addEventListener('change', async () => {
  const file = importFile.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!data.verbs) throw new Error('Bad format');
    DB = normalizeDB(data);
    ACTIVE_VERB_ID = DB.verbs[0]?.id ?? null;
    persistAndRefresh();
    alert('Imported.');
  } catch (error) {
    alert('Import failed: ' + error.message);
  } finally {
    importFile.value = '';
  }
});

// ---------- Init ----------
renderSidebarView();
renderMainViewSection();
