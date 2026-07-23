(() => {
  'use strict';
  const $=s=>document.querySelector(s), esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
  const label=key=>key.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  const scalar=value=>value===null||value===undefined?'—':typeof value==='object'?JSON.stringify(value):String(value);
  const PUBLISHED_WINDOW_DAYS=30;
  function isRecentlyPublished(model){
    const createdUnix=Number(model?.createdUnix);
    if(!Number.isFinite(createdUnix)||createdUnix<=0)return false;
    const publishedAt=createdUnix*1000;
    const age=Date.now()-publishedAt;
    const futureTolerance=24*60*60*1000;
    return age>=-futureTolerance&&age<=PUBLISHED_WINDOW_DAYS*24*60*60*1000;
  }
  function chips(target,values,empty='No publicado'){target.innerHTML=values.length?values.map(v=>`<span>${esc(v)}</span>`).join(''):`<p>${empty}</p>`;}
  function pricing(model){const value=model.pricing;if(!value)return '<p>No hay precios públicos normalizados para este modelo.</p>';if(typeof value!=='object')return `<strong>${esc(value)}</strong>`;return Object.entries(value).map(([k,v])=>`<div><span>${esc(label(k))}</span><strong>${esc(scalar(v))}</strong></div>`).join('');}
  async function init(){
    const id=new URLSearchParams(location.search).get('id');
    if(!id){showError('No se ha indicado ningún identificador de modelo.');return;}
    try{
      const data=await ModelsData.load();const model=data.models.find(m=>m.id===id||m.slug===id);
      if(!model){showError('El modelo solicitado no existe en la versión pública actual del catálogo.');return;}
      document.title=`${model.name} · AI Intelligence Engine`;$('#detail-provider').textContent=model.provider;$('#detail-name').textContent=model.name;$('#detail-description').textContent=model.description;
      $('#detail-status').textContent=model.status;
      const activity=isRecentlyPublished(model)?'Actualizado':'';
      chips($('#detail-badges'),[activity,model.family,model.source,model.license].filter(Boolean));
      if(activity){
        const firstChip=$('#detail-badges span');
        if(firstChip) firstChip.classList.add('activity-badge','updated');
      }
      if(model.sourceUrl){$('#detail-source').href=model.sourceUrl;$('#detail-source').hidden=false;}
      const kpis=[['Contexto',model.contextLabel],['Publicado',model.publishedLabel],['Corte de conocimiento',model.raw.knowledge_cutoff||'No publicado'],['Licencia',model.license]];
      $('#detail-kpis').innerHTML=kpis.map(([k,v])=>`<article><span>${esc(k)}</span><strong>${esc(v)}</strong></article>`).join('');
      const preferred=['id','name','provider','family','source','status','license','openness','architecture','created_unix','knowledge_cutoff','last_modified','updated_at','context_length','context_window','parameters','parameter_count'];
      const rows=[];const seen=new Set();
      preferred.forEach(key=>{if(model.raw[key]!==undefined){rows.push([key,model.raw[key]]);seen.add(key);}});
      Object.entries(model.raw).forEach(([key,value])=>{if(!seen.has(key)&&!['description','capabilities','input_modalities','output_modalities','modalities','pricing','url','first_seen_at','last_seen_at','last_updated_at','is_new','is_updated'].includes(key)&&rows.length<28)rows.push([key,value]);});
      $('#detail-fields').innerHTML=rows.map(([k,v])=>`<div><dt>${esc(label(k))}</dt><dd>${esc(scalar(v))}</dd></div>`).join('')||'<p>No hay campos técnicos adicionales.</p>';
      chips($('#detail-capabilities'),model.capabilities);chips($('#detail-modalities'),[...new Set([...model.input.map(v=>'Entrada: '+v),...model.output.map(v=>'Salida: '+v),...model.modalities])]);
      $('#detail-pricing').innerHTML=pricing(model);
      $('#detail-loading').hidden=true;$('#model-detail').hidden=false;
    }catch(error){console.error(error);showError('No se pudo cargar la ficha. Comprueba los JSON públicos y vuelve al catálogo.');}
  }
  function showError(message){$('#detail-loading').hidden=true;$('#detail-error').hidden=false;$('#detail-error').textContent=message;}
  init();
})();
