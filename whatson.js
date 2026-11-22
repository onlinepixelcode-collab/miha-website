/* What's On: live countdown to the next buffet + "Add to my calendar" (weekly repeating .ics). */
(() => {
  const box = document.querySelector('[data-countdown]');
  const icsBtns = [...document.querySelectorAll('.wbuf__ics')];
  if (!box && !icsBtns.length) return;
  const B = [
    { d: 5, s: '18:30', e: '21:00', n: 'Friday Night Dinner Buffet', p: 'R250 per adult · R125 kids 6–12' },
    { d: 6, s: '09:30', e: '12:00', n: 'Weekend Breakfast Buffet', p: 'R199 per person' },
    { d: 0, s: '09:30', e: '12:00', n: 'Weekend Breakfast Buffet', p: 'R199 per person' },
  ];
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const pad = n => String(n).padStart(2, '0');
  // Johannesburg time (UTC+2, no daylight saving) as a real Date in absolute time
  const jhbNow = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
  const at = (base, addDays, hhmm) => { const d = new Date(base); d.setDate(d.getDate() + addDays); const [h, m] = hhmm.split(':'); d.setHours(+h, +m, 0, 0); return d; };

  function next() {
    const now = jhbNow();
    for (let add = 0; add < 8; add++) {
      const day = (now.getDay() + add) % 7;
      for (const b of B.filter(x => x.d === day)) {
        const start = at(now, add, b.s), end = at(now, add, b.e);
        if (end > now) return { ...b, start, end, live: now >= start, add };
      }
    }
  }

  let current = null;
  function tick() {
    const n = next(); if (!n) return; current = n;
    const now = jhbNow();
    box.classList.toggle('is-live', n.live);
    box.querySelector('.cdown__name').innerHTML = n.live ? `${n.n} is <em>on now.</em>` : n.n.replace(/(Buffet)$/, '<em>$1</em>');
    const dayWord = n.add === 0 ? 'Today' : n.add === 1 ? 'Tomorrow' : DAYS[n.d];
    box.querySelector('.cdown__when').textContent = n.live ? `Until ${n.e} at MiHa Melrose Arch · ${n.p}` : `${dayWord}, ${n.s}–${n.e} · MiHa Melrose Arch · ${n.p}`;
    let ms = Math.max(0, (n.live ? n.end : n.start) - now);
    const d = Math.floor(ms / 864e5); ms -= d * 864e5;
    const h = Math.floor(ms / 36e5); ms -= h * 36e5;
    const m = Math.floor(ms / 6e4); ms -= m * 6e4;
    const s = Math.floor(ms / 1e3);
    const set = (u, v) => { const el = box.querySelector(`[data-u="${u}"]`); if (el && el.textContent !== String(v)) el.textContent = v; };
    set('d', d); set('h', pad(h)); set('m', pad(m)); set('s', pad(s));
  }
  if (box) { tick(); setInterval(tick, 1000); }

  // weekly repeating calendar event, in Johannesburg time
  function ics(day, start, end, name) {
    const now = jhbNow(); let add = (day - now.getDay() + 7) % 7;
    const first = at(now, add, start), last = at(now, add, end);
    const f = d => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MiHa Eatery//Buffets//EN', 'BEGIN:VEVENT', `UID:${name.replace(/\W/g, '')}-${Date.now()}@miha`, `DTSTART;TZID=Africa/Johannesburg:${f(first)}`, `DTEND;TZID=Africa/Johannesburg:${f(last)}`, 'RRULE:FREQ=WEEKLY', `SUMMARY:${name} · MiHa`, 'LOCATION:MiHa Melrose Arch\\, Shop HL48\\, Melrose Arch\\, Johannesburg', 'DESCRIPTION:Bookings are essential. Book at https://onlinepixelcode-collab.github.io/miha-website/reserve.html', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' })); a.download = name.replace(/\s+/g, '-') + '-MiHa.ics'; document.body.appendChild(a); a.click(); a.remove();
  }
  icsBtns.forEach(b => b.addEventListener('click', () => ics(+b.dataset.day, b.dataset.start, b.dataset.end, b.dataset.name)));
  const cbtn = box && box.querySelector('.cdown__ics');
  if (cbtn) cbtn.addEventListener('click', () => { const n = current || next(); ics(n.d, n.s, n.e, n.n); });
})();
