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
  const labelKey = v => norm(v).replace(/[().\s]/g,'');
  const formatDate = iso => { try { return new Intl.DateTimeFormat('es-ES',{dateStyle:'long',timeStyle:'short'}).format(new Date(iso)); } catch { return iso; } };

  function operationType(text){
    const n=norm(text);
    if(/se suprime|quedan suprimid/.test(n)) return 'supresión';
    if(/se inserta|se insertan|se añade|se añaden/.test(n)) return 'adición';
    if(/se sustituye|se sustituyen/.test(n)) return 'sustitución';
    return 'modificación';
  }

  function primaryArticleFromInstruction(text){
    const source=clean(text);
    const direct=source.match(/(?:En el artículo|El artículo)\s+(\d+(?:\s?(?:bis|ter|quater|quinquies))?)/i);
    if(direct) return clean(direct[1]);
    const inserted=source.match(/Se inserta el artículo siguiente:\s*«Artículo\s+(\d+(?:\s?(?:bis|ter|quater|quinquies))?)/i);
    if(inserted) return clean(inserted[1]);
    return '';
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
          primary:primaryArticleFromInstruction(text),
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
    return new Set(state.amendments.map(a=>a.primary).filter(Boolean).map(articleKey));
  }

  function chapterLabel(ch){ return ch ? `Capítulo ${ch}` : 'Anexos'; }
  function displaySection(s){ return s.type==='article' ? `Artículo ${s.number}` : `Anexo ${s.number}`; }
  function isEnumeratorToken(v){ return /^([a-z](?:\s?(?:bis|ter|quater|quinquies))?|\d+(?:\s?(?:bis|ter|quater|quinquies))?|[ivxlcdm]+)[).]?$/i.test(clean(v)); }
  function normalizeContentText(v){ return clean(v).replace(/\n+/g,' ').replace(/\s+/g,' ').trim(); }

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
      list.innerHTML=rows.map(a=>`<button class="legal-list-item ${state.selected===a.id?'active':''}" data-id="${esc(a.id)}"><span class="legal-list-number">Modificación ${a.sequence}</span><span class="legal-list-title">${esc(a.primary?'Artículo '+a.primary:(a.affected.length?'Referencias: '+a.affected.map(x=>'Art. '+x).join(', '):'Contenido de la disposición'))}</span><span class="legal-operation-tag ${esc(a.type)}">${esc(a.type)}</span></button>`).join('');
    }
    list.querySelectorAll('[data-id]').forEach(b=>b.addEventListener('click',()=>select(b.dataset.id)));
    if(!rows.some(r=>(state.view==='law'?`section-${r.type}-${r.number}`:r.id)===state.selected)){
      const first=rows[0]; state.selected=state.view==='law'?`section-${first.type}-${first.number}`:first.id;
    }
    renderContent();
  }

  function renderParagraphs(section){
    const blocks=buildBlocks(section);
    return `<div class="legal-prose legal-article-document">${blocks.map(block=>{
      const top=block.label?`<div class="legal-article-enumerator">${esc(block.label)}</div>`:'';
      const body=block.content?`<div class="legal-article-paragraph">${esc(block.content)}</div>`:'';
      return `<div class="legal-article-row">${top}${body}</div>`;
    }).join('')}</div>`;
  }


  function relatedAmendments(number){ return state.amendments.filter(a=>articleKey(a.primary)===articleKey(number)); }

  function renderLaw(section){
    const related=relatedAmendments(section.number);
    return `<header class="legal-document-head"><div><span>${esc(section.type==='article'?chapterLabel(section.chapter):'Anexo')}</span><h2>${esc(displaySection(section))}${section.title?' · '+esc(section.title):''}</h2></div>${related.length?'<span class="legal-doc-status changed">Modificado por el Omnibus</span>':'<span class="legal-doc-status">Texto base</span>'}</header>
      ${related.length?`<div class="legal-change-alert"><b>Esta disposición tiene ${related.length} modificación${related.length===1?'':'es'} detectada${related.length===1?'':'s'}.</b><button data-open-compare="${esc(section.number)}">Ver qué cambia →</button></div>`:''}
      <div class="legal-source-label">Texto del Reglamento (UE) 2024/1689</div>${renderParagraphs(section)}
      <footer class="legal-document-footer"><span>Fuente: EUR-Lex · CELEX 32024R1689</span><a href="${esc(state.full.source.html_url)}" target="_blank" rel="noopener">Abrir texto oficial ↗</a></footer>`;
  }

  function renderChanges(a){
    return `<header class="legal-document-head"><div><span>Digital Omnibus · Operación ${a.sequence}</span><h2>${esc(a.type[0].toUpperCase()+a.type.slice(1))} normativa</h2></div><span class="legal-doc-status pending">Requiere validación</span></header>
      <div class="legal-amendment-meta"><div><small>Disposiciones relacionadas</small><b>${esc(a.primary?'Artículo '+a.primary:(a.affected.length?a.affected.map(x=>'Artículo '+x).join(' · '):'Contenido continuado'))}</b></div><div><small>Estado de consolidación</small><b>No consolidado automáticamente</b></div></div>
      <div class="legal-source-label">Instrucción jurídica oficial</div><div class="legal-prose legal-instruction">${esc(a.instruction).replace(/\n\n/g,'</p><p>').replace(/^/,'<p>').replace(/$/,'</p>')}</div>
      <div class="legal-validation-box"><b>Qué muestra esta vista</b><p>La operación normativa tal como fue extraída de la norma modificadora. No se sustituye el texto vigente hasta completar la revisión jurídica de cada apartado.</p></div>
      <footer class="legal-document-footer"><span>Fuente: EUR-Lex · CELEX 32026R1744</span><a href="${esc(state.rawChanges.source.html_url)}" target="_blank" rel="noopener">Abrir norma modificadora ↗</a></footer>`;
  }

  function buildBlocks(section){
    const paragraphs=(section.paragraphs||[]).map(p=>clean(p)).filter(Boolean);
    const blocks=[];
    for(let i=0;i<paragraphs.length;i++){
      const current=paragraphs[i];
      if(isEnumeratorToken(current) && paragraphs[i+1] && !isEnumeratorToken(paragraphs[i+1])){
        blocks.push({label:current, content:paragraphs[i+1], kind:'paired'});
        i++;
        continue;
      }
      const inline=current.match(/^((?:\d+(?:\s?(?:bis|ter|quater|quinquies))?|[a-z](?:\s?(?:bis|ter|quater|quinquies))?|[ivxlcdm]+)[).])\s+(.*)$/i);
      if(inline){
        blocks.push({label:inline[1], content:inline[2], kind:'inline'});
      } else if(isEnumeratorToken(current)){
        blocks.push({label:current, content:'', kind:'token'});
      } else {
        blocks.push({label:'', content:current, kind:'text'});
      }
    }
    return blocks;
  }

  function renderCompareBlocks(blocks){
    return `<div class="legal-article-view legal-article-document">${blocks.map(block=>{
      const type=block.changeType||'';
      const cls=['legal-block','legal-article-row',type?`is-${type}`:''].filter(Boolean).join(' ');
      const badge = type ? `<span class="legal-change-badge">${esc(block.changeLabel || (type==='removed'?'Supresión':type==='added'?'Adición':'Cambio'))}</span>` : '';
      const top = (block.label || badge) ? `<div class="legal-block-top">${block.label?`<div class="legal-article-enumerator">${esc(block.label)}</div>`:''}${badge}</div>` : '';
      const bodyContent = type==='removed' && block.content
        ? `<div class="legal-article-paragraph legal-removed-text">${esc(block.content)}</div>`
        : (block.content ? `<div class="legal-article-paragraph">${esc(block.content)}</div>` : '');
      return `<div class="${cls}">${top}${bodyContent}</div>`;
    }).join('')}</div>`;
  }


  function extractFirstQuotedAfter(text, regex){
    const m=text.match(regex);
    return m ? clean(m[1]) : '';
  }

  function splitStructuredQuote(quote){
    const content=clean(quote);
    if(!content) return [];
    const results=[];
    const re=/((?:\d+(?:\s?(?:bis|ter|quater|quinquies))?|[a-z](?:\s?(?:bis|ter|quater|quinquies))?|[ivxlcdm]+)[).])\s*\n\n([\s\S]*?)(?=(?:\n\n(?:\d+(?:\s?(?:bis|ter|quater|quinquies))?|[a-z](?:\s?(?:bis|ter|quater|quinquies))?|[ivxlcdm]+)[).]\s*\n\n)|$)/gi;
    let found=false;
    let m;
    let firstMatchIndex=null;
    while((m=re.exec(content))){
      if(firstMatchIndex===null) firstMatchIndex=m.index;
      found=true;
      results.push({label:clean(m[1]), content:clean(m[2])});
    }
    if(!found){
      const firstSplit = content.split(/\n\n/);
      if(firstSplit.length>1 && isEnumeratorToken(firstSplit[0])){
        return [{label:clean(firstSplit[0]), content:clean(firstSplit.slice(1).join('\n\n'))}];
      }
      return [{label:'', content}];
    }
    const prefix = clean(content.slice(0, firstMatchIndex || 0));
    if(prefix) results.unshift({label:'', content:prefix});
    return results;
  }

  function findBlockIndex(blocks, label){
    const key=labelKey(label);
    return blocks.findIndex(b=>labelKey(b.label)===key || labelKey(b.content.split(/\s+/)[0])===key);
  }

  function replaceOrMark(blocks, label, newContent, mode='changed', changeLabel='Cambio'){
    const idx=findBlockIndex(blocks, label);
    const normalized = Array.isArray(newContent) ? newContent : [{label, content:newContent}];
    const mapped = normalized.map((entry, i)=>({
      label: entry.label || (i===0 ? blocks[idx]?.label || label : ''),
      content: clean(entry.content || ''),
      kind:'generated',
      changeType: mode,
      changeLabel
    }));
    if(idx>=0){
      blocks.splice(idx,1,...mapped);
      return true;
    }
    blocks.push(...mapped);
    return false;
  }

  function insertAfter(blocks, afterLabel, entries, changeLabel='Adición'){
    const idx=findBlockIndex(blocks, afterLabel);
    const mapped=(entries||[]).map(entry=>({label:entry.label||'',content:clean(entry.content||''),kind:'generated',changeType:'added',changeLabel}));
    if(!mapped.length) return;
    if(idx>=0) blocks.splice(idx+1,0,...mapped);
    else blocks.push(...mapped);
  }

  function markSuppressed(blocks, label){
    const idx=findBlockIndex(blocks,label);
    if(idx>=0){
      blocks[idx]={...blocks[idx],changeType:'removed',changeLabel:'Supresión'};
      return;
    }
    blocks.push({label,content:'Suprimido por el Reglamento (UE) 2026/1744.',kind:'generated',changeType:'removed',changeLabel:'Supresión'});
  }

  function quoteBlocks(quote, badge='Texto resaltado'){
    const chunks=splitStructuredQuote(quote);
    return chunks.map(chunk=>({label:chunk.label,content:chunk.content,kind:'generated',changeType:'changed',changeLabel:badge}));
  }

  function renderStandaloneQuote(quote, badge='Texto resaltado'){
    return renderCompareBlocks(quoteBlocks(quote,badge));
  }

  function renderSyncCell(block, side){
    if(!block) return `<div class="legal-sync-cell ${side} empty"><span>—</span></div>`;
    const type=block.changeType||'';
    const cls=['legal-sync-cell',side,type?`is-${type}`:''].filter(Boolean).join(' ');
    const badge=type?`<span class="legal-change-badge">${esc(block.changeLabel || (type==='removed'?'Supresión':type==='added'?'Adición':'Cambio'))}</span>`:'';
    const top=(block.label||badge)?`<div class="legal-block-top">${block.label?`<div class="legal-article-enumerator">${esc(block.label)}</div>`:''}${badge}</div>`:'';
    const body=block.content?`<div class="legal-article-paragraph ${type==='removed'?'legal-removed-text':''}">${esc(block.content)}</div>`:'';
    return `<div class="${cls}">${top}${body}</div>`;
  }

  function alignCompareBlocks(beforeBlocks, afterBlocks){
    const rows=[];
    const used=new Set();
    beforeBlocks.forEach((before,index)=>{
      let match=-1;
      const key=labelKey(before.label);
      if(key) match=afterBlocks.findIndex((after,i)=>!used.has(i)&&labelKey(after.label)===key);
      if(match<0 && afterBlocks[index] && !used.has(index)) match=index;
      const after=match>=0?afterBlocks[match]:null;
      if(match>=0) used.add(match);
      rows.push({before,after});
    });
    afterBlocks.forEach((after,index)=>{ if(!used.has(index)) rows.push({before:null,after}); });
    return rows;
  }

  function renderSynchronizedCompare(beforeBlocks, afterBlocks, articleHeading, headers){
    const rows=alignCompareBlocks(beforeBlocks,afterBlocks);
    return `<div class="legal-sync-compare">
      <div class="legal-sync-header before"><span>ANTES</span><b>Reglamento (UE) 2024/1689</b></div>
      <div class="legal-sync-header after"><span>${esc(headers.label)}</span><b>${esc(headers.title)}</b></div>
      <div class="legal-sync-title before">${esc(articleHeading)}</div>
      <div class="legal-sync-title after">${esc(articleHeading)}</div>
      ${rows.map(row=>`${renderSyncCell(row.before,'before')}${renderSyncCell(row.after,'after')}`).join('')}
    </div>`;
  }

  function buildAssistedCompare(section, amendment){
    const instruction=clean(amendment.instruction);
    const blocks=buildBlocks(section).map(b=>({...b}));
    const notes=[];

    const articleReplace = extractFirstQuotedAfter(instruction, /se sustituye por el texto siguiente:\s*«([\s\S]+)»/i);
    const wholeArticlePattern=/^\d+\)\s*\n+El artículo\s+\d+(?:\s?(?:bis|ter|quater|quinquies))?\s+se sustituye por el texto siguiente:/i;
    if(wholeArticlePattern.test(instruction) && articleReplace){
      return {
        mode:'whole-article',
        html: renderStandaloneQuote(articleReplace, 'Artículo sustituido'),
        blocks: quoteBlocks(articleReplace, 'Artículo sustituido'),
        note: 'La disposición completa ha sido sustituida. El nuevo artículo se muestra íntegramente resaltado.'
      };
    }

    const insertedArticle = extractFirstQuotedAfter(instruction, /se inserta el artículo siguiente:\s*«([\s\S]+)»/i);
    if(/Se inserta el artículo siguiente:/i.test(instruction) && insertedArticle){
      return {
        mode:'inserted-article',
        html: renderStandaloneQuote(insertedArticle, 'Artículo nuevo'),
        blocks: quoteBlocks(insertedArticle, 'Artículo nuevo'),
        note: 'El artículo no existía en la versión anterior. Se muestra íntegramente como nueva incorporación.'
      };
    }

    let matched=false;

    // Sustituciones de letras
    let m;
    const letterReplace=/la letra\s+([a-z](?:\s?(?:bis|ter|quater|quinquies))?)\)\s+se sustituye por el texto siguiente:\s*«([\s\S]*?)»/gi;
    while((m=letterReplace.exec(instruction))){
      matched=true;
      const label=`${clean(m[1])})`;
      const parsed=splitStructuredQuote(m[2]);
      const first=parsed[0] || {label,content:m[2]};
      replaceOrMark(blocks,label,[{label,content:(first && Object.prototype.hasOwnProperty.call(first,'content')) ? first.content : clean(m[2])}], 'changed', 'Cambio');
      notes.push(`Se ha resaltado la letra ${label}.`);
    }

    // Inserciones de letras
    const insertLetters=instruction.match(/se insertan las letras siguientes:\s*«([\s\S]*?)»/i);
    if(insertLetters){
      matched=true;
      const parsed=splitStructuredQuote(insertLetters[1]);
      const firstLabel=parsed[0]?.label || '';
      // intentar insertar detrás de la letra anterior
      const afterLabel = firstLabel ? String.fromCharCode(firstLabel.trim().charCodeAt(0)-1)+')' : '';
      insertAfter(blocks, afterLabel, parsed, 'Adición');
      notes.push('Se han resaltado las letras añadidas.');
    }

    // Sustituciones de apartados
    const paraReplace=/el apartado\s+(\d+(?:\s?(?:bis|ter|quater|quinquies))?)\s+se sustituye por el texto siguiente:\s*«([\s\S]*?)»/gi;
    while((m=paraReplace.exec(instruction))){
      matched=true;
      const label=`${clean(m[1])}.`;
      let parsed=splitStructuredQuote(m[2]);
      if(parsed.length===1 && !parsed[0].label){ parsed=[{label,content:parsed[0].content}]; }
      if(parsed.length===1 && parsed[0].label && labelKey(parsed[0].label)!==labelKey(label)){ parsed=[{label,content:parsed[0].content}]; }
      replaceOrMark(blocks,label,parsed,'changed','Cambio');
      notes.push(`Se ha resaltado el apartado ${clean(m[1])}.`);
    }

    // Sustituciones de puntos (definiciones)
    const pointReplace=/el punto\s+(\d+(?:\s?(?:bis|ter|quater|quinquies))?)\s+se sustituye por el texto siguiente:\s*«([\s\S]*?)»/gi;
    while((m=pointReplace.exec(instruction))){
      matched=true;
      const label=`${clean(m[1])})`;
      let parsed=splitStructuredQuote(m[2]);
      if(parsed.length===1 && !parsed[0].label) parsed=[{label,content:parsed[0].content}];
      replaceOrMark(blocks,label,parsed,'changed','Cambio');
      notes.push(`Se ha resaltado el punto ${clean(m[1])}.`);
    }

    const insertPoints=instruction.match(/se insertan los puntos siguientes:\s*«([\s\S]*?)»/i);
    if(insertPoints){
      matched=true;
      const parsed=splitStructuredQuote(insertPoints[1]);
      const firstLabel=parsed[0]?.label || '';
      const numeric=firstLabel.match(/^(\d+)/);
      const previous=numeric?`${Math.max(1,parseInt(numeric[1],10)-1)})`:'';
      insertAfter(blocks,previous,parsed,'Adición');
      notes.push('Se han resaltado los nuevos puntos añadidos.');
    }

    // Añadir apartado singular
    const addSingle=instruction.match(/se añade el apartado siguiente:\s*«([\s\S]*?)»/i);
    if(addSingle){
      matched=true;
      const parsed=splitStructuredQuote(addSingle[1]);
      const firstLabel=parsed[0]?.label || '';
      const previous = firstLabel.match(/^(\d+)/) ? `${Math.max(1, parseInt(firstLabel,10)-1)}.` : '';
      insertAfter(blocks, previous, parsed, 'Adición');
      notes.push('Se ha resaltado el nuevo apartado añadido.');
    }

    // Añadir apartados plural
    const addPlural=instruction.match(/se añaden los apartados siguientes:\s*«([\s\S]*?)»/i);
    if(addPlural){
      matched=true;
      const parsed=splitStructuredQuote(addPlural[1]);
      const firstLabel=parsed[0]?.label || '';
      const previous = firstLabel.match(/^(\d+)/) ? `${Math.max(1, parseInt(firstLabel,10)-1)}.` : '';
      insertAfter(blocks, previous, parsed, 'Adición');
      notes.push('Se han resaltado los apartados añadidos.');
    }

    // Supresiones
    const suppress=/se suprime\s+(?:el\s+)?apartado\s+(\d+(?:\s?(?:bis|ter|quater|quinquies))?)/gi;
    while((m=suppress.exec(instruction))){
      matched=true;
      markSuppressed(blocks, `${clean(m[1])}.`);
      notes.push(`Se ha marcado la supresión del apartado ${clean(m[1])}.`);
    }

    if(!matched){
      return {
        mode:'fallback',
        html: `<div class="legal-unavailable">No se ha podido pintar automáticamente este cambio dentro del artículo completo.</div>`,
        note: 'La operación es más compleja que los patrones automáticos disponibles. Puedes abrir la modificación completa desde el botón inferior.'
      };
    }

    return { mode:'assisted', html:renderCompareBlocks(blocks), blocks, note: notes.join(' ') };
  }

  function renderCompare(a){
    const mainArticle = a.primary || a.affected[0];
    const original = state.full.sections.find(s=>s.type==='article'&&articleKey(s.number)===articleKey(mainArticle));
    let compare = original ? buildAssistedCompare(original, a) : null;
    if(!compare && /Se inserta el artículo siguiente:/i.test(clean(a.instruction))){
      const inserted=extractFirstQuotedAfter(clean(a.instruction),/se inserta el artículo siguiente:\s*«([\s\S]+)»/i);
      if(inserted){
        compare={mode:'inserted-article',html:renderStandaloneQuote(inserted,'Artículo nuevo'),blocks:quoteBlocks(inserted,'Artículo nuevo'),note:'El artículo no existía en la versión anterior. Se muestra íntegramente como nueva incorporación.'};
      }
    }
    const title = mainArticle ? `Artículo ${mainArticle}` : 'Disposición modificadora';
    const articleHeading = original ? `${displaySection(original)}${original.title?' · '+original.title:''}` : (mainArticle ? `Artículo ${mainArticle}` : 'Disposición');
    const rightHeaderLabel = compare?.mode==='inserted-article' ? 'NUEVO TEXTO' : 'VISTA COMPARADA';
    const rightHeaderTitle = compare?.mode==='whole-article' ? 'Artículo con sustitución completa' : compare?.mode==='inserted-article' ? 'Artículo insertado por el Omnibus' : 'Mismo artículo con cambios resaltados';

    let comparisonBody;
    if(compare?.blocks){
      const beforeBlocks=original?buildBlocks(original):[];
      comparisonBody=renderSynchronizedCompare(beforeBlocks,compare.blocks,articleHeading,{label:rightHeaderLabel,title:rightHeaderTitle});
    } else {
      comparisonBody=`<div class="legal-compare-grid"><section class="legal-compare-column before"><header><span>ANTES</span><b>Reglamento (UE) 2024/1689</b></header><div class="legal-compare-scroll"><h3>${esc(articleHeading)}</h3>${original?renderParagraphs(original):`<div class="legal-unavailable">No existe una versión anterior de ${esc(title)}.</div>`}</div></section><section class="legal-compare-column change compare-assisted"><header><span>${esc(rightHeaderLabel)}</span><b>${esc(rightHeaderTitle)}</b></header><div class="legal-compare-scroll"><h3>${esc(articleHeading)}</h3>${compare?.html||'<div class="legal-unavailable">No se ha podido generar la vista comparada asistida.</div>'}</div></section></div>`;
    }

    return `<header class="legal-document-head"><div><span>Comparación normativa · Operación ${a.sequence}</span><h2>${esc(title)}</h2></div><span class="legal-doc-status pending">Vista comparada asistida</span></header>
      ${comparisonBody}
      <div class="legal-compare-note"><b>Cómo leer esta comparación</b><p>${esc(compare?.note || 'Vista comparada generada automáticamente a partir de la instrucción modificadora.')} Las dos versiones comparten filas, por lo que cada apartado queda alineado con su equivalente.</p></div>
      <div class="legal-reader-actions">
        <a href="/observatorio-normativo/reglamento-2024-1689.html${original?`#articulo-${esc(articleKey(original.number))}`:''}">Ver Reglamento completo</a>
        <a href="/observatorio-normativo/reglamento-2026-1744.html#modificacion-${esc(a.sequence)}">Ver modificación completa</a>
      </div>`;
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
