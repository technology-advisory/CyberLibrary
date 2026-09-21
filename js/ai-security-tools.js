(() => {
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const escapeHTML = value => String(value || '').replace(/[&<>\"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[char]));
  const safeUrl = value => { try { const u = new URL(String(value || ''), location.origin); return u.protocol === 'https:' ? u.href : '#'; } catch (_) { return '#'; } };
  async function init(){
    const grid=document.getElementById('tools-grid'); if(!grid) return;
    const search=document.getElementById('tools-search'), category=document.getElementById('tools-category'), type=document.getElementById('tools-type'), reset=document.getElementById('tools-reset'), count=document.getElementById('tools-count'), empty=document.getElementById('tools-empty');
    try{
      const response=await fetch('/assets/data/herramientas-seguridad-ia.json'); if(!response.ok) throw new Error('No se pudo cargar el catálogo');
      const payload=await response.json(), tools=Array.isArray(payload.tools)?payload.tools:[];
      [...new Set(tools.map(x=>x.category))].sort().forEach(v=>category.add(new Option(v,v)));
      [...new Set(tools.map(x=>x.type))].sort().forEach(v=>type.add(new Option(v,v)));
      const render=()=>{
        const q=normalize(search.value), cat=category.value, kind=type.value;
        const filtered=tools.filter(tool=>{
          const haystack=normalize([tool.name,tool.description,tool.category,tool.type,tool.license,...(tool.tags||[])].join(' '));
          return (!q||haystack.includes(q))&&(!cat||tool.category===cat)&&(!kind||tool.type===kind);
        });
        count.textContent=filtered.length; empty.hidden=filtered.length!==0;
        grid.innerHTML=filtered.map(tool=>`<article class="tool-card"><div class="tool-card-head"><h2>${escapeHTML(tool.name)}</h2></div><span class="tool-category">${escapeHTML(tool.category)}</span><p>${escapeHTML(tool.description)}</p><div class="tool-tags">${(tool.tags||[]).map(tag=>`<span>${escapeHTML(tag)}</span>`).join('')}</div><div class="tool-badges"><span class="tool-badge">${escapeHTML(tool.type)}</span><span class="tool-badge license">Licencia: ${escapeHTML(tool.license)}</span></div><a class="tool-link" href="${escapeHTML(safeUrl(tool.url))}" target="_blank" rel="noopener noreferrer">Abrir proyecto original ↗</a></article>`).join('');
      };
      [search,category,type].forEach(el=>el.addEventListener(el===search?'input':'change',render));
      reset.addEventListener('click',()=>{search.value='';category.value='';type.value='';render();search.focus()}); render();
    }catch(error){console.error(error);grid.innerHTML='<div class="tools-empty">No se pudo cargar el catálogo de herramientas.</div>';count.textContent='0'}
  }
  document.addEventListener('DOMContentLoaded',init);
})();
