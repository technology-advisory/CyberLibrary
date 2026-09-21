(() => {
  const q = document.getElementById('vs-q');
  const cards = [...document.querySelectorAll('.vs-card')];
  const filters = [...document.querySelectorAll('.compare-filter')];
  const count = document.getElementById('vs-count');
  const empty = document.getElementById('vs-empty');
  let category = 'all';

  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');

  const render = () => {
    const term = normalize(q?.value.trim());
    let visible = 0;
    cards.forEach((card) => {
      const cardCategory = card.dataset.category || '';
      const haystack = normalize(`${card.dataset.terms || ''} ${card.textContent}`);
      const matchesCategory = category === 'all' || cardCategory === category;
      const matchesTerm = !term || haystack.includes(term);
      const show = matchesCategory && matchesTerm;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (count) count.textContent = `${visible} comparativa${visible === 1 ? '' : 's'} visible${visible === 1 ? '' : 's'}`;
    if (empty) empty.classList.toggle('is-visible', visible === 0);
  };

  q?.addEventListener('input', render);
  filters.forEach((button) => {
    button.addEventListener('click', () => {
      category = button.dataset.filter || 'all';
      filters.forEach((item) => item.setAttribute('aria-pressed', item === button ? 'true' : 'false'));
      render();
    });
  });
  render();
})();
