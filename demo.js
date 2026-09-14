// The projection screen at the top of the page, driven the way the app is:
// arrows move through the slides, B covers the screen, Escape uncovers it,
// and the number keys jump to an item in the running order.
//
// The words for the status line come from the page (data-texto-*), so both
// languages share this file.

(() => {
  const pantalla = document.querySelector('[data-pantalla]');
  const consola = document.querySelector('[data-consola]');
  if (!pantalla || !consola) return;

  const slides = [...pantalla.querySelectorAll('.slide')];
  const items = [...consola.querySelectorAll('[data-ir]')];
  const estado = consola.querySelector('[data-estado]');
  const botonNegro = consola.querySelector('[data-accion="negro"]');
  const textos = consola.dataset;

  let actual = 0;
  let negro = false;
  let aLaVista = true;

  const itemDe = (slide) => Number(slide.dataset.item);
  const nombreDe = (item) => items[item].textContent.replace(/^\s*\d+\s*/, '').trim();

  function pintar() {
    slides.forEach((slide, i) => {
      const activo = i === actual;
      slide.toggleAttribute('data-activo', activo);
      // The headline stays readable to a screen reader whatever is showing.
      if (i > 0) slide.setAttribute('aria-hidden', String(!activo));
    });

    const item = itemDe(slides[actual]);
    items.forEach((boton, i) => boton.setAttribute('aria-current', String(i === item)));

    const delItem = slides.filter((slide) => itemDe(slide) === item);
    const posicion = delItem.indexOf(slides[actual]) + 1;
    const cuenta = delItem.length > 1 ? ` (${posicion} ${textos.textoDe} ${delItem.length})` : '';

    pantalla.toggleAttribute('data-negro', negro);
    estado.toggleAttribute('data-negro', negro);
    botonNegro.setAttribute('aria-pressed', String(negro));
    estado.textContent = negro
      ? textos.textoNegro
      : `${textos.textoVivo}: ${nombreDe(item)}${cuenta}`;
  }

  function ir(indice) {
    actual = Math.max(0, Math.min(slides.length - 1, indice));
    pintar();
  }

  function alItem(item) {
    const primero = slides.findIndex((slide) => itemDe(slide) === item);
    if (primero >= 0) ir(primero);
  }

  function alternarNegro(valor = !negro) {
    negro = valor;
    pintar();
  }

  pantalla.addEventListener('click', () => ir(actual + 1));

  consola.addEventListener('click', (evento) => {
    const boton = evento.target.closest('button');
    if (!boton) return;
    if (boton.dataset.ir !== undefined) alItem(Number(boton.dataset.ir));
    else if (boton.dataset.accion === 'anterior') ir(actual - 1);
    else if (boton.dataset.accion === 'siguiente') ir(actual + 1);
    else if (boton.dataset.accion === 'negro') alternarNegro();
  });

  // Keys only belong to the screen while it is on view; further down the
  // page they go back to the browser.
  new IntersectionObserver(([entrada]) => {
    aLaVista = entrada.isIntersecting;
  }, { threshold: 0.35 }).observe(pantalla);

  document.addEventListener('keydown', (evento) => {
    if (!aLaVista || evento.metaKey || evento.ctrlKey || evento.altKey) return;
    if (evento.target.closest('input, textarea, select, [contenteditable]')) return;

    const tecla = evento.key;
    if (tecla === 'ArrowRight' || tecla === 'PageDown') ir(actual + 1);
    else if (tecla === 'ArrowLeft' || tecla === 'PageUp') ir(actual - 1);
    else if (tecla === 'b' || tecla === 'B') alternarNegro();
    else if (tecla === 'Escape') alternarNegro(false);
    else if (/^[1-9]$/.test(tecla) && Number(tecla) <= items.length) alItem(Number(tecla) - 1);
    else return;
    evento.preventDefault();
  });

  pintar();
})();
