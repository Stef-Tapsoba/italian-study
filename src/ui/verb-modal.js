import { seedTense, uid } from '../data/default-data.js';
import { normalizeVerb } from '../store/database.js';
import { escapeHTML } from '../utils/html.js';

const TENSES = {
  indicativo: [
    'presente',
    'imperfetto',
    'passato prossimo',
    'trapassato prossimo',
    'passato remoto',
    'trapassato remoto',
    'futuro semplice',
    'futuro anteriore',
  ],
  congiuntivo: ['presente', 'imperfetto', 'passato', 'trapassato'],
  condizionale: ['presente', 'passato'],
  imperativo: ['presente'],
  infinito: ['presente', 'passato'],
  gerundio: ['presente', 'passato'],
  participio: ['presente', 'passato'],
};

/**
 * Creates the Verb modal controller (open/close/save).
 * @param {{
 *  elements: {
 *    backdrop: HTMLElement,
 *    title: HTMLElement,
 *    infInput: HTMLInputElement,
 *    enInput: HTMLInputElement,
 *    tenseContainer: HTMLElement,
 *    addTenseBtn: HTMLElement,
 *    saveBtn: HTMLElement,
 *    closeBtn: HTMLElement,
 *    deleteBtn: HTMLElement,
 *  },
 *  onSave: (verb: object, isExisting: boolean) => void,
 *  onDelete: (verbId: string) => void
 * }} options
 */
export function createVerbModal({ elements, onSave, onDelete }) {
  const {
    backdrop,
    title,
    infInput,
    enInput,
    tenseContainer,
    addTenseBtn,
    saveBtn,
    closeBtn,
    deleteBtn,
  } = elements;

  let editVerb = null;

  const open = ({ verb = null, focusTenseId = null } = {}) => {
    editVerb = verb;
    title.textContent = verb ? 'Edit Verb' : 'Add Verb';
    deleteBtn.style.display = verb ? 'inline-block' : 'none';
    infInput.value = verb?.inf ?? '';
    enInput.value = verb?.en ?? '';
    tenseContainer.innerHTML = '';

    const tensesToRender =
      verb?.tenses?.length > 0
        ? verb.tenses
        : [
            seedTense('indicativo', 'presente', {
              io: '',
              tu: '',
              lui_lei: '',
              noi: '',
              voi: '',
              loro: '',
            }),
          ];
    tensesToRender.forEach((tense) => addTenseUI(tense));

    backdrop.style.display = 'flex';
    document.body.classList.add('modal-open');
    infInput.focus();

    if (focusTenseId) {
      const box = tenseContainer.querySelector(
        `[data-tense-id="${focusTenseId}"]`,
      );
      box?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const close = () => {
    backdrop.style.display = 'none';
    document.body.classList.remove('modal-open');
    editVerb = null;
  };

  function addTenseUI(tense) {
    const wrapper = document.createElement('div');
    wrapper.className = 'tense-box';
    wrapper.dataset.tenseId = tense.id ?? uid();
    wrapper.innerHTML = `
      <div class="row">
        <div>
          <label>Mood</label>
          <select class="mood">
            ${Object.keys(TENSES)
              .map(
                (mood) =>
                  `<option value="${mood}" ${
                    mood === tense.mood ? 'selected' : ''
                  }>${mood}</option>`,
              )
              .join('')}
          </select>
        </div>
        <div>
          <label>Tense</label>
          <select class="tense-select"></select>
        </div>
      </div>
      <div class="tense-grid" style="margin-top:8px;">
        ${inputRow('io', tense.forms?.io || '')}
        ${inputRow('tu', tense.forms?.tu || '')}
        ${inputRow('lui_lei', tense.forms?.lui_lei || '')}
        ${inputRow('noi', tense.forms?.noi || '')}
        ${inputRow('voi', tense.forms?.voi || '')}
        ${inputRow('loro', tense.forms?.loro || '')}
      </div>
      <div class="right" style="margin-top:8px;">
        <button type="button" class="btn small" data-remove-tense>Remove</button>
      </div>
    `;
    const tenseSelect = wrapper.querySelector('.tense-select');
    const moodSelect = wrapper.querySelector('.mood');
    renderTenseOptions(tenseSelect, tense.mood, tense.tense);

    moodSelect.addEventListener('change', () => {
      const current = tenseSelect.value;
      renderTenseOptions(tenseSelect, moodSelect.value, current);
    });

    wrapper
      .querySelector('[data-remove-tense]')
      .addEventListener('click', () => wrapper.remove());

    tenseContainer.appendChild(wrapper);
  }

  function handleSave() {
    const inf = infInput.value.trim();
    const en = enInput.value.trim();
    if (!inf) {
      alert('Infinitive is required.');
      return;
    }

    const existingVerb = editVerb;
    const tensesRaw = [
      ...tenseContainer.querySelectorAll('.tense-box'),
    ].map((box) => {
      const mood = box.querySelector('.mood').value.trim();
      const tense = box.querySelector('.tense-select').value.trim();
      const inputs = box.querySelectorAll('input[data-pronoun]');
      const forms = {};
      inputs.forEach((input) => {
        forms[input.getAttribute('data-pronoun')] = input.value.trim();
      });
      const id = box.getAttribute('data-tense-id') || uid();
      const existingTense = existingVerb?.tenses.find((t) => t.id === id);
      return { id, mood, tense, forms, known: existingTense?.known ?? false };
    }).filter((tense) => tense.tense);

    const normalized = normalizeVerb({
      ...(existingVerb ?? {}),
      id: existingVerb?.id ?? uid(),
      inf,
      en,
      tenses: tensesRaw,
    });

    onSave?.(normalized, !!existingVerb);
    close();
  }

  function handleDelete() {
    if (!editVerb) return;
    const confirmed = confirm(
      `Delete "${editVerb.inf}"? This cannot be undone.`,
    );
    if (!confirmed) return;
    onDelete?.(editVerb.id);
    close();
  }

  addTenseBtn.addEventListener('click', () => {
    addTenseUI(
      seedTense('indicativo', 'presente', {
        io: '',
        tu: '',
        lui_lei: '',
        noi: '',
        voi: '',
        loro: '',
      }),
    );
  });
  saveBtn.addEventListener('click', handleSave);
  deleteBtn.addEventListener('click', handleDelete);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) close();
  });

  return { open, close };
}

function renderTenseOptions(selectEl, mood, currentValue = '') {
  const options = (TENSES[mood] || []).slice();
  if (currentValue && !options.includes(currentValue)) {
    options.unshift(currentValue);
  }
  selectEl.innerHTML = options
    .map(
      (tense) =>
        `<option ${tense === currentValue ? 'selected' : ''}>${tense}</option>`,
    )
    .join('');
}

function inputRow(label, value) {
  const pretty = label === 'lui_lei' ? 'lui/lei' : label;
  return `
    <div>
      <label>${pretty}</label>
      <input data-pronoun="${label}" value="${escapeHTML(value)}" />
    </div>`;
}
