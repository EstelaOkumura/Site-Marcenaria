/* ==========================================================
   COMPORTAMENTO DO SITE — menu, projetos, lightbox,
   linha do tempo e links de contato.
   O conteúdo (fotos, textos, números) fica em data.js.
   ========================================================== */

(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const NS = 'http://www.w3.org/2000/svg';


  /* ---------- Imagens ---------- */

  $$('img[data-img]').forEach(img => {
    const src = IMAGES[img.dataset.img];
    if (src) img.src = src;
  });


  /* ---------- Anéis de tronco (SVG gerado) ---------- */

  function rng(seed) {
    return function () {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;

      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;

      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function ringPath(cx, cy, R, amp, rand) {
    const p1 = rand() * 6.283;
    const p2 = rand() * 6.283;
    const p3 = rand() * 6.283;
    const N = 96;

    let d = '';

    for (let i = 0; i <= N; i++) {
      const a = i / N * Math.PI * 2;

      const r =
        R +
        amp *
          (
            Math.sin(2 * a + p1) * .55 +
            Math.sin(3 * a + p2) * .3 +
            Math.sin(5 * a + p3) * .15
          );

      d +=
        (i ? 'L' : 'M') +
        (cx + Math.cos(a) * r).toFixed(2) +
        ' ' +
        (cy + Math.sin(a) * r).toFixed(2);
    }

    return d + 'Z';
  }

  function makeRings(
    parent,
    { count, rMin, rMax, amp, seed, cx, cy, opacity }
  ) {
    const rand = rng(seed);
    const out = [];

    for (let i = 0; i < count; i++) {
      const R =
        rMin +
        (rMax - rMin) *
          (i / Math.max(1, count - 1));

      const p = document.createElementNS(NS, 'path');

      p.setAttribute(
        'd',
        ringPath(
          cx,
          cy,
          R,
          amp * (.4 + .6 * i / count),
          rand
        )
      );

      p.setAttribute('pathLength', '1');
      p.setAttribute('class', 'ring');
      p.style.setProperty('--i', i);

      if (opacity) {
        p.style.opacity = opacity(i, count).toFixed(2);
      }

      parent.appendChild(p);
      out.push(p);
    }

    return out;
  }


  /* Hero: os anéis se desenham uma vez,
     no carregamento (o CSS cuida da animação) */

  const heroSvg = $('#heroRings');

  if (heroSvg) {
    makeRings(heroSvg, {
      count: 18,
      rMin: 24,
      rMax: 392,
      amp: 7,
      seed: 12,
      cx: 400,
      cy: 400,
      opacity: (i, n) => .62 - .38 * i / n
    });
  }


  /* ---------- Menu ---------- */

  const menu = $('#menu');
  const menuBtn = $('#menuBtn');
  const root = document.documentElement;

  function setMenu(open) {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menu.inert = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    root.style.overflow = open ? 'hidden' : '';

    if (open) {
      setTimeout(
        () => $('#menuClose').focus({ preventScroll: true }),
        300
      );
    } else {
      menuBtn.focus({ preventScroll: true });
    }
  }

  menuBtn.addEventListener('click', () => setMenu(true));

  $('#menuClose').addEventListener('click', () => setMenu(false));

  $$('[data-close]', menu).forEach(a =>
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      menu.inert = true;
      menuBtn.setAttribute('aria-expanded', 'false');
      root.style.overflow = '';
    })
  );


  /* ---------- Projetos: monta os cartões
     a partir de PROJECTS (data.js) ---------- */

  const grid = $('#grid');

  function buildProjects() {

    // Cria as duas colunas da galeria
    const column1 = document.createElement('div');
    const column2 = document.createElement('div');

    column1.className = 'projects-masonry-column';
    column2.className = 'projects-masonry-column';

    grid.appendChild(column1);
    grid.appendChild(column2);

    
    
    PROJECTS.forEach((p, i) => {

      const L =
        PROJECTS_LAYOUT[i % PROJECTS_LAYOUT.length];

      const art = document.createElement('article');

      art.className = 'p-card';

      art.dataset.cat = p.cat;
      art.dataset.img = p.img;
      art.dataset.title = p.title;
      art.dataset.desc = p.desc;

      

      art.innerHTML =
  '<button type="button" class="p-open">'
  + '<div class="p-frame" style="aspect-ratio:' + L.ratio + '">'
  + '<img src="' + p.img + '" alt="' + p.alt + '" loading="lazy">'
  + '</div>'
  + '<div class="mt-4 flex items-baseline justify-between gap-4">'
  + '<h3 class="p-title display text-2xl md:text-3xl">' + p.title + '</h3>'
  + '<span class="text-sm text-ivory/55">' + p.cat + '</span>'
  + '</div>'
  + '</button>';

      // Distribui os projetos entre as duas colunas
      if (i % 2 === 0) {
        column1.appendChild(art);
      } else {
        column2.appendChild(art);
      }
    });
  }

  buildProjects();


  /* ---------- Projetos: filtro e paginação
     ("Ver mais" / "Voltar ao topo") ---------- */

  const cards = $$('.p-card');
  const projMore = $('#projMore');
  const projTop = $('#projTop');

  let curFilter = 'all';
  let shown = PROJECTS_PAGE_SIZE;


  function renderProjects() {

    const list = cards.filter(
      c =>
        curFilter === 'all' ||
        c.dataset.cat === curFilter
    );

    const columns =
      $$('.projects-masonry-column');


    // Reorganiza os cards nas duas colunas
    columns.forEach(column => {
      column.innerHTML = '';
    });


    // Esconde todos os cards inicialmente
    cards.forEach(c => {
      c.hidden = true;
    });


    // Coloca novamente os cards nas colunas
    list.forEach((card, i) => {
  const column = columns[i % 2];

  if (i < shown) {
    card.hidden = false;

    // Remove qualquer aviso anterior
    const oldHint = card.querySelector('[data-project-hint]');
    if (oldHint) oldHint.remove();

    // Adiciona o aviso somente na primeira foto exibida
    if (i === 0) {
      const hint = document.createElement('p');

      hint.dataset.projectHint = '';
      hint.className =
  '-mt-1 text-sm leading-none tracking-[0.08em] text-ivory/45 italic font-semibold';

hint.textContent = 'Toque para ampliar a foto';

      card.querySelector('.p-open').appendChild(hint);
    }
  }

  column.appendChild(card);
});

    // Ainda existem fotos para mostrar?
    const hasMore = shown < list.length;

    projMore.hidden = !hasMore;
    projTop.hidden = hasMore;


    // Animação suave da galeria
    if (
      !matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches &&
      grid.animate
    ) {
      grid.animate(
        [
          { opacity: 0 },
          { opacity: 1 }
        ],
        {
          duration: 450,
          easing: 'ease-out'
        }
      );
    }
  }


  /* ---------- Filtros, "Ver mais"
     e "Voltar ao topo" ---------- */

  $$('[data-filter]').forEach(btn => {

    btn.addEventListener('click', () => {

      curFilter = btn.dataset.filter;
      shown = PROJECTS_PAGE_SIZE;

      $$('[data-filter]').forEach(b => {
        b.setAttribute(
          'aria-pressed',
          String(b === btn)
        );
      });

      renderProjects();
    });
  });


  /* ---------- Ver mais ---------- */

  projMore.addEventListener('click', () => {

    shown += PROJECTS_PAGE_SIZE;

    renderProjects();
  });


  /* ---------- Inicializa a galeria ---------- */

  renderProjects();


  /* ---------- Voltar ao topo ---------- */

  projTop.addEventListener('click', () => {

    // Volta a mostrar somente as 4 primeiras fotos
    shown = PROJECTS_PAGE_SIZE;

    // Atualiza a galeria
    renderProjects();

    // Volta suavemente para o início
    // da seção Projetos
    document
      .querySelector('#projetos')
      .scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
  });


  /* ---------- Lightbox ---------- */

  const lb = $('#lb');

  let lbList = [];
  let lbIdx = 0;
  let lbTrigger = null;


  function showLb(i) {

    lbIdx =
      (i + lbList.length) %
      lbList.length;

    const c = lbList[lbIdx];

    $('#lbImg').src =
      c.dataset.img || '';

    $('#lbImg').alt =
      $('.p-frame img', c).alt;

    $('#lbTitle').textContent =
      c.dataset.title;

    $('#lbCat').textContent =
      c.dataset.cat;

    $('#lbDesc').textContent =
      c.dataset.desc;
  }


  function openLb(card) {

    lbList =
      cards.filter(c => !c.hidden);

    lbTrigger =
      document.activeElement;

    showLb(
      lbList.indexOf(card)
    );

    lb.classList.add('open');

    lb.setAttribute(
      'aria-hidden',
      'false'
    );

    lb.inert = false;

    root.style.overflow = 'hidden';

    setTimeout(
      () =>
        $('#lbClose').focus({
          preventScroll: true
        }),
      50
    );
  }


  function closeLb() {

    lb.classList.remove('open');

    lb.setAttribute(
      'aria-hidden',
      'true'
    );

    lb.inert = true;

    root.style.overflow = '';

    if (lbTrigger) {
      lbTrigger.focus({
        preventScroll: true
      });
    }
  }


  cards.forEach(c => {

    $('.p-open', c).addEventListener(
      'click',
      () => openLb(c)
    );

  });


  $('#lbClose').addEventListener(
    'click',
    closeLb
  );


  $('#lbPrev').addEventListener(
    'click',
    () => showLb(lbIdx - 1)
  );


  $('#lbNext').addEventListener(
    'click',
    () => showLb(lbIdx + 1)
  );


  lb.addEventListener('click', e => {

    if (
      e.target === lb ||
      e.target.classList.contains('lb-inner')
    ) {
      closeLb();
    }

  });


  /* ---------- Teclado ---------- */

  document.addEventListener('keydown', e => {

    if (e.key === 'Escape') {

      if (lb.classList.contains('open')) {
        closeLb();

      } else if (menu.classList.contains('open')) {
        setMenu(false);
      }
    }


    if (lb.classList.contains('open')) {

      if (e.key === 'ArrowLeft') {
        showLb(lbIdx - 1);
      }

      if (e.key === 'ArrowRight') {
        showLb(lbIdx + 1);
      }
    }

  });


  /* ---------- Materiais: painéis expansíveis ---------- */

  const mats = $$('.mat');

  function setMat(i) {

    mats.forEach((m, j) => {
      m.classList.toggle(
        'active',
        i === j
      );
    });
  }

  const canHover =
    matchMedia(
      '(hover: hover) and (min-width: 768px)'
    );


  mats.forEach((m, i) => {

    m.addEventListener(
      'mouseenter',
      () => {
        if (canHover.matches) {
          setMat(i);
        }
      }
    );


    m.addEventListener(
      'click',
      () => setMat(i)
    );


    m.addEventListener(
      'focus',
      () => setMat(i)
    );


    m.addEventListener(
      'keydown',
      e => {

        if (
          e.key === 'Enter' ||
          e.key === ' '
        ) {
          e.preventDefault();
          setMat(i);
        }

      }
    );

  });


  setMat(0);


  /* ---------- História:
     um anel por ano, ligado à rolagem ---------- */

  const hist = $('#historia');

  const years = Math.max(
    1,
    new Date().getFullYear() - FOUNDED
  );


  const hRings = makeRings(
    $('#histRings'),
    {
      count: years + 1,
      rMin: 8,
      rMax: 268,
      amp: 2.1,
      seed: 31,
      cx: 300,
      cy: 300,
      opacity: (i, n) =>
        .5 + .5 * i / n
    }
  );


  const labelYears =
    Array.from(
      new Set([
        FOUNDED,
        1990,
        2000,
        2010,
        2020,
        FOUNDED + years
      ])
    )
    .filter(
      y =>
        y >= FOUNDED &&
        y <= FOUNDED + years
    );


  const hLabels =
    labelYears.map(y => {

      const i = y - FOUNDED;

      const R =
        8 +
        (268 - 8) *
          i / years;

      const g =
        document.createElementNS(
          NS,
          'g'
        );

      const tick =
        document.createElementNS(
          NS,
          'line'
        );

      tick.setAttribute(
        'class',
        'ring-tick'
      );

      tick.setAttribute(
        'x1',
        300
      );

      tick.setAttribute(
        'x2',
        310
      );

      tick.setAttribute(
        'y1',
        300 - R
      );

      tick.setAttribute(
        'y2',
        300 - R
      );


      const t =
        document.createElementNS(
          NS,
          'text'
        );

      t.setAttribute(
        'class',
        'ring-label'
      );

      t.setAttribute(
        'x',
        316
      );

      t.setAttribute(
        'y',
        300 - R + 4
      );

      t.textContent = y;

      g.appendChild(tick);
      g.appendChild(t);

      $('#histLabels').appendChild(g);

      return {
        i,
        t
      };
    });


  const yearNow = $('#yearNow');
  const yearsCount = $('#yearsCount');

  let lastK = -1;


  function updateHistory() {

    const r =
      hist.getBoundingClientRect();

    const vh =
      window.innerHeight;


    const total =
      (vh * .3) +
      (r.height - vh) -
      vh * .5;


    const p =
      clamp(
        (vh * .3 - r.top) /
        total
      );


    const t =
      p * (years + 1);


    hRings.forEach(
      (path, i) => {

        path.style.strokeDashoffset =
          (
            1 -
            clamp(
              (t - i) / 2
            )
          ).toFixed(3);

      }
    );


    hLabels.forEach(l => {

      l.t.style.opacity =
        t - l.i > 1
          ? 1
          : 0;

    });


    const k =
      Math.min(
        years,
        Math.floor(t)
      );


    if (k !== lastK) {

      lastK = k;

      yearNow.textContent =
        FOUNDED + k;

      yearsCount.textContent =
        k +
        (
          k === 1
            ? ' ano de ofício'
            : ' anos de ofício'
        );
    }
  }


  /* ---------- Navegação:
     fundo ao rolar ---------- */

  const nav = $('#nav');

  let ticking = false;


  function onScroll() {

    if (ticking) return;

    ticking = true;


    requestAnimationFrame(() => {

      nav.classList.toggle(
        'scrolled',
        window.scrollY > 40
      );

      updateHistory();

      ticking = false;
    });
  }


  addEventListener(
    'scroll',
    onScroll,
    { passive: true }
  );

  addEventListener(
    'resize',
    onScroll
  );

  onScroll();


  /* ---------- Orçamento em etapas
     (só front end) ---------- */


  /* ---------- Contato direto:
     WhatsApp e Instagram ---------- */

  const MSG_BASE =
    'Olá! Vim pelo site da Marcenaria Eise e gostaria de solicitar um orçamento.';


  const waLink =
    texto =>
      'https://wa.me/' +
      WHATSAPP_NUMBER +
      '?text=' +
      encodeURIComponent(texto);


  $$('[data-wa]').forEach(a => {
    a.href = waLink(MSG_BASE);
  });


  $$('[data-ig]').forEach(a => {
    a.href = INSTAGRAM_URL;
  });


  /* ---------- Rodapé ---------- */

  $('#yr').textContent =
    new Date().getFullYear();

})();