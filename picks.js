/* MiHa menu: instant search + "My picks" list with an estimated total. */
(() => {
  const dishes = [...document.querySelectorAll('.dish[data-name]')];
  if (!dishes.length) return;
  const $ = s => document.querySelector(s);
  const clean = s => s.replace(/&amp;/g, '&');
  const priceOf = s => { const m = (s || '').replace(/[,\s]/g, '').match(/\d+/); return m ? +m[0] : 0; };
  const fmt = n => 'R ' + n.toLocaleString('en-ZA');

  /* ---------- search ---------- */
  const input = $('#msearch'), empty = $('.msearch__empty');
  if (input) input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    document.querySelectorAll('.msec .dish, .mextra .dish').forEach(d => {
      const hit = !q || d.textContent.toLowerCase().includes(q) || (d.dataset.tags || '').includes(q.replace('vegetarian', 'veg').replace('vegan', 'veg'));
      d.classList.toggle('is-search-hidden', !hit); if (hit) shown++;
    });
    document.querySelectorAll('.msec, .mextra').forEach(sec => {
      const any = [...sec.querySelectorAll('.dish')].some(d => !d.classList.contains('is-search-hidden') && !d.classList.contains('is-hidden'));
      sec.classList.toggle('is-search-empty', !!q && !any);
    });
    if (empty) empty.hidden = !q || shown > 0;
    window.ScrollTrigger && ScrollTrigger.refresh();
  });

  /* ---------- my picks ---------- */
  let picks = [];
  try { picks = JSON.parse(localStorage.getItem('miha-picks') || '[]'); } catch (e) {}
  const save = () => { try { localStorage.setItem('miha-picks', JSON.stringify(picks)); } catch (e) {} };

  document.body.insertAdjacentHTML('beforeend', `
    <button class="picks-pill" type="button" aria-controls="picks" aria-expanded="false" hidden><span class="picks-pill__n">0</span> My picks <b class="picks-pill__t">R 0</b></button>
    <section class="picks" id="picks" role="dialog" aria-label="My picks" hidden>
      <header class="picks__head"><h2>My picks</h2><button class="picks__x" type="button" aria-label="Close my picks">×</button></header>
      <ul class="picks__list"></ul>
      <div class="picks__foot">
        <p class="picks__total"><span>Estimated total</span><b>R 0</b></p>
        <p class="picks__note">An estimate from MiHa’s listed prices. Final prices are confirmed at the restaurant.</p>
        <div class="picks__actions">
          <a class="btn btn--gold" href="reserve.html#book"><span>Book a table</span></a>
          <button class="btn btn--ghost picks__share" type="button"><span>Share my list</span></button>
          <button class="link-arrow picks__clear" type="button">Clear list</button>
        </div>
      </div>
    </section>`);
  const pill = $('.picks-pill'), panel = $('#picks'), list = $('.picks__list');

  const render = () => {
    const count = picks.reduce((a, p) => a + p.q, 0), total = picks.reduce((a, p) => a + p.q * p.p, 0);
    pill.hidden = count === 0;
    pill.querySelector('.picks-pill__n').textContent = count;
    pill.querySelector('.picks-pill__t').textContent = fmt(total);
    $('.picks__total b').textContent = fmt(total);
    list.innerHTML = picks.length ? picks.map((p, i) => `<li><span class="picks__name">${p.n}</span><span class="picks__qty"><button type="button" data-i="${i}" data-d="-1" aria-label="One less ${p.n}">−</button><output>${p.q}</output><button type="button" data-i="${i}" data-d="1" aria-label="One more ${p.n}">+</button></span><span class="picks__price">${fmt(p.p * p.q)}</span></li>`).join('') : '<li class="picks__empty">Tap ＋ next to any dish to add it here.</li>';
    document.querySelectorAll('.dish[data-name]').forEach(d => d.classList.toggle('is-picked', picks.some(p => p.n === clean(d.dataset.name))));
    if (count === 0) closePanel();
  };
  const add = (n, p) => { const f = picks.find(x => x.n === n); f ? f.q++ : picks.push({ n, p, q: 1 }); save(); render(); pill.classList.remove('is-bump'); void pill.offsetWidth; pill.classList.add('is-bump'); };
  document.addEventListener('click', e => {
    const b = e.target.closest('.pick'); if (!b) return;
    const d = b.closest('.dish'); add(clean(d.dataset.name), priceOf(d.dataset.price));
  });
  list.addEventListener('click', e => {
    const b = e.target.closest('button[data-i]'); if (!b) return;
    const p = picks[+b.dataset.i]; p.q += +b.dataset.d; if (p.q <= 0) picks.splice(+b.dataset.i, 1); save(); render();
  });
  const openPanel = () => { panel.hidden = false; requestAnimationFrame(() => panel.classList.add('is-open')); pill.setAttribute('aria-expanded', 'true'); };
  function closePanel() { panel.classList.remove('is-open'); pill.setAttribute('aria-expanded', 'false'); setTimeout(() => { if (!panel.classList.contains('is-open')) panel.hidden = true; }, 400); }
  pill.addEventListener('click', () => (panel.classList.contains('is-open') ? closePanel() : openPanel()));
  $('.picks__x').addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
  $('.picks__clear').addEventListener('click', () => { picks = []; save(); render(); });
  $('.picks__share').addEventListener('click', async () => {
    const total = picks.reduce((a, p) => a + p.q * p.p, 0);
    const text = 'My MiHa picks:\n' + picks.map(p => `${p.q} × ${p.n}`).join('\n') + `\nEstimated total: ${fmt(total)}\nhttps://onlinepixelcode-collab.github.io/miha-website/menu.html`;
    if (navigator.share) { try { await navigator.share({ title: 'My MiHa picks', text }); return; } catch (e) {} }
    location.href = 'https://wa.me/?text=' + encodeURIComponent(text);
  });
  render();
})();
