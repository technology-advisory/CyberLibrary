
(() => {
  const headerHTML = `
<header class="top">
  <a class="brand" href="/">
    <img src="/img/logo.svg" alt="CyberLibrary AI" width="64" height="64" decoding="async">
    <span>CYBERLIBRARY <b>AI</b>
      <small>Conocimiento · Skills · IA</small>
    </span>
  </a>
  <nav aria-label="Navegación principal">
    <a href="/#pilares">Biblioteca</a>
    <a href="/cyberskills/">CyberSkills</a>
    <a href="/rutas/">Rutas</a>
    <a href="/mapa/#recursos">Recursos</a>
    <a href="/buscar/">Buscar</a>
    <a href="/cumplimiento/">Cumplimiento</a>
    <a href="/sobre-mi/">Sobre CyberLibrary</a>
    <a class="top-legal-highlight" href="/legal/">Legal</a>
  </nav>
</header>`;

  const sidebarHTML = `
<aside class="side" id="site-navigation" aria-label="Navegación de la biblioteca">
  <div class="st">Explorar</div>
  <a class="sl" href="/"><b>⌂</b>Inicio</a>
  <a class="sl" href="/mapa/"><b>◫</b>Mapa de contenidos</a>
  <a class="sl" href="/cyberskills/"><b>✦</b>CyberSkills <span class="nav-new">NUEVO</span></a>
  <a class="sl" href="/rutas/"><b>⇢</b>Rutas por objetivo</a>
  <a class="sl" href="/buscar/"><b>⌕</b>Buscar</a>
  <div class="sep"></div>
  <div class="st">13 pilares</div>
  <a class="ps" href="/gobernanza-y-politicas/"><b class="pillar-number pillar-01">01</b>Gobernanza y políticas</a>
  <a class="ps" href="/riesgo-y-cumplimiento/"><b class="pillar-number pillar-02">02</b>Riesgo y cumplimiento</a>
  <a class="ps" href="/gobierno-de-modelos/"><b class="pillar-number pillar-03">03</b>Gobierno de modelos</a>
  <a class="ps" href="/seguridad-de-ia/"><b class="pillar-number pillar-04">04</b>Seguridad de IA</a>
  <a class="ps" href="/auditoria-de-ia/"><b class="pillar-number pillar-05">05</b>Auditoría de IA</a>
  <a class="ps" href="/respuesta-a-incidentes/"><b class="pillar-number pillar-06">06</b>Respuesta a incidentes</a>
  <a class="ps" href="/arquitectura-segura/"><b class="pillar-number pillar-07">07</b>Arquitectura segura</a>
  <a class="ps" href="/ai-red-teaming/"><b class="pillar-number pillar-08">08</b>AI Red Teaming</a>
  <a class="ps" href="/observabilidad-de-ia/"><b class="pillar-number pillar-09">09</b>Observabilidad de IA</a>
  <a class="ps" href="/seguridad-cloud-ia/"><b class="pillar-number pillar-10">10</b>Seguridad Cloud para IA</a>
  <a class="ps" href="/cadena-de-suministro-ia/"><b class="pillar-number pillar-11">11</b>Cadena de suministro de IA</a>
  <a class="ps" href="/gobierno-del-dato-ia/"><b class="pillar-number pillar-12">12</b>Gobierno del dato para IA</a>
  <a class="ps" href="/automatizacion-y-controles/"><b class="pillar-number pillar-13">13</b>Automatización y controles</a>
  <div class="sep"></div>
  <div class="st">Recursos</div>
  <a class="sl" href="/plantillas/"><b>▧</b>Plantillas y evidencias</a>
  <a class="sl" href="/herramientas-seguridad-ia/"><b>⚙</b>AI Security Center</a>
  <a class="sl" href="/modelos/"><b>◈</b>Catálogo de modelos</a>
  <a class="sl" href="/observatorio-normativo/"><b>§</b>Observatorio normativo</a>
  <a class="sl" href="/comparador/"><b>≋</b>Comparador de marcos</a>
  <a class="sl" href="/comparativas/"><b>⇄</b>IA vs IA</a>
  <a class="sl" href="/controles/"><b>✓</b>Catálogo de controles</a>
  <a class="sl" href="/evaluaciones/"><b>◎</b>Evaluaciones</a>
  <a class="sl" href="/ia-aplicada/"><b>▦</b>IA aplicada <span class="nav-new">NUEVO</span></a>
</aside>`;

  const footerHTML = `
<footer class="footer">
  <div class="fg">
    <div>
      <a class="brand" href="/"><img src="/img/logo.svg" alt="CyberLibrary AI" width="64" height="64" decoding="async"><span>CYBERLIBRARY <b>AI</b></span></a>
      <p>Biblioteca profesional de gobernanza, arquitectura, seguridad y auditoría de sistemas de IA y SGIA.</p>
      <a class="linkedin" href="https://www.linkedin.com/in/macarriazo/" target="_blank" rel="noopener" aria-label="LinkedIn">in</a>
    </div>
    <div><h4>Explorar</h4><a href="/#pilares">Biblioteca</a><a href="/mapa/">Mapa de contenidos</a><a href="/cyberskills/">CyberSkills</a><a href="/rutas/">Rutas</a><a href="/buscar/">Buscar</a></div>
    <div><h4>Recursos</h4><a href="/plantillas/">Plantillas</a><a href="/herramientas-seguridad-ia/">AI Security Center</a><a href="/modelos/">Modelos</a><a href="/observatorio-normativo/">Observatorio normativo</a><a href="/comparador/">Comparador de marcos</a><a href="/controles/">Controles</a><a href="/evaluaciones/">Evaluaciones</a><a href="/ia-aplicada/">IA aplicada</a></div>
    <div><h4>Proyecto</h4><a href="/metodologia/">Metodología editorial</a><a href="/actualizaciones/">Actualizaciones</a><a href="/cumplimiento/">Transparencia y cumplimiento</a><a href="/sobre-mi/">Sobre CyberLibrary</a><a href="/legal/">Legal</a><p>Construido con rigor. Diseñado para profesionales. Pensado para seguridad, cumplimiento y gobierno de la IA.</p></div>
  </div>
  <div class="fb"><span>© 2026 CyberLibrary AI. Todos los derechos reservados · <b>OpenTrust Group</b></span></div>
</footer>`;

  function inject(id, value) {
    const el = document.getElementById(id);
    if (el) el.outerHTML = value;
  }

  function injectMobileNav() {
    const nav = document.querySelector(".top nav");
    const side = document.querySelector(".side");
    if (!nav || !side || side.querySelector(".mobile-nav")) return;
    const wrap = document.createElement("div");
    wrap.className = "mobile-nav";
    const title = document.createElement("div");
    title.className = "st";
    title.textContent = "Menú";
    wrap.appendChild(title);
    nav.querySelectorAll("a").forEach(a => {
      const link = document.createElement("a");
      link.className = "sl" + (a.classList.contains("top-legal-highlight") ? " legal-highlight" : "");
      link.href = a.getAttribute("href");
      const icon = document.createElement("b");
      icon.textContent = "›";
      link.appendChild(icon);
      link.appendChild(document.createTextNode(a.textContent.trim()));
      wrap.appendChild(link);
    });
    const sep = document.createElement("div");
    sep.className = "sep";
    wrap.appendChild(sep);
    side.insertBefore(wrap, side.firstChild);
  }

  function normalizeDesignB() {
    // Pillar guide cards: rebuild old card markup into the compact B row.
    document.querySelectorAll(".guide-card:not(.b-row)").forEach(card => {
      const href = card.getAttribute("href") || "#";
      const code = card.querySelector(".guide-code")?.textContent?.trim() || "GUÍA";
      const title = card.querySelector("h2")?.textContent?.trim() || "Guía";
      const desc = card.querySelector("p")?.textContent?.trim() || "";
      const icon = card.querySelector(".guide-icon")?.getAttribute("src") || "";
      card.classList.add("b-row");
      card.innerHTML = `${icon ? `<img class="b-guide-icon" src="${icon}" alt="" width="36" height="36" loading="lazy" decoding="async">` : `<span class="skill-mark">›</span>`}<div class="b-guide-main"><span class="guide-code">${code}</span><h2>${title}</h2><p>${desc}</p></div><span class="b-guide-action">Abrir</span>`;
      card.setAttribute("href", href);
    });
  }


  function enhanceArticleReader() {
    const wrap = document.querySelector('.article-wrap');
    const side = wrap?.querySelector('.article-side');
    if (!wrap || !side || side.dataset.enhanced) return;
    side.dataset.enhanced = '1';

    const taxonomy = [...wrap.querySelectorAll('.taxonomy-chip')].map(x => x.textContent.trim()).filter(Boolean);
    const meta = [...wrap.querySelectorAll('.article-meta-strip .meta-item span')].map(x => x.textContent.trim()).filter(Boolean);
    if (taxonomy.length || meta.length) {
      const panel = document.createElement('div');
      panel.className = 'reader-panel';
      panel.innerHTML = `<h4>Ficha de lectura</h4>${taxonomy.map(x=>`<span class="reader-chip">${x.replace(/[<>&]/g,'')}</span>`).join('')}<p>${meta.slice(0,3).map(x=>x.replace(/[<>&]/g,'')).join(' · ')}</p>`;
      side.appendChild(panel);
    }

    const links=[...side.querySelectorAll('a[href^="#"]')];
    const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
      const obs=new IntersectionObserver(entries=>{
        entries.filter(e=>e.isIntersecting).forEach(e=>{
          links.forEach(a=>a.classList.toggle('article-toc-active',a.getAttribute('href')===`#${e.target.id}`));
        });
      },{rootMargin:'-20% 0px -68% 0px'});
      sections.forEach(s=>obs.observe(s));
    }
  }

  function markActive() {
    const path = location.pathname.replace(/\/index\.html$/, "/");
    document.querySelectorAll(".side a").forEach(a => {
      try {
        const href = new URL(a.href, location.origin).pathname.replace(/\/index\.html$/, "/");
        if (href !== "/" && path.startsWith(href)) a.classList.add("active");
        if (href === "/" && path === "/") a.classList.add("active");
      } catch (_) {}
    });
  }

  function initMobileMenu() {
    const header = document.querySelector(".top");
    const side = document.querySelector(".side");
    if (!header || !side) return;

    side.id = side.id || "site-navigation";
    let lastFocused = null;

    let button = header.querySelector(".menu-toggle");
    if (!button) {
      button = document.createElement("button");
      button.className = "menu-toggle";
      button.type = "button";
      button.setAttribute("aria-label", "Abrir menú");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", side.id);
      button.innerHTML = "<span></span><span></span><span></span>";
      header.appendChild(button);
    }

    let overlay = document.querySelector(".mobile-menu-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "mobile-menu-overlay";
      overlay.setAttribute("aria-hidden", "true");
      document.body.appendChild(overlay);
    }

    const focusables = () => [...side.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter(el => !el.hidden && el.offsetParent !== null);

    const close = (restoreFocus = true) => {
      const wasOpen = side.classList.contains("open");
      side.classList.remove("open");
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("menu-open");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Abrir menú");
      if (wasOpen && restoreFocus && lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    };

    const open = () => {
      lastFocused = document.activeElement;
      side.classList.add("open");
      overlay.classList.add("open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("menu-open");
      button.setAttribute("aria-expanded", "true");
      button.setAttribute("aria-label", "Cerrar menú");
      const first = focusables()[0];
      if (first) requestAnimationFrame(() => first.focus());
    };

    button.addEventListener("click", () => side.classList.contains("open") ? close() : open());
    overlay.addEventListener("click", () => close());
    side.querySelectorAll("a").forEach(a => a.addEventListener("click", () => close(false)));
    document.addEventListener("keydown", e => {
      if (!side.classList.contains("open")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab") {
        const items = focusables();
        if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
    window.addEventListener("resize", () => { if (innerWidth > 900) close(false); });
  }

  document.addEventListener("click", event => {
    const trigger = event.target.closest("[data-print-page]");
    if (!trigger) return;
    event.preventDefault();
    window.print();
  });

  document.addEventListener("DOMContentLoaded", () => {
    inject("site-header", headerHTML);
    inject("site-sidebar", sidebarHTML);
    inject("site-footer", footerHTML);
    injectMobileNav();
    markActive();
    initMobileMenu();
    normalizeDesignB();
    enhanceArticleReader();
    document.dispatchEvent(new CustomEvent("layout:loaded"));
  });
})();
