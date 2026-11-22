/* MiHa step-by-step booking: Branch → Date & time → Guests → Details → Review.
   Final confirmation happens on Dineplan (MiHa's booking system); the request can also be
   emailed to MiHa and saved to the guest's calendar. */
(() => {
  const root = document.querySelector('[data-booking]');
  if (!root) return;
  const BR = {
    jhb: { name: 'Melrose Arch', addr: 'Shop HL48, Melrose Arch, Johannesburg', dine: 'https://www.dineplan.com/restaurants/miha', tel: '060 748 9464',
      h: { 0: ['09:00', '21:30'], 1: ['11:00', '21:30'], 2: ['11:00', '21:30'], 3: ['11:00', '21:30'], 4: ['11:00', '21:30'], 5: ['11:00', '22:00'], 6: ['09:00', '22:00'] } },
    pta: { name: 'Centurion', addr: '134 Baard Rd, Raslouw, Pretoria', dine: 'https://www.dineplan.com/restaurants/miha-pretoria', tel: '078 005 9386',
      h: { 0: ['09:00', '21:30'], 1: ['18:00', '21:30'], 2: ['12:00', '21:30'], 3: ['12:00', '21:30'], 4: ['12:00', '21:30'], 5: ['12:00', '21:30'], 6: ['09:00', '22:00'] } }
  };
  const S = { step: 0, branch: null, date: null, time: null, guests: 2, occasion: '', name: '', phone: '', email: '', notes: '' };
  const steps = [...root.querySelectorAll('.bk-step')];
  const bar = root.querySelector('.bk-progress i');
  const dots = [...root.querySelectorAll('.bk-dots li')];
  const back = root.querySelector('.bk-back'), next = root.querySelector('.bk-next');
  const toM = s => { const [a, b] = s.split(':'); return +a * 60 + +b; };
  const pad = n => String(n).padStart(2, '0');
  const now = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
  const fmt = d => d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' });

  function valid(i = S.step) {
    if (i === 0) return !!S.branch;
    if (i === 1) return !!(S.date && S.time);
    if (i === 2) return S.guests > 0;
    if (i === 3) return S.name.trim().length > 1 && /^[+\d][\d\s()-]{7,}$/.test(S.phone.trim()) && (!S.email || /\S+@\S+\.\S+/.test(S.email));
    return true;
  }
  function go(i) {
    S.step = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach((s, k) => { s.hidden = k !== S.step; s.classList.toggle('is-active', k === S.step); });
    dots.forEach((d, k) => { d.classList.toggle('is-done', k < S.step); d.classList.toggle('is-current', k === S.step); d.toggleAttribute('aria-current', k === S.step); });
    bar.style.transform = `scaleX(${(S.step) / (steps.length - 1)})`;
    back.hidden = S.step === 0;
    next.hidden = S.step === steps.length - 1;
    next.querySelector('span').textContent = S.step === steps.length - 2 ? 'Review booking' : 'Continue';
    if (S.step === 1) renderDates();
    if (S.step === 4) renderReview();
    refresh();
    const h = steps[S.step].querySelector('h3'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    const top = root.getBoundingClientRect().top + scrollY - 100;
    if (Math.abs(scrollY - top) > 200) { window.__lenis ? window.__lenis.scrollTo(top, { duration: 1 }) : scrollTo({ top, behavior: 'smooth' }); }
  }
  const refresh = () => { next.disabled = !valid(); };

  // step 1: branch
  root.querySelectorAll('[name="bk-branch"]').forEach(r => r.addEventListener('change', () => { S.branch = r.value; S.time = null; refresh(); }));

  // step 2: dates + times
  function renderDates() {
    const wrap = root.querySelector('.bk-dates'); if (wrap.dataset.for === S.branch) return renderTimes();
    wrap.dataset.for = S.branch; wrap.innerHTML = '';
    const n = now();
    for (let i = 0; i < 14; i++) {
      const d = new Date(n); d.setDate(n.getDate() + i);
      const b = document.createElement('button'); b.type = 'button'; b.className = 'bk-date';
      b.innerHTML = `<small>${i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-ZA', { weekday: 'short' })}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString('en-ZA', { month: 'short' })}</small>`;
      b.setAttribute('aria-label', fmt(d));
      if (S.date && d.toDateString() === S.date.toDateString()) b.classList.add('is-on');
      b.onclick = () => { S.date = d; S.time = null; wrap.querySelectorAll('.bk-date').forEach(x => x.classList.toggle('is-on', x === b)); renderTimes(); refresh(); };
      wrap.appendChild(b);
    }
    renderTimes();
  }
  function renderTimes() {
    const wrap = root.querySelector('.bk-times'); wrap.innerHTML = '';
    if (!S.date) { wrap.innerHTML = '<p class="bk-hint">Choose a day to see available times.</p>'; return; }
    const [o, c] = BR[S.branch].h[S.date.getDay()];
    const today = S.date.toDateString() === now().toDateString();
    const nowM = now().getHours() * 60 + now().getMinutes() + 45;
    const slots = [];
    for (let m = toM(o); m <= toM(c) - 60; m += 30) if (!today || m > nowM) slots.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
    if (!slots.length) { wrap.innerHTML = `<p class="bk-hint">No more times on this day at ${BR[S.branch].name}. Please choose another day.</p>`; return; }
    const groups = { Morning: s => toM(s) < 720, Afternoon: s => toM(s) >= 720 && toM(s) < 1020, Evening: s => toM(s) >= 1020 };
    Object.entries(groups).forEach(([g, f]) => {
      const list = slots.filter(f); if (!list.length) return;
      const box = document.createElement('div'); box.className = 'bk-tgroup'; box.innerHTML = `<p>${g}</p>`;
      const row = document.createElement('div'); row.className = 'bk-trow';
      list.forEach(t => { const b = document.createElement('button'); b.type = 'button'; b.className = 'bk-time' + (S.time === t ? ' is-on' : ''); b.textContent = t;
        b.onclick = () => { S.time = t; wrap.querySelectorAll('.bk-time').forEach(x => x.classList.toggle('is-on', x === b)); refresh(); }; row.appendChild(b); });
      box.appendChild(row); wrap.appendChild(box);
    });
  }

  // step 3: guests + occasion
  const gOut = root.querySelector('.bk-guests output');
  root.querySelectorAll('.bk-guests button').forEach(b => b.addEventListener('click', () => {
    S.guests = Math.max(1, Math.min(30, S.guests + (+b.dataset.d))); gOut.textContent = S.guests;
    root.querySelector('.bk-large').hidden = S.guests < 9; refresh();
  }));
  root.querySelectorAll('[name="bk-occ"]').forEach(r => r.addEventListener('change', () => (S.occasion = r.value)));

  // step 4: details
  ['name', 'phone', 'email', 'notes'].forEach(k => {
    const el = root.querySelector(`#bk-${k}`);
    el.addEventListener('input', () => { S[k] = el.value; refresh(); });
    el.addEventListener('blur', () => {
      const bad = (k === 'name' && el.value.trim().length < 2) || (k === 'phone' && !/^[+\d][\d\s()-]{7,}$/.test(el.value.trim())) || (k === 'email' && el.value && !/\S+@\S+\.\S+/.test(el.value));
      el.closest('.field').classList.toggle('is-bad', bad);
    });
  });

  // step 5: review
  function summaryText() {
    const b = BR[S.branch];
    return `Booking request — MiHa ${b.name}\nName: ${S.name}\nPhone: ${S.phone}${S.email ? `\nEmail: ${S.email}` : ''}\nDate: ${fmt(S.date)}\nTime: ${S.time}\nGuests: ${S.guests}${S.occasion ? `\nOccasion: ${S.occasion}` : ''}${S.notes ? `\nNotes: ${S.notes}` : ''}`;
  }
  function renderReview() {
    const b = BR[S.branch];
    root.querySelector('.bk-review').innerHTML = `
      <dl>
        <div><dt>Restaurant</dt><dd>MiHa ${b.name}<small>${b.addr}</small></dd></div>
        <div><dt>When</dt><dd>${fmt(S.date)}<small>at ${S.time}</small></dd></div>
        <div><dt>Guests</dt><dd>${S.guests}${S.occasion ? `<small>${S.occasion}</small>` : ''}</dd></div>
        <div><dt>Name</dt><dd>${esc(S.name)}<small>${esc(S.phone)}${S.email ? ' · ' + esc(S.email) : ''}</small></dd></div>
        ${S.notes ? `<div><dt>Notes</dt><dd>${esc(S.notes)}</dd></div>` : ''}
      </dl>`;
    const sum = summaryText();
    root.querySelector('.bk-confirm').href = b.dine;
    root.querySelector('.bk-email').href = `mailto:yasin@miha.co.za?subject=${encodeURIComponent('Table booking – ' + S.name)}&body=${encodeURIComponent(sum)}`;
  }
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  root.querySelector('.bk-confirm').addEventListener('click', () => { try { navigator.clipboard.writeText(summaryText()); } catch (e) {} root.querySelector('.bk-done').hidden = false; });
  root.querySelector('.bk-ics').addEventListener('click', () => {
    const b = BR[S.branch], [h, m] = S.time.split(':');
    const st = new Date(S.date); st.setHours(+h, +m, 0, 0); const en = new Date(st.getTime() + 2 * 3600e3);
    const f = d => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MiHa Eatery//Booking//EN', 'BEGIN:VEVENT', `UID:${Date.now()}@miha.co.za`, `DTSTART;TZID=Africa/Johannesburg:${f(st)}`, `DTEND;TZID=Africa/Johannesburg:${f(en)}`, `SUMMARY:Dinner at MiHa ${b.name}`, `LOCATION:${b.addr}`, `DESCRIPTION:Table for ${S.guests}. Confirm your booking on Dineplan.`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'MiHa-booking.ics'; a.click();
  });

  back.addEventListener('click', () => go(S.step - 1));
  next.addEventListener('click', () => { if (valid()) go(S.step + 1); });
  dots.forEach((d, k) => d.querySelector('button').addEventListener('click', () => { for (let i = 0; i < k; i++) if (!valid(i)) return go(i); go(k); }));
  root.querySelector('.bk-edit').addEventListener('click', () => go(0));
  // preselect branch from URL (?branch=pta)
  const qb = new URLSearchParams(location.search).get('branch');
  if (qb && BR[qb]) { const r = root.querySelector(`[value="${qb}"]`); if (r) { r.checked = true; S.branch = qb; } }
  go(0);
})();
