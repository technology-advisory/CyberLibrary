(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const clean = v => String(v ?? '').replace(/\r/g,'').replace(/\n{3,}/g,'\n\n').trim();
  const safeOfficialSourceUrl = value => { try { const u = new URL(String(value || ''), location.origin); return (u.protocol === 'https:' && u.hostname === 'eur-lex.europa.eu') ? u.href : '#'; } catch (_) { return '#'; } };
  const norm = v => clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const articleKey = v => norm(v).replace(/\s+/g,'').replace('articulo','');
  const mode = document.body.dataset.legalReader;
  const dataPath = mode === 'base' ? '/assets/data/normativa/ai-act-full.json' : '/assets/data/normativa/ai-act-changes.json';
  const state = { rows: [], filtered: [], selected: null };

  function isToken(v){ return /^([a-z](?:\s?(?:bis|ter|quater|quinquies))?|\d+(?:\s?(?:bis|ter|quater|quinquies))?|[ivxlcdm]+)[).]?$/i.test(clean(v)); }
  function renderParagraphs(section){
    const parts=(section.paragraphs||[]).map(clean).filter(Boolean);
    const blocks=[];
    for(let i=0;i<parts.length;i++){
      const current=parts[i];
      if(isToken(current) && parts[i+1] && !isToken(parts[i+1])){
        blocks.push({label:current,text:parts[i+1]});
        i++;
      } else {
        const inline=current.match(/^((?:\d+(?:\s?(?:bis|ter|quater|quinquies))?|[a-z](?:\s?(?:bis|ter|quater|quinquies))?|[ivxlcdm]+)[).])\s+(.*)$/i);
        if(inline) blocks.push({label:inline[1],text:inline[2]});
        else blocks.push({label:'',text:current});
      }
    }
    return `<div class="reader-base-article">${blocks.map(block=>{
      const top=block.label?`<div class="reader-base-label">${esc(block.label)}</div>`:'';
      const body=block.text?`<div class="reader-base-body"><p>${esc(block.text)}</p></div>`:'';
      return `<section class="reader-base-block ${block.label?'has-label':''}">${top}${body}</section>`;
    }).join('')}</div>`;
  }
  function legalInstruction(text){
    const parts=clean(text).split(/\n\n+/).map(clean).filter(Boolean);
    if(!parts.length) return '';
    const out=[];
    let index=0;
    const operation=parts[0].match(/^(\d+)\)$/);
    if(operation){
      out.push(`<div class="reader-operation-number"><span>Operación normativa</span><b>${esc(operation[1])}</b></div>`);
      index=1;
    }
    for(;index<parts.length;index++){
      const part=parts[index];
      const article=part.match(/^«?Artículo\s+(.+)$/i);
      const enumToken=part.match(/^([a-z](?:\s?(?:bis|ter|quater|quinquies))?|\d+(?:\s?(?:bis|ter|quater|quinquies))?|[ivxlcdm]+)[).]?$/i);
      const instruction=/^(Se inserta|Se añade|Se añaden|Se sustituye|Se sustituyen|Se suprime|El artículo|En el artículo|Los artículos|El anexo|En el anexo)/i.test(part);
      const titleLike=!/[.;:]$/.test(part)&&part.length<145&&index>0&&!enumToken&&!instruction;
      if(article){
        out.push(`<div class="reader-law-article"><span>Artículo</span><strong>${esc(article[1].replace(/[»«]/g,''))}</strong></div>`);
      } else if(enumToken){
        out.push(`<div class="reader-law-enumerator">${esc(part)}</div>`);
      } else if(instruction){
        out.push(`<div class="reader-law-action"><span class="reader-law-action-icon">§</span><p>${esc(part)}</p></div>`);
      } else if(titleLike){
        out.push(`<h3 class="reader-law-title">${esc(part.replace(/[»«]/g,''))}</h3>`);
      } else {
        out.push(`<p class="reader-law-paragraph">${esc(part.replace(/^«|»$/g,''))}</p>`);
      }
    }
    return out.join('');
  }
  function primaryArticle(text){
    const inserted=clean(text).match(/Se inserta el artículo siguiente:\s*«Artículo\s+(\d+(?:\s?(?:bis|ter|quater|quinquies))?)/i);
    if(inserted) return clean(inserted[1]);
    const direct=clean(text).match(/(?:En el artículo|El artículo)\s+(\d+(?:\s?(?:bis|ter|quater|quinquies))?)/i);
    return direct ? clean(direct[1]) : '';
  }
  function normalizeChanges(items){
    const out=[];
    for(const item of items||[]){
      const text=clean(item.legal_instruction);
      if(/^\d+\)/.test(text)||!out.length){ out.push({sequence:item.sequence,instruction:text,primary:primaryArticle(text)}); }
      else { const last=out[out.length-1]; last.instruction+=`\n\n${text}`; if(!last.primary) last.primary=primaryArticle(last.instruction); }
    }
    return out;
  }
  function renderSummary(cards){
    $('#reader-summary').innerHTML=cards.map(c=>`<div class="reader-summary-card"><span>${esc(c.label)}</span><b>${esc(c.value)}</b><small>${esc(c.note)}</small></div>`).join('');
  }
  function rowId(row){ return row.id; }
  function setHash(id){ history.replaceState(null,'',`#${id}`); }
  function currentIndex(){ return state.filtered.findIndex(r=>rowId(r)===state.selected); }

  function renderNav(){
    $('#reader-count').textContent=`${state.filtered.length} resultado${state.filtered.length===1?'':'s'}`;
    $('#reader-nav').innerHTML=state.filtered.map(r=>`<button class="reader-nav-item ${rowId(r)===state.selected?'active':''}" data-id="${esc(rowId(r))}"><b>${esc(r.label)}</b><span>${esc(r.title||'')}</span></button>`).join('') || '<div class="reader-empty-nav">No hay resultados.</div>';
    $('#reader-nav').querySelectorAll('[data-id]').forEach(b=>b.addEventListener('click',()=>select(b.dataset.id)));
  }

  function renderSelected(){
    const row=state.rows.find(r=>rowId(r)===state.selected);
    if(!row){ $('#reader-content').innerHTML='<div class="reader-empty">No hay contenido para mostrar.</div>'; return; }
    const idx=currentIndex();
    const prev=idx>0?state.filtered[idx-1]:null;
    const next=idx>=0&&idx<state.filtered.length-1?state.filtered[idx+1]:null;
    const prerendered=[...$('#reader-content').querySelectorAll('[data-reader-id]')];
    if(prerendered.length){
      prerendered.forEach(article=>{ article.hidden=article.dataset.readerId!==row.id; article.querySelectorAll('.reader-pager[data-enhanced]').forEach(node=>node.remove()); });
      const selected=prerendered.find(article=>article.dataset.readerId===row.id);
      if(selected){
        selected.insertAdjacentHTML('beforeend',`<footer class="reader-pager" data-enhanced="true"><button type="button" data-go="${prev?esc(prev.id):''}" ${prev?'':'disabled'}>← ${prev?esc(prev.label):'Anterior'}</button><span>${idx+1} de ${state.filtered.length}</span><button type="button" data-go="${next?esc(next.id):''}" ${next?'':'disabled'}>${next?esc(next.label):'Siguiente'} →</button></footer>`);
        selected.querySelectorAll('[data-go]').forEach(b=>{ if(!b.disabled)b.addEventListener('click',()=>select(b.dataset.go)); });
      }
      setHash(row.id);
      $('#reader-content').scrollTop=0;
      return;
    }
    const body = mode==='base'
      ? `<div class="reader-prose reader-base-document">${renderParagraphs(row.source)}</div>`
      : `<div class="reader-prose reader-instruction reader-legal-document">${legalInstruction(row.source.instruction)}</div>`;
    $('#reader-content').innerHTML=`
      <article class="reader-document-single">
        <header class="reader-doc-head"><div><div class="reader-doc-meta">${esc(row.meta)}</div><h2>${esc(row.heading)}</h2></div><a class="reader-anchor" href="#${esc(row.id)}" aria-label="Enlace directo">#</a></header>
        ${body}
        <footer class="reader-pager">
          <button type="button" data-go="${prev?esc(prev.id):''}" ${prev?'':'disabled'}>← ${prev?esc(prev.label):'Anterior'}</button>
          <span>${idx+1} de ${state.filtered.length}</span>
          <button type="button" data-go="${next?esc(next.id):''}" ${next?'':'disabled'}>${next?esc(next.label):'Siguiente'} →</button>
        </footer>
      </article>`;
    $('#reader-content').querySelectorAll('[data-go]').forEach(b=>{ if(!b.disabled)b.addEventListener('click',()=>select(b.dataset.go)); });
    setHash(row.id);
    $('#reader-content').scrollTop=0;
  }

  function select(id){ state.selected=id; renderNav(); renderSelected(); }
  function applySearch(){
    const q=norm($('#reader-search').value);
    state.filtered=state.rows.filter(r=>!q||r.search.includes(q));
    if(!state.filtered.some(r=>rowId(r)===state.selected)) state.selected=state.filtered[0]?.id||null;
    renderNav(); renderSelected();
  }
  function bindUi(){
    $('#reader-search').addEventListener('input',applySearch);
    $('#reader-toggle-nav').addEventListener('click',()=>$('#reader-workspace').classList.toggle('nav-hidden'));
  }

  function renderBase(data){
    $('#reader-title').textContent=data.document.title;
    $('#reader-subtitle').textContent=data.document.official_number;
    $('#reader-source').href=safeOfficialSourceUrl(data.source?.html_url);
    renderSummary([
      {label:'Documento',value:data.document.official_number,note:'Texto completo en español'},
      {label:'Artículos',value:String(data.statistics?.article_count||0),note:'Consulta individual'},
      {label:'Anexos',value:String(data.statistics?.annex_count||0),note:'Incluidos en el índice'},
      {label:'Fuente',value:'EUR-Lex',note:`CELEX ${data.document.celex||'32024R1689'}`}
    ]);
    state.rows=(data.sections||[]).map(section=>{
      const isArticle=section.type==='article';
      const id=isArticle?`articulo-${articleKey(section.number)}`:`anexo-${articleKey(section.number)}`;
      const label=isArticle?`Artículo ${section.number}`:`Anexo ${section.number}`;
      return {id,label,title:section.title||'',meta:isArticle?(section.chapter?`Capítulo ${section.chapter}`:'Reglamento'):'Anexo',heading:`${label}${section.title?' · '+section.title:''}`,source:section,search:norm([section.heading,section.title,section.chapter,section.text].join(' '))};
    });
    start();
  }

  function renderChanges(data){
    $('#reader-title').textContent=data.amending_document.title;
    $('#reader-subtitle').textContent=data.amending_document.official_number;
    $('#reader-source').href=safeOfficialSourceUrl(data.source?.html_url);
    const changes=normalizeChanges(data.changes);
    const affected=[...new Set(changes.map(c=>c.primary).filter(Boolean))];
    renderSummary([
      {label:'Documento',value:data.amending_document.official_number,note:'Norma modificadora'},
      {label:'Operaciones',value:String(changes.length),note:'Consulta individual'},
      {label:'Artículos afectados',value:String(affected.length),note:'Referencias principales'},
      {label:'Fuente',value:'EUR-Lex',note:`CELEX ${data.amending_document.celex||'32026R1744'}`}
    ]);
    state.rows=changes.map(c=>({id:`modificacion-${c.sequence}`,label:`Modificación ${c.sequence}`,title:c.primary?`Artículo ${c.primary}`:'Disposición modificadora',meta:`Operación ${c.sequence}${c.primary?` · Artículo ${c.primary}`:''}`,heading:`Modificación ${c.sequence}${c.primary?` · Artículo ${c.primary}`:''}`,source:c,search:norm([c.primary,c.instruction].join(' '))}));
    start();
  }

  function start(){
    state.filtered=[...state.rows];
    const hash=location.hash.replace('#','');
    state.selected=state.rows.some(r=>r.id===hash)?hash:state.rows[0]?.id||null;
    bindUi(); renderNav(); renderSelected();
  }

  fetch(dataPath).then(r=>{if(!r.ok)throw new Error('No se pudo cargar la norma');return r.json();}).then(data=>mode==='base'?renderBase(data):renderChanges(data)).catch(err=>{$('#reader-content').innerHTML=`<div class="reader-error">${esc(err.message)}</div>`;});
})();
