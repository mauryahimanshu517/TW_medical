/* =========================================================
   TW Medical — Home page
   ========================================================= */

const HERO_SLIDES = [
  {
    eyebrow: 'Quality Medical Products',
    title: 'Trusted healthcare products, delivered to your doorstep',
    text: 'Genuine medicines, devices and surgical supplies from licensed distributors.',
    cta: { label: 'Shop Now', href: 'products.html' },
    cta2: { label: 'Explore Devices', href: 'products.html?category=medical-devices' },
    bg: ['#0B4FA8', '#1273DE'],
    art: [['stethoscope', '#1F2A44', 0], ['thermometer', '#1864AB', 1], ['oximeter', '#2F9E44', 2]],
    chip: { icon: 'fa-shield-heart', text: '100% Genuine' }
  },
  {
    eyebrow: 'Diabetes Care',
    title: 'Monitor sugar levels with confidence',
    text: 'Glucometers, test strips, lancets & insulin syringes — up to 50% off.',
    cta: { label: 'Shop Diabetes Care', href: 'products.html?category=diabetes-care' },
    cta2: { label: 'Test Strips', href: 'products.html?category=diabetes-care&sub=Test%20Strips' },
    bg: ['#0A6E6E', '#12A39A'],
    art: [['glucometer', '#1C7ED6', 1], ['strips', '#1C7ED6', 0], ['lancet', '#3B8ED8', 3]],
    chip: { icon: 'fa-droplet', text: 'Up to 50% OFF' }
  },
  {
    eyebrow: 'First Aid Essentials',
    title: 'Be prepared for every scrape and sprain',
    text: 'Bandages, antiseptics, gauze and complete first-aid kits for home and travel.',
    cta: { label: 'Shop First Aid', href: 'products.html?category=first-aid' },
    cta2: { label: 'Bandages', href: 'products.html?q=bandage' },
    bg: ['#B42331', '#E0484F'],
    art: [['firstaid', '#E03131', 0], ['adhesive', '#E8B48C', 3], ['bandage', '#E7B98A', 1]],
    chip: { icon: 'fa-kit-medical', text: 'Kits from ₹699' }
  },
  {
    eyebrow: 'Blood Pressure Monitoring',
    title: 'Clinically validated BP monitors for home',
    text: 'Accurate readings with Omron & Dr. Morepen — track your heart health daily.',
    cta: { label: 'Shop BP Monitors', href: 'products.html?category=blood-pressure' },
    cta2: { label: 'View Omron', href: 'products.html?brand=Omron' },
    bg: ['#4A2FB8', '#7556E8'],
    art: [['bpmonitor', '#1864AB', 0], ['bpmonitor', '#2F9E44', 2], ['stethoscope', '#1F2A44', 4]],
    chip: { icon: 'fa-heart-pulse', text: '5-year warranty' }
  },
  {
    eyebrow: 'Doctor Consultation',
    title: 'Consult a verified doctor in 15 minutes',
    text: 'Video consultations with specialists, 24x7. Digital prescription included.',
    cta: { label: 'Consult Now', href: 'product.html?id=137' },
    cta2: { label: 'Book Appointment', href: 'product.html?id=138' },
    bg: ['#0B6F86', '#16A2B8'],
    art: [['doctor', '#1098AD', 0], ['stethoscope', '#1F2A44', 1], ['tablets', '#1C7ED6', 3]],
    chip: { icon: 'fa-user-doctor', text: 'From ₹349' }
  }
];

/* ---------- Hero carousel (infinite loop with cloned edge slides) ---------- */
function initHero() {
  const hero = $('#hero');
  const track = $('#heroTrack');
  const dots = $('#heroDots');
  const progress = $('#heroProgress');
  const INTERVAL = 5500;
  const n = HERO_SLIDES.length;

  const slideHTML = (s, i, clone = false) => `
    <div class="hero-slide" style="--h1:${s.bg[0]};--h2:${s.bg[1]}" ${clone ? 'aria-hidden="true"' : `role="group" aria-roledescription="slide" aria-label="${i + 1} of ${n}"`}>
      <div class="hero-copy">
        <span class="hero-eyebrow">${s.eyebrow}</span>
        <h2>${s.title}</h2>
        <p>${s.text}</p>
        <div class="hero-cta">
          <a class="btn btn-white btn-lg" href="${s.cta.href}" ${clone ? 'tabindex="-1"' : ''}>${s.cta.label} <i class="fa-solid fa-arrow-right"></i></a>
          <a class="btn btn-outline-white" href="${s.cta2.href}" ${clone ? 'tabindex="-1"' : ''}>${s.cta2.label}</a>
        </div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="hv-ring"></div>
        <div class="hv-card hv-main"><img src="${MedArt.single(...s.art[0])}" alt=""></div>
        <div class="hv-card hv-a"><img src="${MedArt.single(...s.art[1])}" alt=""></div>
        <div class="hv-card hv-b"><img src="${MedArt.single(...s.art[2])}" alt=""></div>
        <div class="hv-chip"><i class="fa-solid ${s.chip.icon}"></i>${s.chip.text}</div>
      </div>
    </div>`;

  track.innerHTML =
    slideHTML(HERO_SLIDES[n - 1], n - 1, true) +
    HERO_SLIDES.map((s, i) => slideHTML(s, i)).join('') +
    slideHTML(HERO_SLIDES[0], 0, true);

  dots.innerHTML = HERO_SLIDES.map((_, i) => `<button role="tab" aria-label="Go to slide ${i + 1}"></button>`).join('');

  let pos = 1; // position in track including leading clone
  let timer = null;
  let locked = false;
  let paused = false;

  function setPos(p, animate = true) {
    track.style.transition = animate ? '' : 'none';
    track.style.transform = `translateX(${-p * 100}%)`;
    pos = p;
    const real = (p - 1 + n) % n;
    $$('button', dots).forEach((d, i) => {
      d.classList.toggle('is-active', i === real);
      d.setAttribute('aria-selected', i === real);
    });
    $$('.hero-slide', track).forEach((s, i) => s.classList.toggle('is-current', i === p));
  }

  let settleTimer = null;
  function settle() {
    clearTimeout(settleTimer);
    locked = false;
    if (pos === 0) setPos(n, false);
    if (pos === n + 1) setPos(1, false);
  }

  function go(p) {
    if (locked) return;
    if (p === pos) { restart(); return; }
    locked = true;
    setPos(p);
    restart();
    // Fallback in case transitionend doesn't fire (e.g. background tab).
    settleTimer = setTimeout(settle, 1000);
  }

  track.addEventListener('transitionend', (e) => {
    if (e.target === track) settle();
  });

  function restart() {
    clearInterval(timer);
    progress.classList.remove('run');
    void progress.offsetWidth;
    if (paused) return;
    progress.style.animationDuration = INTERVAL + 'ms';
    progress.classList.add('run');
    timer = setInterval(() => go(pos + 1), INTERVAL);
  }

  $('#heroPrev').addEventListener('click', () => go(pos - 1));
  $('#heroNext').addEventListener('click', () => go(pos + 1));
  dots.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn) go($$('button', dots).indexOf(btn) + 1);
  });

  // Pause on hover (pointer devices) and when the tab is hidden.
  hero.addEventListener('mouseenter', () => { paused = true; restart(); hero.classList.add('is-paused'); });
  hero.addEventListener('mouseleave', () => { paused = false; restart(); hero.classList.remove('is-paused'); });
  document.addEventListener('visibilitychange', () => { paused = document.hidden; restart(); });

  // Touch swipe
  let startX = 0, startY = 0, dx = 0, dragging = false;
  hero.addEventListener('touchstart', (e) => {
    if (locked) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    dx = 0;
    dragging = true;
    clearInterval(timer);
    track.style.transition = 'none';
  }, { passive: true });
  hero.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    if (Math.abs(dy) > Math.abs(dx)) return;
    track.style.transform = `translateX(calc(${-pos * 100}% + ${dx}px))`;
  }, { passive: true });
  hero.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    track.style.transition = '';
    if (Math.abs(dx) > 50) go(dx < 0 ? pos + 1 : pos - 1);
    else { setPos(pos); restart(); }
  });

  hero.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(pos - 1);
    if (e.key === 'ArrowRight') go(pos + 1);
  });

  setPos(1, false);
  restart();
}

/* ---------- Category grid ---------- */
function renderCategoryGrid() {
  const featured = [
    { slug: 'diabetes-care', items: ['Glucose meters', 'Test strips', 'Insulin syringes', 'Lancets'], art: ['glucometer', '#1C7ED6'] },
    { slug: 'blood-pressure', items: ['BP monitors', 'Digital BP machines', 'Accessories'], art: ['bpmonitor', '#1864AB'] },
    { slug: 'surgical-supplies', items: ['Bandages', 'Gauze', 'Surgical tapes', 'Gloves'], art: ['gloves', '#6C8EEF'] },
    { slug: 'medical-devices', items: ['Thermometers', 'Pulse oximeters', 'Nebulizers'], art: ['oximeter', '#2F9E44'] },
    { slug: 'first-aid', items: ['Antiseptic', 'Cotton', 'Bandages', 'First-aid kits'], art: ['firstaid', '#E03131'] },
    { slug: 'doctor-consultation', title: 'Doctor Services', items: ['Book an appointment', 'Consult a doctor', 'Medicine consultation'], art: ['doctor', '#1098AD'] }
  ];
  $('#catGrid').innerHTML = featured.map((f, i) => {
    const c = twCategory(f.slug);
    const count = PRODUCTS.filter(p => p.cats.includes(f.slug)).length;
    return `
      <a class="cat-card reveal" href="products.html?category=${f.slug}" style="--c:${c.color};--d:${i * 60}ms">
        <div class="cat-card-body">
          <span class="cat-ico"><i class="fa-solid ${c.icon}"></i></span>
          <h3>${f.title || c.name}</h3>
          <ul>${f.items.map(t => `<li>${t}</li>`).join('')}</ul>
          <span class="cat-link">${count} products <i class="fa-solid fa-arrow-right"></i></span>
        </div>
        <img src="${MedArt.single(f.art[0], f.art[1], i)}" alt="" loading="lazy" width="140" height="140">
      </a>`;
  }).join('');
}

/* ---------- Brand marquee ---------- */
function renderBrands() {
  const cards = BRANDS.map(b => {
    const count = PRODUCTS.filter(p => p.brand === b.name).length;
    const initials = b.name.replace(/[^A-Za-z0-9& ]/g, '').split(/\s+/).map(w => w[0]).join('').slice(0, 2);
    return `
      <a class="brand-card" href="products.html?brand=${encodeURIComponent(b.name)}" style="--c:${b.color}">
        <span class="brand-logo">${b.name.length <= 3 ? b.name : initials}</span>
        <span class="brand-meta"><b>${b.name}</b><small>${b.tag} · ${count} items</small></span>
      </a>`;
  }).join('');
  // Two identical halves: animating -50% creates a seamless loop.
  $('#brandTrack').innerHTML = `<div class="marquee-group">${cards}</div><div class="marquee-group" aria-hidden="true">${cards.replace(/<a /g, '<a tabindex="-1" ')}</div>`;
}

/* ---------- Recently viewed ---------- */
function renderRecent() {
  const rail = $('#recentRail');
  const ids = Store.getRecent();
  $('#clearRecent').hidden = !ids.length;
  if (!ids.length) {
    rail.classList.add('is-empty');
    rail.innerHTML = emptyState({
      icon: 'fa-clock-rotate-left',
      title: 'No recently viewed products',
      text: 'Products you open will appear here so you can find them again quickly.',
      cta: '<a class="btn btn-primary" href="products.html">Start browsing</a>'
    });
    return;
  }
  rail.classList.remove('is-empty');
  rail.innerHTML = ids.map(id => productCard(twGetProduct(id))).join('');
}

/* ---------- Top rated suppliers ---------- */
function renderTopRated(seller = 'All') {
  const list = PRODUCTS
    .filter(p => !isService(p))
    .filter(p => seller === 'All' || p.seller === seller)
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    .slice(0, 8);
  $('#topRatedGrid').innerHTML = list.map(p => productCard(p, { seller: true })).join('');
}

function initSellerTabs() {
  const tabs = $('#sellerTabs');
  tabs.innerHTML = ['All', ...SELLERS].map((s, i) => `<button class="chip ${i === 0 ? 'is-active' : ''}" role="tab" aria-selected="${i === 0}" data-seller="${s}">${s === 'All' ? '<i class="fa-solid fa-award"></i>All Suppliers' : s}</button>`).join('');
  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-seller]');
    if (!btn) return;
    $$('.chip', tabs).forEach(c => { c.classList.toggle('is-active', c === btn); c.setAttribute('aria-selected', c === btn); });
    renderTopRated(btn.dataset.seller);
  });
}

/* ---------- Boot ---------- */
initHero();
renderCategoryGrid();
renderBrands();
initSellerTabs();
$('#promoImg1').src = MedArt.single('glucometer', '#1C7ED6', 0);
$('#promoImg2').src = MedArt.single('doctor', '#1098AD', 1);

// Brief skeleton state so the page feels responsive while content "loads".
$('#recentRail').innerHTML = skeletonCards(4);
$('#topRatedGrid').innerHTML = skeletonCards(4);
$('#bestRail').innerHTML = skeletonCards(4);
setTimeout(() => {
  renderRecent();
  renderTopRated();
  $('#bestRail').innerHTML = PRODUCTS
    .filter(p => p.cats.includes('medical-devices'))
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 8)
    .map(p => productCard(p)).join('');
  initReveal();
  // Honour hash links like index.html#recent once content has rendered.
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }
}, 450);

$('#clearRecent').addEventListener('click', () => {
  Store.clearRecent();
  renderRecent();
  toast('Browsing history cleared', 'info');
});

// Refresh when history changes in another tab.
window.addEventListener('storage', (e) => { if (e.key === 'tw_recent') renderRecent(); });
