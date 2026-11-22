/* MiHa Concierge — booking, order suggestions and quick answers.
   Runs entirely in the browser. To connect a real AI model later, set
   window.MIHA_AI_ENDPOINT to a server route that accepts {messages} and returns {reply};
   free-text questions the concierge can't answer are then sent there. */
(() => {
  const BR = {
    jhb: { name: 'Melrose Arch', addr: 'Shop HL48, Melrose Arch, Johannesburg', tel: '+27607489464', telTxt: '060 748 9464', dine: 'https://www.dineplan.com/restaurants/miha', map: 'https://www.google.com/maps/search/?api=1&query=MiHa+Eatery+Melrose+Arch',
      h: { 0: ['09:00', '21:30'], 1: ['11:00', '21:30'], 2: ['11:00', '21:30'], 3: ['11:00', '21:30'], 4: ['11:00', '21:30'], 5: ['11:00', '22:00'], 6: ['09:00', '22:00'] } },
    pta: { name: 'Centurion', addr: '134 Baard Rd, Raslouw, Pretoria', tel: '+27780059386', telTxt: '078 005 9386', dine: 'https://www.dineplan.com/restaurants/miha-pretoria', map: 'https://www.google.com/maps/search/?api=1&query=MiHa+Eatery+134+Baard+Rd+Raslouw',
      h: { 0: ['09:00', '21:30'], 1: ['18:00', '21:30'], 2: ['12:00', '21:30'], 3: ['12:00', '21:30'], 4: ['12:00', '21:30'], 5: ['12:00', '21:30'], 6: ['09:00', '22:00'] } }
  };
  const IMG = n => `img/miha/${n}.jpg`;
  const SUGGEST = {
    hungry: { label: 'Properly hungry', picks: [['The MiHa grill platter', 'Flame-grilled cuts, onion rings and chips.', 'imgs-9-of-118'], ['Peri-peri prawns', 'With savoury rice and charred lemon.', 'imgs-26-of-118'], ['The MiHa burger', 'Avocado, crispy onions, sesame bun.', 'imgs-89-of-118']] },
    light: { label: 'Something light', picks: [['MiHa garden salad', 'Crisp leaves, avocado and red onion.', 'img-98-of-163'], ['Penne arrabbiata', 'Slow tomato, olives and basil.', 'imgs-44-of-118'], ['Grilled chicken wrap', 'Charred wrap with fresh salad.', 'imgs-56-of-118']] },
    share: { label: 'Sharing with the table', picks: [['The MiHa grill platter', 'Built for the middle of the table.', 'imgs-17-of-118'], ['Chicken platter', 'Chicken, rice, chips and sauces.', 'imgs-35-of-118'], ['Starter board', 'Crumbed bites to share.', 'img-94-of-163']] },
    sweet: { label: 'Something sweet', picks: [['Crème brûlée', 'Crackled sugar and strawberries.', 'img-152-of-163'], ['Chocolate fondant', 'Molten centre, vanilla ice cream.', 'img-135-of-163'], ['Tiramisu', 'Coffee, cream and cocoa.', 'img-161-of-163']] },
    drink: { label: 'A great drink', picks: [['Violet berry crush', 'Berry pearls, mint and sparkle.', 'imgs-77-of-118'], ['Pineapple sunset', 'Tropical, with dried pineapple.', 'imgs-113-of-118'], ['Caramel freakshake', 'Piled high with cream.', 'img-131-of-163']] },
    kids: { label: 'For the kids', picks: [['Basket of chips', 'Hand-cut and hot.', 'imgs-91-of-118'], ['Penne arrabbiata (mild on request)', 'Ask us to keep it gentle.', 'imgs-41-of-118'], ['Chocolate freakshake', 'The obvious winner.', 'imgs-84-of-118']] }
  };

  const css = `
  .cc-btn{position:fixed;right:24px;bottom:24px;z-index:120;width:60px;height:60px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#e2c48f,#c9a46a 55%,#8d6b3a);box-shadow:0 18px 40px -12px rgba(0,0,0,.75),0 0 0 6px rgba(201,164,106,.14);transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s}
  .cc-btn:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 22px 46px -12px rgba(0,0,0,.8),0 0 0 9px rgba(201,164,106,.18)}
  .cc-btn svg{width:30px;color:#0d0b09}
  .cc-bubble{position:fixed;right:96px;bottom:36px;z-index:120;padding:10px 16px;border-radius:16px 16px 4px 16px;background:#efe8dd;color:#0d0b09;font:500 14px/1 "Geist",sans-serif;letter-spacing:.02em;box-shadow:0 14px 34px -12px rgba(0,0,0,.6);white-space:nowrap;cursor:pointer;opacity:0;transform:translateX(10px) scale(.9);transform-origin:right bottom;transition:opacity .5s,transform .6s cubic-bezier(.22,1,.36,1)}
  .cc-bubble.is-on{opacity:1;transform:none}
  .cc-bubble::after{content:"";position:absolute;right:-6px;bottom:6px;border:6px solid transparent;border-left-color:#efe8dd;border-right:0}
  .cc{position:fixed;right:24px;bottom:24px;z-index:130;width:min(420px,calc(100vw - 24px));height:min(680px,calc(100svh - 48px));display:flex;flex-direction:column;border-radius:22px;overflow:hidden;background:#110e0b;border:1px solid rgba(239,232,221,.14);box-shadow:0 40px 100px -20px rgba(0,0,0,.85);transform-origin:bottom right;transform:scale(.6) translateY(30px);opacity:0;pointer-events:none;transition:transform .6s cubic-bezier(.22,1,.36,1),opacity .4s}
  .cc.is-open{transform:none;opacity:1;pointer-events:auto}
  .cc__head{display:flex;align-items:center;gap:14px;padding:18px 18px 16px;border-bottom:1px solid rgba(239,232,221,.1);background:linear-gradient(180deg,#1a1612,#110e0b)}
  .cc__head svg.mh{width:34px;color:#c9a46a}
  .cc__head b{display:block;font:400 22px/1 'Cormorant Garamond',serif;color:#efe8dd}
  .cc__head span{font:500 11px 'Geist',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#c9a46a}
  .cc__x{margin-left:auto;width:44px;height:44px;border-radius:50%;border:1px solid rgba(239,232,221,.18);color:#efe8dd;font-size:20px;line-height:1}
  .cc__log{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:10px;scrollbar-width:thin;overscroll-behavior:contain}
  .cc__m{max-width:86%;padding:12px 15px;border-radius:16px;font:400 15px/1.5 'Geist',sans-serif;animation:ccIn .5s cubic-bezier(.22,1,.36,1)}
  .cc__m a{color:#e2c48f;text-decoration:underline;text-underline-offset:3px}
  .cc__m--bot{background:#1d1915;color:#e8e0d4;border-bottom-left-radius:4px}
  .cc__m--me{align-self:flex-end;background:linear-gradient(135deg,#e2c48f,#c9a46a);color:#0d0b09;border-bottom-right-radius:4px}
  .cc__typing{display:flex;gap:4px;padding:14px 16px}.cc__typing i{width:6px;height:6px;border-radius:50%;background:#c9a46a;animation:ccDot 1s infinite}.cc__typing i:nth-child(2){animation-delay:.15s}.cc__typing i:nth-child(3){animation-delay:.3s}
  @keyframes ccDot{50%{opacity:.25;transform:translateY(-3px)}}
  @keyframes ccIn{from{opacity:0;transform:translateY(10px)}}
  .cc__chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:2px}
  .cc__chip{min-height:40px;padding:8px 14px;border-radius:999px;border:1px solid rgba(201,164,106,.45);color:#e2c48f;font:500 13px 'Geist',sans-serif;background:transparent;transition:background .3s,color .3s}
  .cc__chip:hover{background:#c9a46a;color:#0d0b09}
  .cc__cards{display:grid;gap:8px;width:100%}
  .cc__card{display:grid;grid-template-columns:64px 1fr;gap:12px;align-items:center;padding:8px;border-radius:14px;background:#1d1915;border:1px solid rgba(239,232,221,.08)}
  .cc__card img{width:64px;height:64px;object-fit:cover;border-radius:10px}
  .cc__card b{display:block;font:400 19px/1.15 'Cormorant Garamond',serif;color:#efe8dd}
  .cc__card small{color:#9d9488;font-size:13px}
  .cc__sum{width:100%;padding:16px;border-radius:14px;border:1px solid rgba(201,164,106,.4);background:#17130f;font:400 14px/1.7 'Geist',sans-serif;color:#e8e0d4}
  .cc__sum b{color:#e2c48f;font-weight:500}
  .cc__go{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 20px;margin:12px 8px 0 0;border-radius:999px;background:linear-gradient(135deg,#e2c48f,#c9a46a 55%,#8d6b3a);color:#0d0b09!important;text-decoration:none!important;font:500 14px 'Geist',sans-serif}
  .cc__go--ghost{background:transparent;border:1px solid rgba(239,232,221,.25);color:#efe8dd!important}
  .cc__form{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(239,232,221,.1)}
  .cc__form input{flex:1;min-height:48px;padding:0 16px;border-radius:999px;border:1px solid rgba(239,232,221,.16);background:#1a1612;color:#efe8dd;font:400 15px 'Geist',sans-serif}
  .cc__form input:focus{outline:none;border-color:#c9a46a}
  .cc__form button{width:48px;height:48px;border-radius:50%;background:#c9a46a;color:#0d0b09;font-size:18px}
  @media (max-width:900px){.cc-btn{bottom:80px;right:14px;width:54px;height:54px}.cc-bubble{right:78px;bottom:92px}.cc{right:12px;bottom:12px;height:calc(100svh - 24px)}}
  @media (prefers-reduced-motion:reduce){.cc,.cc__m{transition:none;animation:none}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const MH = '<svg class="mh" viewBox="40 50 440 430" fill="none" stroke="currentColor" stroke-width="46" aria-hidden="true"><path d="M73 470V300a79.5 70 0 0 1 159 0v170"/><path d="M232 300a62 68 0 0 1 72-67"/><path d="M354 64v406"/><path d="M354 300a44.5 67 0 0 1 89 0v170"/></svg>';
  document.body.insertAdjacentHTML('beforeend', `
    <button class="cc-btn" aria-haspopup="dialog" aria-controls="cc" aria-label="Ask MiHa: chat with our concierge" data-cursor="Chat">${MH}</button><p class="cc-bubble" aria-hidden="true">Ask MiHa</p>
    <section class="cc" id="cc" role="dialog" aria-modal="false" aria-label="Ask MiHa" hidden>
      <header class="cc__head">${MH}<div><b>Ask MiHa</b></div><button class="cc__x" aria-label="Close concierge">×</button></header>
      <div class="cc__log" aria-live="polite"></div>
      <form class="cc__form"><label class="sr" for="cc-in" style="position:absolute;left:-9999px">Message</label><input id="cc-in" autocomplete="off" placeholder="Ask about a table, the menu, hours…"><button aria-label="Send">↑</button></form>
    </section>`);
  const btn = document.querySelector('.cc-btn'), box = document.getElementById('cc'), log = box.querySelector('.cc__log'), form = box.querySelector('.cc__form'), input = form.querySelector('input');
  let started = false, flow = null, history = [];

  const open = () => { box.hidden = false; requestAnimationFrame(() => box.classList.add('is-open')); btn.style.visibility = 'hidden'; bub.classList.remove('is-on'); if (!started) { started = true; greet(); } setTimeout(() => input.focus(), 400); };
  const close = () => { box.classList.remove('is-open'); btn.style.visibility = ''; setTimeout(() => (box.hidden = true), 500); btn.focus(); };
  btn.addEventListener('click', open);
  const bub = document.querySelector('.cc-bubble'); bub.addEventListener('click', open); setTimeout(() => bub.classList.add('is-on'), 2500); setTimeout(() => bub.classList.remove('is-on'), 9000); btn.addEventListener('mouseenter', () => bub.classList.add('is-on')); btn.addEventListener('mouseleave', () => bub.classList.remove('is-on'));
  box.querySelector('.cc__x').addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) close(); });
  document.querySelectorAll('[data-concierge]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); open(); }));
  box.addEventListener('wheel', e => e.stopPropagation(), { passive: true });

  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const scroll = () => (log.scrollTop = log.scrollHeight);
  const me = t => { log.insertAdjacentHTML('beforeend', `<div class="cc__m cc__m--me">${esc(t)}</div>`); history.push({ role: 'user', content: t }); scroll(); };
  const bot = (html, delay = 550) => new Promise(r => {
    const ty = document.createElement('div'); ty.className = 'cc__m cc__m--bot cc__typing'; ty.innerHTML = '<i></i><i></i><i></i>'; log.appendChild(ty); scroll();
    setTimeout(() => { ty.remove(); log.insertAdjacentHTML('beforeend', `<div class="cc__m cc__m--bot">${html}</div>`); history.push({ role: 'assistant', content: html.replace(/<[^>]+>/g, ' ') }); scroll(); r(); }, delay);
  });
  const chips = (list) => {
    const wrap = document.createElement('div'); wrap.className = 'cc__chips';
    list.forEach(([label, fn]) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'cc__chip'; b.textContent = label; b.onclick = () => { wrap.remove(); me(label); fn(); }; wrap.appendChild(b); });
    log.appendChild(wrap); scroll();
  };
  const main = () => chips([['Book a table', startBooking], ['Suggest something to eat', suggest], ['Order delivery', delivery], ['Buffets', () => { input.value = 'buffet'; form.requestSubmit(); }], ['Opening hours', hours], ['Is it Halaal?', halaal], ['Directions', directions], ['Play a game while I wait', games]]);

  async function greet() {
    const h = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' })).getHours();
    const hi = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    await bot(`${hi}, and welcome to MiHa. I can book you a table, suggest what to order, or tell you when we're open. What can I do for you?`, 400);
    main();
  }

  /* ---------- hours ---------- */
  const now = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
  const toM = s => { const [a, b] = s.split(':'); return +a * 60 + +b; };
  const status = k => { const b = BR[k], n = now(), d = n.getDay(), m = n.getHours() * 60 + n.getMinutes(), [o, c] = b.h[d];
    if (m >= toM(o) && m < toM(c)) return `<b>open now</b> until ${c}`;
    if (m < toM(o)) return `closed right now, opening at ${o} today`;
    return `closed for today, opening at ${b.h[(d + 1) % 7][0]} tomorrow`; };
  async function hours() {
    await bot(`Melrose Arch is ${status('jhb')}. Centurion is ${status('pta')}.<br><br><b>Melrose Arch:</b> Mon–Thu 11:00–21:30, Fri 11:00–22:00, Sat 09:00–22:00, Sun 09:00–21:30.<br><b>Centurion:</b> Mon 18:00–21:30, Tue–Fri 12:00–21:30, Sat 09:00–22:00, Sun 09:00–21:30.`);
    chips([['Book a table', startBooking], ['Something else', anything]]);
  }
  async function halaal() {
    await bot('Yes. All food at MiHa is <b>strictly Halaal</b>, and for religious reasons no alcohol is served or allowed on the premises. Instead we pour mocktails, freakshakes, fresh juice and coffee.');
    chips([['Suggest a drink', () => showPicks('drink')], ['Book a table', startBooking], ['Something else', anything]]);
  }
  async function directions() {
    await bot(`<b>Melrose Arch:</b> ${BR.jhb.addr}. <a href="${BR.jhb.map}" target="_blank" rel="noopener">Open in Maps</a><br><b>Centurion:</b> ${BR.pta.addr}. <a href="${BR.pta.map}" target="_blank" rel="noopener">Open in Maps</a>`);
    chips([['Book a table', startBooking], ['Something else', anything]]);
  }
  async function anything() { await bot('Of course. What else can I help with?', 300); main(); }


  /* ---------- games ---------- */
  async function games() {
    await bot('Waiting on your food? MiHa Games has seven free games: Stack the Burger, MiHa Memory, Mi vs Ha, Tap the Dish, The Food Quiz, Would You Rather? and Who’s Choosing Dessert?');
    log.insertAdjacentHTML('beforeend', `<div class="cc__sum"><b>MiHa Games</b><br>For one player or the whole table, right here on your phone.<br><a class="cc__go" href="games.html">Play now</a></div>`);
    scroll();
    chips([['Open MiHa Games', () => (location.href = 'games.html')], ['Something else', anything]]);
  }

  /* ---------- delivery ---------- */
  async function delivery() {
    let picks = []; try { picks = JSON.parse(localStorage.getItem('miha-picks') || '[]'); } catch (e) {}
    const list = picks.length ? '<br><br>Your picks from the menu:<br>' + picks.map(p => `• ${p.q} × ${esc(p.n)}`).join('<br>') + '<br>Search for these in the app to add them to your order.' : '';
    await bot('Order MiHa to your door through our delivery partners. The order and payment are completed in their app.' + list);
    log.insertAdjacentHTML('beforeend', `<div class="cc__sum"><b>MiHa Melrose Arch</b><br>Uber Eats · rated 4.4 by 1,000+ guests<br><a class="cc__go" href="https://www.ubereats.com/za/search?q=MiHa%20Melrose%20Arch" target="_blank" rel="noopener">Order on Uber Eats</a><br><br><b>MiHa X Lenasia</b><br>Mr D<br><a class="cc__go" href="https://www.mrdfood.com/" target="_blank" rel="noopener">Order on Mr D</a></div>`);
    scroll();
    chips([['Build my order from the menu', () => (location.href = 'menu.html')], ['Play a game while I wait', games], ['Something else', anything]]);
  }

  /* ---------- suggestions ---------- */
  async function suggest() {
    await bot('Lovely. What are you in the mood for?');
    chips(Object.entries(SUGGEST).map(([k, v]) => [v.label, () => showPicks(k)]));
  }
  async function showPicks(k) {
    const s = SUGGEST[k];
    await bot(`Here's what I'd order for <b>${s.label.toLowerCase()}</b>:`);
    log.insertAdjacentHTML('beforeend', `<div class="cc__cards">${s.picks.map(([n, d, img]) => `<div class="cc__card"><img src="${IMG(img)}" alt=""><div><b>${n}</b><small>${d}</small></div></div>`).join('')}</div>`);
    scroll();
    await bot('Prices and the full list are on the <a href="menu.html">menu</a>. Shall I find you a table to enjoy it?', 700);
    chips([['Yes, book a table', startBooking], ['Suggest something else', suggest], ['Not now', anything]]);
  }

  /* ---------- booking flow ---------- */
  function startBooking() { flow = { step: 'branch', data: {} }; askBranch(); }
  async function askBranch() {
    await bot('Wonderful. Which MiHa would you like?');
    chips([['Melrose Arch', () => setBranch('jhb')], ['Centurion', () => setBranch('pta')]]);
  }
  async function setBranch(k) { flow.data.branch = k; flow.step = 'date'; await bot(`${BR[k].name}, perfect. It's ${status(k)}. Which day?`); dateChips(); }
  function dateChips() {
    const n = now(), days = [];
    for (let i = 0; i < 4; i++) { const d = new Date(n); d.setDate(n.getDate() + i); days.push(d); }
    const lbl = (d, i) => i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-ZA', { weekday: 'long' });
    chips(days.map((d, i) => [lbl(d, i), () => setDate(d)]).concat([['Another day', () => { flow.step = 'date-text'; bot('Type the date, for example "Saturday 14 December".', 300); }]]));
  }
  async function setDate(d, txt) {
    flow.data.date = d; flow.data.dateTxt = txt || d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' });
    flow.step = 'time';
    let times = ['12:30', '13:30', '18:30', '19:30', '20:00'];
    if (d) { const [o, c] = BR[flow.data.branch].h[d.getDay()]; times = ['09:30', '11:30', '12:30', '13:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'].filter(t => toM(t) >= toM(o) && toM(t) <= toM(c) - 60);
      if (d.toDateString() === now().toDateString()) { const m = now().getHours() * 60 + now().getMinutes() + 30; times = times.filter(t => toM(t) > m); } }
    if (!times.length) { await bot(`I'm sorry, ${BR[flow.data.branch].name} has no more tables that day. Shall we try another day?`); return dateChips(); }
    await bot(`${flow.data.dateTxt}. What time suits you?`);
    chips(times.slice(0, 6).map(t => [t, () => setTime(t)]));
  }
  async function setTime(t) { flow.data.time = t; flow.step = 'guests'; await bot('How many guests?'); chips(['2', '3', '4', '5', '6', '8+'].map(g => [g, () => setGuests(g)])); }
  async function setGuests(g) { flow.data.guests = g; flow.step = 'name'; await bot(g === '8+' ? 'A proper gathering. What name should the booking be under?' : 'And what name should the booking be under?'); }
  async function setName(n) { flow.data.name = n; flow.step = 'occasion'; await bot(`Thank you, ${esc(n.split(' ')[0])}. Is it a special occasion?`); chips([['Just dinner', () => setOcc('')], ['Birthday', () => setOcc('Birthday')], ['Anniversary', () => setOcc('Anniversary')], ['Business', () => setOcc('Business')], ['Family gathering', () => setOcc('Family gathering')]]); }
  async function setOcc(o) {
    flow.data.occasion = o; flow.step = null;
    const d = flow.data, b = BR[d.branch];
    const summary = `Booking request for MiHa ${b.name}\nName: ${d.name}\nDate: ${d.dateTxt}\nTime: ${d.time}\nGuests: ${d.guests}${o ? `\nOccasion: ${o}` : ''}`;
    try { await navigator.clipboard.writeText(summary); } catch (e) {}
    await bot('Here is your booking:');
    log.insertAdjacentHTML('beforeend', `<div class="cc__sum"><b>MiHa ${b.name}</b><br>${esc(d.name)} · ${d.guests} guests<br>${d.dateTxt} at ${d.time}${o ? `<br>${o}` : ''}<br>
      <a class="cc__go" href="${b.dine}" target="_blank" rel="noopener">Confirm on Dineplan</a><a class="cc__go cc__go--ghost" href="mailto:yasin@miha.co.za?subject=${encodeURIComponent('Booking request – ' + d.name)}&body=${encodeURIComponent(summary)}">Email MiHa instead</a></div>`);
    scroll();
    await bot(`Tap <b>Confirm on Dineplan</b> to lock in your table; I've copied the details for you. For 8 or more guests, emailing or calling <a href="tel:${b.tel}">${b.telTxt}</a> is best.${o === 'Birthday' || o === 'Anniversary' ? ' Mention the occasion and the team will make it special.' : ''}`, 700);
    chips([['Suggest what to order', suggest], ['Start again', startBooking], ['That\'s all, thanks', async () => bot('My pleasure. We look forward to welcoming you to MiHa.', 400)]]);
  }

  /* ---------- free text ---------- */
  const parseDate = t => { const d = new Date(t + ' ' + now().getFullYear()); return isNaN(d) ? null : d; };
  form.addEventListener('submit', async e => {
    e.preventDefault(); const t = input.value.trim(); if (!t) return; input.value = ''; me(t);
    const q = t.toLowerCase();
    if (flow) {
      if (flow.step === 'name') return setName(t);
      if (flow.step === 'date-text') { const d = parseDate(t); return setDate(d, t); }
      if (flow.step === 'guests' && /\d+/.test(q)) return setGuests(q.match(/\d+/)[0]);
      if (flow.step === 'time' && /\d{1,2}[:h.]?\d{0,2}/.test(q)) return setTime(t);
    }
    if (/book|reserv|table|seat/.test(q)) { if (/centurion|pretoria|pta|raslouw/.test(q)) { flow = { step: 'branch', data: {} }; return setBranch('pta'); } if (/melrose|joburg|johannesburg|jhb/.test(q)) { flow = { step: 'branch', data: {} }; return setBranch('jhb'); } return startBooking(); }
    if (/halaal|halal|alcohol|wine|beer|drink alcohol/.test(q)) return halaal();
    if (/hour|open|close|time/.test(q)) return hours();
    if (/where|address|direction|map|park|location/.test(q)) return directions();
    if (/sweet|dessert|cake/.test(q)) return showPicks('sweet');
    if (/drink|mocktail|shake|coffee|juice/.test(q)) return showPicks('drink');
    if (/share|group|family|platter/.test(q)) return showPicks('share');
    if (/light|salad|veg/.test(q)) return showPicks('light');
    if (/kid|child/.test(q)) return showPicks('kids');
    if (/\bgames?\b|\bplay\b|\bbored\b/.test(q)) return games();
    if (/buffet|friday|breakfast buffet|weekend/.test(q)) { await bot('At MiHa Melrose Arch:<br><b>Friday Night Dinner Buffet</b>: Fridays 18:30–21:00, R250 per adult, R125 for kids 6–12.<br><b>Weekend Breakfast Buffet</b>: Saturday and Sunday 09:30–12:00, R199 per person.<br>Bookings are essential. <a href="whats-on.html">See what’s on</a>.'); return chips([['Book a buffet', () => { flow = { step: 'branch', data: {} }; setBranch('jhb'); }], ['Something else', anything]]); }
    if (/wedding|engagement|graduation|birthday party|function|private|celebrat|event/.test(q)) { await bot('MiHa hosts corporate events, weddings, engagements, birthdays and graduations at Melrose Arch and Centurion, with decor, setup and Halaal catering taken care of. <a href="events.html#enquire">Plan your event</a>.'); return main(); }
    if (/lenasia|miha x|mihax|trade route/.test(q)) { await bot('<b>MiHa X Lenasia</b> is at Trade Route Mall, Lenasia: gourmet food at exceptional value. Call <a href="tel:+27616014332">061 601 4332</a> or see <a href="https://www.instagram.com/mihax_lenasia/" target="_blank" rel="noopener">@mihax_lenasia</a>.'); return main(); }
    if (/deliver|uber|mr d|mrd|takeaway|take away|order online|order food|place.*order/.test(q)) { return delivery(); await bot('Order MiHa Melrose Arch on <a href="https://www.ubereats.com/za/search?q=MiHa%20Melrose%20Arch" target="_blank" rel="noopener">Uber Eats</a> (rated 4.4), and MiHa X Lenasia on <a href="https://www.mrdfood.com/" target="_blank" rel="noopener">Mr D</a>.'); return main(); }
    if (/cater|office|staff|corporate/.test(q)) { await bot('We cater boardroom lunches, functions and daily staff lunches, all Halaal. <a href="catering.html">See catering and request a quote</a>.'); return main(); }
    if (/hungry|eat|food|recommend|suggest|order|menu|best|popular/.test(q)) return suggest();
    if (/bakery|bread|clenergy|birthday cake/.test(q)) { await bot('Clenergy Bakery is our own in-house bakery for breads, pastries and celebration cakes. <a href="bakery.html">Visit the bakery page</a>.'); return main(); }
    if (/phone|call|contact|email/.test(q)) { await bot(`Melrose Arch: <a href="tel:${BR.jhb.tel}">${BR.jhb.telTxt}</a><br>Centurion: <a href="tel:${BR.pta.tel}">${BR.pta.telTxt}</a><br>Email: <a href="mailto:yasin@miha.co.za">yasin@miha.co.za</a>`); return main(); }
    if (/^(hi|hello|hey|salaam|salam|assalam)/.test(q)) { await bot('Wa alaykum salaam, and welcome. How can I help?', 400); return main(); }
    if (/thank/.test(q)) return bot('It\'s a pleasure. Enjoy your MiHa experience.', 400);
    if (window.MIHA_AI_ENDPOINT) {
      try { const r = await fetch(window.MIHA_AI_ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-12) }) }); const j = await r.json(); if (j.reply) return bot(esc(j.reply)); } catch (err) {}
    }
    await bot('I may not have that one, but the team will. Here is what I can help with right now:');
    main();
  });
})();
