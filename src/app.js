// ---------- Data Layer ----------
const LS_KEY = 'verbsDataV1';
/** shape: { verbs: [{ id, inf, en, tenses: [{ id, mood, tense, forms: {io, tu, lui_lei, noi, voi, loro}}]}] } */

const defaultData = {
    verbs: [
        seedVerb('Essere', 'to be', [
            seedTense('indicativo', 'presente', { io: 'sono', tu: 'sei', 'lui_lei': 'è', noi: 'siamo', voi: 'siete', loro: 'sono' }),
            seedTense('indicativo', 'imperfetto', { io: 'ero', tu: 'eri', 'lui_lei': 'era', noi: 'eravamo', voi: 'eravate', loro: 'erano' }),
            seedTense('indicativo', 'futuro semplice', { io: 'sarò', tu: 'sarai', 'lui_lei': 'sarà', noi: 'saremo', voi: 'sarete', loro: 'saranno' })
        ]),
        seedVerb('Avere', 'to have', [
            seedTense('indicativo', 'presente', { io: 'ho', tu: 'hai', 'lui_lei': 'ha', noi: 'abbiamo', voi: 'avete', loro: 'hanno' }),
            seedTense('indicativo', 'imperfetto', { io: 'avevo', tu: 'avevi', 'lui_lei': 'aveva', noi: 'avevamo', voi: 'avevate', loro: 'avevano' }),
            seedTense('indicativo', 'futuro semplice', { io: 'avrò', tu: 'avrai', 'lui_lei': 'avrà', noi: 'avremo', voi: 'avrete', loro: 'avranno' })
        ]),
        seedVerb('Andare', 'to go', [
            seedTense('indicativo', 'presente', { io: 'vado', tu: 'vai', 'lui_lei': 'va', noi: 'andiamo', voi: 'andate', loro: 'vanno' }),
            seedTense('indicativo', 'imperfetto', { io: 'andavo', tu: 'andavi', 'lui_lei': 'andava', noi: 'andavamo', voi: 'andavate', loro: 'andavano' }),
            seedTense('indicativo', 'futuro semplice', { io: 'andrò', tu: 'andrai', 'lui_lei': 'andrà', noi: 'andremo', voi: 'andrete', loro: 'andranno' })
        ])
    ]
};

function seedVerb(inf, en, tenses) { return { id: uid(), inf, en, tenses }; }
function seedTense(mood, tense, forms) { return { id: uid(), mood, tense, forms }; }
function uid() { return Math.random().toString(36).slice(2, 10); }

// ---------------- Version check ----------------
const APP_VERSION = "0.0.1"; // bump this when you push new seeds

function checkVersion() {
  const storedVersion = localStorage.getItem('appVersion');
  if (storedVersion !== APP_VERSION) {
    localStorage.removeItem(LS_KEY); // wipe outdated data
    localStorage.setItem('appVersion', APP_VERSION);
    console.log(`Updated to version ${APP_VERSION} — cache reset.`);
  }
}

checkVersion();
// ------------------------------------------------


function load() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : defaultData;
    } catch { return defaultData; }
}
function save(db) { localStorage.setItem(LS_KEY, JSON.stringify(db)); }

let DB = load();
let ACTIVE_VERB_ID = DB.verbs[0]?.id ?? null;

// ---------- UI Elements ----------
const verbListEl = document.getElementById('verbList');
const mainEl = document.getElementById('main');
const searchEl = document.getElementById('search');

const modalBackdrop = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle');
const vInfInput = document.getElementById('vInf');
const vEnInput = document.getElementById('vEn');
const tenseContainer = document.getElementById('tenseContainer');
const addVerbBtn = document.getElementById('addVerbBtn');
const addTenseBtn = document.getElementById('addTenseBtn');
const saveVerbBtn = document.getElementById('saveVerbBtn');
const closeModalBtn = document.getElementById('closeModal');
const deleteVerbBtn = document.getElementById('deleteVerbBtn');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');

// ---------- Render Functions ----------
function renderSidebar(filter = '') {
    const q = filter.trim().toLowerCase();
    const verbs = DB.verbs
        .slice()
        .sort((a, b) => a.inf.localeCompare(b.inf, 'it'))
        .filter(v => v.inf.toLowerCase().includes(q) || v.en.toLowerCase().includes(q));

    verbListEl.innerHTML = verbs.map(v => `
    <div class="verb-item ${v.id === ACTIVE_VERB_ID ? 'active' : ''}" data-id="${v.id}">
    <div><b>${v.inf}</b><br><small>${v.en}</small></div>
    <small>${v.tenses.length} ${v.tenses.length === 1 ? 'tense' : 'tenses'}</small>
    </div>
`).join('') || '<div class="muted">No verbs yet. Add one →</div>';

    // click handlers
    verbListEl.querySelectorAll('.verb-item').forEach(el => {
        el.addEventListener('click', () => {
            ACTIVE_VERB_ID = el.dataset.id;
            renderSidebar(q);
            renderMain();
        });
    });
}

function renderMain() {
    const verb = DB.verbs.find(v => v.id === ACTIVE_VERB_ID);
    if (!verb) {
        mainEl.innerHTML = '<div class="empty">Pick a verb or add a new one.</div>';
        return;
    }

    const deck = verb.tenses.map(t => cardHTML(t)).join('');
    mainEl.innerHTML = `
    <div class="title-row">
    <h2>${verb.inf}</h2>
    <span class="muted">(${verb.en})</span>
    <div class="grow"></div>
    <button class="btn small" data-edit-verb="${verb.id}">Edit</button>
    </div>
    <div class="deck">${deck}</div>
`;

    // Attach edit buttons on cards
    mainEl.querySelectorAll('[data-edit-tense]').forEach(btn => {
        btn.addEventListener('click', () => {
            openVerbModal(verb.id, btn.getAttribute('data-edit-tense'));
        });
    });
    // Edit verb (full modal)
    mainEl.querySelector('[data-edit-verb]')?.addEventListener('click', () => {
        openVerbModal(verb.id);
    });
}

function cardHTML(t) {
    const label = `${cap(t.mood)} · ${cap(t.tense)}`;
    const F = t.forms || {};
    return `
    <div class="card">
    <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:6px;">
        <h3><span class="badge">${label}</span></h3>
        <button class="btn small" data-edit-tense="${t.id}">Edit</button>
    </div>
    <table>
        <thead><tr><th>Pronoun</th><th>Form</th></tr></thead>
        <tbody>
        ${row('io', F.io || '')}
        ${row('tu', F.tu || '')}
        ${row('lui/lei', F.lui_lei || '')}
        ${row('noi', F.noi || '')}
        ${row('voi', F.voi || '')}
        ${row('loro', F.loro || '')}
        </tbody>
    </table>
    </div>
`;
}
function row(p, f) { return `<tr><td>${p}</td><td>${f}</td></tr>`; }
function cap(s) { return (s || '').replace(/^\w/, c => c.toUpperCase()); }

// ---------- Modal (Add/Edit) ----------
let EDIT_VERB_ID = null; // null = new
function openVerbModal(verbId = null, focusTenseId = null) {
    EDIT_VERB_ID = verbId;
    tenseContainer.innerHTML = '';
    deleteVerbBtn.style.display = verbId ? '' : 'none';

    if (verbId) {
        modalTitle.textContent = 'Edit Verb';
        const v = DB.verbs.find(x => x.id === verbId);
        vInfInput.value = v.inf;
        vEnInput.value = v.en;
        v.tenses.forEach(t => addTenseUI(t));
    } else {
        modalTitle.textContent = 'Add Verb';
        vInfInput.value = '';
        vEnInput.value = '';
        // start with one prefilled tense: indicativo/presente
        addTenseUI(seedTense('indicativo', 'presente', { io: '', tu: '', 'lui_lei': '', noi: '', voi: '', loro: '' }));
    }

    modalBackdrop.style.display = 'flex';
    if (focusTenseId) {
        // scroll to specific tense block
        setTimeout(() => {
            const box = tenseContainer.querySelector(`[data-tense-id="${focusTenseId}"]`);
            box?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 0);
    }
}
function closeVerbModal() {
    modalBackdrop.style.display = 'none';
    EDIT_VERB_ID = null;
}

function addTenseUI(t) {
    const id = t.id || uid();
    const box = document.createElement('div');
    box.className = 'tense-box';
    box.setAttribute('data-tense-id', id);
    box.innerHTML = `
    <div class="row">
    <div>
        <label>Mood</label>
        <select class="mood">
        ${['indicativo', 'congiuntivo', 'condizionale', 'imperativo', 'infinito', 'gerundio', 'participio']
            .map(m => `<option ${m === t.mood ? 'selected' : ''}>${m}</option>`).join('')}
        </select>
    </div>
    <div>
        <label>Tense</label>
        <input class="tense" placeholder="presente / passato prossimo / imperfetto …" value="${t.tense || ''}" />
    </div>
    </div>
    <div class="tense-grid">
    ${inputRow('io', t.forms?.io || '')}
    ${inputRow('tu', t.forms?.tu || '')}
    ${inputRow('lui_lei', t.forms?.lui_lei || '')}
    ${inputRow('noi', t.forms?.noi || '')}
    ${inputRow('voi', t.forms?.voi || '')}
    ${inputRow('loro', t.forms?.loro || '')}
    </div>
    <div class="right" style="margin-top:8px;">
    <button class="btn small danger" data-remove-tense>Remove tense</button>
    </div>
`;
    tenseContainer.appendChild(box);
    box.querySelector('[data-remove-tense]').addEventListener('click', () => {
        box.remove();
    });
}
function inputRow(label, val) {
    const pretty = label === 'lui_lei' ? 'lui/lei' : label;
    return `
    <div>
    <label>${pretty}</label>
    <input data-pronoun="${label}" value="${escapeHTML(val)}" />
    </div>
`;
}
function escapeHTML(s) { return (s ?? '').toString().replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }

// ---------- Events ----------
addVerbBtn.addEventListener('click', () => openVerbModal());
addTenseBtn.addEventListener('click', () => {
    addTenseUI(seedTense('indicativo', 'presente', { io: '', tu: '', 'lui_lei': '', noi: '', voi: '', loro: '' }));
});
closeModalBtn.addEventListener('click', closeVerbModal);
modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeVerbModal(); });

saveVerbBtn.addEventListener('click', () => {
    const inf = vInfInput.value.trim();
    const en = vEnInput.value.trim();
    if (!inf) { alert('Infinitive is required.'); return; }

    // Gather tenses from UI
    const tenses = [...tenseContainer.querySelectorAll('.tense-box')].map(box => {
        const mood = box.querySelector('.mood').value.trim();
        const tense = box.querySelector('.tense').value.trim();
        const inputs = box.querySelectorAll('input[data-pronoun]');
        const forms = {};
        inputs.forEach(i => forms[i.getAttribute('data-pronoun')] = i.value.trim());
        return { id: box.getAttribute('data-tense-id') || uid(), mood, tense, forms };
    }).filter(t => t.tense); // keep only tenses with a name

    if (EDIT_VERB_ID) {
        // update existing
        const v = DB.verbs.find(x => x.id === EDIT_VERB_ID);
        v.inf = inf; v.en = en; v.tenses = tenses;
        ACTIVE_VERB_ID = v.id;
    } else {
        const v = { id: uid(), inf, en, tenses };
        DB.verbs.push(v);
        ACTIVE_VERB_ID = v.id;
    }
    save(DB);
    renderSidebar(searchEl.value);
    renderMain();
    closeVerbModal();
});

deleteVerbBtn.addEventListener('click', () => {
    if (!EDIT_VERB_ID) return;
    const v = DB.verbs.find(x => x.id === EDIT_VERB_ID);
    if (confirm(`Delete "${v.inf}"? This cannot be undone.`)) {
        DB.verbs = DB.verbs.filter(x => x.id !== EDIT_VERB_ID);
        if (ACTIVE_VERB_ID === EDIT_VERB_ID) { ACTIVE_VERB_ID = DB.verbs[0]?.id ?? null; }
        save(DB);
        renderSidebar(searchEl.value);
        renderMain();
        closeVerbModal();
    }
});

searchEl.addEventListener('input', () => renderSidebar(searchEl.value));

exportBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(DB, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'italian-verbs.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
});

importFile.addEventListener('change', async () => {
    const file = importFile.files[0];
    if (!file) return;
    try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!data.verbs) throw new Error('Bad format');
        DB = data;
        save(DB);
        ACTIVE_VERB_ID = DB.verbs[0]?.id ?? null;
        renderSidebar();
        renderMain();
        alert('Imported.');
    } catch (e) {
        alert('Import failed: ' + e.message);
    } finally {
        importFile.value = '';
    }
});

// ---------- Init ----------
renderSidebar();
renderMain();