// Shared helpers for composing verb seed data.
export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function seedVerb(inf, en, tenses, extras = {}) {
  return { id: uid(), inf, en, tenses, ...extras };
}

export function seedTense(mood, tense, forms, extras = {}) {
  return { id: uid(), mood, tense, forms, known: false, ...extras };
}
