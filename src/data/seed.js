// Shared helpers for composing verb seed data.
export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function seedVerb(inf, en, tenses) {
  return { id: uid(), inf, en, tenses };
}

export function seedTense(mood, tense, forms) {
  return { id: uid(), mood, tense, forms };
}
