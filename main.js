/* MiHa Eatery — motion & interaction */
(() => {
  const html = document.documentElement;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // year
  $$('.year').forEach(el => (el.textContent = new Date().getFullYear()));

  // buffet calendar: highlight today and count down to the next buffet (Johannesburg time)
  (() => {
    const box = $('[data-next-buffet] .next-buffet__txt');
    const sa = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
    $$('.week__day').forEach(d => d.classList.toggle('is-today', +d.dataset.day === sa.getDay()));
    if (!box) return;
    const B = [{ d: 5, s: '18:30', e: '21:00', n: 'Friday Night Dinner Buffet' }, { d: 6, s: '09:30', e: '12:00', n: 'Weekend Breakfast Buffet' }, { d: 0, s: '09:30', e: '12:00', n: 'Weekend Breakfast Buffet' }];
    const m = s => { const [h, mm] = s.split(':'); return +h * 60 + +mm; };
    const nowM = sa.getHours() * 60 + sa.getMinutes();
    let best = null;
    for (let add = 0; add < 8 && !best; add++) {
      const day = (sa.getDay() + add) % 7;
      B.filter(b => b.d === day).forEach(b => { if (add > 0 || nowM < m(b.e)) best = best || { ...b, add, live: add === 0 && nowM >= m(b.s) }; });
    }
    if (!best) return;
    const when = best.live ? 'on <em>right now</em>, until ' + best.e : best.add === 0 ? `<em>today</em> at ${best.s}` : best.add === 1 ? `<em>tomorrow</em> at ${best.s}` : `this <em>${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][best.d]}</em> at ${best.s}`;
    box.innerHTML = `${best.n} is ${when}.`;
  })();

  // light / dark theme
  const setThemeLabel = () => $$('.theme-toggle').forEach(b => b.setAttribute('aria-label', html.dataset.theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'));
  setThemeLabel();
  $$('.theme-toggle').forEach(b => b.addEventListener('click', () => {
    html.dataset.theme = html.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('miha-theme', html.dataset.theme); } catch (e) {}
    setThemeLabel();
  }));

  // current page in nav
  const here = location.pathname.split('/').pop() || 'index.html';
  $$('.nav__links a, .drawer nav a').forEach(a => {
    if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
  });

  /* ---------------- fail-safe: no GSAP → show everything ---------------- */
  if (!hasGSAP || reduce) {
    html.classList.add('seen');
    $$('[data-reveal],[data-clip]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    $$('.statement__text').forEach(el => (el.style.opacity = 1));
    initStatus(); initMenuPage(); initForms(); initDrawer();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- smooth scroll ---------------- */
  let lenis = null;
  if (window.Lenis && !location.search.includes('nosmooth')) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update); window.__lenis = lenis;
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  // anchor links
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = $(id); if (!t) return;
    e.preventDefault(); closeDrawer();
    lenis ? lenis.scrollTo(t, { offset: -60, duration: 1.6 }) : t.scrollIntoView({ behavior: 'smooth' });
  }));

  /* ---------------- words split for statement ---------------- */
  $$('[data-words]').forEach(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  });

  /* ---------------- intro: loader (first visit) or curtain (page change) ---------------- */
  const fromInside = sessionStorage.getItem('miha-nav') === '1';
  sessionStorage.removeItem('miha-nav');
  const loader = $('.loader');
  const curtain = $('.curtain');
  // Drive the curtain only with yPercent: clear the CSS translateY so the two never add up
  // (that stacking left the curtain covering the page after a page change).
  if (curtain) { curtain.style.transform = 'none'; gsap.set(curtain, { y: 0, yPercent: 100 }); }

  function heroIn() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to('.phero__media img, .phero__media video', { scale: 1, duration: 2.6, ease: 'power3.out' }, 0)
      .from('.hero__title .line > span, .phero__title .line > span', { yPercent: 110, duration: 1, stagger: .08 }, 0)
      .from('.hero__eyebrow, .phero .eyebrow, .crumbs', { y: 20, opacity: 0, duration: .7 }, .1)
      .from('.hero__lead, .hero__actions > *, .phero .lead, .phero__row .btn', { y: 30, opacity: 0, duration: .8, stagger: .06 }, .2)
      .from('.fcard', { y: 60, opacity: 0, scale: .9, duration: 1, stagger: .1 }, .3)
      .from('.nav', { opacity: 0, duration: .6, clearProps: 'opacity' }, 0)
      .from('.hero__ticker', { yPercent: 100, duration: 1.2 }, .7);
    return tl;
  }

  if (loader && !fromInside && !sessionStorage.getItem('miha-seen')) {
    sessionStorage.setItem('miha-seen', '1');
    lenis && lenis.stop();
    const counter = { v: 0 };
    const tl = gsap.timeline();
    const release = () => { window.__loaderGone = Math.round(performance.now()); loader.remove(); lenis && lenis.start(); };
    // ~1.2s total: the monogram draws, the wordmark settles, the panels part
    tl.to('.loader__mark path', { strokeDashoffset: 0, duration: .6, stagger: .08, ease: 'power2.inOut' }, 0)
      .fromTo('.loader__word', { opacity: 0, letterSpacing: '1em' }, { opacity: 1, letterSpacing: '.5em', duration: .6, ease: 'expo.out' }, .3)
      .to('.loader__line i', { scaleX: 1, duration: .7, ease: 'power2.inOut' }, .1)
      .to(counter, { v: 100, duration: .7, ease: 'power2.inOut', onUpdate: () => { $('.loader__count').textContent = String(Math.round(counter.v)).padStart(2, '0'); } }, .1)
      .to('.loader__inner', { opacity: 0, y: -14, duration: .3, ease: 'power2.in' }, .85)
      .to('.loader__panel--top', { yPercent: -100, duration: .6, ease: 'expo.inOut' }, .95)
      .to('.loader__panel--bottom', { yPercent: 100, duration: .6, ease: 'expo.inOut' }, .95)
      .add(heroIn(), 1.05)
      .call(release, null, 1.5);   // page is usable as soon as the panels have parted
  } else {
    loader && loader.remove();
    if (curtain && fromInside) {
      gsap.set(curtain, { yPercent: 0 });
      gsap.to(curtain, { yPercent: -100, duration: .5, ease: 'expo.inOut' });
      heroIn().delay(.15);
    } else {
      heroIn();
    }
  }

  /* ---------------- page transitions ---------------- */
  $$('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || a.target === '_blank' || /\.pdf$/.test(href)) return;
    a.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      closeDrawer();
      sessionStorage.setItem('miha-nav', '1');
      const label = a.dataset.title || a.textContent.trim().split('\n')[0];
      const w = curtain && $('.curtain__word', curtain);
      if (w) w.textContent = label.length < 24 ? label : 'MiHa';
      gsap.timeline({ onComplete: () => (location.href = href) })
        .fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: .4, ease: 'power3.inOut' })
        .fromTo([$('.curtain__mark', curtain), w], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .2, stagger: .04, ease: 'power3.out' }, .2);
    });
  });
  window.addEventListener('pageshow', e => { if (e.persisted && curtain) gsap.set(curtain, { yPercent: 100 }); });

  /* ---------------- nav behaviour ---------------- */
  const nav = $('.nav');
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: self => {
      const y = self.scroll();
      nav.classList.toggle('is-scrolled', y > 40);
      nav.classList.toggle('is-hidden', y > lastY && y > 400 && !html.classList.contains('drawer-open'));
      lastY = y;
    }
  });
  initDrawer();

  /* ---------------- hero: floating cards follow pointer ---------------- */
  const cards = $$('.fcard');
  if (cards.length) {
    cards.forEach((c, i) => gsap.to(c, { y: '+=14', duration: 2.6 + i * .4, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    if (fine) window.addEventListener('mousemove', e => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      cards.forEach(c => { const d = +c.dataset.depth || 20; gsap.to(c, { x: -x * d * 2, rotate: x * 3, duration: 1.2, ease: 'power3.out', overwrite: 'auto' }); });
    });
  }
  // hero reel: MiHa's own photos crossfade like a slow film
  const reel = $$('.hero__reel img'), bars = $$('.hero__reel-nav i');
  if (reel.length > 1) {
    let k = 0;
    const show = i => {
      reel.forEach((im, j) => im.classList.toggle('is-on', j === i));
      gsap.fromTo(reel[i], { scale: 1.15 }, { scale: 1.02, duration: 7, ease: 'none' });
      bars.forEach((b, j) => { b.classList.remove('is-on'); if (j === i) { void b.offsetWidth; b.classList.add('is-on'); } });
    };
    show(0);
    setInterval(() => { k = (k + 1) % reel.length; show(k); }, 5500);
  }
  // hero image drift on scroll
  $$('.phero__media img').forEach(img => {
    gsap.to(img, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: img.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  });

  /* ---------------- statement word highlight ---------------- */
  $$('.statement__text').forEach(el => {
    gsap.to($$('.w', el), { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: true } });
  });

  /* ---------------- generic reveals ---------------- */
  $$('[data-reveal]').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
  $$('[data-clip]').forEach(el => {
    gsap.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 85%' } });
    const img = $('img', el); if (img) gsap.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
  $$('.h2, .msec__title, .reserve__title, .display').forEach(h => {
    if (h.closest('.phero')) return;
    gsap.from(h, { y: 60, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' } });
  });
  $$('.reserve__title .line > span').forEach((s, i) => gsap.from(s, { yPercent: 110, duration: 1.4, delay: i * .12, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 92%' } }));

  /* ---------------- signature wheel ---------------- */
  const sig = $('.signature');
  if (sig) {
    const disc = $('.wheel__disc'), items = $$('.sig-list li'), plates = $$('.wheel__plate img');
    const n = items.length;
    const setActive = i => items.forEach((li, k) => li.classList.toggle('is-active', k === i));
    const desktop = matchMedia('(min-width: 901px)').matches;
    const st = ScrollTrigger.create({
      trigger: sig, start: 'top top', end: () => '+=' + innerHeight * (desktop ? 2.6 : 1.6), pin: '.signature__pin', scrub: 1,
      onUpdate: self => {
        const p = self.progress;
        const rot = p * 270; // 4 plates, 90° apart; the active plate faces the copy (left)
        gsap.set(disc, { rotate: rot });
        plates.forEach(img => gsap.set(img, { rotate: -rot * 1.2 }));
        setActive(Math.min(n - 1, Math.round(p * (n - 1))));
      }
    });
    // rotate so plate 0 faces the viewer (left side of wheel = 270deg position)
    gsap.set('.wheel__plate', { '--a': (i, el) => el.style.getPropertyValue('--a') });
    items.forEach((li, i) => li.addEventListener('click', () => {
      const target = st.start + (st.end - st.start) * (i / (n - 1));
      lenis ? lenis.scrollTo(target, { duration: 1.4 }) : scrollTo({ top: target, behavior: 'smooth' });
    }));
  }

  /* ---------------- day: horizontal journey ---------------- */
  const day = $('.day');
  if (day) {
    const track = $('.day__track');
    const dist = () => Math.max(0, track.scrollWidth - innerWidth + 40);
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: day, start: 'top top', end: () => '+=' + dist(), pin: '.day__pin', scrub: 1, invalidateOnRefresh: true,
        onUpdate: s => gsap.set('.day__bar i', { scaleX: s.progress }) }
    });
    $$('.slot__img img', day).forEach(img => gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: day, start: 'top top', end: () => '+=' + dist(), scrub: true } }));
  }

  /* ---------------- step inside: the moon portal opens ---------------- */
  $$('.portal').forEach(p => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: p, start: 'top top', end: () => '+=' + innerHeight * 1.4, pin: true, scrub: 1 } });
    tl.fromTo($('.portal__img', p), { width: '30vmin' }, { width: () => Math.min(innerWidth * .86, innerHeight * .66) + 'px', ease: 'power2.inOut' }, 0)
      .fromTo($('.portal__img img', p), { scale: 1.35 }, { scale: 1, ease: 'none' }, 0)
      .fromTo($('.portal__copy', p), { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out' }, .35);
  });

  /* ---------------- bleed parallax ---------------- */
  $$('.bleed').forEach(b => {
    $('.bleed__img', b) && gsap.fromTo($('.bleed__img', b), { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: b, start: 'top bottom', end: 'bottom top', scrub: true } });
    // lines rise into place (no sideways shift, so they never pass the screen edge)
    $$('.bleed__quote span', b).forEach((s, i) => gsap.fromTo(s, { y: 60 + i * 30, opacity: 0 }, { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: b, start: 'top 80%', end: 'center center', scrub: true } }));
  });
  $$('.reserve__img img').forEach(r => gsap.fromTo(r, { scale: 1.18, yPercent: -6 }, { scale: 1.02, yPercent: 6, ease: 'none', scrollTrigger: { trigger: r.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } }));

  /* ---------------- counters ---------------- */
  $$('[data-count]').forEach(el => {
    const to = +el.dataset.count, o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 2, ease: 'power3.out', onUpdate: () => (el.textContent = Math.round(o.v)) }) });
  });

  /* ---------------- footer word ---------------- */
  $$('.footer__lockup').forEach(w => gsap.from(w, { yPercent: 30, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: w, start: 'top 95%' } }));

  /* ---------------- cursor ---------------- */
  if (fine) {
    const cur = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('.cursor__label');
    const xd = gsap.quickTo(dot, 'x', { duration: .12 }), yd = gsap.quickTo(dot, 'y', { duration: .12 });
    const xr = gsap.quickTo(ring, 'x', { duration: .5, ease: 'power3' }), yr = gsap.quickTo(ring, 'y', { duration: .5, ease: 'power3' });
    window.addEventListener('mousemove', e => { xd(e.clientX); yd(e.clientY); xr(e.clientX); yr(e.clientY); });
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('[data-cursor], a, button');
      cur.classList.toggle('is-label', !!(t && t.dataset.cursor));
      cur.classList.toggle('is-link', !!(t && !t.dataset.cursor));
      label.textContent = t && t.dataset.cursor ? t.dataset.cursor : '';
    });
    document.addEventListener('mouseleave', () => gsap.to(cur, { opacity: 0 }));
    document.addEventListener('mouseenter', () => gsap.to(cur, { opacity: 1 }));

    // magnetic buttons
    $$('.mag').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .6, ease: 'power3.out' });
        gsap.to($('span', b), { x: (e.clientX - r.left - r.width / 2) * .1, duration: .6, ease: 'power3.out' });
      });
      b.addEventListener('mouseleave', () => { gsap.to([b, $('span', b)], { x: 0, y: 0, duration: .9, ease: 'elastic.out(1,.4)' }); });
    });
  }

  initStatus(); initMenuPage(); initForms();
  window.addEventListener('load', () => ScrollTrigger.refresh());

  /* ================= helpers ================= */
  function initDrawer() {
    const burger = $('.nav__burger'), drawer = $('#drawer');
    if (!burger || !drawer) return;
    drawer.hidden = false;
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      drawer.classList.toggle('is-open', open);
      html.classList.toggle('drawer-open', open);
      if (window.gsap && open) gsap.from($$('nav a', drawer), { y: 60, opacity: 0, duration: 1, stagger: .06, ease: 'expo.out', delay: .25 });
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  }
  function closeDrawer() {
    const burger = $('.nav__burger'), drawer = $('#drawer');
    if (!burger || !drawer) return;
    burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu');
    drawer.classList.remove('is-open'); html.classList.remove('drawer-open');
  }

  // Live open/closed from MiHa's real trading hours (Johannesburg time)
  function initStatus() {
    const H = {
      jhb: { 0: ['09:00', '21:30'], 1: ['11:00', '21:30'], 2: ['11:00', '21:30'], 3: ['11:00', '21:30'], 4: ['11:00', '21:30'], 5: ['11:00', '22:00'], 6: ['09:00', '22:00'] },
      pta: { 0: ['09:00', '21:30'], 1: ['18:00', '21:30'], 2: ['12:00', '21:30'], 3: ['12:00', '21:30'], 4: ['12:00', '21:30'], 5: ['12:00', '21:30'], 6: ['09:00', '22:00'] }
    };
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
    const mins = now.getHours() * 60 + now.getMinutes(), d = now.getDay();
    const toM = s => { const [h, m] = s.split(':'); return +h * 60 + +m; };
    $$('[data-branch]').forEach(card => {
      const h = H[card.dataset.branch]; if (!h) return;
      const el = $('.status', card); if (!el) return;
      const [o, c] = h[d];
      let txt, open = false;
      if (mins >= toM(o) && mins < toM(c)) { open = true; txt = `Open now · until ${c}`; }
      else if (mins < toM(o)) txt = `Closed · opens ${o} today`;
      else { const nd = (d + 1) % 7; txt = `Closed · opens ${h[nd][0]} tomorrow`; }
      el.classList.add(open ? 'is-open' : 'is-closed');
      $('em', el).textContent = txt;
      // highlight today in the hours table
      const map = card.dataset.branch === 'jhb' ? [3, 0, 0, 0, 0, 1, 2] : [3, 0, 1, 1, 1, 1, 2];
      const rows = $$('.hours tr', card); if (rows[map[d]]) rows[map[d]].classList.add('is-today');
    });
  }

  // Menu page: tabs follow scroll, filters
  function initMenuPage() {
    const tabs = $$('.mtabs a'); if (!tabs.length) return;
    const secs = tabs.map(a => $(a.getAttribute('href'))).filter(Boolean);
    const onScroll = () => {
      let idx = 0; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < 220) idx = i; });
      tabs.forEach((t, i) => t.classList.toggle('is-active', i === idx));
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    const btns = $$('.mfilters button');
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.setAttribute('aria-pressed', x === b));
      const f = b.dataset.filter;
      $$('.dish').forEach(d => d.classList.toggle('is-hidden', f !== 'all' && !(d.dataset.tags || '').includes(f)));
      window.ScrollTrigger && ScrollTrigger.refresh();
    }));
  }

  // Enquiry forms open the visitor's email app with the details filled in
  function initForms() {
    $$('form[data-mailto]').forEach(f => f.addEventListener('submit', e => {
      e.preventDefault();
      if (!f.reportValidity()) return;
      const data = new FormData(f);
      const subject = `${f.dataset.subject || 'Enquiry'} — ${data.get('name') || ''}`;
      const body = [...data.entries()].map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)}: ${v}`).join('\n');
      location.href = `mailto:${f.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const ok = $('.form__ok', f); if (ok) ok.hidden = false;
    }));
  }
})();
