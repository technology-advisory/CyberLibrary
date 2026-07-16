document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.top');
  const side = document.querySelector('.side');
  if (!header || !side) return;

  let button = header.querySelector('.menu-toggle');
  if (!button) {
    button = document.createElement('button');
    button.className = 'menu-toggle';
    button.type = 'button';
    button.setAttribute('aria-label', 'Abrir menú');
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = '<span></span><span></span><span></span>';
    header.appendChild(button);
  }

  let overlay = document.querySelector('.mobile-menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
  }

  const closeMenu = () => {
    side.classList.remove('open');
    overlay.classList.remove('open');
    document.body.classList.remove('menu-open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Abrir menú');
  };

  const openMenu = () => {
    side.classList.add('open');
    overlay.classList.add('open');
    document.body.classList.add('menu-open');
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', 'Cerrar menú');
  };

  button.addEventListener('click', () => {
    side.classList.contains('open') ? closeMenu() : openMenu();
  });
  overlay.addEventListener('click', closeMenu);
  side.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
});
