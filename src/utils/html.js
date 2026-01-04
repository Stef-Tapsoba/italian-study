/**
 * Escapes a string for safe HTML rendering.
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHTML(value) {
  return (value ?? '')
    .toString()
    .replace(/[&<>"']/g, (char) => escapeMap[char]);
}

const escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};
