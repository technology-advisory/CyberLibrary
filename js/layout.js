
(() => {
  const headerHTML = `
<header class="top">
  <a class="brand" href="/">
    <img src="/svg/logo.svg" alt="CyberLibrary AI">
    <span>CYBERLIBRARY <b>AI</b>
      <small>by OpenTrust Group · Gobernanza · Arquitectura · Seguridad · Auditoría</small>
    </span>
  </a>
  <nav>
    <a href="/#pilares">Biblioteca</a>
    <a href="/rutas/">Rutas</a>
    <a href="/plantillas/">Plantillas</a>
    <a href="/modelos/">Modelos</a>
    <a href="/02-riesgo-y-cumplimiento/">Marcos</a>
    <a href="/04-seguridad-de-ia/">Seguridad</a>
    <a href="/05-auditoria-de-ia/">Auditoría</a>
    <a href="/sobre-mi/">Sobre mí</a>
    <a class="top-legal-highlight" href="/legal/">Legal</a>
  </nav>
</header>`;

  const sidebarHTML = `
<aside class="side">
  <div class="st">Explorar</div>
  <a class="sl" href="/"><b>⌂</b>Inicio</a>
  <a class="sl" href="/#pilares"><b>▣</b>Todos los contenidos</a>
  <a class="sl" href="/mapa/"><b>◫</b>Mapa de contenidos</a>
  <a class="sl" href="/rutas/"><b>⇢</b>Empezar por una ruta</a>
  <div class="sep"></div>
  <div class="st">Recursos prácticos</div>
  <a class="sl" href="/plantillas/"><b>▧</b>Plantillas y evidencias</a>
  <a class="sl" href="/comparador/"><b>≋</b>Comparador de marcos</a>
  <a class="sl" href="/modelos/"><b>◈</b>Catálogo vivo de modelos</a>
  <a class="sl" href="/comparativas/"><b>⇄</b>IA vs IA</a>
  <a class="sl" href="/06-respuesta-a-incidentes/"><b>▤</b>Playbooks de respuesta</a>
  <a class="sl" href="/07-arquitectura-segura/"><b>⌘</b>Arquitecturas y diagramas</a>
  <a class="sl" href="/08-ai-red-teaming/"><b>◎</b>AI Red Teaming</a>
  <a class="sl" href="/13-automatizacion-y-controles/"><b>⚒</b>Automatización y controles</a>
  <div class="sep"></div>
  <div class="st">Pilares</div>
  <a class="ps" href="/01-gobernanza-y-politicas/"><b style="color:#1f8fff">01</b>Gobernanza y políticas</a>
  <a class="ps" href="/02-riesgo-y-cumplimiento/"><b style="color:#ff9d19">02</b>Riesgo y cumplimiento</a>
  <a class="ps" href="/03-gobierno-de-modelos/"><b style="color:#22d36b">03</b>Gobierno de modelos</a>
  <a class="ps" href="/04-seguridad-de-ia/"><b style="color:#a563ff">04</b>Seguridad de IA</a>
  <a class="ps" href="/05-auditoria-de-ia/"><b style="color:#19d6e9">05</b>Auditoría de IA</a>
  <a class="ps" href="/06-respuesta-a-incidentes/"><b style="color:#ff525d">06</b>Respuesta a incidentes</a>
  <a class="ps" href="/07-arquitectura-segura/"><b style="color:#24a7ff">07</b>Arquitectura segura</a>
  <a class="ps" href="/08-ai-red-teaming/"><b style="color:#a96aff">08</b>AI Red Teaming</a>
  <a class="ps" href="/09-observabilidad-de-ia/"><b style="color:#ffb21a">09</b>Observabilidad de IA</a>
  <a class="ps" href="/10-seguridad-cloud-ia/"><b style="color:#18c8ff">10</b>Seguridad Cloud para IA</a>
  <a class="ps" href="/11-cadena-de-suministro-ia/"><b style="color:#27df83">11</b>Cadena de suministro de IA</a>
  <a class="ps" href="/12-gobierno-del-dato-ia/"><b style="color:#d7e92c">12</b>Gobierno del dato para IA</a>
  <a class="ps" href="/13-automatizacion-y-controles/"><b style="color:#b36bff">13</b>Automatización y controles</a>
</aside>`;

  const footerHTML = `
<footer class="footer">
  <div class="fg">
    <div>
      <a class="brand" href="/"><img src="/svg/logo.svg" alt="CyberLibrary AI"><span>CYBERLIBRARY <b>AI</b></span></a>
      <p>Biblioteca profesional de gobernanza, arquitectura, seguridad y auditoría de sistemas de IA y SGIA.</p>
      <a class="linkedin" href="https://www.linkedin.com/in/macarriazo/" target="_blank" rel="noopener" aria-label="LinkedIn">in</a>
    </div>
    <div><h4>Recursos</h4><a href="/#pilares">Biblioteca</a>
    <a href="/rutas/">Rutas</a>
    <a href="/plantillas/">Plantillas</a>
    <a href="/modelos/">Modelos</a><a href="/02-riesgo-y-cumplimiento/">Marcos de referencia</a><a href="/13-automatizacion-y-controles/">Herramientas</a><a href="/06-respuesta-a-incidentes/">Playbooks</a></div>
    <div><h4>Proyecto</h4><a href="/01-gobernanza-y-politicas/">Gobernanza</a><a href="/04-seguridad-de-ia/">Seguridad</a><a href="/05-auditoria-de-ia/">Auditoría</a><a href="/07-arquitectura-segura/">Arquitectura</a></div>
    <div><h4>CyberLibrary AI</h4><a href="/sobre-mi/">Sobre mí</a><a href="/legal/">Legal</a><p>Construido con rigor. Diseñado para profesionales. Pensado para seguridad, cumplimiento y gobierno de la IA.</p></div>
  </div>
  <div class="fb"><span>© 2026 CyberLibrary AI. Todos los derechos reservados · <b>OpenTrust Group</b></span></div>
</footer>`;

  function inject(id, value) {
    const el = document.getElementById(id);
    if (el) el.outerHTML = value;
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

    let button = header.querySelector(".menu-toggle");
    if (!button) {
      button = document.createElement("button");
      button.className = "menu-toggle";
      button.type = "button";
      button.setAttribute("aria-label", "Abrir menú");
      button.setAttribute("aria-expanded", "false");
      button.innerHTML = "<span></span><span></span><span></span>";
      header.appendChild(button);
    }

    let overlay = document.querySelector(".mobile-menu-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "mobile-menu-overlay";
      document.body.appendChild(overlay);
    }

    const close = () => {
      side.classList.remove("open");
      overlay.classList.remove("open");
      document.body.classList.remove("menu-open");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Abrir menú");
    };
    const open = () => {
      side.classList.add("open");
      overlay.classList.add("open");
      document.body.classList.add("menu-open");
      button.setAttribute("aria-expanded", "true");
      button.setAttribute("aria-label", "Cerrar menú");
    };

    button.addEventListener("click", () => side.classList.contains("open") ? close() : open());
    overlay.addEventListener("click", close);
    side.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    window.addEventListener("resize", () => { if (innerWidth > 900) close(); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    inject("site-header", headerHTML);
    inject("site-sidebar", sidebarHTML);
    inject("site-footer", footerHTML);
    markActive();
    initMobileMenu();
    document.dispatchEvent(new CustomEvent("layout:loaded"));
  });
})();
