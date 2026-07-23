(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const fmt = value => new Intl.NumberFormat('es-ES').format(Number(value) || 0);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const state = { data: null, filtered: [], page: 1, pageSize: 24 };
  const filterIds = ['model-provider','model-family','model-modality','model-capability','model-price'];
  const PUBLISHED_WINDOW_DAYS = 30;

  function isRecentlyPublished(model) {
    const createdUnix = Number(model?.createdUnix);
    if (!Number.isFinite(createdUnix) || createdUnix <= 0) return false;
    const publishedAt = createdUnix * 1000;
    const age = Date.now() - publishedAt;
    const futureTolerance = 24 * 60 * 60 * 1000;
    return age >= -futureTolerance && age <= PUBLISHED_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  }

  function uniqueSorted(values) {
    return [...new Set(values.filter(v => v && !/^sin /i.test(v)))].sort((a,b)=>a.localeCompare(b,'es'));
  }
  function selectedFilters() {
    return {
      provider: $('#model-provider').value,
      family: $('#model-family').value,
      modality: $('#model-modality').value,
      capability: $('#model-capability').value,
      price: $('#model-price').value
    };
  }
  function matches(model, filters, excluded = '') {
    return (excluded === 'provider' || !filters.provider || model.provider === filters.provider)
      && (excluded === 'family' || !filters.family || model.family === filters.family)
      && (excluded === 'modality' || !filters.modality || model.modalities.includes(filters.modality))
      && (excluded === 'capability' || !filters.capability || model.capabilities.includes(filters.capability))
      && (excluded === 'price' || !filters.price || model.priceClass === filters.price);
  }
  function valuesFor(key, filters) {
    const models = state.data.models.filter(model => matches(model, filters, key));
    if (key === 'provider') return models.map(model => model.provider);
    if (key === 'family') return models.map(model => model.family);
    if (key === 'modality') return models.flatMap(model => model.modalities);
    if (key === 'capability') return models.flatMap(model => model.capabilities);
    return models.map(model => model.priceClass);
  }
  function fillSelect(select, values, emptyLabel, current) {
    const options = uniqueSorted(values);
    select.innerHTML = `<option value="">${emptyLabel}</option>` + options.map(value => `<option value="${esc(value)}">${esc(value)}</option>`).join('');
    select.value = options.includes(current) ? current : '';
  }
  function updateCascadingFilters() {
    if (!state.data) return;
    let filters = selectedFilters();
    let changed = true;
    while (changed) {
      changed = false;
      const specs = [
        ['provider', '#model-provider', 'Todos'],
        ['family', '#model-family', 'Todas'],
        ['modality', '#model-modality', 'Todas'],
        ['capability', '#model-capability', 'Todas'],
        ['price', '#model-price', 'Todos']
      ];
      for (const [key, selector] of specs) {
        const current = filters[key];
        const available = uniqueSorted(valuesFor(key, filters));
        if (current && !available.includes(current)) {
          filters[key] = '';
          $(selector).value = '';
          changed = true;
        }
      }
    }
    fillSelect($('#model-provider'), valuesFor('provider', filters), 'Todos', filters.provider);
    fillSelect($('#model-family'), valuesFor('family', filters), 'Todas', filters.family);
    fillSelect($('#model-modality'), valuesFor('modality', filters), 'Todas', filters.modality);
    fillSelect($('#model-capability'), valuesFor('capability', filters), 'Todas', filters.capability);
    fillSelect($('#model-price'), valuesFor('price', filters), 'Todos', filters.price);
  }
  function statsValue(keys, fallback) {
    const value = ModelsData.first(state.data.statistics, keys, null);
    return value !== null && value !== '' && !Number.isNaN(Number(value)) ? Number(value) : fallback;
  }
  function renderStats() {
    $('#stat-models').textContent = fmt(statsValue(['models','model_count','total_models','totals.models'], state.data.models.length));
    $('#stat-providers').textContent = fmt(statsValue(['providers','provider_count','total_providers','totals.providers'], new Set(state.data.models.map(m=>m.provider)).size));
    $('#stat-families').textContent = fmt(statsValue(['families','family_count','total_families','totals.families'], new Set(state.data.models.map(m=>m.family)).size));
    $('#stat-capabilities').textContent = fmt(statsValue(['capabilities','capability_count','total_capabilities','totals.capabilities'], new Set(state.data.models.flatMap(m=>m.capabilities)).size));
    const newCount = statsValue(['data.new_models_last_7_days','new_models_last_7_days','data.activity.new_models','activity.new_models'], 0);
    const updatedCount = statsValue(['data.updated_models_last_7_days','updated_models_last_7_days','data.activity.updated_models','activity.updated_models'], 0);
    $('#stat-changes').textContent = fmt(newCount + updatedCount || state.data.changes.length);
  }
  function card(model) {
    const tags = [...model.modalities.slice(0,3), ...model.capabilities.slice(0,2)];
    const activityBadge = isRecentlyPublished(model)
      ? '<span class="activity-badge updated">Actualizado</span>'
      : '';
    return `<article class="model-card">
      <div class="model-card-top"><div><div class="card-provider-row"><span class="card-provider">${esc(model.provider)}</span>${activityBadge}</div><h3>${esc(model.name)}</h3></div><span class="source-badge">${esc(model.source)}</span></div>
      <p class="model-desc">${esc(model.description.slice(0,210))}${model.description.length > 210 ? '…' : ''}</p>
      <div class="model-tags">${tags.map(v=>`<span>${esc(v)}</span>`).join('') || '<span>Sin etiquetas</span>'}</div>
      <dl class="model-facts"><div><dt>Familia</dt><dd>${esc(model.family)}</dd></div><div><dt>Contexto</dt><dd>${esc(model.contextLabel)}</dd></div><div><dt>Licencia</dt><dd>${esc(model.license)}</dd></div><div><dt>Publicado</dt><dd>${esc(model.publishedLabel)}</dd></div></dl>
      <div class="card-actions"><a class="detail-link" href="/modelos/detalle.html?id=${encodeURIComponent(model.id)}">Ver ficha completa →</a>${model.sourceUrl ? `<a class="source-link" href="${esc(model.sourceUrl)}" target="_blank" rel="noopener" aria-label="Abrir fuente oficial">↗</a>` : ''}</div>
    </article>`;
  }
  function renderPagination(total) {
    const pages = Math.max(1, Math.ceil(total / state.pageSize)); state.page = Math.min(state.page, pages);
    if (pages <= 1) { $('#pagination').innerHTML=''; return; }
    const buttons = []; const start=Math.max(1,state.page-2), end=Math.min(pages,state.page+2);
    buttons.push(`<button data-page="${state.page-1}" ${state.page===1?'disabled':''}>←</button>`);
    if(start>1) buttons.push(`<button data-page="1">1</button>${start>2?'<span>…</span>':''}`);
    for(let p=start;p<=end;p++) buttons.push(`<button data-page="${p}" class="${p===state.page?'active':''}">${p}</button>`);
    if(end<pages) buttons.push(`${end<pages-1?'<span>…</span>':''}<button data-page="${pages}">${pages}</button>`);
    buttons.push(`<button data-page="${state.page+1}" ${state.page===pages?'disabled':''}>→</button>`);
    $('#pagination').innerHTML=buttons.join('');
    $('#pagination').querySelectorAll('button[data-page]').forEach(b=>b.addEventListener('click',()=>{state.page=Number(b.dataset.page);renderGrid();scrollTo({top:$('.catalog-panel').offsetTop-20,behavior:'smooth'});}));
  }
  function renderGrid() {
    const start=(state.page-1)*state.pageSize, visible=state.filtered.slice(start,start+state.pageSize);
    $('#model-grid').innerHTML=visible.map(card).join(''); $('#result-count').textContent=fmt(state.filtered.length);
    $('#model-empty').hidden=state.filtered.length>0; renderPagination(state.filtered.length);
  }
  function apply(resetPage=true, refreshOptions=true) {
    if (!state.data) return; if(resetPage) state.page=1;
    if (refreshOptions) updateCascadingFilters();
    const q=norm($('#model-q').value), filters=selectedFilters();
    state.filtered=state.data.models.filter(m => {
      const haystack=norm([m.name,m.id,m.provider,m.family,m.description,...m.capabilities,...m.modalities].join(' '));
      return (!q||haystack.includes(q)) && matches(m, filters);
    });
    const sort=$('#model-sort').value;
    state.filtered.sort((a,b)=> sort==='provider' ? a.provider.localeCompare(b.provider,'es')||a.name.localeCompare(b.name,'es') : sort==='context-desc' ? (b.context||0)-(a.context||0) : sort==='release-desc' ? (b.createdUnix||0)-(a.createdUnix||0) : sort==='release-asc' ? (a.createdUnix||0)-(b.createdUnix||0) : a.name.localeCompare(b.name,'es'));
    renderGrid();
  }
  function renderChanges() {
    const changes=state.data.changes.slice(0,20);
    if (changes.length) {
      $('#changes-list').innerHTML=changes.map(change=>{
        const type=String(ModelsData.first(change,['type','change_type','action','status'],'updated')).toLowerCase();
        const label=type.includes('add')||type.includes('alta')?'Alta':type.includes('remov')||type.includes('retir')?'Retirada':'Modificación';
        const name=ModelsData.first(change,['name','model_name','id','model_id','title'],'Modelo');
        const date=ModelsData.first(change,['date','detected_at','changed_at','updated_at'],'');
        const fields=ModelsData.array(ModelsData.first(change,['fields','changed_fields','changes'],[])).join(', ');
        return `<article class="change-item"><time>${esc(date||'—')}</time><span class="change-kind ${label==='Alta'?'added':label==='Retirada'?'removed':'updated'}">${label}</span><div><strong>${esc(name)}</strong>${fields?`<small>${esc(fields)}</small>`:''}${ModelsData.first(change,['id','model_id'],'')?`<a class="change-link" href="/modelos/detalle.html?id=${encodeURIComponent(ModelsData.first(change,['id','model_id'],''))}">Ver modelo →</a>`:''}</div></article>`;
      }).join('');
      return;
    }

    const recentUpdated = state.data.models.filter(isRecentlyPublished);
    const providers = new Set(state.data.models.map(model => model.provider)).size;
    const families = new Set(state.data.models.map(model => model.family)).size;
    const updatedText = recentUpdated.length
      ? `${fmt(recentUpdated.length)} ${recentUpdated.length === 1 ? 'modelo publicado' : 'modelos publicados'} durante los últimos 30 días.`
      : `No se han publicado modelos durante los últimos 30 días.`;
    $('#changes-list').innerHTML=`<div class="model-message activity-summary"><strong>Estado actual del catálogo</strong><span>${fmt(state.data.models.length)} modelos · ${fmt(providers)} proveedores · ${fmt(families)} familias</span><small>${updatedText}</small></div>`;
  }
  async function init() {
    try {
      state.data=await ModelsData.load(); state.filtered=[...state.data.models];
      updateCascadingFilters(); renderStats(); renderChanges(); apply(true, false);
      $('#model-status').textContent=state.data.models.length?'Catálogo operativo':'Catálogo sin modelos'; $('#model-status').className='status-pill '+(state.data.models.length?'ok':'warning');
      $('#model-updated').textContent='Última actualización: '+(state.data.generatedAt ? new Date(state.data.generatedAt).toLocaleString('es-ES') : 'no publicada');
      $('#model-version').textContent='Versión: '+ModelsData.first(state.data.version,['version','catalog_version','release','engine_version'],'—');
    } catch(error) {
      $('#model-status').textContent='Error de carga'; $('#model-status').className='status-pill error'; $('#model-error').hidden=false;
      $('#model-error').textContent='No se pudo cargar el catálogo público. Comprueba que data/models.json es válido y que la web se sirve mediante HTTP.'; console.error(error);
    }
  }
  ['model-provider','model-family','model-modality','model-capability','model-price'].forEach(id=>document.getElementById(id).addEventListener('change',()=>apply()));
  $('#model-q').addEventListener('input',()=>apply());
  $('#model-sort').addEventListener('change',()=>apply(false, false));
  $('#page-size').addEventListener('change',e=>{state.pageSize=Number(e.target.value);state.page=1;renderGrid();});
  $('#reset-filters').addEventListener('click',()=>{['model-q',...filterIds].forEach(id=>document.getElementById(id).value='');$('#model-sort').value='name';updateCascadingFilters();apply(true, false);});
  init();
})();
