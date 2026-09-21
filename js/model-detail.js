(() => {
  'use strict';
  const slug = value => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const id = new URLSearchParams(location.search).get('id');
  if (!id) return;
  const target = slug(id);
  if (target) location.replace(`/modelos/fichas/${encodeURIComponent(target)}/`);
})();
