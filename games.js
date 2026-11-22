/* MiHa Games: Stack the Burger · MiHa Memory · Who's Choosing Dessert? */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const store = { get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const buzz = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };

  /* =============== 1. STACK THE BURGER =============== */
  (() => {
    const cv = $('.st-canvas'); if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height, LH = 26;
    const LAYERS = [ // name, fill, top highlight
      ['Patty', '#5a3420', '#7a4a2e'], ['Cheese', '#f2b632', '#ffd36b'], ['Lettuce', '#6aa84f', '#8fcb6d'],
      ['Tomato', '#d9443a', '#f06a5f'], ['Onion', '#e8d6e8', '#fff'], ['Patty', '#5a3420', '#7a4a2e'], ['Pickle', '#7c9b3a', '#a2c35a']];
    let stack, moving, dir, speed, running = false, score = 0, raf, cam = 0;
    let best = store.get('miha-stack-best', 0);
    const scoreEl = $('.st-score'), bestEl = $('.st-best'), overlay = $('.st-overlay'), msg = $('.st-msg');
    bestEl.textContent = best;

    function reset() {
      stack = [{ x: W / 2 - 120, w: 240, c: ['Bun', '#c8843f', '#e0a45e'], bun: 'bottom' }];
      score = 0; speed = 2.6; cam = 0; scoreEl.textContent = 0; spawn();
    }
    function spawn() {
      const top = stack[stack.length - 1];
      const c = LAYERS[stack.length % LAYERS.length];
      dir = Math.random() < .5 ? 1 : -1;
      moving = { x: dir > 0 ? -top.w : W, w: top.w, c };
    }
    function drop() {
      if (!running) return;
      const top = stack[stack.length - 1];
      const l = Math.max(moving.x, top.x), r = Math.min(moving.x + moving.w, top.x + top.w);
      let w = r - l;
      if (w <= 0) return over();
      let x = l;
      if (Math.abs(moving.x - top.x) < 6) { x = top.x; w = top.w; flash = 1; buzz(15); } // perfect
      stack.push({ x, w, c: moving.c });
      score++; scoreEl.textContent = score;
      speed = Math.min(7.5, speed + .22);
      if (w < 14) return over();
      spawn();
    }
    let flash = 0;
    function over() {
      running = false; cancelAnimationFrame(raf); buzz([30, 40, 30]);
      // crown it with the top bun
      const top = stack[stack.length - 1];
      stack.push({ x: top.x, w: top.w, c: ['Bun', '#c8843f', '#e0a45e'], bun: 'top' });
      draw();
      if (score > best) { best = score; store.set('miha-stack-best', best); bestEl.textContent = best; }
      msg.innerHTML = score > 0 && score === best ? `New best: <b>${score}</b> layers!` : `<b>${score}</b> layers. Your best is ${best}.`;
      $('.st-start span').textContent = 'Play again';
      overlay.hidden = false;
    }
    function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
    function layer(L, y) {
      const [_, fill, hi] = L.c;
      if (L.bun === 'top') { ctx.fillStyle = fill; ctx.beginPath(); ctx.ellipse(L.x + L.w / 2, y + LH, L.w / 2, LH * 1.4, 0, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#f6e7c8'; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.ellipse(L.x + L.w * (.2 + i * .1), y + LH * .2 + (i % 2) * 6, 3, 1.6, .4, 0, 7); ctx.fill(); } return; }
      ctx.fillStyle = fill; rr(L.x, y, L.w, LH - 3, L.bun ? 10 : 7); ctx.fill();
      ctx.fillStyle = hi; rr(L.x + 4, y + 2, Math.max(0, L.w - 8), 5, 3); ctx.fill();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createRadialGradient(W / 2, H * .9, 20, W / 2, H * .9, W * .8); g.addColorStop(0, 'rgba(255,200,130,.18)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const want = Math.max(0, (stack.length + 3) * LH - H * .7); cam += (want - cam) * .12;
      const base = H - 40 + cam;
      ctx.fillStyle = 'rgba(239,232,221,.08)'; ctx.beginPath(); ctx.ellipse(W / 2, H - 22 + cam, 170, 16, 0, 0, 7); ctx.fill(); // plate
      stack.forEach((L, i) => layer(L, base - (i + 1) * LH));
      if (running) layer(moving, base - (stack.length + 1) * LH);
      if (flash > 0) { ctx.fillStyle = `rgba(255,230,180,${flash * .35})`; ctx.fillRect(0, 0, W, H); flash -= .06; }
    }
    function loop() {
      moving.x += speed * dir;
      if (moving.x + moving.w > W + 40 && dir > 0) dir = -1;
      if (moving.x < -40 && dir < 0) dir = 1;
      draw(); raf = requestAnimationFrame(loop);
    }
    function start() { reset(); overlay.hidden = true; running = true; cancelAnimationFrame(raf); loop(); }
    $('.st-start').addEventListener('click', e => { e.stopPropagation(); start(); });
    cv.addEventListener('pointerdown', e => { e.preventDefault(); drop(); });
    document.addEventListener('keydown', e => {
      if (e.code !== 'Space') return;
      const r = cv.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      e.preventDefault(); running ? drop() : start();
    });
    reset(); draw();
  })();

  /* =============== 2. MIHA MEMORY =============== */
  (() => {
    const board = $('.mm-board'); if (!board) return;
    const DISHES = [['g-platter', 'Tapas board'], ['g-prawns', 'Portuguese prawns'], ['g-sushi', 'Sushi'], ['g-pizza', 'Stone-fired pizza'], ['g-dessert-choc', 'Brownies'], ['g-tart', 'Chocolate tart'], ['g-burger', 'MiHa burger'], ['g-crepe', 'Crêpe']];
    let players = 1, turn = 0, scores = [], first = null, lock = false, found = 0, moves = 0;
    const scoreEl = $('.mm-score'), win = $('.mm-win');
    $$('.mm-setup [data-n]').forEach(b => b.addEventListener('click', () => { $$('.mm-setup [data-n]').forEach(x => x.classList.toggle('is-on', x === b)); players = +b.dataset.n; deal(); }));
    $('.mm-new').addEventListener('click', deal);
    $('.mm-again').addEventListener('click', deal);
    function renderScore() {
      scoreEl.innerHTML = players === 1 ? `<span class="is-turn">Moves <b>${moves}</b></span><span>Pairs <b>${found}/8</b></span>`
        : scores.map((s, i) => `<span class="${i === turn ? 'is-turn' : ''}">Player ${i + 1} <b>${s}</b></span>`).join('');
    }
    function deal() {
      scores = Array(players).fill(0); turn = 0; first = null; lock = false; found = 0; moves = 0; win.hidden = true;
      const deck = DISHES.flatMap(d => [d, d]).sort(() => Math.random() - .5);
      board.innerHTML = deck.map(([img, name], i) => `<button class="mm-card" type="button" data-k="${img}" aria-label="Hidden card ${i + 1}"><span class="mm-card__in"><span class="mm-card__back"><svg viewBox="40 50 440 430" fill="none" stroke="currentColor" stroke-width="46"><path d="M73 470V300a79.5 70 0 0 1 159 0v170"/><path d="M232 300a62 68 0 0 1 72-67"/><path d="M354 64v406"/><path d="M354 300a44.5 67 0 0 1 89 0v170"/></svg></span><span class="mm-card__front"><img src="img/miha/${img}.jpg" alt=""><em>${name}</em></span></span></button>`).join('');
      renderScore();
    }
    board.addEventListener('click', e => {
      const c = e.target.closest('.mm-card'); if (!c || lock || c.classList.contains('is-up') || c.classList.contains('is-done')) return;
      c.classList.add('is-up'); c.setAttribute('aria-label', c.querySelector('em').textContent);
      if (!first) { first = c; return; }
      moves++; lock = true;
      if (first.dataset.k === c.dataset.k) {
        setTimeout(() => { first.classList.add('is-done'); c.classList.add('is-done'); scores[turn]++; found++; first = null; lock = false; buzz(20); renderScore(); if (found === 8) finish(); }, 380);
      } else {
        setTimeout(() => { first.classList.remove('is-up'); c.classList.remove('is-up'); first = null; lock = false; if (players > 1) turn = (turn + 1) % players; renderScore(); }, 900);
      }
      renderScore();
    });
    function finish() {
      let t;
      if (players === 1) { const best = store.get('miha-mem-best', 0); const nb = !best || moves < best; if (nb) store.set('miha-mem-best', moves); t = `All pairs found in <b>${moves}</b> moves${nb ? ', a new best!' : `. Your best is ${best}.`}`; }
      else { const top = Math.max(...scores), w = scores.map((s, i) => s === top ? i + 1 : 0).filter(Boolean); t = w.length > 1 ? `It’s a tie between players ${w.join(' &amp; ')}!` : `Player ${w[0]} wins with <b>${top}</b> pairs!`; }
      $('.mm-win__t').innerHTML = t; win.hidden = false;
    }
    deal();
  })();

  /* =============== 3. WHO'S CHOOSING DESSERT? =============== */
  (() => {
    const stage = $('.ch-stage'); if (!stage) return;
    const ring = $('.ch-ring'), msg = $('.ch-msg'), spinBtn = $('.ch-spin'), list = $('.ch-list');
    const touch = matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;
    document.body.classList.add(touch ? 'ch-is-touch' : 'ch-is-mouse');
    const COLORS = ['#ffd27f', '#f59e7a', '#9fd89a', '#8fc7ff', '#e7a6ff', '#ffe9b3', '#7fe0d0', '#ffb3c7'];
    let names = [], dots = new Map(), timer = null, busy = false;

    // touch mode: one finger per person
    ring.addEventListener('touchstart', e => { e.preventDefault(); if (busy) return; sync(e.touches); });
    ring.addEventListener('touchmove', e => { e.preventDefault(); if (busy) return; sync(e.touches); }, { passive: false });
    ring.addEventListener('touchend', e => { e.preventDefault(); if (busy) return; sync(e.touches); });
    function sync(ts) {
      const r = ring.getBoundingClientRect(); const seen = new Set();
      [...ts].forEach((t, i) => {
        seen.add(t.identifier);
        let d = dots.get(t.identifier);
        if (!d) { d = document.createElement('span'); d.className = 'ch-dot'; d.style.setProperty('--c', COLORS[dots.size % COLORS.length]); ring.appendChild(d); dots.set(t.identifier, d); buzz(10); }
        d.style.left = (t.clientX - r.left) + 'px'; d.style.top = (t.clientY - r.top) + 'px';
      });
      dots.forEach((d, id) => { if (!seen.has(id)) { d.remove(); dots.delete(id); } });
      clearTimeout(timer);
      msg.textContent = dots.size < 2 ? (dots.size ? 'Waiting for more fingers…' : 'Fingers on the circle') : 'Hold still…';
      if (dots.size >= 2) timer = setTimeout(() => choose([...dots.values()]), 1800);
    }
    // mouse mode: names
    $('.ch-names').addEventListener('submit', e => {
      e.preventDefault(); const i = $('#ch-name'); const v = i.value.trim(); if (!v || names.length >= 10) return;
      names.push(v); i.value = ''; drawNames();
    });
    function drawNames() {
      list.innerHTML = names.map((n, i) => `<li style="--c:${COLORS[i % COLORS.length]}"><span>${n.replace(/[<>&]/g, '')}</span><button type="button" data-i="${i}" aria-label="Remove ${n.replace(/["<>&]/g, '')}">×</button></li>`).join('');
      msg.textContent = names.length < 2 ? 'Add at least two names' : `${names.length} at the table. Spin!`;
    }
    list.addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (!b) return; names.splice(+b.dataset.i, 1); drawNames(); });
    spinBtn.addEventListener('click', () => {
      if (busy) return;
      if (touch && dots.size >= 2) return choose([...dots.values()]);
      if (names.length < 2) { msg.textContent = touch ? 'Two or more fingers on the circle' : 'Add at least two names'; return; }
      choose(null);
    });
    function choose(fingerDots) {
      busy = true; ring.classList.remove('is-done'); ring.classList.add('is-spinning'); msg.textContent = 'Choosing…'; buzz(20);
      setTimeout(() => {
        ring.classList.remove('is-spinning'); ring.classList.add('is-done'); buzz([40, 30, 60]);
        if (fingerDots) {
          const w = fingerDots[Math.floor(Math.random() * fingerDots.length)];
          fingerDots.forEach(d => d.classList.toggle('is-out', d !== w)); w.classList.add('is-win');
          msg.textContent = 'You’re choosing dessert!';
          setTimeout(() => { dots.forEach(d => d.remove()); dots.clear(); busy = false; msg.textContent = 'Fingers on the circle'; }, 3500);
        } else {
          const i = Math.floor(Math.random() * names.length);
          msg.innerHTML = `<b>${names[i].replace(/[<>&]/g, '')}</b><br>is choosing dessert!`;
          $$('li', list).forEach((li, k) => li.classList.toggle('is-win', k === i));
          busy = false;
        }
      }, 2600);
    }
    drawNames(); if (touch) msg.textContent = 'Fingers on the circle';
  })();
  /* =============== 4. MI vs HA (noughts & crosses) =============== */
  (() => {
    const board = $('.tt-board'); if (!board) return;
    const cells = $$('.tt-cell', board), msg = $('.tt-msg');
    const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    let g, turn, first = 'mi', over, mode = 'cpu', score = { mi: 0, ha: 0, d: 0 };
    const label = p => p === 'mi' ? 'Mi' : (mode === 'cpu' ? 'MiHa' : 'Ha');
    const win = b => { for (const l of LINES) { const [a, c, d] = l; if (b[a] && b[a] === b[c] && b[a] === b[d]) return { p: b[a], l }; } return b.every(Boolean) ? { p: 'd' } : null; };
    function paint() {
      cells.forEach((c, i) => { c.innerHTML = g[i] ? `<span class="tt-m tt-m--${g[i]}">${g[i] === 'mi' ? 'Mi' : 'Ha'}</span>` : ''; c.disabled = !!g[i] || over; c.setAttribute('aria-label', `Square ${i + 1}${g[i] ? ', ' + (g[i] === 'mi' ? 'Mi' : 'Ha') : ''}`); });
      Object.keys(score).forEach(k => $(`[data-s="${k}"]`).textContent = score[k]);
      $('.tt-ha-name').textContent = mode === 'cpu' ? 'MiHa' : 'Ha';
    }
    function round() {
      g = Array(9).fill(null); turn = first; over = false; cells.forEach(c => c.classList.remove('is-win'));
      msg.textContent = `${label(turn)} to play`; paint();
      if (mode === 'cpu' && turn === 'ha') setTimeout(cpu, 450);
    }
    function play(i) {
      if (over || g[i]) return;
      g[i] = turn; buzz(8);
      const w = win(g);
      if (w) {
        over = true; score[w.p]++;
        if (w.p === 'd') { msg.textContent = 'A draw. Go again?'; }
        else { w.l.forEach(k => cells[k].classList.add('is-win')); msg.textContent = `${label(w.p)} wins the round!`; first = w.p === 'mi' ? 'ha' : 'mi'; buzz([30, 30, 60]); }
        paint(); return;
      }
      turn = turn === 'mi' ? 'ha' : 'mi'; msg.textContent = `${label(turn)} to play`; paint();
      if (mode === 'cpu' && turn === 'ha') { board.classList.add('is-thinking'); setTimeout(cpu, 480); }
    }
    function minimax(b, p) {
      const w = win(b); if (w) return { s: w.p === 'ha' ? 10 : w.p === 'mi' ? -10 : 0 };
      let best = { s: p === 'ha' ? -99 : 99 };
      b.forEach((v, i) => { if (v) return; b[i] = p; const r = minimax(b, p === 'ha' ? 'mi' : 'ha'); b[i] = null;
        if ((p === 'ha' && r.s > best.s) || (p === 'mi' && r.s < best.s)) best = { s: r.s, i }; });
      return best;
    }
    function cpu() {
      board.classList.remove('is-thinking'); if (over) return;
      const free = g.map((v, i) => v ? -1 : i).filter(i => i >= 0);
      // beatable: plays the perfect move most of the time, a random one now and then
      const i = Math.random() < .72 ? minimax(g.slice(), 'ha').i : free[Math.floor(Math.random() * free.length)];
      play(i ?? free[0]);
    }
    board.addEventListener('click', e => { const c = e.target.closest('.tt-cell'); if (!c) return; if (mode === 'cpu' && turn === 'ha') return; play(+c.dataset.i); });
    $('.tt-reset').addEventListener('click', round);
    $$('.tt-mode [data-mode]').forEach(b => b.addEventListener('click', () => { $$('.tt-mode [data-mode]').forEach(x => x.classList.toggle('is-on', x === b)); mode = b.dataset.mode; score = { mi: 0, ha: 0, d: 0 }; first = 'mi'; round(); }));
    round();
  })();

  /* =============== 5. TAP THE DISH =============== */
  (() => {
    const grid = $('.tp-grid'); if (!grid) return;
    const holes = $$('.tp-hole', grid), overlay = $('.tp-overlay'), msg = $('.tp-msg');
    const DISH = ['g-burger', 'g-pizza', 'g-sushi', 'g-prawns', 'g-platter', 'g-tart', 'g-crepe', 'g-dessert-choc', 'g-curry', 'g-bagel'];
    DISH.forEach(d => { const im = new Image(); im.src = `img/miha/${d}.jpg`; });
    let score = 0, left = 30, running = false, tick, spawnT, best = store.get('miha-tap-best', 0);
    const sEl = $('.tp-score'), tEl = $('.tp-time'), bEl = $('.tp-best'); bEl.textContent = best;
    function clear(h) { clearTimeout(h._t); h.classList.remove('is-up', 'is-gold', 'is-hit'); h.dataset.k = ''; }
    function spawn() {
      if (!running) return;
      const free = holes.filter(h => !h.dataset.k); if (free.length) {
        const h = free[Math.floor(Math.random() * free.length)];
        const gold = Math.random() < .12;
        h.dataset.k = gold ? 'gold' : 'dish';
        h.querySelector('.tp-dish').style.backgroundImage = gold ? '' : `url(img/miha/${DISH[Math.floor(Math.random() * DISH.length)]}.jpg)`;
        h.classList.add('is-up'); h.classList.toggle('is-gold', gold);
        const life = Math.max(520, 1150 - (30 - left) * 22);
        h._t = setTimeout(() => clear(h), life);
      }
      spawnT = setTimeout(spawn, Math.max(300, 720 - (30 - left) * 14));
    }
    grid.addEventListener('pointerdown', e => {
      const h = e.target.closest('.tp-hole'); if (!h || !running) return; e.preventDefault();
      if (h.dataset.k) { score += h.dataset.k === 'gold' ? 3 : 1; buzz(10); const k = h.dataset.k; clear(h); h.classList.add('is-hit'); setTimeout(() => h.classList.remove('is-hit'), 260); }
      else { score = Math.max(0, score - 1); h.classList.add('is-miss'); setTimeout(() => h.classList.remove('is-miss'), 260); }
      sEl.textContent = score;
    });
    function end() {
      running = false; clearInterval(tick); clearTimeout(spawnT); holes.forEach(clear);
      const nb = score > best; if (nb) { best = score; store.set('miha-tap-best', best); bEl.textContent = best; }
      msg.innerHTML = nb && score > 0 ? `New best: <b>${score}</b> points!` : `You scored <b>${score}</b>. Your best is ${best}.`;
      $('.tp-start span').textContent = 'Play again'; overlay.hidden = false; buzz([30, 40, 30]);
    }
    $('.tp-start').addEventListener('click', () => {
      score = 0; left = 30; sEl.textContent = 0; tEl.textContent = 30; overlay.hidden = true; running = true;
      tick = setInterval(() => { left--; tEl.textContent = left; if (left <= 0) end(); }, 1000);
      spawn();
    });
  })();

  /* =============== 6. THE FOOD QUIZ =============== */
  (() => {
    const box = $('.qz'); if (!box) return;
    // [question, correct, wrong, wrong, wrong]
    const Q = [
      ['Which country does sushi come from?', 'Japan', 'China', 'Korea', 'Thailand'],
      ['What does “halaal” mean in Arabic?', 'Permissible', 'Delicious', 'Fresh', 'Blessed'],
      ['Which spice is the most expensive in the world by weight?', 'Saffron', 'Vanilla', 'Cinnamon', 'Cardamom'],
      ['Guacamole is made mainly from which fruit?', 'Avocado', 'Lime', 'Green apple', 'Kiwi'],
      ['Marzipan is made from which nut?', 'Almond', 'Cashew', 'Hazelnut', 'Peanut'],
      ['Traditional mozzarella is made from the milk of which animal?', 'Water buffalo', 'Goat', 'Sheep', 'Camel'],
      ['Pastel de nata, the famous custard tart, comes from which country?', 'Portugal', 'Spain', 'France', 'Italy'],
      ['Bunny chow was first made in which South African city?', 'Durban', 'Cape Town', 'Johannesburg', 'Gqeberha'],
      ['Which fruit wears its seeds on the outside?', 'Strawberry', 'Raspberry', 'Blueberry', 'Fig'],
      ['What is the main ingredient in hummus?', 'Chickpeas', 'Lentils', 'Butter beans', 'Peas'],
      ['“Tiramisu” means what in Italian?', 'Pick me up', 'Sweet dream', 'Little cake', 'Coffee cloud'],
      ['Chocolate is made from the beans of which tree?', 'Cacao', 'Carob', 'Coffee', 'Vanilla'],
      ['Paella is the national dish of which country?', 'Spain', 'Mexico', 'Portugal', 'Morocco'],
      ['Crêpes are a classic from which country?', 'France', 'Belgium', 'Switzerland', 'Austria'],
      ['Peri-peri sauce gets its heat from which chilli?', 'African bird’s eye', 'Jalapeño', 'Habanero', 'Scotch bonnet'],
      ['Which drink will you never find at MiHa?', 'Alcohol', 'Milkshakes', 'Mocktails', 'Coffee'],
      ['MiHa’s Johannesburg restaurant is in which precinct?', 'Melrose Arch', 'Sandton City', 'Rosebank', 'Hyde Park'],
      ['MiHa’s Pretoria restaurant is in which area?', 'Centurion', 'Menlyn', 'Hatfield', 'Brooklyn'],
      ['On which night does MiHa Melrose Arch hold its dinner buffet?', 'Friday', 'Monday', 'Wednesday', 'Sunday'],
      ['Which grain is used to make traditional sushi?', 'Short-grain rice', 'Basmati rice', 'Quinoa', 'Couscous'],
      ['Which country gave the world the pizza margherita?', 'Italy', 'Greece', 'USA', 'France'],
      ['Wasabi comes from the root of a plant in which family?', 'Cabbage and mustard', 'Ginger', 'Onion', 'Mint'],
    ];
    const qEl = $('.qz__q'), aEl = $('.qz__a'), go = $('.qz__go'), nEl = $('.qz__n b'), sEl = $('.qz__s b'), bar = $('.qz__bar i');
    let set = [], at = 0, score = 0, lock = false;
    const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
    function start() { set = shuffle(Q).slice(0, 10); at = 0; score = 0; sEl.textContent = 0; go.hidden = true; ask(); }
    function ask() {
      lock = false; const [q, ...ans] = set[at]; nEl.textContent = at + 1; bar.style.width = (at / 10 * 100) + '%';
      qEl.textContent = q;
      aEl.innerHTML = shuffle(ans.map((t, i) => ({ t, ok: i === 0 }))).map(o => `<button type="button" class="qz__opt" data-ok="${o.ok ? 1 : 0}">${o.t}</button>`).join('');
    }
    aEl.addEventListener('click', e => {
      const b = e.target.closest('.qz__opt'); if (!b || lock) return; lock = true;
      const ok = b.dataset.ok === '1'; if (ok) { score++; sEl.textContent = score; buzz(15); } else buzz([20, 30, 20]);
      $$('.qz__opt', aEl).forEach(o => { o.disabled = true; if (o.dataset.ok === '1') o.classList.add('is-right'); });
      if (!ok) b.classList.add('is-wrong');
      setTimeout(() => { at++; if (at < 10) ask(); else done(); }, ok ? 900 : 1500);
    });
    function done() {
      bar.style.width = '100%';
      const word = score >= 9 ? 'Head chef!' : score >= 7 ? 'Seriously impressive.' : score >= 5 ? 'Not bad at all.' : score >= 3 ? 'Room to grow.' : 'Better luck next round.';
      qEl.innerHTML = `You got <b>${score} out of 10</b>. ${word}`; aEl.innerHTML = '';
      $('span', go).textContent = 'Play again'; go.hidden = false;
    }
    go.addEventListener('click', start);
  })();

  /* =============== 7. WOULD YOU RATHER? =============== */
  (() => {
    const card = $('.wyr__card'); if (!card) return;
    const W = [
      'Only eat pizza or only eat burgers for a whole year?',
      'Give up chocolate forever or give up chips forever?',
      'Eat breakfast for dinner every day or dinner for breakfast every day?',
      'Always eat dessert first or never have dessert again?',
      'Eat only spicy food or only sweet food for a month?',
      'Have your own personal chef or your own personal baker?',
      'Live in a house made of chocolate or a house made of cake?',
      'Be a judge on a cooking show or win a cooking show?',
      'Only eat with chopsticks or only eat with your hands?',
      'Never drink a milkshake again or never drink coffee again?',
      'Eat sushi every day or tacos every day?',
      'Know every recipe in the world or taste every dish in the world?',
      'Get free MiHa desserts for life or free MiHa breakfasts for life?',
      'Cook for your family every night or wash the dishes every night?',
      'Go on a food tour of Japan or a food tour of Italy?',
      'Bite into a whole lemon or a whole chilli?',
      'Have pancakes for every meal or waffles for every meal?',
      'Always share your dessert or never choose your own food?',
      'Only eat cold food or only eat hot food?',
      'Learn the secret recipe of your favourite dish or get it free for life?',
      'Have a never-ending pizza or a never-ending milkshake?',
      'Run a restaurant or own a bakery?',
      'Eat the same meal every day or never eat the same meal twice?',
      'Have a fridge that never runs out of fruit or a jar that never runs out of sweets?',
      'Be the best cook at the table or the funniest person at the table?',
    ];
    let deck = [], n = 0;
    const qEl = $('.wyr__q'), nEl = $('.wyr__n');
    $('.wyr__go').addEventListener('click', () => {
      if (!deck.length) deck = W.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
      n++; card.classList.remove('is-flip'); void card.offsetWidth; card.classList.add('is-flip');
      qEl.textContent = deck.pop(); nEl.textContent = `Card ${n}`; buzz(8);
      $('.wyr__go span').textContent = 'Next card';
    });
  })();
})();
