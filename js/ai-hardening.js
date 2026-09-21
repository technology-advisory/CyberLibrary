(function(){
  const domains=['Acceso','Datos','Gobierno','Modelo','Suministro','Monitorización','Infraestructura','Cumplimiento'];
  const rows=document.getElementById('ah-rows');
  const radar=document.getElementById('ah-radar');
  const score=document.getElementById('ah-score');
  const level=document.getElementById('ah-level');
  if(!rows||!radar||!score||!level) return;
  const values=new Array(domains.length).fill(0);
  const labels=['Ausente','Inicial','Definido','Gestionado','Optimizado'];
  domains.forEach((name,i)=>{
    const card=document.createElement('div'); card.className='ah-row';
    card.innerHTML='<div class="ah-row-top"><div class="ah-domain"><span class="ah-num">'+String(i+1).padStart(2,'0')+'</span><span>'+name+'</span></div><span class="ah-value" id="ah-v-'+i+'">0</span></div><input aria-label="Nivel de '+name+'" type="range" min="0" max="4" step="1" value="0"><div class="ah-scale"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span></div>';
    const input=card.querySelector('input');
    input.addEventListener('input',()=>{values[i]=Number(input.value);document.getElementById('ah-v-'+i).textContent=input.value;draw();});
    rows.appendChild(card);
  });
  const legend=document.createElement('div'); legend.className='ah-legend'; legend.innerHTML=labels.map((x,i)=>'<span>'+i+' · '+x+'</span>').join('');
  radar.parentElement.appendChild(legend);
  function point(cx,cy,r,angle){return [cx+Math.cos(angle)*r,cy+Math.sin(angle)*r]}
  function polygon(points){return points.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}
  function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function draw(){
    const cx=150,cy=150,maxR=92,n=domains.length;
    let svg='<defs><linearGradient id="ahrg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#276fe8" stop-opacity=".42"/><stop offset="1" stop-color="#7b61ff" stop-opacity=".18"/></linearGradient></defs>';
    for(let ring=1;ring<=4;ring++){
      const pts=[]; for(let i=0;i<n;i++) pts.push(point(cx,cy,maxR*ring/4,-Math.PI/2+i*2*Math.PI/n));
      svg+='<polygon points="'+polygon(pts)+'" fill="none" stroke="#d3dfec" stroke-width="1"/>';
    }
    for(let i=0;i<n;i++){
      const a=-Math.PI/2+i*2*Math.PI/n, p=point(cx,cy,maxR,a), lp=point(cx,cy,123,a);
      svg+='<line x1="'+cx+'" y1="'+cy+'" x2="'+p[0]+'" y2="'+p[1]+'" stroke="#d3dfec"/>';
      const anchor=Math.abs(lp[0]-cx)<12?'middle':(lp[0]>cx?'start':'end');
      svg+='<text x="'+lp[0]+'" y="'+(lp[1]+4)+'" text-anchor="'+anchor+'" font-size="9.5" font-weight="700" fill="#52677e">'+esc(domains[i])+'</text>';
    }
    const data=[]; for(let i=0;i<n;i++) data.push(point(cx,cy,maxR*(values[i]/4),-Math.PI/2+i*2*Math.PI/n));
    svg+='<polygon points="'+polygon(data)+'" fill="url(#ahrg)" stroke="#276fe8" stroke-width="3" stroke-linejoin="round"/>';
    data.forEach(p=>svg+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4" fill="#fff" stroke="#276fe8" stroke-width="2.5"/>');
    radar.innerHTML=svg;
    const avg=values.reduce((a,b)=>a+b,0)/values.length;
    score.textContent=avg.toFixed(1);
    level.textContent=labels[Math.min(4,Math.round(avg))];
  }
  draw();
})();
