(() => {
  'use strict';
  const PATHS = {
    full: '/data/normativa/ai-act-full.json',
    changes: '/data/normativa/ai-act-changes.json',
    index: '/data/normativa/ai-act-index.json'
  };
  const state = { view:'law', full:null, rawChanges:null, index:null, amendments:[], selected:null, query:'', chapter:'all', status:'all' };
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const clean = v => String(v ?? '').replace(/\r/g,'').replace(/\n{3,}/g,'\n\n').trim();
  const norm = v => clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const articleKey = v => norm(v).replace(/\s+/g,'').replace('articulo','');
  const formatDate = iso => { try { return new Intl.DateTimeFormat('es-ES',{dateStyle:'long',timeStyle:'short'}).format(new Date(iso)); } catch { return iso; } };

  function operationType(text){
    const n=norm(text);
    if(/se suprime|quedan suprimid/.test(n)) return 'supresión';
    if(/se inserta|se insertan|se añade|se añaden/.test(n)) return 'adición';
    if(/se sustituye|se sustituyen/.test(n)) return 'sustitución';
    return 'modificación';
  }

  function normalizeAmendments(items){
    const out=[];
    for(const item of items){
      const text=clean(item.legal_instruction);
      const top=/^\d+\)/.test(text);
      if(top || !out.length){
        out.push({
          id:`amendment-${String(out.length+1).padStart(3,'0')}`,
          sequence:item.sequence,
          affected:[...(item.affected_articles||[])],
          instruction:text,
          validation:item.validation_status,
          consolidated:item.consolidated_text,
          type:operationType(text)
        });
      } else {
        const last=out[out.length-1];
        last.instruction += `\n\n${text}`;
        last.affected=[...new Set([...last.affected,...(item.affected_articles||[])])];
      }
    }
    return out;
  }

  function changedSet(){
    return new Set(state.amendments.flatMap(a=>a.affected.map(articleKey)));
  }

  function chapterLabel(ch){ return ch ? `Capítulo ${ch}` : 'Anexos'; }
  function displaySection(s){ return s.type==='article' ? `Artículo ${s.number}` : `Anexo ${s.number}`; }

  function renderDashboard(){
    const stats=state.full.statistics||{};
    const types=state.amendments.reduce((a,x)=>(a[x.type]=(a[x.type]||0)+1,a),{});
    $('#legal-dashboard').innerHTML=`
      <div class="legal-kpi"><span>Texto completo</span><b>${stats.article_count||0}</b><small>artículos</small></div>
      <div class="legal-kpi"><span>Anexos</span><b>${stats.annex_count||0}</b><small>documentos técnicos</small></div>
      <div class="legal-kpi accent"><span>Modificaciones</span><b>${state.amendments.length}</b><small>operaciones principales</small></div>
      <div class="legal-kpi"><span>Nuevas inserciones</span><b>${types['adición']||0}</b><small>detectadas</small></div>`;
  }

  function populateChapters(){
    const el=$('#legal-chapter');
    const chapters=[...new Set(state.full.sections.filter(s=>s.type==='article').map(s=>s.chapter).filter(Boolean))];
    el.innerHTML='<option value="all">Todos los capítulos</option>'+chapters.map(c=>`<option value="${esc(c)}">${esc(chapterLabel(c))}</option>`).join('')+'<option value="annexes">Anexos</option>';
  }

  function sectionMatches(s){
    const changed=changedSet().has(articleKey(s.number));
    const chapterOk=state.chapter==='all'||(state.chapter==='annexes'?s.type==='annex':s.chapter===state.chapter);
    const statusOk=state.status==='all'||(state.status==='changed'?changed:!changed);
    const queryOk=!state.query||norm([s.heading,s.title,s.chapter,s.text].join(' ')).includes(norm(state.query));
    return chapterOk&&statusOk&&queryOk;
  }

  function amendmentMatches(a){
    const queryOk=!state.query||norm([a.sequence,a.type,a.affected.join(' '),a.instruction].join(' ')).includes(norm(state.query));
    const chapterOk=state.chapter==='all';
    return queryOk&&chapterOk;
  }

  function currentRows(){ return state.view==='law' ? state.full.sections.filter(sectionMatches) : state.amendments.filter(amendmentMatches); }

  function renderList(){
    const rows=currentRows();
    const changed=changedSet();
    $('#legal-result-count').textContent=`${rows.length} resultado${rows.length===1?'':'s'}`;
    $('#legal-list-title').textContent=state.view==='law'?'Índice de la norma':state.view==='changes'?'Novedades normativas':'Operaciones modificadoras';
    $('#legal-status-filter').hidden=state.view!=='law';
    $('#legal-chapter').hidden=state.view!=='law';
    const list=$('#legal-list');
    if(!rows.length){ list.innerHTML='<div class="legal-empty-list">No hay resultados con estos filtros.</div>'; $('#legal-content').innerHTML='<div class="legal-empty-content">Ajusta los filtros para continuar.</div>'; return; }
    if(state.view==='law'){
      list.innerHTML=rows.map(s=>{
        const key=`section-${s.type}-${s.number}`; const isChanged=changed.has(articleKey(s.number));
        return `<button class="legal-list-item ${state.selected===key?'active':''}" data-id="${esc(key)}"><span class="legal-list-number">${esc(displaySection(s))}</span><span class="legal-list-title">${esc(s.title||'Sin título')}</span>${isChanged?'<span class="legal-change-mark">MODIFICADO</span>':''}</button>`;
      }).join('');
    } else {
      list.innerHTML=rows.map(a=>`<button class="legal-list-item ${state.selected===a.id?'active':''}" data-id="${esc(a.id)}"><span class="legal-list-number">Modificación ${a.sequence}</span><span class="legal-list-title">${esc(a.affected.length?'Afecta a: '+a.affected.map(x=>'Art. '+x).join(', '):'Contenido de la disposición')}</span><span class="legal-operation-tag ${esc(a.type)}">${esc(a.type)}</span></button>`).join('');
    }
    list.querySelectorAll('[data-id]').forEach(b=>b.addEventListener('click',()=>select(b.dataset.id)));
    if(!rows.some(r=>(state.view==='law'?`section-${r.type}-${r.number}`:r.id)===state.selected)){
      const first=rows[0]; state.selected=state.view==='law'?`section-${first.type}-${first.number}`:first.id;
    }
    renderContent();
  }

  function renderParagraphs(section){
    const paragraphs=(section.paragraphs||[]).map(p=>clean(p)).filter(Boolean);
    if(!paragraphs.length) return `<div class="legal-prose">${esc(section.text||'')}</div>`;
    return `<div class="legal-prose">${paragraphs.map(p=>/^([a-z]|\d+|[ivx]+)[).]?$/i.test(p)?`<span class="legal-enumerator">${esc(p)}</span>`:`<p>${esc(p)}</p>`).join('')}</div>`;
  }

  function relatedAmendments(number){ return state.amendments.filter(a=>a.affected.some(x=>articleKey(x)===articleKey(number))); }

  function renderLaw(section){
    const related=relatedAmendments(section.number);
    return `<header class="legal-document-head"><div><span>${esc(section.type==='article'?chapterLabel(section.chapter):'Anexo')}</span><h2>${esc(displaySection(section))}${section.title?' · '+esc(section.title):''}</h2></div>${related.length?'<span class="legal-doc-status changed">Modificado por el Omnibus</span>':'<span class="legal-doc-status">Texto base</span>'}</header>
      ${related.length?`<div class="legal-change-alert"><b>Esta disposición tiene ${related.length} modificación${related.length===1?'':'es'} detectada${related.length===1?'':'s'}.</b><button data-open-compare="${esc(section.number)}">Ver qué cambia →</button></div>`:''}
      <div class="legal-source-label">Texto del Reglamento (UE) 2024/1689</div>${renderParagraphs(section)}
      <footer class="legal-document-footer"><span>Fuente: EUR-Lex · CELEX 32024R1689</span><a href="${esc(state.full.source.html_url)}" target="_blank" rel="noopener">Abrir texto oficial ↗</a></footer>`;
  }

  function renderChanges(a){
    return `<header class="legal-document-head"><div><span>Digital Omnibus · Operación ${a.sequence}</span><h2>${esc(a.type[0].toUpperCase()+a.type.slice(1))} normativa</h2></div><span class="legal-doc-status pending">Requiere validación</span></header>
      <div class="legal-amendment-meta"><div><small>Disposiciones relacionadas</small><b>${esc(a.affected.length?a.affected.map(x=>'Artículo '+x).join(' · '):'Contenido continuado')}</b></div><div><small>Estado de consolidación</small><b>No consolidado automáticamente</b></div></div>
      <div class="legal-source-label">Instrucción jurídica oficial</div><div class="legal-prose legal-instruction">${esc(a.instruction).replace(/\n\n/g,'</p><p>').replace(/^/,'<p>').replace(/$/,'</p>')}</div>
      <div class="legal-validation-box"><b>Qué muestra esta vista</b><p>La operación normativa tal como fue extraída de la norma modificadora. No se sustituye el texto vigente hasta completar la revisión jurídica de cada apartado.</p></div>
      <footer class="legal-document-footer"><span>Fuente: EUR-Lex · CELEX 32026R1744</span><a href="${esc(state.rawChanges.source.html_url)}" target="_blank" rel="noopener">Abrir norma modificadora ↗</a></footer>`;
  }

  function renderCompare(a){
    const originals=a.affected.map(n=>state.full.sections.find(s=>s.type==='article'&&articleKey(s.number)===articleKey(n))).filter(Boolean);
    return `<header class="legal-document-head"><div><span>Comparación normativa · Operación ${a.sequence}</span><h2>${esc(a.affected.length?a.affected.map(x=>'Artículo '+x).join(' · '):'Disposición modificadora')}</h2></div><span class="legal-doc-status pending">Consolidación pendiente</span></header>
      <div class="legal-compare-grid">
        <section class="legal-compare-column before"><header><span>ANTES</span><b>Reglamento (UE) 2024/1689</b></header><div class="legal-compare-scroll">${originals.length?originals.map(s=>`<h3>${esc(displaySection(s))} · ${esc(s.title||'')}</h3>${renderParagraphs(s)}`).join(''):'<div class="legal-unavailable">No se ha podido vincular automáticamente un artículo base. Consulta la instrucción jurídica.</div>'}</div></section>
        <section class="legal-compare-column change"><header><span>CAMBIO</span><b>Reglamento (UE) 2026/1744</b></header><div class="legal-compare-scroll"><div class="legal-prose legal-instruction">${esc(a.instruction).replace(/\n\n/g,'</p><p>').replace(/^/,'<p>').replace(/$/,'</p>')}</div></div></section>
      </div>
      <div class="legal-consolidation-lock"><span>🔒</span><div><b>Texto consolidado no publicado todavía</b><p>El JSON de origen indica <code>pending_validated_consolidation</code>. Por seguridad jurídica, esta vista enseña el texto anterior y la operación exacta, pero no inventa un “después” automático.</p></div></div>`;
  }

  function renderContent(){
    const el=$('#legal-content');
    if(state.view==='law'){
      const s=state.full.sections.find(x=>`section-${x.type}-${x.number}`===state.selected); if(s) el.innerHTML=renderLaw(s);
    } else {
      const a=state.amendments.find(x=>x.id===state.selected); if(a) el.innerHTML=state.view==='changes'?renderChanges(a):renderCompare(a);
    }
    el.querySelectorAll('[data-open-compare]').forEach(b=>b.addEventListener('click',()=>{
      const n=b.dataset.openCompare; const a=relatedAmendments(n)[0]; if(!a)return; setView('compare',a.id);
    }));
    el.scrollTop=0;
  }

  function select(id){ state.selected=id; renderList(); }
  function setView(view,selected=null){
    state.view=view; state.selected=selected; state.chapter='all'; state.status='all';
    $$('.legal-mode').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
    $('#legal-chapter').value='all'; $('#legal-status-filter').value='all';
    renderList();
  }

  function bind(){
    $$('.legal-mode').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
    $('#legal-search').addEventListener('input',e=>{state.query=e.target.value;renderList();});
    $('#legal-chapter').addEventListener('change',e=>{state.chapter=e.target.value;renderList();});
    $('#legal-status-filter').addEventListener('change',e=>{state.status=e.target.value;renderList();});
    $('#legal-collapse').addEventListener('click',()=>$('.legal-workspace').classList.toggle('index-hidden'));
  }

  Promise.all(Object.entries(PATHS).map(async ([key,url])=>{ const r=await fetch(url,{cache:'no-store'}); if(!r.ok) throw new Error(`No se pudo cargar ${url}`); return [key,await r.json()]; }))
    .then(entries=>{
      const data=Object.fromEntries(entries); state.full=data.full; state.rawChanges=data.changes; state.index=data.index;
      state.amendments=normalizeAmendments(data.changes.changes||[]);
      $('#legal-generated').innerHTML=`<b>Datos</b> ${esc(formatDate(data.index.generated_at_utc))}`;
      renderDashboard(); populateChapters(); bind(); renderList();
    })
    .catch(err=>{ $('#legal-content').innerHTML=`<div class="legal-fatal"><b>No se pudo iniciar el observatorio</b><p>${esc(err.message)}</p><small>Comprueba que los tres JSON estén en <code>/data/normativa/</code> y abre la web mediante servidor HTTP.</small></div>`; });
})();
