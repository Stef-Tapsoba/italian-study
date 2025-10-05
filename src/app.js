// ---------- Data Layer ----------
const LS_KEY = 'verbsDataV1';
/** shape: { verbs: [{ id, inf, en, tenses: [{ id, mood, tense, forms: {io, tu, lui_lei, noi, voi, loro}}]}] } */

const defaultData = {
    verbs: [
        seedVerb('Essere', 'to be', [
            seedTense('indicativo', 'presente', { io: 'sono', tu: 'sei', 'lui_lei': 'è', noi: 'siamo', voi: 'siete', loro: 'sono' }),
            seedTense('indicativo', 'imperfetto', { io: 'ero', tu: 'eri', 'lui_lei': 'era', noi: 'eravamo', voi: 'eravate', loro: 'erano' }),
            seedTense('indicativo', 'futuro semplice', { io: 'sarò', tu: 'sarai', 'lui_lei': 'sarà', noi: 'saremo', voi: 'sarete', loro: 'saranno' }),
            seedTense('indicativo', 'passato remoto', { io: 'fui', tu: 'fosti', 'lui_lei': 'fu', noi: 'fummo', voi: 'foste', loro: 'furono' }),
            seedTense('indicativo', 'passato prossimo', { io: 'sono stato', tu: 'sei stato', 'lui_lei': 'è stato(a)', noi: 'siamo stati', voi: 'siete stati', loro: 'sono stati(e)' }),
            seedTense('indicativo', 'trapassato prossimo', { io: 'ero stato', tu: 'eri stato', 'lui_lei': 'era stato(a)', noi: 'eravamo stati', voi: 'eravate stati', loro: 'erano stati(e)' }),
            seedTense('indicativo', 'trapassato remoto', { io: 'fui stato', tu: 'fosti stato', 'lui_lei': 'fu stato(a)', noi: 'fummo stati', voi: 'foste stati', loro: 'furono stati(e)' }),
            seedTense('indicativo', 'futuro anteriore', { io: 'sarò stato', tu: 'sarai stato', 'lui_lei': 'sarà stato(a)', noi: 'saremo stati', voi: 'sarete stati', loro: 'saranno stati(e)' })
        ]),
        seedVerb('Avere', 'to have', [
            seedTense('indicativo', 'presente', { io: 'ho', tu: 'hai', 'lui_lei': 'ha', noi: 'abbiamo', voi: 'avete', loro: 'hanno' }),
            seedTense('indicativo', 'imperfetto', { io: 'avevo', tu: 'avevi', 'lui_lei': 'aveva', noi: 'avevamo', voi: 'avevate', loro: 'avevano' }),
            seedTense('indicativo', 'futuro semplice', { io: 'avrò', tu: 'avrai', 'lui_lei': 'avrà', noi: 'avremo', voi: 'avrete', loro: 'avranno' }),
            seedTense('indicativo', 'passato remoto', { io: 'ebbi', tu: 'avesti', 'lui_lei': 'ebbe', noi: 'avemmo', voi: 'aveste', loro: 'ebbero' }),
            seedTense('indicativo', 'passato prossimo', { io: 'ho avuto', tu: 'hai avuto', 'lui_lei': 'ha avuto', noi: 'abbiamo avuto', voi: 'avete avuto', loro: 'hanno avuto' }),
            seedTense('indicativo', 'trapassato prossimo', { io: 'avevo avuto', tu: 'avevi avuto', 'lui_lei': 'aveva avuto', noi: 'avevamo avuto', voi: 'avevate avuto', loro: 'avevano avuto' }),
            seedTense('indicativo', 'trapassato remoto', { io: 'ebbi avuto', tu: 'avesti avuto', 'lui_lei': 'ebbe avuto', noi: 'avemmo avuto', voi: 'aveste avuto', loro: 'ebbero avuto' }),
            seedTense('indicativo', 'futuro anteriore', { io: 'avrò avuto', tu: 'avrai avuto', 'lui_lei': 'avrà avuto', noi: 'avremo avuto', voi: 'avrete avuto', loro: 'avranno avuto' })
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
const APP_VERSION = "0.0.5"; // bump this when you push new seeds

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

function renderMain(){
  const verb = DB.verbs.find(v=>v.id===ACTIVE_VERB_ID);
  if(!verb){
    mainEl.innerHTML = '<div class="empty">Pick a verb or add a new one.</div>';
    return;
  }

  // keep a queue (deck) of tenses
  let deck = verb.tenses.slice();

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
    <div class="deck" id="flashDeck"></div>
    <div class="card-actions">
      <button class="fc-btn" data-action="prev">← Back</button>
      <button class="fc-btn primary" data-action="flip">Flip</button>
      <button class="fc-btn" data-action="next">Next →</button>
    </div>
  `;

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
  return `
    <div class="card3d">
      <div class="card-inner" data-card>
        <div class="card-face front">
          <div class="card-title">
            <span class="badge">${verb.inf}</span>
            <b>${verb.en}</b>
          </div>
          <div style="display:grid;place-items:center;">
            <h3 style="margin:24px 0 8px;font-size:1.15rem;">${label}</h3>
            <p class="muted" style="margin:0;">Tap to flip and see conjugations</p>
          </div>
        </div>
        <div class="card-face back">
          <div class="card-title"><span class="badge">${label}</span></div>
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

    // Gather tenses from UI
    const tenses = [...tenseContainer.querySelectorAll('.tense-box')].map(box => {
        const mood = box.querySelector('.mood').value.trim();
        const tense = box.querySelector('.tense-select').value.trim();
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