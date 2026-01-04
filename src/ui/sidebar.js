/**
 * Renders the sidebar list and wires click handlers.
 * @param {{
 *  container: HTMLElement,
 *  verbs: Array,
 *  activeVerbId: string|null,
 *  filterText: string,
 *  onSelect: (verbId: string) => void
 * }} options
 */
export function renderSidebar({
  container,
  verbs,
  activeVerbId,
  filterText = '',
  onSelect,
}) {
  if (!container) return;
  const q = filterText.trim().toLowerCase();
  const filtered = verbs
    .slice()
    .sort((a, b) => a.inf.localeCompare(b.inf, 'it'))
    .filter(
      (verb) =>
        verb.inf.toLowerCase().includes(q) || verb.en.toLowerCase().includes(q),
    );

  container.innerHTML =
    filtered
      .map(
        (verb) => `
      <div class="verb-item ${verb.id === activeVerbId ? 'active' : ''}" data-id="${verb.id}">
        <div><b>${verb.inf}</b><br><small>${verb.en}</small></div>
        <small>${verb.tenses.length} ${
          verb.tenses.length === 1 ? 'tense' : 'tenses'
        }</small>
      </div>`,
      )
      .join('') || '<div class="muted">No verbs yet. Add one +</div>';

  container.querySelectorAll('.verb-item').forEach((el) => {
    el.addEventListener('click', () => {
      onSelect?.(el.dataset.id);
    });
  });
}
