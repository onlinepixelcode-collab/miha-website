// Builds the MiHa multi-page site from shared parts. Run: node build.mjs
import { writeFileSync, readFileSync } from 'node:fs';
import { MENU, BUFFETS } from './content.mjs';

const MARK = (cls="") => `<svg class="mh ${cls}" viewBox="40 50 440 430" fill="none" stroke="currentColor" stroke-width="46" aria-hidden="true"><path pathLength="1" d="M73 470V300a79.5 70 0 0 1 159 0v170"/><path pathLength="1" d="M232 300a62 68 0 0 1 72-67"/><path pathLength="1" d="M354 64v406"/><path pathLength="1" d="M354 300a44.5 67 0 0 1 89 0v170"/></svg>`;
const HI = {"imgs-24-of-118":"g-prawns","imgs-12-of-118":"g-dessert-choc","imgs-110-of-118":"g-mojito","imgs-35-of-118":"g-platter","img-141-of-163":"g-crepe","imgs-18-of-118":"g-prawns","imgs-99-of-118":"g-platter","imgs-89-of-118":"g-burger","img-131-of-163":"g-crepe","imgs-15-of-118":"g-curry","img-135-of-163":"g-tart","img-161-of-163":"g-dessert-choc","imgs-62-of-118":"g-mojito","img-139-of-163":"g-tart","imgs-1-of-118":"g-burger-board","imgs-29-of-118":"g-prawns","imgs-44-of-118":"g-penne","imgs-88-of-118":"g-burger","img-155-of-163":"g-tart","imgs-57-of-118":"g-fish","imgs-23-of-118":"g-sushi","img-157-of-163":"g-dessert-choc","imgs-41-of-118":"g-pizza","img-98-of-163":"g-bagel","img-163-of-163":"g-curry","imgs-33-of-118":"g-curry","imgs-56-of-118":"g-fish","Clenergy-Breads-3-1":"g-bagel","Clenergy-Breads-3-3":"g-crepe","img-142-of-163":"g-dessert-choc","img-138-of-163":"g-tart","img-144-of-163":"g-crepe","img-160-of-163":"g-dessert-choc","img-127-of-163":"g-bagel","imgs-17-of-118":"g-platter","imgs-77-of-118":"g-mojito"};
const I = n => `img/miha/${HI[n] || n}.jpg`; // MiHa's own photography (miha.co.za media library)
const DINE_JHB = 'https://www.dineplan.com/restaurants/miha';
const DINE_PTA = 'https://www.dineplan.com/restaurants/miha-pretoria';
const PDF = 'https://www.miha.co.za/wp-content/uploads/2026/10/Melrose-Arch-Main-Menu-A3.pdf';

const pages = [
  ['index.html', 'Home'], ['menu.html', 'Menu'], ['story.html', 'Our Story'],
  ['bar.html', 'The Bar'], ['catering.html', 'Catering'], ['bakery.html', 'Bakery'], ['reserve.html', 'Reserve']
];

const head = (title, desc, og = I('imgs-17-of-118')) => `<!doctype html>
<html lang="en-ZA" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#0d0b09">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${og}">
<link rel="icon" type="image/svg+xml" href="img/brand/mh-mark.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Geist:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<script>document.documentElement.classList.replace('no-js','js');try{var t=localStorage.getItem('miha-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="curtain" aria-hidden="true">${MARK("curtain__mark")}<p class="curtain__word">MiHa</p></div>
<div class="cursor" aria-hidden="true"><div class="cursor__dot"></div><div class="cursor__ring"><span class="cursor__label"></span></div></div>
<div class="grain" aria-hidden="true"></div>`;

const nav = () => `
<header class="nav">
  <a class="nav__logo" href="index.html" data-title="MiHa" aria-label="MiHa Eatery, home">${MARK()}<span>MiHa</span></a>
  <nav class="nav__links" aria-label="Main">
    <a href="menu.html">Menu</a>
    <a href="whats-on.html">What’s On</a>
    <a href="events.html">Events</a>
    <a href="story.html">Our Story</a>
    <a href="bar.html">The Bar</a>
    <a href="catering.html">Catering</a>
  </nav>
  <div class="nav__right">
    <span class="nav__badge">Strictly Halaal</span>
    <button class="theme-toggle" type="button" aria-label="Switch to light theme"><svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/></svg><svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button>
    <a class="btn btn--gold mag" href="reserve.html#book" data-cursor="Book"><span>Reserve</span></a>
    <button class="nav__burger" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><i></i><i></i></button>
  </div>
</header>
<div class="drawer" id="drawer" hidden>
  <nav aria-label="Mobile">
    <a href="index.html"><small>01</small>Home</a>
    <a href="menu.html"><small>02</small>Menu</a>
    <a href="whats-on.html"><small>03</small>What’s On</a>
    <a href="events.html"><small>04</small>Events</a>
    <a href="story.html"><small>05</small>Our Story</a>
    <a href="bar.html"><small>06</small>The Bar</a>
    <a href="catering.html"><small>07</small>Catering</a>
    <a href="bakery.html"><small>08</small>Bakery</a>
    <a href="reserve.html#book"><small>09</small>Reserve</a>
  </nav>
  <p class="drawer__foot">Melrose Arch · Centurion<br>Strictly Halaal · Alcohol-free</p>
</div>`;

const next = (href, label) => {
  const parts = label.split(' ');
  const last = parts.pop();
  return `<a class="next" href="${href}" data-title="${label}" data-cursor="Next"><small>Next</small><strong>${parts.join(' ')} <em>${last}</em></strong></a>`;
};

const UBER = 'https://www.ubereats.com/za/search?q=MiHa%20Melrose%20Arch';
const MRD = 'https://www.mrdfood.com/';
const join = () => `
<section class="join" aria-labelledby="join-title">
  <div class="wrap join__grid">
    <div>
      <p class="eyebrow"><span class="num">—</span> Join the MiHa family</p>
      <h2 class="h2" id="join-title">First to hear about <em>buffets &amp; specials.</em></h2>
    </div>
    <form class="join__form" data-mailto="yasin@miha.co.za" data-subject="Join the MiHa family">
      <div class="field"><label for="j-name">Name</label><input id="j-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="j-email">Email</label><input id="j-email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="j-branch">Your MiHa</label><select id="j-branch" name="branch"><option>Melrose Arch</option><option>Centurion</option><option>MiHa X Lenasia</option></select></div>
      <button class="btn btn--gold btn--lg mag" type="submit"><span>Join</span></button>
      <p class="form__note">Opens your email app with your details addressed to MiHa. Or follow <a href="https://www.instagram.com/mihasouthafrica/" target="_blank" rel="noopener">@mihasouthafrica</a>.</p>
      <p class="form__ok" hidden>Welcome to the family. Your email app should now be open, ready to send.</p>
    </form>
  </div>
</section>`;

const footer = () => `${join()}
<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div><h3>Visit us</h3><p><b>Melrose Arch</b><br>Shop HL48, Melrose Arch, Johannesburg<br><a href="tel:+27607489464">060 748 9464</a></p><p><b>Centurion</b><br>134 Baard Rd, Raslouw, Pretoria<br><a href="tel:+27780059386">078 005 9386</a></p><p><b>MiHa X</b><br>Trade Route Mall, Lenasia<br><a href="tel:+27616014332">061 601 4332</a></p></div>
      <div><h3>Order online</h3><p><a href="${UBER}" target="_blank" rel="noopener">Uber Eats</a></p><p><a href="${MRD}" target="_blank" rel="noopener">Mr D</a></p><p><a href="reserve.html#book">Book a table</a></p></div>
      <div><h3>Explore</h3><p><a href="menu.html">Menu</a></p><p><a href="whats-on.html">What’s On</a></p><p><a href="events.html">Events</a></p><p><a href="story.html">Our Story</a></p><p><a href="bar.html">The Bar</a></p><p><a href="catering.html">Catering</a></p><p><a href="bakery.html">Clenergy Bakery</a></p></div>
      <div><h3>Say hello</h3><p><a href="mailto:yasin@miha.co.za">yasin@miha.co.za</a></p><p><a href="https://www.instagram.com/mihasouthafrica/" target="_blank" rel="noopener">Instagram</a></p><p><a href="https://www.tiktok.com/@mihasouthafrica" target="_blank" rel="noopener">TikTok</a></p><p><a href="https://g.page/r/CccsfAQ77eEuEBM/review" target="_blank" rel="noopener">Leave a Google review</a></p></div>
    </div>
    <div class="footer__lockup sign" aria-hidden="true"><div class="sign__in">${MARK()}<p>MiHa</p></div></div>
    <div class="footer__base">
      <p>All food is strictly Halaal. For religious reasons, no alcohol is served or allowed on the premises.</p>
      <p>© <span class="year">2026</span> MiHa Eatery</p>
    </div>
  </div>
</footer>
<div class="mbar"><a href="reserve.html#book" class="mbar__main">Reserve</a><a href="tel:+27607489464">Call</a><a href="reserve.html#branches">Directions</a></div>
<script src="vendor/gsap.min.js"></script>
<script src="vendor/ScrollTrigger.min.js"></script>
<script src="vendor/lenis.min.js"></script>
<script src="main.js"></script>
<script src="concierge.js"></script>
<script src="booking.js"></script>
</body>
</html>`;

const phero = ({ crumb, eyebrow, title, lead, img, cta = '' }) => `
<section class="phero">
  <div class="phero__media"><img src="${I(img)}" alt="" fetchpriority="high"></div>
  <div class="wrap">
    <p class="crumbs"><a href="index.html">MiHa</a> &nbsp;/&nbsp; ${crumb}</p>
    <h1 class="display phero__title">${title}</h1>
    <div class="phero__row"><p class="lead">${lead}</p>${cta}</div>
  </div>
</section>`;

const branches = () => `
<section class="homes" id="branches">
  <div class="wrap">
    <p class="eyebrow"><span class="num">—</span> Three homes</p>
    <h2 class="h2">Find your <em>table.</em></h2>
    <div class="homes__grid">
      <article class="home" data-branch="jhb">
        <a class="home__img" href="${DINE_JHB}" target="_blank" rel="noopener" data-cursor="Book"><img src="${I('g-sushi')}" alt="MiHa sushi" loading="lazy"></a>
        <div class="home__body">
          <div class="home__top"><h3>Melrose Arch</h3><span class="status"><i></i><em>Checking hours…</em></span></div>
          <p class="home__addr">Shop HL48, Melrose Arch, Johannesburg</p>
          <table class="hours"><tr><th>Mon–Thu</th><td>11:00 – 21:30</td></tr><tr><th>Friday</th><td>11:00 – 22:00</td></tr><tr><th>Saturday</th><td>09:00 – 22:00</td></tr><tr><th>Sunday</th><td>09:00 – 21:30</td></tr></table>
          <div class="home__actions"><a class="btn btn--gold mag" href="${DINE_JHB}" target="_blank" rel="noopener"><span>Book Melrose Arch</span></a><a class="link-arrow" href="tel:+27607489464">060 748 9464</a><a class="link-arrow" href="https://www.google.com/maps/search/?api=1&query=MiHa+Eatery+Melrose+Arch" target="_blank" rel="noopener">Directions ↗</a></div>
        </div>
      </article>
      <article class="home" data-branch="pta">
        <a class="home__img" href="${DINE_PTA}" target="_blank" rel="noopener" data-cursor="Book"><img src="${I('g-platter')}" alt="A MiHa sharing platter" loading="lazy"></a>
        <div class="home__body">
          <div class="home__top"><h3>Centurion</h3><span class="status"><i></i><em>Checking hours…</em></span></div>
          <p class="home__addr">134 Baard Rd, Raslouw, Pretoria</p>
          <table class="hours"><tr><th>Monday</th><td>18:00 – 21:30</td></tr><tr><th>Tue–Fri</th><td>12:00 – 21:30</td></tr><tr><th>Saturday</th><td>09:00 – 22:00</td></tr><tr><th>Sunday</th><td>09:00 – 21:30</td></tr></table>
          <div class="home__actions"><a class="btn btn--gold mag" href="${DINE_PTA}" target="_blank" rel="noopener"><span>Book Centurion</span></a><a class="link-arrow" href="tel:+27780059386">078 005 9386</a><a class="link-arrow" href="https://www.google.com/maps/search/?api=1&query=MiHa+Eatery+134+Baard+Rd+Raslouw" target="_blank" rel="noopener">Directions ↗</a></div>
        </div>
      </article>
    </div>
    <article class="homex">
      <div class="homex__logo"><svg class="mh" viewBox="40 50 440 430" fill="none" stroke="currentColor" stroke-width="46" aria-hidden="true"><path d="M73 470V300a79.5 70 0 0 1 159 0v170"/><path d="M232 300a62 68 0 0 1 72-67"/><path d="M354 64v406"/><path d="M354 300a44.5 67 0 0 1 89 0v170"/></svg><span>MIHA X</span></div>
      <div class="homex__txt"><h3>MiHa X <em>Lenasia</em></h3><p>A new destination where gourmet food meets exceptional value. Trade Route Mall, Lenasia.</p></div>
      <div class="homex__actions"><a class="btn btn--ghost mag" href="tel:+27616014332"><span>Call 061 601 4332</span></a><a class="link-arrow" href="https://www.instagram.com/mihax_lenasia/" target="_blank" rel="noopener">@mihax_lenasia ↗</a><a class="link-arrow" href="${MRD}" target="_blank" rel="noopener">Order on Mr D ↗</a></div>
    </article>
  </div>
</section>`;

/* =========================== HOME =========================== */
const home = `${head('MiHa Eatery · Halaal Fine Dining in Melrose Arch & Centurion', 'Family-run, strictly Halaal and alcohol-free. International cuisine with a South African touch in Melrose Arch, Johannesburg and Centurion, Pretoria.')}
<div class="loader" aria-hidden="true">
  <div class="loader__panel loader__panel--top"></div><div class="loader__panel loader__panel--bottom"></div>
  <div class="loader__inner">${MARK("loader__mark")}<div class="loader__word">MiHa</div><div class="loader__line"><i></i></div><div class="loader__meta"><span>Miya</span><span class="loader__count">00</span><span>Hassim</span></div></div>
</div>
${nav()}
<main id="main">
<section class="hero" id="top">
  <div class="wrap hero__grid">
    <div class="hero__content">
    <p class="eyebrow hero__eyebrow"><span class="dot"></span>Halaal dining · Melrose Arch &amp; Centurion</p>
    <h1 class="hero__title"><span class="line"><span>The simple</span></span><span class="line"><span><em>&amp;</em> the sumptuous.</span></span></h1>
    <div class="hero__foot">
      <p class="hero__lead">Strictly Halaal international cuisine with a South African touch, from MiHa's two family kitchens.</p>
      <div class="hero__actions">
        <a class="btn btn--gold btn--lg mag" href="reserve.html#book" data-cursor="Book"><span>Reserve a table</span></a>
        <a class="btn btn--ghost btn--lg mag" href="menu.html"><span>View the menu</span></a>
      </div>
    </div>
  </div>
    <div class="hero__arch">
      <div class="hero__reel">
    <img class="is-on" src="${I('g-platter')}" alt="A MiHa tapas board with falafel, kebabs, samoosas and dips" fetchpriority="high">
    <img src="${I('g-sushi')}" alt="MiHa sushi rolls" loading="lazy">
    <img src="${I('g-prawns')}" alt="MiHa peri-peri prawns with chips and charred lemon" loading="lazy">
    <img src="${I('g-pizza')}" alt="A stone-fired MiHa pizza" loading="lazy">
    <img src="${I('g-tart')}" alt="A MiHa chocolate tart with chocolate drizzle" loading="lazy">
  </div>
      <div class="hero__float" aria-hidden="true">
    <div class="fcard fcard--a" data-depth="18"><img src="${I('imgs-26-of-118')}" alt=""><div><b>Peri-peri prawns</b><span>Signature</span></div></div>
    <div class="fcard fcard--b" data-depth="30"><img src="${I('img-127-of-163')}" alt=""><div><b>Flat white</b><span>From 09:00</span></div></div>
    <div class="fcard fcard--c" data-depth="12"><img src="${I('imgs-77-of-118')}" alt=""><div><b>House mocktails</b><span>Alcohol-free, always</span></div></div>
  </div>
      <div class="hero__reel-nav" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
    </div>
  </div>
  <div class="hero__ticker" aria-hidden="true"><div class="ticker__track">
    ${'<span>Strictly Halaal</span><i>✦</i><span>Alcohol-free, always</span><i>✦</i><span>Melrose Arch</span><i>✦</i><span>Centurion</span><i>✦</i><span>Breakfast to dinner</span><i>✦</i>'.repeat(2)}
  </div></div>
</section>

<section class="statement" id="welcome">
  <div class="wrap">
    <p class="eyebrow"><span class="num">01</span> Welcome to MiHa</p>
    <p class="statement__text" data-words>From a quick flat white on the way to work to a long celebration dinner with everyone you love, MiHa is where a casual café meets classic dining. Every plate is strictly Halaal, every glass alcohol-free, and every guest family.</p>
    <div class="statement__pills">
      <div class="pill"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/></svg><span><b>Strictly Halaal</b>Every kitchen, every dish</span></div>
      <div class="pill"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10l-1 7a4 4 0 01-8 0zM12 14v7M8 21h8"/><path d="M4 4l16 16"/></svg><span><b>Alcohol-free</b>A bar built on mocktails</span></div>
      <div class="pill"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.6-7 10-7 10z"/></svg><span><b>Made around you</b>Taste and variety, your way</span></div>
    </div>
  </div>
</section>

<section class="signature" id="signature">
  <div class="signature__pin">
    <div class="wrap signature__grid">
      <div class="signature__copy">
        <p class="eyebrow"><span class="num">02</span> Signature plates</p>
        <h2 class="h2">Turn the <em>table.</em></h2>
        <ol class="sig-list">
          <li class="is-active"><span class="sig-list__n">01</span><div><h3>The MiHa platter</h3><p>Samoosas, kebabs, falafel and house dips for the table.</p></div></li>
          <li><span class="sig-list__n">02</span><div><h3>Peri-peri prawns</h3><p>Butter-basted, with chips and charred lemon.</p></div></li>
          <li><span class="sig-list__n">03</span><div><h3>MiHa pizza</h3><p>Golden, bubbling and made to share.</p></div></li>
          <li><span class="sig-list__n">04</span><div><h3>Chocolate mousse slice</h3><p>Dark chocolate, mousse and fresh berries.</p></div></li>
        </ol>
        <a class="link-arrow" href="menu.html">See the full menu <span aria-hidden="true">→</span></a>
      </div>
    </div>
    <div class="wheel" aria-hidden="true">
      <div class="wheel__disc">
        <div class="wheel__ring"></div>
        <div class="wheel__plate" style="--a:270deg"><img src="${I('g-platter')}" alt=""></div>
        <div class="wheel__plate" style="--a:0deg"><img src="${I('g-prawns')}" alt=""></div>
        <div class="wheel__plate" style="--a:90deg"><img src="${I('g-pizza')}" alt=""></div>
        <div class="wheel__plate" style="--a:180deg"><img src="${I('g-dessert-choc')}" alt=""></div>
      </div>
    </div>
  </div>
</section>

<section class="day" id="day">
  <div class="day__pin">
    <div class="day__head wrap">
      <p class="eyebrow"><span class="num">03</span> A day at MiHa</p>
      <h2 class="h2">First coffee to <em>last</em> dessert.</h2>
    </div>
    <div class="day__track">
      <article class="slot"><figure class="slot__img"><img src="${I('img-127-of-163')}" alt="A MiHa flat white with latte art" loading="lazy"></figure><div class="slot__txt"><span class="slot__time">09:00</span><h3>Breakfast</h3><p>Fresh bakes from our own Clenergy Bakery and the first flat white of the day.</p></div></article>
      <article class="slot"><figure class="slot__img"><img src="${I('imgs-89-of-118')}" alt="A MiHa burger with avocado and crispy onions" loading="lazy"></figure><div class="slot__txt"><span class="slot__time">12:30</span><h3>Lunch</h3><p>Burgers, wraps and pastas for a quick lunch, or a long table for the family.</p></div></article>
      <article class="slot"><figure class="slot__img"><img src="${I('img-131-of-163')}" alt="A MiHa freakshake topped with cream and caramel" loading="lazy"></figure><div class="slot__txt"><span class="slot__time">15:30</span><h3>Afternoon</h3><p>Freakshakes, mocktails and cakes for the slow part of the day.</p></div></article>
      <article class="slot"><figure class="slot__img"><img src="${I('imgs-15-of-118')}" alt="MiHa's grill platter with onion rings" loading="lazy"></figure><div class="slot__txt"><span class="slot__time">19:30</span><h3>Dinner</h3><p>Low light, the grill and a dessert you'll share, or won't.</p></div></article>
      <article class="slot"><figure class="slot__img"><img src="${I('img-135-of-163')}" alt="A chocolate fondant with ice cream" loading="lazy"></figure><div class="slot__txt"><span class="slot__time">21:30</span><h3>Last orders</h3><p>A warm fondant and one more mocktail before home.</p></div></article>
      <div class="slot slot--end"><p>Open seven days.<br><em>Breakfast from 09:00 on weekends.</em></p><a class="btn btn--gold mag" href="reserve.html#branches"><span>See trading hours</span></a></div>
    </div>
    <div class="day__bar"><i></i></div>
  </div>
</section>

<section class="story" id="story">
  <div class="wrap story__grid">
    <figure class="story__img story__img--tall" data-clip><img src="${I('imgs-12-of-118')}" alt="A MiHa grill platter beside a brass lantern and orchids" loading="lazy"></figure>
    <div class="story__copy">
      <p class="eyebrow"><span class="num">04</span> Our story</p>
      <h2 class="h2">Two families.<br><em>One name.</em></h2>
      <p class="story__lead">Fifteen years ago, the Miya and Hassim families became one. <strong>MiHa</strong> is a celebration of that union, and a term of endearment we hope you'll feel the moment you sit down.</p>
      <p>We cook the way we eat at home: generously, with flavours from everywhere and a South African heart.</p>
      <dl class="stats"><div><dt>Years together</dt><dd data-count="15">15</dd></div><div><dt>Families</dt><dd data-count="2">2</dd></div><div><dt>Homes</dt><dd data-count="2">2</dd></div><div><dt>Halaal</dt><dd><span data-count="100">100</span>%</dd></div></dl>
      <p style="margin-top:36px"><a class="link-arrow" href="story.html">Read our story <span aria-hidden="true">→</span></a></p>
    </div>
    <figure class="story__img story__img--small" data-clip><img src="${I('img-161-of-163')}" alt="A slice of MiHa tiramisu" loading="lazy"></figure>
  </div>
</section>

<section class="bleed" aria-label="The MiHa bar">
  <figure class="bleed__img"><img src="${I('g-pizza')}" alt="A stone-fired MiHa pizza" loading="lazy"></figure>
  <p class="bleed__quote wrap"><span>“Where casual café</span><span><em>meets classic dining.”</em></span></p>
</section>

<section class="beyond">
  <div class="wrap">
    <div class="beyond__head"><p class="eyebrow"><span class="num">05</span> Explore MiHa</p><h2 class="h2">More than a <em>meal.</em></h2></div>
    <div class="beyond__grid">
      <a class="bcard" href="bar.html" data-cursor="Explore"><figure><img src="${I('imgs-62-of-118')}" alt="A tall MiHa mocktail with golden garnish" loading="lazy"></figure><div><h3>The alcohol-free bar</h3><p>Mocktails, shakes and coffee worth crossing town for.</p><span class="link-arrow">Visit the bar →</span></div></a>
      <a class="bcard" href="catering.html" data-cursor="Explore"><figure><img src="${I('imgs-35-of-118')}" alt="A MiHa peri-peri chicken platter" loading="lazy"></figure><div><h3>Catering &amp; staff lunches</h3><p>Boardroom lunches to year-end functions, fully Halaal.</p><span class="link-arrow">Plan an event →</span></div></a>
      <a class="bcard" href="bakery.html" data-cursor="Explore"><figure><img src="${I('img-139-of-163')}" alt="A MiHa cheesecake crowned with caramel crunch" loading="lazy"></figure><div><h3>Clenergy Bakery</h3><p>Breads, pastries and celebration cakes, baked in-house.</p><span class="link-arrow">Visit the bakery →</span></div></a>
    </div>
  </div>
</section>

<section class="teaser sec--line">
  <div class="wrap teaser__grid">
    <figure class="teaser__img" data-clip><img src="${I('g-curry')}" alt="A MiHa curry served for the Friday buffet" loading="lazy"></figure>
    <div>
      <p class="eyebrow"><span class="num">—</span> What’s on</p>
      <h2 class="h2">Friday nights are <em>buffet nights.</em></h2>
      <ul class="teaser__list">
        <li><b>Friday Night Dinner Buffet</b><span>Fridays · 18:30–21:00 · R250 adults, R125 kids 6–12</span></li>
        <li><b>Weekend Breakfast Buffet</b><span>Sat &amp; Sun · 09:30–12:00 · R199 per person</span></li>
      </ul>
      <p class="muted">Both at MiHa Melrose Arch. Bookings are essential.</p>
      <p style="margin-top:28px;display:flex;gap:14px;flex-wrap:wrap"><a class="btn btn--gold mag" href="reserve.html?branch=jhb#book"><span>Book a buffet</span></a><a class="btn btn--ghost mag" href="whats-on.html"><span>See what’s on</span></a></p>
    </div>
  </div>
</section>

<section class="reviews sec--line" aria-labelledby="rev-title">
  <div class="wrap">
    <p class="eyebrow"><span class="num">—</span> Guest love</p>
    <h2 class="h2" id="rev-title">Loved by <em>Johannesburg.</em></h2>
    <div class="ratings">
      <div class="rating" data-reveal><b>4.4</b><span class="stars" aria-hidden="true">★★★★★</span><p>Uber Eats<small>1,000+ ratings</small></p></div>
      <div class="rating" data-reveal><b>4.1</b><span class="stars" aria-hidden="true">★★★★★</span><p>Dineplan<small>1,138 reviews</small></p></div>
      <div class="rating" data-reveal><b>9.1</b><span class="stars" aria-hidden="true">/10</span><p>Dinestar<small>100% of guests recommend</small></p></div>
    </div>
    <div class="quotes">
      <blockquote class="quote" data-reveal><p>“The food was delicious… the best cheesecake I’ve had by far.”</p><cite>Guest review · <a href="https://dinestar.co.za/" target="_blank" rel="noopener">Dinestar</a></cite></blockquote>
      <blockquote class="quote" data-reveal><p>“A good spot to host your next alcohol-free family get-together.”</p><cite><a href="https://www.inyourpocket.com/johannesburg" target="_blank" rel="noopener">Johannesburg In Your Pocket</a></cite></blockquote>
    </div>
    <p style="margin-top:36px"><a class="link-arrow" href="https://g.page/r/CccsfAQ77eEuEBM/review" target="_blank" rel="noopener">Dined with us? Leave a Google review ↗</a></p>
  </div>
</section>

<section class="order sec--line">
  <div class="wrap order__grid">
    <div><p class="eyebrow"><span class="num">—</span> Order online</p><h2 class="h2">MiHa, <em>delivered.</em></h2><p class="lead">Your favourites from MiHa Melrose Arch on Uber Eats. MiHa X Lenasia delivers on Mr D.</p></div>
    <div class="order__cards">
      <a class="order__card" href="${UBER}" target="_blank" rel="noopener" data-cursor="Order"><b>Uber Eats</b><span>MiHa Melrose Arch · ★ 4.4 (1,000+)</span><i aria-hidden="true">↗</i></a>
      <a class="order__card" href="${MRD}" target="_blank" rel="noopener" data-cursor="Order"><b>Mr D</b><span>MiHa X Lenasia</span><i aria-hidden="true">↗</i></a>
    </div>
  </div>
</section>

${branches()}

<section class="reserve" id="reserve">
  <figure class="reserve__img"><img src="${I('imgs-18-of-118')}" alt="A table at MiHa set with the grill platter, chips, a brass lantern and white orchids" loading="lazy"></figure>
  <div class="wrap reserve__inner">
    <p class="eyebrow"><span class="num">06</span> Reservations</p>
    <h2 class="reserve__title"><span class="line"><span>Your table</span></span><span class="line"><span><em>is waiting.</em></span></span></h2>
    <p class="reserve__lead">Book to avoid disappointment. Choose your MiHa.</p>
    <div class="reserve__actions">
      <a class="btn btn--gold btn--lg mag" href="${DINE_JHB}" target="_blank" rel="noopener" data-cursor="Book"><span>Melrose Arch</span></a>
      <a class="btn btn--ghost btn--lg mag" href="${DINE_PTA}" target="_blank" rel="noopener" data-cursor="Book"><span>Centurion</span></a>
    </div>
  </div>
</section>
</main>
${footer()}`;

/* =========================== MENU =========================== */
const dishRow = ([name, desc, price, tags]) => {
  const t = tags.split(' ').filter(Boolean);
  const badge = t.includes('sig') ? ' <span class="tag">Signature</span>' : '';
  const ic = (t.includes('spicy') ? ' <span class="ic" title="Spicy" aria-label="Spicy">🌶</span>' : '') + (t.includes('veg') ? ' <span class="ic ic--veg" title="Vegetarian" aria-label="Vegetarian">V</span>' : '');
  return `<div class="dish" data-tags="${tags}"><h3>${name}${badge}${ic}</h3><span class="price">${price}</span><p>${desc}</p></div>`;
};
const menuSec = (s, i) => `
<section class="msec" id="${s.id}">
  <div class="wrap msec__grid${i % 2 ? ' msec__grid--rev' : ''}">
    <figure class="msec__img" data-clip><img src="${I(s.img)}" alt="${s.alt}" loading="lazy"></figure>
    <div><h2 class="msec__title">${s.title}</h2>${s.items.map(dishRow).join('')}</div>
  </div>
</section>`;
const orderOnline = () => `
<section class="order sec--line">
  <div class="wrap order__grid">
    <div><p class="eyebrow"><span class="num">—</span> Order online</p><h2 class="h2">MiHa, <em>delivered.</em></h2><p class="lead">Your favourites from MiHa Melrose Arch on Uber Eats, rated 4.4 by more than 1,000 guests. MiHa X Lenasia delivers on Mr D.</p></div>
    <div class="order__cards">
      <a class="order__card" href="${UBER}" target="_blank" rel="noopener" data-cursor="Order"><b>Uber Eats</b><span>MiHa Melrose Arch · ★ 4.4 (1,000+)</span><i aria-hidden="true">↗</i></a>
      <a class="order__card" href="${MRD}" target="_blank" rel="noopener" data-cursor="Order"><b>Mr D</b><span>MiHa X Lenasia</span><i aria-hidden="true">↗</i></a>
    </div>
  </div>
</section>`;
const menu = `${head('Menu · MiHa Eatery', 'MiHa’s menu: signature 28-day aged steaks, Portuguese prawns, sushi platters, stone-fired pizza, burgers and desserts. Strictly Halaal.', I('g-prawns'))}
${nav()}
<main id="main">
${phero({ crumb: 'Menu', title: '<span class="line"><span>Taste &amp;</span></span><span class="line"><span><em>variety.</em></span></span>', lead: 'From 28-day aged steaks to sushi platters and stone-fired pizza. Every dish strictly Halaal.', img: 'g-prawns', cta: '<a class="btn btn--gold btn--lg mag" href="reserve.html#book"><span>Book a table</span></a>' })}
<nav class="mtabs" aria-label="Menu sections"><div class="wrap mtabs__in">
  ${MENU.map(s => `<a href="#${s.id}">${s.title.replace(/<[^>]+>/g, '').replace('&amp;', '&')}</a>`).join('')}
</div></nav>
<div class="wrap"><div class="mfilters" role="group" aria-label="Filter dishes">
  <button aria-pressed="true" data-filter="all">Everything</button><button aria-pressed="false" data-filter="sig">Signature</button><button aria-pressed="false" data-filter="spicy">Spicy</button><button aria-pressed="false" data-filter="veg">Vegetarian</button><button aria-pressed="false" data-filter="share">To share</button>
</div></div>
${MENU.map(menuSec).join('')}
<section class="sec"><div class="wrap menu__note"><p>A selection from MiHa’s menu as listed on Dineplan (July 2025). Dishes and prices may change; ask your server for today’s menu, kids’ menu and specials.</p><a class="link-arrow" href="${PDF}" target="_blank" rel="noopener">Download MiHa’s printed menu (PDF) ↗</a></div></section>
${orderOnline()}
${next('whats-on.html', 'What’s On')}
</main>
${footer()}`;

/* =========================== WHAT'S ON (buffets) =========================== */
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const weekStrip = () => `<ol class="week" aria-label="This week at MiHa">${[1, 2, 3, 4, 5, 6, 0].map(d => {
  const b = BUFFETS.filter(x => x.day === d);
  return `<li class="week__day${b.length ? ' has-event' : ''}" data-day="${d}"><b>${DAYS[d].slice(0, 3)}</b>${b.length ? b.map(x => `<span>${x.name.replace(' Buffet', '')}<small>${x.time}</small></span>`).join('') : '<span class="muted">À la carte</span>'}</li>`;
}).join('')}</ol>`;
const buffetCard = (b, label) => `
<article class="buffet">
  <figure class="buffet__img" data-clip><img src="${I(b.img)}" alt="" loading="lazy"></figure>
  <div class="buffet__body">
    <p class="eyebrow">${label}</p>
    <h3>${b.name}</h3>
    <dl class="buffet__facts"><div><dt>When</dt><dd>${label} · ${b.time}</dd></div><div><dt>Where</dt><dd>${b.where}</dd></div><div><dt>Price</dt><dd>${b.price}</dd></div></dl>
    <p class="muted">${b.note}</p>
    <div class="buffet__actions"><a class="btn btn--gold mag" href="reserve.html?branch=${b.branch}#book"><span>Book this buffet</span></a><a class="link-arrow" href="tel:+27607489464">Call 060 748 9464</a></div>
  </div>
</article>`;
const whatson = `${head('What’s On · Buffets at MiHa', 'Friday Night Dinner Buffet and Weekend Breakfast Buffet at MiHa Melrose Arch. Prices, times and bookings.', I('g-curry'))}
${nav()}
<main id="main">
${phero({ crumb: 'What’s On', title: '<span class="line"><span>Buffet</span></span><span class="line"><span><em>nights.</em></span></span>', lead: 'Friday dinners and weekend breakfasts at MiHa Melrose Arch. Come hungry; bookings are essential.', img: 'g-curry', cta: '<a class="btn btn--gold btn--lg mag" href="reserve.html?branch=jhb#book"><span>Book a buffet</span></a>' })}
<section class="sec"><div class="wrap">
  <div class="next-buffet" data-next-buffet><p class="eyebrow"><span class="dot"></span> Next buffet</p><p class="next-buffet__txt">Checking the calendar…</p></div>
  <p class="eyebrow" style="margin-top:56px"><span class="num">01</span> This week</p>
  <h2 class="h2">Your week at <em>MiHa.</em></h2>
  ${weekStrip()}
</div></section>
<section class="sec sec--line"><div class="wrap">
  <p class="eyebrow"><span class="num">02</span> The buffets</p>
  <h2 class="h2">Pull up <em>a chair.</em></h2>
  <div class="buffets">
    ${buffetCard(BUFFETS[0], 'Every Friday')}
    ${buffetCard(BUFFETS[1], 'Every Saturday &amp; Sunday')}
  </div>
</div></section>
<section class="sec sec--line"><div class="wrap split">
  <figure class="split__img" data-clip><img src="${I('g-tart')}" alt="A MiHa chocolate dessert" loading="lazy"></figure>
  <div class="split__txt">
    <p class="eyebrow"><span class="num">03</span> Seasonal</p>
    <h2 class="h2">Ramadan, Eid <em>&amp; special days.</em></h2>
    <p>MiHa hosts Iftaar buffets during Ramadan and special menus for Eid, Mother’s Day, Father’s Day and more. Dates and prices are announced on Instagram first.</p>
    <p><a class="btn btn--ghost mag" href="https://www.instagram.com/mihasouthafrica/" target="_blank" rel="noopener"><span>Follow @mihasouthafrica</span></a></p>
  </div>
</div></section>
${next('events.html', 'Host an Event')}
</main>
${footer()}`;

/* =========================== EVENTS =========================== */
const occ = (t, d, icon) => `<div class="occ" data-reveal><span class="occ__ic" aria-hidden="true">${icon}</span><h3>${t}</h3><p>${d}</p></div>`;
const events = `${head('Events & Private Dining · MiHa Eatery', 'Host corporate events, weddings, engagements, birthdays and graduations at MiHa Melrose Arch or Centurion. Decor, setup and Halaal catering.', I('g-platter'))}
${nav()}
<main id="main">
${phero({ crumb: 'Events', title: '<span class="line"><span>Your occasion,</span></span><span class="line"><span><em>our care.</em></span></span>', lead: 'Corporate events, weddings, engagements, birthdays and graduations. MiHa takes care of the decor, setup and catering.', img: 'g-platter', cta: '<a class="btn btn--gold btn--lg mag" href="#enquire"><span>Plan your event</span></a>' })}
<section class="statement"><div class="wrap">
  <p class="eyebrow"><span class="num">01</span> Effortless from start to finish</p>
  <p class="statement__text" data-words>We take care of the decor, the setup and the food, so you can enjoy the moment while we handle the details. Choose one of our packages, or let us curate one around your occasion, style and needs.</p>
</div></section>
<section class="sec sec--line"><div class="wrap">
  <p class="eyebrow"><span class="num">02</span> Occasions</p>
  <h2 class="h2">Made for <em>every celebration.</em></h2>
  <div class="occs">
    ${occ('Corporate events', 'Launches, team dinners and year-end functions, fully Halaal.', '◆')}
    ${occ('Weddings', 'An elegant, alcohol-free reception the whole family can share.', '♡')}
    ${occ('Engagements', 'Intimate or grand, with flowers and a table to remember.', '◇')}
    ${occ('Birthdays', 'From first birthdays to milestone dinners.', '✦')}
    ${occ('Graduations', 'Celebrate the achievement with the people who helped.', '★')}
    ${occ('Family gatherings', 'Eid lunches, Iftaar and long Sunday tables.', '❖')}
  </div>
</div></section>
<section class="sec sec--line"><div class="wrap">
  <p class="eyebrow"><span class="num">03</span> What we handle</p>
  <h2 class="h2">You arrive. <em>We’ve done the rest.</em></h2>
  <div class="steps">
    <div class="step" data-reveal><b>01</b><h3>Decor</h3><p>Florals, table styling and the details that set the mood.</p></div>
    <div class="step" data-reveal><b>02</b><h3>Setup</h3><p>Your room arranged, laid and ready before the first guest.</p></div>
    <div class="step" data-reveal><b>03</b><h3>Catering</h3><p>Strictly Halaal menus from MiHa’s kitchen, plated or buffet.</p></div>
  </div>
</div></section>
<section class="sec sec--line"><div class="wrap">
  <p class="eyebrow"><span class="num">04</span> Venues</p>
  <h2 class="h2">Two beautiful <em>rooms.</em></h2>
  <div class="homes__grid">
    <article class="home"><div class="home__img"><img src="${I('g-sushi')}" alt="MiHa sushi" loading="lazy"></div><div class="home__body"><h3>Melrose Arch</h3><p class="home__addr">Shop HL48, Melrose Arch, Johannesburg</p><a class="link-arrow" href="tel:+27607489464">060 748 9464</a></div></article>
    <article class="home"><div class="home__img"><img src="${I('g-platter')}" alt="A MiHa sharing platter" loading="lazy"></div><div class="home__body"><h3>Centurion</h3><p class="home__addr">Golden Point Padel, 134 Baard Rd, Raslouw, Pretoria</p><a class="link-arrow" href="tel:+27780059386">078 005 9386</a></div></article>
  </div>
</div></section>
<section class="sec sec--line" id="enquire"><div class="wrap split">
  <div class="split__txt split__txt--form">
    <p class="eyebrow"><span class="num">05</span> Enquire</p>
    <h2 class="h2">Tell us about <em>your day.</em></h2>
    <p>Share a few details and the MiHa events team will come back to you with packages and availability.</p>
  </div>
  <form class="form split__form" data-mailto="yasin@miha.co.za" data-subject="Event enquiry">
    <div class="field"><label for="e-name">Name</label><input id="e-name" name="name" required autocomplete="name"></div>
    <div class="field"><label for="e-phone">Mobile</label><input id="e-phone" name="phone" type="tel" required autocomplete="tel"></div>
    <div class="field"><label for="e-email">Email</label><input id="e-email" name="email" type="email" required autocomplete="email"></div>
    <div class="field"><label for="e-type">Occasion</label><select id="e-type" name="occasion"><option>Corporate event</option><option>Wedding</option><option>Engagement</option><option>Birthday</option><option>Graduation</option><option>Family gathering</option><option>Other</option></select></div>
    <div class="field"><label for="e-venue">Venue</label><select id="e-venue" name="venue"><option>Melrose Arch</option><option>Centurion</option><option>Not sure yet</option></select></div>
    <div class="field"><label for="e-date">Date</label><input id="e-date" name="date" type="date"></div>
    <div class="field"><label for="e-guests">Guests</label><input id="e-guests" name="guests" type="number" min="1"></div>
    <div class="field"><label for="e-budget">Budget (optional)</label><input id="e-budget" name="budget" inputmode="numeric" placeholder="e.g. R15 000"></div>
    <div class="field field--full"><label for="e-msg">Your vision</label><textarea id="e-msg" name="message" placeholder="Theme, colours, menu ideas…"></textarea></div>
    <p class="form__note">Sending opens your email app with these details addressed to MiHa.</p>
    <p><button class="btn btn--gold btn--lg mag" type="submit"><span>Send enquiry</span></button></p>
    <p class="form__ok" hidden>Thank you. Your email app should now be open with your enquiry ready to send.</p>
  </form>
</div></section>
${next('catering.html', 'Office Catering')}
</main>
${footer()}`;

/* =========================== STORY =========================== */
const story = `${head('Our Story · MiHa Eatery', 'MiHa is the coming together of the Miya and Hassim families: a casual café and a classic dining experience in one.', I('imgs-12-of-118'))}
${nav()}
<main id="main">
${phero({ crumb: 'Our Story', title: '<span class="line"><span>Two families,</span></span><span class="line"><span><em>one table.</em></span></span>', lead: 'Fifteen years ago, the Miya and Hassim families became one. The name MiHa is a celebration of that union.', img: 'imgs-12-of-118' })}
<section class="statement"><div class="wrap">
  <p class="eyebrow"><span class="num">01</span> The name</p>
  <p class="statement__text" data-words>Mi for Miya. Ha for Hassim. Said together, MiHa is also a term of endearment, which is exactly how we want every guest to feel: welcomed, fed well and part of the family.</p>
</div></section>
<section class="sec sec--line"><div class="wrap split">
  <figure class="split__img" data-clip><img src="${I('imgs-57-of-118')}" alt="A MiHa grilled wrap with fresh tomato" loading="lazy"></figure>
  <div class="split__txt">
    <p class="eyebrow"><span class="num">02</span> The idea</p>
    <h2 class="h2">The simple <em>&amp;</em> the sumptuous.</h2>
    <p>MiHa is the coming together of a casual café and a classic dining experience. From a quick grab-and-go to a decadent celebratory feast, we bring the two together under one roof.</p>
    <p>Our menu is international, with flavours from near and far and our own South African touch.</p>
  </div>
</div></section>
<section class="sec sec--line"><div class="wrap split split--rev">
  <figure class="split__img" data-clip><img src="${I('img-107-of-163')}" alt="A strawberry and lemon mocktail" loading="lazy"></figure>
  <div class="split__txt">
    <p class="eyebrow"><span class="num">03</span> Our promise</p>
    <h2 class="h2">Halaal, <em>always.</em></h2>
    <p>All food at MiHa is strictly Halaal. For religious reasons, no alcohol is served or allowed on the premises, so our bar pours mocktails, shakes, fresh juices and coffee instead.</p>
    <p>It means everyone can sit at the same table, and nobody has to ask.</p>
  </div>
</div></section>
<section class="sec sec--line"><div class="wrap">
  <p class="eyebrow"><span class="num">04</span> The journey</p>
  <h2 class="h2">How MiHa <em>grew.</em></h2>
  <div class="timeline">
    <div class="tl" data-reveal><b>01</b><h3>Two families become one</h3><p>The Miya and Hassim families come together, and the name MiHa is born.</p></div>
    <div class="tl" data-reveal><b>02</b><h3>Melrose Arch</h3><p>MiHa opens its doors in the heart of Johannesburg's Melrose Arch.</p></div>
    <div class="tl" data-reveal><b>03</b><h3>Centurion</h3><p>A second home opens on Baard Road in Raslouw, Pretoria.</p></div>
    <div class="tl" data-reveal><b>04</b><h3>Clenergy Bakery &amp; catering</h3><p>Our own bakery, corporate catering and staff lunches bring MiHa beyond the table.</p></div>
  </div>
</div></section>
<section class="sec sec--line"><div class="wrap">
  <p class="eyebrow"><span class="num">05</span> At the table</p>
  <h2 class="h2">A taste of <em>MiHa.</em></h2>
  <div class="gallery">
    <figure class="g1" data-clip><img src="${I('imgs-23-of-118')}" alt="MiHa peri-peri prawns with savoury rice" loading="lazy"></figure>
    <figure class="g2" data-clip><img src="${I('img-157-of-163')}" alt="A meringue dessert with strawberries" loading="lazy"></figure>
    <figure class="g3" data-clip><img src="${I('imgs-41-of-118')}" alt="Penne arrabbiata" loading="lazy"></figure>
    <figure class="g4" data-clip><img src="${I('img-98-of-163')}" alt="A fresh MiHa salad" loading="lazy"></figure>
    <figure class="g5" data-clip><img src="${I('img-163-of-163')}" alt="Tiramisu" loading="lazy"></figure>
  </div>
</div></section>
${next('bar.html', 'The Bar')}
</main>
${footer()}`;

/* =========================== BAR =========================== */
const drink = (img, name, note) => `<a class="bcard" href="reserve.html#book" data-cursor="Book"><figure><img src="${I(img)}" alt="${name}" loading="lazy"></figure><div><h3>${name}</h3><p>${note}</p></div></a>`;
const bar = `${head('The Alcohol-free Bar · MiHa Eatery', 'MiHa\'s alcohol-free bar: signature mocktails, freakshakes, fresh juice and specialty coffee.', I('imgs-110-of-118'))}
${nav()}
<main id="main">
${phero({ crumb: 'The Bar', title: '<span class="line"><span>Zero proof.</span></span><span class="line"><span><em>Full flavour.</em></span></span>', lead: 'No alcohol, ever. Instead: layered mocktails, freakshakes, fresh juice and coffee, made with the same care as the kitchen.', img: 'imgs-110-of-118' })}
<section class="statement"><div class="wrap">
  <p class="eyebrow"><span class="num">01</span> The philosophy</p>
  <p class="statement__text" data-words>A great drink is about balance, colour and a little theatre. Ours just happen to be alcohol-free, so the whole table can raise a glass together.</p>
</div></section>
<section class="sec sec--line"><div class="wrap">
  <p class="eyebrow"><span class="num">02</span> Signature mocktails</p>
  <h2 class="h2">Poured with <em>colour.</em></h2>
  <div class="beyond__grid">
    ${drink('imgs-77-of-118', 'Violet berry crush', 'Berry pearls, crushed mint and a sparkling top.')}
    ${drink('imgs-62-of-118', 'Golden bloom', 'Bright citrus and a golden floral garnish.')}
    ${drink('imgs-113-of-118', 'Pineapple sunset', 'Tropical juice crowned with dried pineapple.')}
    ${drink('img-103-of-163', 'Blue lagoon', 'Electric blue, lemon twist, fresh mint.')}
    ${drink('img-107-of-163', 'Strawberry lemonade', 'Muddled strawberry, lemon and ice.')}
    ${drink('imgs-67-of-118', 'Mint cooler', 'Lime, mint and soda, as cold as it gets.')}
  </div>
</div></section>
<section class="bleed" aria-label="A carafe of MiHa mocktail">
  <figure class="bleed__img"><img src="${I('imgs-99-of-118')}" alt="A carafe of violet mocktail" loading="lazy"></figure>
  <p class="bleed__quote wrap"><span>Raise a glass,</span><span><em>everyone.</em></span></p>
</section>
<section class="sec"><div class="wrap">
  <p class="eyebrow"><span class="num">03</span> Shakes &amp; coffee</p>
  <h2 class="h2">Sweet, cold <em>&amp; strong.</em></h2>
  <div class="beyond__grid">
    ${drink('imgs-84-of-118', 'Chocolate freakshake', 'Piled with cream, cookies and sauce.')}
    ${drink('img-131-of-163', 'Caramel freakshake', 'Caramel drizzle and whipped cream.')}
    ${drink('img-127-of-163', 'Flat white', 'Silky milk, latte art, every time.')}
  </div>
</div></section>
${next('catering.html', 'Catering')}
</main>
${footer()}`;

/* =========================== CATERING =========================== */
const catering = `${head('Corporate Catering & Staff Lunches · MiHa Eatery', 'Strictly Halaal corporate catering and staff lunches from MiHa: boardroom meetings, functions and daily team meals.', I('imgs-35-of-118'))}
${nav()}
<main id="main">
${phero({ crumb: 'Catering', title: '<span class="line"><span>MiHa,</span></span><span class="line"><span><em>at the office.</em></span></span>', lead: 'Boardroom lunches, special events and daily staff meals, all strictly Halaal and made in our own kitchens.', img: 'imgs-35-of-118', cta: '<a class="btn btn--gold btn--lg mag" href="#enquire"><span>Request a quote</span></a>' })}
<section class="sec"><div class="wrap split">
  <figure class="split__img" data-clip><img src="${I('imgs-33-of-118')}" alt="A MiHa chicken platter with rice and chips" loading="lazy"></figure>
  <div class="split__txt">
    <p class="eyebrow"><span class="num">01</span> Corporate catering</p>
    <h2 class="h2">Your meeting, <em>catered.</em></h2>
    <p>From breakfast meetings to year-end functions, MiHa takes care of the food so you can focus on the room. Platters, plated meals or a full spread.</p>
    <p><a class="link-arrow" href="https://www.miha.co.za/corporate-catering/" target="_blank" rel="noopener">View the catering brochure ↗</a></p>
  </div>
</div></section>
<section class="sec sec--line"><div class="wrap split split--rev">
  <figure class="split__img" data-clip><img src="${I('imgs-56-of-118')}" alt="A MiHa chicken wrap" loading="lazy"></figure>
  <div class="split__txt">
    <p class="eyebrow"><span class="num">02</span> Staff lunches</p>
    <h2 class="h2">Feed the <em>whole team.</em></h2>
    <p>Daily or weekly lunches for your staff: pastas, wraps, gourmet burgers, salads and more, delivered to the office. Choose the model that suits your company.</p>
    <p><a class="link-arrow" href="https://www.miha.co.za/staff-lunches/" target="_blank" rel="noopener">See staff lunch options ↗</a></p>
  </div>
</div></section>
<section class="sec sec--line"><div class="wrap">
  <p class="eyebrow"><span class="num">03</span> How it works</p>
  <h2 class="h2">Three steps to <em>lunch.</em></h2>
  <div class="steps">
    <div class="step" data-reveal><b>01</b><h3>Tell us</h3><p>Date, headcount, budget and any dietary needs.</p></div>
    <div class="step" data-reveal><b>02</b><h3>We tailor</h3><p>A Halaal menu built for your team and your event.</p></div>
    <div class="step" data-reveal><b>03</b><h3>We deliver</h3><p>Fresh from our kitchen to your table, on time.</p></div>
  </div>
</div></section>
<section class="sec sec--line" id="enquire"><div class="wrap split">
  <div class="split__txt split__txt--form">
    <p class="eyebrow"><span class="num">04</span> Enquire</p>
    <h2 class="h2">Let's plan <em>your menu.</em></h2>
    <p>Send us the details and the MiHa team will come back to you with a tailored quote.</p>
  </div>
  <form class="form split__form" data-mailto="yasin@miha.co.za" data-subject="Catering enquiry">
    <div class="field"><label for="c-name">Name</label><input id="c-name" name="name" required autocomplete="name"></div>
    <div class="field"><label for="c-company">Company</label><input id="c-company" name="company" autocomplete="organization"></div>
    <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" required autocomplete="email"></div>
    <div class="field"><label for="c-phone">Phone</label><input id="c-phone" name="phone" type="tel" autocomplete="tel"></div>
    <div class="field"><label for="c-type">What do you need?</label><select id="c-type" name="type"><option>Corporate catering</option><option>Staff lunches</option><option>Special event</option></select></div>
    <div class="field"><label for="c-guests">Number of guests</label><input id="c-guests" name="guests" type="number" min="1"></div>
    <div class="field field--full"><label for="c-msg">Tell us more</label><textarea id="c-msg" name="message"></textarea></div>
    <p class="form__note">Sending opens your email app with these details addressed to MiHa.</p>
    <p><button class="btn btn--gold btn--lg mag" type="submit"><span>Send enquiry</span></button></p>
    <p class="form__ok" hidden>Thank you. Your email app should now be open with your enquiry ready to send.</p>
  </form>
</div></section>
${next('bakery.html', 'Clenergy Bakery')}
</main>
${footer()}`;

/* =========================== BAKERY =========================== */
const bakery = `${head('Clenergy Bakery · MiHa Eatery', 'Clenergy Bakery: MiHa\'s in-house bakery for breads, pastries, desserts and celebration cakes.', I('img-141-of-163'))}
${nav()}
<main id="main">
${phero({ crumb: 'Clenergy Bakery', title: '<span class="line"><span>Baked</span></span><span class="line"><span><em>in-house.</em></span></span>', lead: 'Clenergy Bakery is MiHa\'s own bakery: breads, pastries, desserts and celebration cakes, made fresh every day.', img: 'img-141-of-163' })}
<section class="statement"><div class="wrap">
  <p class="eyebrow"><span class="num">01</span> The bakery</p>
  <p class="statement__text" data-words>Every loaf, pastry and dessert on the MiHa table starts in our own ovens. Proper butter, patient dough and nothing rushed.</p>
</div></section>
<section class="sec sec--line"><div class="wrap">
  <p class="eyebrow"><span class="num">02</span> From the ovens</p>
  <h2 class="h2">Sweet <em>&amp;</em> savoury.</h2>
  <div class="gallery">
    <figure class="g1" data-clip><img src="${I('Clenergy-Breads-3-1')}" alt="Clenergy Bakery breads" loading="lazy"></figure>
    <figure class="g2" data-clip><img src="${I('img-142-of-163')}" alt="Caramel crunch cheesecake" loading="lazy"></figure>
    <figure class="g3" data-clip><img src="${I('Clenergy-Breads-3-3')}" alt="Freshly baked bread" loading="lazy"></figure>
    <figure class="g4" data-clip><img src="${I('img-138-of-163')}" alt="Chocolate fondant" loading="lazy"></figure>
    <figure class="g5" data-clip><img src="${I('img-144-of-163')}" alt="Waffles with white chocolate and strawberries" loading="lazy"></figure>
  </div>
</div></section>
<section class="sec sec--line"><div class="wrap split">
  <figure class="split__img" data-clip><img src="${I('img-160-of-163')}" alt="A slice of MiHa tiramisu" loading="lazy"></figure>
  <div class="split__txt">
    <p class="eyebrow"><span class="num">03</span> Celebration cakes</p>
    <h2 class="h2">For the <em>big</em> days.</h2>
    <p>Birthdays, engagements, Eid and everything in between. Tell us the occasion and Clenergy Bakery will make it memorable.</p>
    <p><a class="btn btn--gold mag" href="mailto:yasin@miha.co.za?subject=Celebration%20cake%20order"><span>Order a cake</span></a></p>
  </div>
</div></section>
${next('reserve.html', 'Reserve a table')}
</main>
${footer()}`;

/* =========================== RESERVE =========================== */
const reserve = `${head('Reserve a Table · MiHa Eatery', 'Book a table at MiHa Melrose Arch or MiHa Centurion. Trading hours, directions and contact details.', I('g-tart'))}
${nav()}
<main id="main">
${phero({ crumb: 'Reserve', title: '<span class="line"><span>Choose</span></span><span class="line"><span><em>your MiHa.</em></span></span>', lead: 'Five quick steps: choose your branch, pick a time, tell us who is coming and confirm.', img: 'g-tart' })}
${readFileSync(new URL('parts/booking-form.html', import.meta.url),'utf8')}
${branches()}
<section class="sec sec--line"><div class="wrap split">
  <div class="split__txt split__txt--form">
    <p class="eyebrow"><span class="num">—</span> Private dining</p>
    <h2 class="h2">Celebrations <em>&amp;</em> large groups.</h2>
    <p>Birthdays, family gatherings and corporate dinners. Tell us what you have in mind.</p>
  </div>
  <form class="form split__form" data-mailto="yasin@miha.co.za" data-subject="Group booking">
    <div class="field"><label for="r-name">Name</label><input id="r-name" name="name" required autocomplete="name"></div>
    <div class="field"><label for="r-email">Email</label><input id="r-email" name="email" type="email" required autocomplete="email"></div>
    <div class="field"><label for="r-branch">Branch</label><select id="r-branch" name="branch"><option>Melrose Arch</option><option>Centurion</option></select></div>
    <div class="field"><label for="r-date">Date</label><input id="r-date" name="date" type="date"></div>
    <div class="field"><label for="r-guests">Guests</label><input id="r-guests" name="guests" type="number" min="1"></div>
    <div class="field"><label for="r-phone">Phone</label><input id="r-phone" name="phone" type="tel" autocomplete="tel"></div>
    <div class="field field--full"><label for="r-msg">Occasion &amp; notes</label><textarea id="r-msg" name="message"></textarea></div>
    <p class="form__note">Sending opens your email app with these details addressed to MiHa.</p>
    <p><button class="btn btn--gold btn--lg mag" type="submit"><span>Send request</span></button></p>
    <p class="form__ok" hidden>Thank you. Your email app should now be open with your request ready to send.</p>
  </form>
</div></section>
${next('menu.html', 'See the Menu')}
</main>
${footer()}`;

const out = { 'index.html': home, 'menu.html': menu, 'whats-on.html': whatson, 'events.html': events, 'story.html': story, 'bar.html': bar, 'catering.html': catering, 'bakery.html': bakery, 'reserve.html': reserve };
for (const [f, html] of Object.entries(out)) writeFileSync(new URL(f, import.meta.url), html);

// list of MiHa images the pages use
const used = [...new Set(Object.values(out).join('').match(/img\/miha\/[^"']+\.jpg/g))].map(s => s.slice(9, -4));
writeFileSync(new URL('img/miha/used.txt', import.meta.url), used.join('\n'));
console.log('built', Object.keys(out).length, 'pages ·', used.length, 'MiHa photos');
