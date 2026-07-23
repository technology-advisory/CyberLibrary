(function(){
  'use strict';
  const INDEX=Array.isArray(window.CYBER_INDEX)?window.CYBER_INDEX:[];
  const SYNONYMS={
    'ens':['esquema nacional de seguridad'],
    'esquema nacional de seguridad':['ens'],
    'ai act':['reglamento europeo de ia','eu ai act'],
    'reglamento europeo de ia':['ai act','eu ai act'],
    'iso 42001':['iso/iec 42001','sgia'],
    'sgia':['iso 42001','sistema de gestion de ia'],
    'shadow ai':['ia no autorizada','ia en la sombra'],
    'ai-bom':['aibom','inventario de componentes de ia'],
    'aibom':['ai-bom'],
    'prompt injection':['inyeccion de prompts','inyeccion de instrucciones'],
    'llm':['modelo de lenguaje','modelos de lenguaje'],
    'mcp':['model context protocol'],
    'rag':['retrieval augmented generation','generacion aumentada por recuperacion']
  };
  const norm=s=>(s||'').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[‐‑–—]/g,'-').replace(/[^a-z0-9ñáéíóúü\-\/\.\s]/gi,' ').replace(/\s+/g,' ').trim();
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tokens=s=>norm(s).match(/[a-z0-9]+(?:[-\/\.][a-z0-9]+)*/g)||[];
  const tokenSet=s=>new Set(tokens(s));
  function parseQuery(q){
    const phrases=[]; let rest=q.replace(/"([^"]+)"/g,(_,p)=>{phrases.push(norm(p));return ' ';});
    return {raw:norm(q),phrases,words:tokens(rest)};
  }
  function expand(parsed){
    const extra=[]; const candidates=[parsed.raw,...parsed.phrases,...parsed.words];
    candidates.forEach(x=>(SYNONYMS[x]||[]).forEach(y=>extra.push(norm(y))));
    return [...new Set(extra)];
  }
  function hasWhole(hay,word){ return tokenSet(hay).has(norm(word)); }
  function hasPhrase(hay,phrase){ return (' '+norm(hay)+' ').includes(' '+norm(phrase)+' '); }
  function isAcronym(word){ return /^[a-z0-9]{2,5}$/.test(norm(word)); }
  function exactMetadata(r,word){
    const w=norm(word);
    return (r.frameworks||[]).some(x=>norm(x)===w) || (r.tags||[]).some(x=>norm(x)===w);
  }
  function matchRecord(r,query,filters={}){
    const parsed=parseQuery(query); if(!parsed.raw) return null;
    const title=norm(r.t), desc=norm(r.d), pillar=norm(r.p), content=norm(r.content), tags=norm((r.tags||[]).join(' '));
    const all=[title,desc,pillar,tags,content].join(' ');
    const titleTokens=tokenSet(title), descTokens=tokenSet(desc), tagTokens=tokenSet(tags), allTokens=tokenSet(all);
    if(filters.pillar && r.p!==filters.pillar) return null;
    if(filters.type && r.type!==filters.type) return null;
    if(filters.level && r.level!==filters.level) return null;
    if(filters.profile && !(r.profiles||[]).includes(filters.profile)) return null;
    if(filters.framework && !(r.frameworks||[]).includes(filters.framework)) return null;
    if(filters.format && r.format!==filters.format) return null;
    let score=0; let matched=0;
    if(title===parsed.raw) score+=120;
    if(hasPhrase(title,parsed.raw)) score+=55;
    parsed.phrases.forEach(p=>{if(hasPhrase(title,p)){score+=60;matched++;}else if(hasPhrase(all,p)){score+=22;matched++;}});
    parsed.words.forEach(w=>{
      if(titleTokens.has(w)){score+=32;matched++;}
      else if(exactMetadata(r,w)){score+=28;matched++;}
      else if(tagTokens.has(w)){score+=22;matched++;}
      else if(descTokens.has(w)){score+=13;matched++;}
      else if(allTokens.has(w)){score+=5;matched++;}
    });
    expand(parsed).forEach(s=>{
      if(hasPhrase(title,s))score+=12;
      else if(hasPhrase(all,s))score+=4;
    });
    /* Salvaguarda: los acrónimos como ENS, RAG, MCP o LLM solo cuentan como token completo o metadato exacto. */
    const required=parsed.words.length+parsed.phrases.length;
    if(required && matched<required) return null;
    if(!score) return null;
    return {r,score};
  }
  function search(query,filters={}){
    return INDEX.map(r=>matchRecord(r,query,filters)).filter(Boolean).sort((a,b)=>b.score-a.score||a.r.t.localeCompare(b.r.t,'es')).map(x=>x.r);
  }
  window.CyberSearch={search,norm,tokens};

  function options(field){return [...new Set(INDEX.flatMap(r=>Array.isArray(r[field])?r[field]:[r[field]]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));}
  function setup(root){
    const input=root.querySelector('[data-search-input],#q'); const out=root.querySelector('[data-search-results],#search-results');
    if(!input||!out) return;
    const filterEls=[...root.querySelectorAll('[data-search-filter]')]; let active=-1;
    const getFilters=()=>Object.fromEntries(filterEls.map(e=>[e.dataset.searchFilter,e.value]).filter(x=>x[1]));
    const links=()=>[...out.querySelectorAll('.sr-item')];
    function close(){out.innerHTML='';out.classList.remove('open');active=-1;}
    function activate(i){const a=links();if(!a.length)return;active=(i+a.length)%a.length;a.forEach((x,n)=>x.classList.toggle('active',n===active));a[active].scrollIntoView({block:'nearest'});}
    function render(list,q){
      active=-1;if(!q.trim()){close();return;}
      if(!list.length){out.innerHTML='<div class="sr-empty"><b>Sin resultados exactos para “'+esc(q)+'”.</b><span>Prueba otra palabra, un sinónimo o elimina algún filtro.</span></div>';out.classList.add('open');return;}
      out.innerHTML=list.slice(0,30).map(r=>'<a class="sr-item" href="/'+esc(r.u)+'"><b>'+esc(r.t)+'</b><em>'+esc(r.type)+' · '+esc(r.p)+'</em><span>'+esc(r.d)+'</span><small>'+esc([r.level,...(r.frameworks||[])].filter(Boolean).join(' · '))+'</small></a>').join('');
      out.classList.add('open');
    }
    function run(){render(search(input.value,getFilters()),input.value);}
    input.addEventListener('input',run);input.addEventListener('focus',()=>{if(input.value.trim())run();});filterEls.forEach(e=>e.addEventListener('change',run));
    input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();activate(active+1);}else if(e.key==='ArrowUp'){e.preventDefault();activate(active-1);}else if(e.key==='Enter'&&active>=0){e.preventDefault();links()[active].click();}else if(e.key==='Escape'){close();input.blur();}});
    document.addEventListener('click',e=>{if(!e.target.closest('[data-search-root],.search-wrap'))close();});
  }
  function boot(){document.querySelectorAll('[data-search-root],.search-wrap').forEach(setup);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
