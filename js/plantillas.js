(function(){
  'use strict';
  const q=document.getElementById('template-query');
  const c=document.getElementById('template-category');
  const count=document.getElementById('template-count');
  const cards=[...document.querySelectorAll('.template-row-pro')];
  const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  function run(){
    const query=norm(q?.value),cat=c?.value||''; let n=0;
    cards.forEach(card=>{
      const hide=!!((cat&&card.dataset.category!==cat)||(query&&!norm(card.textContent).includes(query)));
      card.hidden=hide;if(!hide)n++;
    });
    if(count) count.textContent=`${n} plantilla${n===1?'':'s'}`;
  }
  q?.addEventListener('input',run);c?.addEventListener('change',run);run();
})();
