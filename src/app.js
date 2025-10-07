import { defaultData, seedTense, uid } from './data/default-data.js';

// ---------- Data Layer ----------
const LS_KEY = 'verbsDataV1';
/** shape: { verbs: [{ id, inf, en, tenses: [{ id, mood, tense, known, forms: {io, tu, lui_lei, noi, voi, loro}}]}] } */

function normalizeVerb(verb = {}) {
  const verbKnown = !!verb.known;
  const tenses = Array.isArray(verb.tenses)
    ? verb.tenses.map(t => {
      const forms = typeof t.forms === 'object' && t.forms !== null ? { ...t.forms } : {};
      return {
        ...t,
        id: t.id ?? uid(),
        known: t.known !== undefined ? !!t.known : verbKnown,
        forms
      };
    })
    : [];
  return {
    ...verb,
    id: verb.id ?? uid(),
    known: verbKnown,
    tenses
  };
}

function normalizeDB(data = {}) {
  const verbs = Array.isArray(data.verbs) ? data.verbs : [];
  return { verbs: verbs.map(normalizeVerb) };
}

// ---- Mood → Tense map ----
const TENSES = {
  indicativo: [
    "presente", "imperfetto", "passato prossimo", "trapassato prossimo",
    "passato remoto", "trapassato remoto", "futuro semplice", "futuro anteriore"
  ],
  congiuntivo: ["presente", "imperfetto", "passato", "trapassato"],
  condizionale: ["presente", "passato"],
  imperativo: ["presente"],
  infinito: ["presente", "passato"],
  gerundio: ["presente", "passato"],
  participio: ["presente", "passato"]
};

// renders the <select> options for the chosen mood
function renderTenseOptions(selectEl, mood, currentValue = "") {
  const options = (TENSES[mood] || []).slice();
  if (currentValue && !options.includes(currentValue)) options.unshift(currentValue);
  selectEl.innerHTML = options.map(
    t => `<option ${t === currentValue ? 'selected' : ''}>${t}</option>`
  ).join('');
}

// ---------------- Version check ----------------
const APP_VERSION = "0.1.2"; // bump this when you push new seeds

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
        return normalizeDB(raw ? JSON.parse(raw) : defaultData);
    } catch { return normalizeDB(defaultData); }
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

// ---- Filters (persisted per verb) ----
function getFilters(verbId){
  try { return JSON.parse(localStorage.getItem(`filters_${verbId}`)) || {mood:'all', tense:'all'}; }
  catch { return {mood:'all', tense:'all'}; }
}
function setFilters(verbId, f){
  localStorage.setItem(`filters_${verbId}`, JSON.stringify(f));
}

function renderMain(){
  const verb = DB.verbs.find(v=>v.id===ACTIVE_VERB_ID);
  if(!verb){
    mainEl.innerHTML = '<div class="empty">Pick a verb or add a new one.</div>';
    return;
  }


  // --- Mood/Tense filter state ---
  let filters = getFilters(verb.id);
  // Get all unique moods in this verb
  const moods = [...new Set(verb.tenses.map(t => t.mood))];
  // Get tenses for selected mood
  const tensesForMood = filters.mood && filters.mood !== 'all'
    ? verb.tenses.filter(t => t.mood === filters.mood).map(t => t.tense)
    : [];

  // Filter deck by mood/tense
  let deck = verb.tenses.filter(t => {
    if (filters.mood && filters.mood !== 'all' && t.mood !== filters.mood) return false;
    if (filters.tense && filters.tense !== 'all' && t.tense !== filters.tense) return false;
    return true;
  });

  if (deck.length === 0) {
    mainEl.innerHTML = `
      <div class="title-row">
        <h2>${verb.inf}</h2><span class="muted">(${verb.en})</span>
        <div class="grow"></div>
        <button class="btn small" data-edit-verb="${verb.id}">Edit</button>
      </div>
      <div class="empty">No tenses yet. Click <b>Edit</b> → <i>+ Add Tense</i>.</div>`;
    mainEl.querySelector('[data-edit-verb]')?.addEventListener('click', ()=> openVerbModal(verb.id));
    return;
  }


  mainEl.innerHTML = `
    <div class="title-row">
      <h2>${verb.inf}</h2><span class="muted">(${verb.en})</span>
      <div class="grow"></div>
      <button class="btn small" data-shuffle>Shuffle</button>
      <button class="btn small" data-edit-verb="${verb.id}">Edit</button>
    </div>
    <div class="filter-row" style="display:flex;gap:10px;margin:12px 0;align-items:center;flex-wrap:wrap;">
      <label style="font-size:.95em;">Mood:
        <select id="moodSelect" style="font-size:1.1em;padding:6px 12px;border-radius:8px;">
          <option value="all">All</option>
          ${moods.map(m=>`<option value="${m}" ${filters.mood===m?'selected':''}>${m.charAt(0).toUpperCase()+m.slice(1)}</option>`).join('')}
        </select>
      </label>
      <label style="font-size:.95em;">Tense:
        <select id="tenseSelect" style="font-size:1.1em;padding:6px 12px;border-radius:8px;">
          <option value="all">All</option>
          ${tensesForMood.map(t=>`<option value="${t}" ${filters.tense===t?'selected':''}>${t.charAt(0).toUpperCase()+t.slice(1)}</option>`).join('')}
        </select>
      </label>
    </div>
    <div class="deck" id="flashDeck"></div>
    <div class="card-actions">
      <button class="fc-btn" data-action="prev">← Back</button>
      <button class="fc-btn primary" data-action="flip">Flip</button>
      <button class="fc-btn" data-action="next">Next →</button>
    </div>
  `;


  // --- Dropdown event handlers ---
  const moodSelect = mainEl.querySelector('#moodSelect');
  const tenseSelect = mainEl.querySelector('#tenseSelect');
  moodSelect.addEventListener('change', e => {
    filters.mood = e.target.value;
    filters.tense = 'all'; // reset tense when mood changes
    setFilters(verb.id, filters);
    renderMain();
  });
  tenseSelect.addEventListener('change', e => {
    filters.tense = e.target.value;
    setFilters(verb.id, filters);
    renderMain();
  });

  const deckEl = document.getElementById('flashDeck');

  function paintDeck(){
    deckEl.innerHTML = '';
    const top = deck.slice(0, 3); // render only first 3 for performance
    top.forEach((t, i) => {
      const z = 3 - i;
      const y = i * 8;
      const s = 1 - i * 0.04;
      const el = document.createElement('div');
      el.className = 'flashcard';
      el.style.zIndex = String(100 + z);
      el.style.transform = `translateY(${y}px) scale(${s})`;
      el.innerHTML = card3DHTML(verb, t);
      deckEl.appendChild(el);
      const toggleBtn = el.querySelector('[data-tense-known-toggle]');
      if (toggleBtn) {
        const stop = evt => evt.stopPropagation();
        toggleBtn.addEventListener('mousedown', stop);
        toggleBtn.addEventListener('touchstart', stop, { passive: true });
        toggleBtn.addEventListener('click', evt => {
          evt.stopPropagation();
          t.known = !t.known;
          save(DB);
          toggleBtn.classList.toggle('is-known', t.known);
          toggleBtn.setAttribute('aria-pressed', t.known ? 'true' : 'false');
          const labelText = t.known
            ? `Mark ${verb.inf} · ${t.mood} ${t.tense} as unknown`
            : `Mark ${verb.inf} · ${t.mood} ${t.tense} as known`;
          const titleText = t.known
            ? `${verb.inf} · ${t.mood} ${t.tense} is known`
            : `Mark ${verb.inf} · ${t.mood} ${t.tense} as known`;
          toggleBtn.setAttribute('aria-label', labelText);
          toggleBtn.setAttribute('title', titleText);
        });
      }
      if (i === 0) attachInteractions(el); // only top card is interactive
    });
  }

  mainEl.querySelector('[data-edit-verb]')?.addEventListener('click', ()=> openVerbModal(verb.id));

  mainEl.querySelector('[data-shuffle]')?.addEventListener('click', ()=>{
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    paintDeck();
  });

  mainEl.querySelector('[data-action="flip"]')?.addEventListener('click', ()=>{
    const topCard = deckEl.querySelector('.flashcard [data-card]');
    topCard?.classList.toggle('is-flipped');
  });

  mainEl.querySelector('[data-action="next"]')?.addEventListener('click', ()=>{
    const first = deck.shift(); deck.push(first); paintDeck();
  });

  mainEl.querySelector('[data-action="prev"]')?.addEventListener('click', ()=>{
    const last = deck.pop(); deck.unshift(last); paintDeck();
  });

  // swipe/drag handlers attach per top card:
  function attachInteractions(wrapperEl){
    const inner = wrapperEl.querySelector('[data-card]');
    let startX = 0, startY = 0, dx = 0, dy = 0, dragging = false;
    const maxRotate = 12, threshold = 90;

    function onPointerDown(e){
      dragging = true;
      startX = (e.touches?.[0]?.clientX ?? e.clientX);
      startY = (e.touches?.[0]?.clientY ?? e.clientY);
    }
    function onPointerMove(e){
      if(!dragging) return;
      const x = (e.touches?.[0]?.clientX ?? e.clientX);
      const y = (e.touches?.[0]?.clientY ?? e.clientY);
      dx = x - startX; dy = y - startY;
      const rot = Math.max(-maxRotate, Math.min(maxRotate, dx/8));
      wrapperEl.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
      wrapperEl.style.transition = 'transform 0s';
    }
    function onPointerUp(){
      if(!dragging) return; dragging = false;
      if (Math.abs(dx) > threshold) {
        const dir = Math.sign(dx);
        wrapperEl.style.transition = 'transform .25s ease';
        wrapperEl.style.transform = `translate(${dir*600}px, ${dy}px) rotate(${dir*18}deg)`;
        setTimeout(()=>{
          const first = deck.shift(); deck.push(first);
          paintDeck();
        }, 250);
      } else {
        wrapperEl.style.transition = 'transform .25s ease';
        wrapperEl.style.transform = `translateY(0px)`;
      }
      dx = dy = 0;
    }

    // tap to flip (if it wasn't a swipe)
    wrapperEl.addEventListener('click', ()=>{
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) inner.classList.toggle('is-flipped');
    });

    // touch
    wrapperEl.addEventListener('touchstart', onPointerDown, {passive:true});
    wrapperEl.addEventListener('touchmove', onPointerMove, {passive:true});
    wrapperEl.addEventListener('touchend', onPointerUp);
    // mouse
    wrapperEl.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
  }

  paintDeck();
}

function row(p, f) { return `<tr><td>${p}</td><td>${f}</td></tr>`; }
function cap(s) { return (s || '').replace(/^\w/, c => c.toUpperCase()); }

function card3DHTML(verb, tenseObj){
  const label = `${cap(tenseObj.mood)} · ${cap(tenseObj.tense)}`;
  const F = tenseObj.forms || {};
  const isKnown = !!tenseObj.known;
  const toggleLabel = isKnown
    ? `Mark ${verb.inf} · ${tenseObj.mood} ${tenseObj.tense} as unknown`
    : `Mark ${verb.inf} · ${tenseObj.mood} ${tenseObj.tense} as known`;
  const toggleTitle = isKnown
    ? `${verb.inf} · ${tenseObj.mood} ${tenseObj.tense} is known`
    : `Mark ${verb.inf} · ${tenseObj.mood} ${tenseObj.tense} as known`;
  const safeInf = escapeHTML(verb.inf);
  const safeEn = escapeHTML(verb.en);
  const safeLabel = escapeHTML(label);
  const safeToggleLabel = escapeHTML(toggleLabel);
  const safeToggleTitle = escapeHTML(toggleTitle);
  return `
    <div class="card3d">
      <button
        type="button"
        class="known-toggle ${isKnown ? 'is-known' : ''}"
        data-tense-known-toggle="${tenseObj.id}"
        aria-pressed="${isKnown ? 'true' : 'false'}"
        aria-label="${safeToggleLabel}"
        title="${safeToggleTitle}"
      >
        <span aria-hidden="true"></span>
      </button>
      <div class="card-inner" data-card>
        <div class="card-face front">
          <div class="card-title">
            <span class="badge">${safeInf}</span>
            <b>${safeEn}</b>
          </div>
          <div style="display:grid;place-items:center;">
            <h3 style="margin:24px 0 8px;font-size:1.15rem;">${safeLabel}</h3>
            <p class="muted" style="margin:0;">Tap to flip and see conjugations</p>
          </div>
        </div>
        <div class="card-face back">
          <div class="card-title"><span class="badge">${safeLabel}</span></div>
          <table class="table-compact" style="margin-top:8px;">
            <thead><tr><th>Pronoun</th><th>Form</th></tr></thead>
            <tbody>
              ${row('io', F.io||'')}
              ${row('tu', F.tu||'')}
              ${row('lui/lei', F.lui_lei||'')}
              ${row('noi', F.noi||'')}
              ${row('voi', F.voi||'')}
              ${row('loro', F.loro||'')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}


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
  document.body.classList.add('modal-open');
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
  document.body.classList.remove('modal-open');
  EDIT_VERB_ID = null;
}

function addTenseUI(t){
  const id = t.id || uid();
  const box = document.createElement('div');
  box.className = 'tense-box';
  box.setAttribute('data-tense-id', id);
  box.innerHTML = `
    <div class="row">
      <div>
        <label>Mood</label>
        <select class="mood">
          ${['indicativo','congiuntivo','condizionale','imperativo','infinito','gerundio','participio']
            .map(m=>`<option ${m===(t.mood||'indicativo')?'selected':''}>${m}</option>`).join('')}
        </select>
      </div>
      <div>
        <label>Tense</label>
        <select class="tense-select"></select>
      </div>
    </div>
    <div class="tense-grid">
      ${inputRow('io', t.forms?.io||'')}
      ${inputRow('tu', t.forms?.tu||'')}
      ${inputRow('lui_lei', t.forms?.lui_lei||'')}
      ${inputRow('noi', t.forms?.noi||'')}
      ${inputRow('voi', t.forms?.voi||'')}
      ${inputRow('loro', t.forms?.loro||'')}
    </div>
    <div class="right" style="margin-top:8px;">
      <button class="btn small danger" data-remove-tense>Remove tense</button>
    </div>
  `;
  tenseContainer.appendChild(box);

  const moodSel  = box.querySelector('.mood');
  const tenseSel = box.querySelector('.tense-select');

  // initial fill
  renderTenseOptions(tenseSel, t.mood || 'indicativo', t.tense || 'presente');

  // when mood changes, re-render tenses (keep current if valid)
  moodSel.addEventListener('change', () => {
    const current = tenseSel.value;
    renderTenseOptions(tenseSel, moodSel.value, current);
  });

  // remove block
  box.querySelector('[data-remove-tense]').addEventListener('click', ()=> box.remove());
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

    const existingVerb = EDIT_VERB_ID ? DB.verbs.find(x => x.id === EDIT_VERB_ID) : null;

    // Gather tenses from UI
    const tensesRaw = [...tenseContainer.querySelectorAll('.tense-box')].map(box => {
        const mood = box.querySelector('.mood').value.trim();
        const tense = box.querySelector('.tense-select').value.trim();
        const inputs = box.querySelectorAll('input[data-pronoun]');
        const forms = {};
        inputs.forEach(i => forms[i.getAttribute('data-pronoun')] = i.value.trim());
        const id = box.getAttribute('data-tense-id') || uid();
        const existingTense = existingVerb?.tenses.find(t => t.id === id);
        return { id, mood, tense, forms, known: existingTense?.known ?? false };
    }).filter(t => t.tense); // keep only tenses with a name

    const normalized = normalizeVerb({
        ...(existingVerb ?? {}),
        id: existingVerb?.id ?? uid(),
        inf,
        en,
        tenses: tensesRaw
    });

    if (EDIT_VERB_ID && existingVerb) {
        // update existing
        existingVerb.inf = normalized.inf;
        existingVerb.en = normalized.en;
        existingVerb.tenses = normalized.tenses;
        ACTIVE_VERB_ID = existingVerb.id;
    } else {
        DB.verbs.push(normalized);
        ACTIVE_VERB_ID = normalized.id;
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
        DB = normalizeDB(data);
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
