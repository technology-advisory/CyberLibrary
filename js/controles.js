(function(){
  'use strict';
  const q=document.getElementById('control-query');
  const d=document.getElementById('control-domain');
  const f=document.getElementById('control-framework');
  const count=document.getElementById('control-count');
  const reset=document.getElementById('control-reset');
  const cards=[...document.querySelectorAll('.control-card')];
  const total=cards.length;
  const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  function run(){
    const n=norm(q?.value),dom=d?.value||'',fw=norm(f?.value);
    let visible=0;
    cards.forEach(c=>{
      const hay=norm(c.textContent), cfw=norm(c.dataset.framework);
      const hide=!!((dom&&c.dataset.domain!==dom)||(fw&&!cfw.includes(fw))||(n&&!hay.includes(n)));
      c.hidden=hide;
      if(!hide) visible++;
    });
    if(count) count.textContent=`${visible} de ${total} control${total===1?'':'es'}`;
    if(reset) reset.disabled=!(n||dom||fw);
  }
  function clear(){
    if(q) q.value='';
    if(d) d.value='';
    if(f) f.value='';
    run();
    q?.focus();
  }
  q?.addEventListener('input',run);
  d?.addEventListener('change',run);
  f?.addEventListener('change',run);
  reset?.addEventListener('click',clear);
  run();
})();
