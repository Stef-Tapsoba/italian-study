import { escapeHTML } from '../utils/html.js';

/**
 * Renders the main verb panel + flashcard deck.
 * @param {{
 *  container: HTMLElement,
 *  verb: any|null,
 *  filters: { mood: string, tense: string },
 *  onFiltersChange: (filters: { mood: string, tense: string }) => void,
 *  onRequestEdit: (verbId: string) => void,
 *  onSave: () => void
 * }} options
 */
export function renderMainView({
  container,
  verb,
  filters,
  onFiltersChange,
  onRequestEdit,
  onSave,
}) {
  if (!container) return;
  if (!verb) {
    container.innerHTML =
      '<div class="empty">Pick a verb or hit <b>Add Verb</b> to create one.</div>';
    return;
  }

  const moodFilters = filters ?? { mood: 'all', tense: 'all' };
  const moods = [...new Set(verb.tenses.map((t) => t.mood))];
  const tensesForMood =
    moodFilters.mood && moodFilters.mood !== 'all'
      ? verb.tenses
          .filter((t) => t.mood === moodFilters.mood)
          .map((t) => t.tense)
      : [];

  let deck = verb.tenses.filter((t) => {
    if (
      moodFilters.mood &&
      moodFilters.mood !== 'all' &&
      t.mood !== moodFilters.mood
    ) {
      return false;
    }
    if (
      moodFilters.tense &&
      moodFilters.tense !== 'all' &&
      t.tense !== moodFilters.tense
    ) {
      return false;
    }
    return true;
  });

  if (deck.length === 0) {
    container.innerHTML = `
      <div class="title-row">
        <h2>${verb.inf}</h2><span class="muted">(${verb.en})</span>
        <div class="grow"></div>
        <button class="btn small" data-edit-verb="${verb.id}">Edit</button>
      </div>
      <div class="empty">No tenses yet. Click <b>Edit</b> + <i>+ Add Tense</i>.</div>`;
    container
      .querySelector('[data-edit-verb]')
      ?.addEventListener('click', () => onRequestEdit?.(verb.id));
    return;
  }

  container.innerHTML = `
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
          ${moods
            .map(
              (m) =>
                `<option value="${m}" ${
                  moodFilters.mood === m ? 'selected' : ''
                }>${m.charAt(0).toUpperCase() + m.slice(1)}</option>`,
            )
            .join('')}
        </select>
      </label>
      <label style="font-size:.95em;">Tense:
        <select id="tenseSelect" style="font-size:1.1em;padding:6px 12px;border-radius:8px;">
          <option value="all">All</option>
          ${tensesForMood
            .map(
              (t) =>
                `<option value="${t}" ${
                  moodFilters.tense === t ? 'selected' : ''
                }>${t.charAt(0).toUpperCase() + t.slice(1)}</option>`,
            )
            .join('')}
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

  container
    .querySelector('[data-edit-verb]')
    ?.addEventListener('click', () => onRequestEdit?.(verb.id));

  const deckEl = container.querySelector('#flashDeck');

  const applyFilters = (nextFilters) => {
    onFiltersChange?.(nextFilters);
  };

  const moodSelect = container.querySelector('#moodSelect');
  const tenseSelect = container.querySelector('#tenseSelect');
  moodSelect.addEventListener('change', (event) => {
    applyFilters({ mood: event.target.value, tense: 'all' });
  });
  tenseSelect.addEventListener('change', (event) => {
    applyFilters({ ...moodFilters, tense: event.target.value });
  });

  function paintDeck() {
    if (!deckEl) return;
    deckEl.innerHTML = '';
    const top = deck.slice(0, 3);
    top.forEach((tense, index) => {
      const z = 3 - index;
      const y = index * 8;
      const s = 1 - index * 0.04;
      const cardWrapper = document.createElement('div');
      cardWrapper.className = 'flashcard';
      cardWrapper.style.zIndex = String(100 + z);
      cardWrapper.style.transform = `translateY(${y}px) scale(${s})`;
      cardWrapper.innerHTML = card3DHTML(verb, tense);
      deckEl.appendChild(cardWrapper);
      const toggleBtn = cardWrapper.querySelector(
        '[data-tense-known-toggle]',
      );
      if (toggleBtn) {
        const stop = (evt) => evt.stopPropagation();
        toggleBtn.addEventListener('mousedown', stop);
        toggleBtn.addEventListener('touchstart', stop, { passive: true });
        toggleBtn.addEventListener('click', (evt) => {
          evt.stopPropagation();
          tense.known = !tense.known;
          onSave?.();
          toggleBtn.classList.toggle('is-known', tense.known);
          toggleBtn.setAttribute('aria-pressed', tense.known ? 'true' : 'false');
          const labelText = tense.known
            ? `Mark ${verb.inf} - ${tense.mood} ${tense.tense} as unknown`
            : `Mark ${verb.inf} - ${tense.mood} ${tense.tense} as known`;
          toggleBtn.setAttribute('aria-label', labelText);
          toggleBtn.setAttribute('title', labelText);
        });
      }
      if (index === 0) attachInteractions(cardWrapper);
    });
  }

  container.querySelector('[data-shuffle]')?.addEventListener('click', () => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    paintDeck();
  });

  container
    .querySelector('[data-action="flip"]')
    ?.addEventListener('click', () => {
      const topCard = deckEl?.querySelector('.flashcard [data-card]');
      topCard?.classList.toggle('is-flipped');
    });

  container
    .querySelector('[data-action="next"]')
    ?.addEventListener('click', () => {
      const first = deck.shift();
      if (!first) return;
      deck.push(first);
      paintDeck();
    });

  container
    .querySelector('[data-action="prev"]')
    ?.addEventListener('click', () => {
      const last = deck.pop();
      if (!last) return;
      deck.unshift(last);
      paintDeck();
    });

  function attachInteractions(wrapperEl) {
    const inner = wrapperEl.querySelector('[data-card]');
    let startX = 0;
    let startY = 0;
    let dx = 0;
    let dy = 0;
    let dragging = false;
    const maxRotate = 12;
    const threshold = 90;

    function onPointerDown(e) {
      dragging = true;
      startX = e.touches?.[0]?.clientX ?? e.clientX;
      startY = e.touches?.[0]?.clientY ?? e.clientY;
    }
    function onPointerMove(e) {
      if (!dragging) return;
      const x = e.touches?.[0]?.clientX ?? e.clientX;
      const y = e.touches?.[0]?.clientY ?? e.clientY;
      dx = x - startX;
      dy = y - startY;
      const rot = Math.max(-maxRotate, Math.min(maxRotate, dx / 8));
      wrapperEl.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
      wrapperEl.style.transition = 'transform 0s';
    }
    function onPointerUp() {
      if (!dragging) return;
      dragging = false;
      if (Math.abs(dx) > threshold) {
        const dir = Math.sign(dx);
        wrapperEl.style.transition = 'transform .25s ease';
        wrapperEl.style.transform = `translate(${dir * 600}px, ${dy}px) rotate(${
          dir * 18
        }deg)`;
        setTimeout(() => {
          const first = deck.shift();
          if (first) deck.push(first);
          paintDeck();
        }, 250);
      } else {
        wrapperEl.style.transition = 'transform .25s ease';
        wrapperEl.style.transform = `translateY(0px)`;
      }
      dx = dy = 0;
    }

    wrapperEl.addEventListener('click', () => {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) {
        inner?.classList.toggle('is-flipped');
      }
    });

    wrapperEl.addEventListener('touchstart', onPointerDown, { passive: true });
    wrapperEl.addEventListener('touchmove', onPointerMove, { passive: true });
    wrapperEl.addEventListener('touchend', onPointerUp);
    wrapperEl.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
  }

  paintDeck();
}

function card3DHTML(verb, tenseObj) {
  const label = `${capitalize(tenseObj.mood)} - ${capitalize(tenseObj.tense)}`;
  const forms = tenseObj.forms || {};
  const isKnown = !!tenseObj.known;
  const toggleLabel = isKnown
    ? `Mark ${verb.inf} - ${tenseObj.mood} ${tenseObj.tense} as unknown`
    : `Mark ${verb.inf} - ${tenseObj.mood} ${tenseObj.tense} as known`;
  const safeLabel = escapeHTML(label);
  const safeToggle = escapeHTML(toggleLabel);
  return `
    <div class="card3d">
      <button
        type="button"
        class="known-toggle ${isKnown ? 'is-known' : ''}"
        data-tense-known-toggle
        aria-pressed="${isKnown ? 'true' : 'false'}"
        aria-label="${safeToggle}"
        title="${safeToggle}"
      >
        <span>✓</span>
      </button>
      <div class="card-inner" data-card>
        <div class="card-face front">
          <div class="card-title">
            <h3>${escapeHTML(verb.inf)}</h3>
            <span class="badge">${safeLabel}</span>
          </div>
          <p>${escapeHTML(verb.en)}</p>
        </div>
        <div class="card-face back">
          <div class="card-title">
            <h3>${escapeHTML(verb.inf)}</h3>
            <span class="badge">${safeLabel}</span>
          </div>
          <table class="table-compact">
            <tbody>
              ${row('io', forms.io)}
              ${row('tu', forms.tu)}
              ${row('lui/lei', forms.lui_lei)}
              ${row('noi', forms.noi)}
              ${row('voi', forms.voi)}
              ${row('loro', forms.loro)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function row(pronoun, form) {
  return `<tr><td>${escapeHTML(pronoun)}</td><td>${escapeHTML(form)}</td></tr>`;
}

function capitalize(value = '') {
  return value.replace(/^\w/, (c) => c.toUpperCase());
}
