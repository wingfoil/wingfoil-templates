// The search page's script (spec-002 §5, task-024): written in this repository, with no
// dependency; the site build checks it against search.js.sha256. `matches` is pure; the wiring
// runs in a browser only, on the data- attributes of the page's pack rows, and sends no request.
(function () {
  'use strict';

  /** Every word of the query occurs in the text, and the pack passes every filter given. */
  function matches(pack, query, filters) {
    const text = pack.text.toLowerCase();
    const words = query.toLowerCase().split(/\s+/).filter((word) => word !== '');
    if (!words.every((word) => text.includes(word))) return false;
    if (filters.axis && pack.axis !== filters.axis) return false;
    if (filters.slot && pack.slot !== filters.slot) return false;
    if (filters.status && pack.status !== filters.status) return false;
    if (filters.profile && !pack.profiles.includes(filters.profile)) return false;
    return true;
  }

  if (typeof document === 'undefined') {
    globalThis.wingfoilSearch = { matches };
    return;
  }

  /** A row's profiles; a malformed attribute is no profile, never an error for the whole page. */
  function profilesOf(row) {
    try {
      const profiles = JSON.parse(row.dataset.profiles || '[]');
      return Array.isArray(profiles) ? profiles.map(String) : [];
    } catch {
      return [];
    }
  }

  const form = document.getElementById('search');
  const query = document.getElementById('query');
  const selects = ['axis', 'slot', 'profile', 'status'].map((name) => document.getElementById(name));
  const rows = Array.from(document.querySelectorAll('tr[data-pack]'));
  const packs = rows.map((row) => ({
    text: row.dataset.text || '',
    axis: row.dataset.axis || '',
    slot: row.dataset.slot || '',
    status: row.dataset.status || '',
    profiles: profilesOf(row),
  }));

  function apply() {
    const filters = {};
    for (const select of selects) filters[select.id] = select.value;
    rows.forEach((row, index) => { row.hidden = !matches(packs[index], query.value, filters); });
  }

  form.hidden = false;
  form.addEventListener('submit', (event) => { event.preventDefault(); });
  query.addEventListener('input', apply);
  for (const select of selects) select.addEventListener('change', apply);
})();
