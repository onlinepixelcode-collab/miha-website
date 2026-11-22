/* MiHa catering: occasion tabs + "Build your spread" suggestion engine (no prices; MiHa quotes). */
(() => {
  const root = document.querySelector('.cat-build');
  const tabs = [...document.querySelectorAll('.occ-pick__btn')];
  if (!root && !tabs.length) return;
  const $ = (s, c = document) => c.querySelector(s);

  // occasion tabs (keyboard friendly)
  const show = btn => {
    tabs.forEach(t => { const on = t === btn; t.classList.toggle('is-on', on); t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; const p = document.getElementById(t.getAttribute('aria-controls')); p.hidden = !on; p.classList.toggle('is-on', on); });
    window.ScrollTrigger && ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => show(t));
    t.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); show(n); } });
  });

  if (!root) return;
  const form = $('.cb__form', root), range = $('.cb__range', root), gOut = $('.cb__guests', root);
  const title = $('.cb__title', root), list = $('.cb__list', root);

  // occasion buttons in the panels preselect the builder
  document.querySelectorAll('[data-occ]').forEach(a => a.addEventListener('click', () => {
    const r = form.querySelector(`input[name="occ"][value="${a.dataset.occ}"]`); if (r) { r.checked = true; update(); }
  }));

  const per = (g, n) => Math.max(1, Math.ceil(g / n));
  function suggest(occ, g, style, diet) {
    const L = [];
    if (occ === 'Staff lunches') {
      L.push([g, 'individual lunches', 'pastas, gourmet burgers and wraps on rotation']);
      L.push([per(g, 4), 'salad bowls', 'Greek, butternut and grilled chicken salads']);
      if (diet.includes('Healthy options')) L.push([per(g, 3), 'Clenergy healthy options', 'high-protein bread, low-carb and gluten-free wraps']);
      if (diet.includes('Vegetarian')) L.push([per(g, 4), 'vegetarian meals', 'falafel wraps, vegan bowls and Margherita pizza']);
      return L;
    }
    if (style === 'Individual meals') {
      L.push([g, 'plated mains', occ === 'Boardroom meeting' ? 'grilled chicken, salmon poke and steak & avo wraps' : 'flame-grilled chicken, steak and Portuguese prawns']);
      L.push([g, 'desserts', 'chocolate fondant, Basque cheesecake or brownies']);
    } else {
      L.push([per(g, 2), 'tapas boards for 2', 'falafel, sheesh kebab, halloumi and dips with laffa']);
      L.push([per(g, 12), 'sushi platters', 'Kyoto salmon and Okinawa tempura']);
      if (occ === 'Function or year-end' || g >= 40) L.push([per(g, 10), 'chicken platters', 'two full chickens with rice and chips each']);
      if (diet.includes('Seafood lovers')) L.push([per(g, 12), 'prawn platters', 'two dozen queen prawns with rice and chips']);
      L.push([per(g, 8), 'dessert trays', 'brownies, croffles and cheesecake']);
      if (style === 'Buffet') L.unshift([1, 'buffet station', 'set up with hot mains, sides and salads']);
    }
    if (diet.includes('Vegetarian')) L.push([per(g, 10), 'vegetarian platters', 'Kobe vegetarian sushi and falafel']);
    if (diet.includes('Healthy options') && occ !== 'Staff lunches') L.push([per(g, 6), 'salad bowls', 'Greek and butternut salads']);
    return L;
  }
  function update() {
    const occ = form.querySelector('input[name="occ"]:checked').value;
    const style = form.querySelector('input[name="style"]:checked').value;
    const diet = [...form.querySelectorAll('input[name="diet"]:checked')].map(i => i.value);
    const g = +range.value; gOut.textContent = g;
    const short = { 'Boardroom meeting': 'Boardroom', 'Function or year-end': 'Function', 'Staff lunches': 'Staff lunches' }[occ];
    title.textContent = `${short} for ${g}`;
    const items = suggest(occ, g, style, diet);
    list.innerHTML = items.map(([n, what, d]) => `<li><b>${n}</b><span>${what}<small>${d}</small></span></li>`).join('');
    // pre-fill the enquiry form
    const msg = document.getElementById('c-msg'), guests = document.getElementById('c-guests');
    if (guests) guests.value = g;
    if (msg && (!msg.value || msg.dataset.auto === '1')) {
      msg.value = `${occ} · ${g} guests · ${style}${diet.length ? ' · ' + diet.join(', ') : ''}\nSuggested spread:\n` + items.map(([n, w]) => `- ${n} × ${w}`).join('\n');
      msg.dataset.auto = '1';
    }
  }
  document.getElementById('c-msg')?.addEventListener('input', e => (e.target.dataset.auto = '0'));
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
})();
