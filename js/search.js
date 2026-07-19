(function(){
  var input=document.getElementById('q');
  var out=document.getElementById('search-results');
  if(!input||!out||!Array.isArray(window.CYBER_INDEX)) return;

  var norm=function(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');};
  var esc=function(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  var active=-1;

  function close(){out.innerHTML='';out.classList.remove('open');active=-1;}
  function links(){return Array.prototype.slice.call(out.querySelectorAll('.sr-item'));}
  function activate(i){
    var items=links(); if(!items.length) return;
    active=(i+items.length)%items.length;
    items.forEach(function(a,n){a.classList.toggle('active',n===active);});
    items[active].scrollIntoView({block:'nearest'});
  }
  function render(list,q){
    active=-1;
    if(!q){close();return;}
    if(!list.length){out.innerHTML='<div class="sr-empty">Sin resultados para “'+esc(q)+'”.</div>';out.classList.add('open');return;}
    out.innerHTML=list.slice(0,10).map(function(r){
      return '<a class="sr-item" href="/'+esc(r.u)+'"><b>'+esc(r.t)+'</b><em>'+esc(r.n)+' · '+esc(r.p)+'</em><span>'+esc(r.d)+'</span></a>';
    }).join('');
    out.classList.add('open');
  }
  function search(q){
    var nq=norm(q.trim());
    if(!nq){render([], '');return;}
    var words=nq.split(/\s+/).filter(Boolean);
    var scored=window.CYBER_INDEX.map(function(r){
      var title=norm(r.t), desc=norm(r.d), pillar=norm(r.p), hay=title+' '+desc+' '+pillar;
      var score=0;
      if(title===nq) score+=20;
      if(title.indexOf(nq)>=0) score+=10;
      if(desc.indexOf(nq)>=0) score+=5;
      if(pillar.indexOf(nq)>=0) score+=3;
      words.forEach(function(w){
        if(title.indexOf(w)>=0) score+=4;
        if(desc.indexOf(w)>=0) score+=2;
        if(pillar.indexOf(w)>=0) score+=1;
      });
      return {r:r,s:score};
    }).filter(function(x){return x.s>0;}).sort(function(a,b){return b.s-a.s||a.r.t.localeCompare(b.r.t);}).map(function(x){return x.r;});
    render(scored,q);
  }

  input.addEventListener('input',function(){search(input.value);});
  input.addEventListener('focus',function(){if(input.value.trim()) search(input.value);});
  input.addEventListener('keydown',function(e){
    if(e.key==='ArrowDown'){e.preventDefault();activate(active+1);}
    else if(e.key==='ArrowUp'){e.preventDefault();activate(active-1);}
    else if(e.key==='Enter'&&active>=0){e.preventDefault();links()[active].click();}
    else if(e.key==='Escape'){close();input.blur();}
  });
  document.addEventListener('click',function(e){if(!e.target.closest('.search-wrap')) close();});
})();
