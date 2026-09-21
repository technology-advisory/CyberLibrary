(function(){
  'use strict';
  const inputs=[...document.querySelectorAll('.assessment-dimension input[type="range"]')];
  const score=document.getElementById('assessment-score');
  const level=document.getElementById('assessment-level');
  const message=document.getElementById('assessment-message');
  const priorities=document.getElementById('assessment-priorities');
  const reset=document.getElementById('assessment-reset');
  const printBtn=document.getElementById('assessment-print');
  const messages=[
    ['Nivel 0 · No establecido','Prioridad inmediata: inventario, responsables y controles básicos.'],
    ['Nivel 1 · Ad hoc','Existe actividad, pero depende de personas y decisiones no estandarizadas.'],
    ['Nivel 2 · Definido','La base está formalizada; toca medir eficacia, excepciones y cumplimiento real.'],
    ['Nivel 3 · Medido','La operación es repetible y medible; refuerza assurance independiente y automatización.'],
    ['Nivel 4 · Gestionado','Madurez avanzada: conserva evidencia, mide eficacia y revisa ante cada cambio significativo.']
  ];
  const actionMap={
    'Gobierno':'Completar inventario, RACI, política y gates del ciclo de vida.',
    'Riesgo':'Formalizar clasificación, obligaciones, aceptación y seguimiento de riesgos.',
    'Seguridad':'Priorizar identidad, secretos, validación de entradas/salidas y hardening.',
    'Datos':'Documentar procedencia, minimización, calidad, linaje y retención.',
    'Terceros':'Implantar due diligence, AI-BOM y requisitos contractuales.',
    'Observabilidad':'Asegurar logging, métricas, alertas y trazabilidad extremo a extremo.',
    'Incidentes':'Probar playbooks, escalado, contención, recuperación y lecciones aprendidas.',
    'Auditoría':'Definir pruebas, muestreo, evidencia, hallazgos y seguimiento.'
  };
  function render(){
    if(!inputs.length) return;
    let total=0;
    const dims=[];
    inputs.forEach(input=>{
      const v=Number(input.value||0); total+=v;
      const box=input.closest('.assessment-dimension');
      const name=box?.dataset.dimension||'Dimensión';
      const out=box?.querySelector('output'); if(out) out.value=String(v);
      dims.push({name,value:v});
      const bar=document.querySelector(`[data-bar="${CSS.escape(name)}"]`);
      if(bar){ const fill=bar.querySelector('.dimension-bar-fill'); const b=bar.querySelector('b'); if(fill) fill.style.width=`${v*25}%`; if(b) b.textContent=String(v); }
    });
    const avg=total/inputs.length; if(score) score.textContent=avg.toFixed(1);
    const idx=Math.max(0,Math.min(4,Math.round(avg)));
    if(level) level.textContent=messages[idx][0]; if(message) message.textContent=messages[idx][1];
    const worst=[...dims].sort((a,b)=>a.value-b.value).slice(0,3);
    if(priorities) priorities.innerHTML=worst.map(x=>`<li><b>${x.name} (${x.value}/4):</b> ${actionMap[x.name]||'Definir un plan de mejora verificable.'}</li>`).join('');
  }
  inputs.forEach(i=>i.addEventListener('input',render));
  reset?.addEventListener('click',()=>{inputs.forEach(i=>i.value='0');render();});
  printBtn?.addEventListener('click',()=>window.print());
  render();
})();
