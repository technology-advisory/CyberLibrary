(() => {
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const safeUrl = value => {
    try {
      const url = new URL(String(value || ''), location.origin);
      return url.protocol === 'https:' ? url.href : '#';
    } catch (_) {
      return '#';
    }
  };

  function addOptions(select, values) {
    [...new Set(values.filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'es'))
      .forEach(value => select.add(new Option(value, value)));
  }

  function createToolRow(tool) {
    const article = document.createElement('article');
    article.className = 'tool-row';

    const main = document.createElement('div');
    const title = document.createElement('h3');
    title.className = 'tool-name';
    title.textContent = tool.name || 'No definido';
    const description = document.createElement('p');
    description.className = 'tool-desc';
    description.textContent = tool.description || 'No definido';
    main.append(title, description);

    const classification = document.createElement('div');
    classification.className = 'tool-class';
    const category = document.createElement('span');
    category.className = 'tool-category';
    category.textContent = tool.category || 'No definido';
    const type = document.createElement('span');
    type.className = 'tool-type';
    type.textContent = tool.type || 'No definido';
    const license = document.createElement('span');
    license.className = 'tool-license';
    license.textContent = `Licencia: ${tool.license || 'No definido'}`;
    classification.append(category, type, license);

    const tags = document.createElement('div');
    tags.className = 'tool-tags';
    (tool.tags || []).forEach(value => {
      const tag = document.createElement('span');
      tag.textContent = value;
      tags.append(tag);
    });
    if (!tags.childElementCount) {
      const tag = document.createElement('span');
      tag.textContent = 'No definido';
      tags.append(tag);
    }

    const access = document.createElement('div');
    const link = document.createElement('a');
    const url = safeUrl(tool.url);
    link.className = 'tool-link';
    link.href = url;
    link.textContent = url === '#' ? 'URL no válida' : 'Proyecto original ↗';
    if (url !== '#') {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    access.append(link);

    article.append(main, classification, tags, access);
    return article;
  }

  async function init() {
    const register = document.getElementById('tools-grid');
    if (!register) return;

    const search = document.getElementById('tools-search');
    const tag = document.getElementById('tools-tag');
    const category = document.getElementById('tools-category');
    const type = document.getElementById('tools-type');
    const reset = document.getElementById('tools-reset');
    const count = document.getElementById('tools-count');
    const empty = document.getElementById('tools-empty');

    try {
      const response = await fetch('/assets/data/herramientas-seguridad-ia.json');
      if (!response.ok) throw new Error('No se pudo cargar el catálogo');
      const payload = await response.json();
      const tools = Array.isArray(payload.tools) ? payload.tools : [];

      addOptions(tag, tools.flatMap(item => item.tags || []));
      addOptions(category, tools.map(item => item.category));
      addOptions(type, tools.map(item => item.type));

      const render = () => {
        const query = normalize(search.value);
        const selectedTag = tag.value;
        const selectedCategory = category.value;
        const selectedType = type.value;

        const filtered = tools.filter(tool => {
          const haystack = normalize([
            tool.name,
            tool.description,
            tool.category,
            tool.type,
            tool.license,
            ...(tool.tags || [])
          ].join(' '));
          return (!query || haystack.includes(query)) &&
            (!selectedTag || (tool.tags || []).includes(selectedTag)) &&
            (!selectedCategory || tool.category === selectedCategory) &&
            (!selectedType || tool.type === selectedType);
        });

        count.textContent = String(filtered.length);
        empty.hidden = filtered.length !== 0;
        register.replaceChildren(...filtered.map(createToolRow));
      };

      search.addEventListener('input', render);
      [tag, category, type].forEach(select => select.addEventListener('change', render));
      reset.addEventListener('click', () => {
        search.value = '';
        tag.value = '';
        category.value = '';
        type.value = '';
        render();
        search.focus();
      });

      render();
    } catch (error) {
      console.error(error);
      register.replaceChildren();
      const errorBox = document.createElement('div');
      errorBox.className = 'tools-empty';
      errorBox.textContent = 'No se pudo cargar el catálogo de herramientas.';
      register.append(errorBox);
      count.textContent = '0';
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
