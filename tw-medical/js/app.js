/* =========================================================
   TW Medical — Shared app shell
   Header, live search, mega-menu, mobile drawer, footer,
   product card component, toasts, modal, WhatsApp button.
   ========================================================= */

/* ---------- Configuration ---------- */
const whatsappNumber = "YOUR_NUMBER_HERE"; // e.g. "919876543210" (country code + number, digits only)
const WHATSAPP_MESSAGE = 'Hello TW Medical, I would like to know more about your medical products.';
const TW_CONFIG = {
  freeDeliveryAbove: 499,
  deliveryCharge: 49,
  taxRate: 0.05, // GST applied on the discounted amount
  supportPhone: '+91 00000 00000',
  supportEmail: 'support@twmedical.example'
};
const POPULAR_SEARCHES = ['Bandage', 'Glucometer', 'BP Monitor', 'Gloves', 'Thermometer', 'Syringe', 'Pulse Oximeter'];

/* ---------- Utilities ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const formatINR = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const qs = (key) => new URLSearchParams(location.search).get(key);
const productURL = (id) => `product.html?id=${id}`;
const isService = (p) => p.cats.includes('doctor-consultation');

function whatsappURL(message = WHATSAPP_MESSAGE) {
  const digits = whatsappNumber.replace(/\D/g, '');
  const text = encodeURIComponent(message);
  // Without a configured number, WhatsApp lets the user choose a chat.
  return digits ? `https://wa.me/${digits}?text=${text}` : `https://wa.me/?text=${text}`;
}

function deliveryText(p) {
  if (isService(p)) return p.deliveryDays === 0 ? 'Available <b>today</b>' : `Slots from <b>${p.deliveryDate}</b>`;
  return `Get it by <b>${p.deliveryDate}</b>`;
}

function starsHTML(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) html += '<i class="fa-solid fa-star"></i>';
    else if (rating >= i - 0.5) html += '<i class="fa-solid fa-star-half-stroke"></i>';
    else html += '<i class="fa-regular fa-star"></i>';
  }
  return `<span class="stars" aria-hidden="true">${html}</span>`;
}

/* ---------- Search ---------- */
function twNormalize(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9.\s-]/g, ' ');
}
function twStem(token) {
  return token.length > 3 && token.endsWith('s') ? token.slice(0, -1) : token;
}

/** Returns products matching every search token, best matches first. */
function twSearch(query) {
  const tokens = twNormalize(query).split(/\s+/).filter(Boolean).map(twStem);
  if (!tokens.length) return [];
  const results = [];
  PRODUCTS.forEach(p => {
    const name = twNormalize(p.name);
    const catNames = p.cats.map(s => (twCategory(s) || {}).name || '').join(' ');
    const hay = twNormalize([p.name, p.brand, p.category, p.subCategory, p.description, p.type, catNames, p.variants.join(' ')].join(' '));
    let score = 0;
    for (const t of tokens) {
      if (!hay.includes(t)) return;
      if (name.startsWith(t)) score += 6;
      else if (name.includes(t)) score += 4;
      else if (twNormalize(p.brand + ' ' + p.type + ' ' + p.subCategory).includes(t)) score += 2;
      else score += 1;
    }
    results.push({ p, score: score + p.rating / 10 });
  });
  return results.sort((a, b) => b.score - a.score).map(r => r.p);
}

function highlight(text, query) {
  const safe = escapeHTML(text);
  const tokens = twNormalize(query).split(/\s+/).filter(t => t.length > 1).map(twStem);
  if (!tokens.length) return safe;
  const re = new RegExp(`(${tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return safe.replace(re, '<mark>$1</mark>');
}

/* ---------- Layout: header ---------- */
function renderHeader() {
  const mount = $('#site-header');
  if (!mount) return;
  const page = document.body.dataset.page;

  const megaCols = MEGA_MENU.map(g => {
    const cat = twCategory(g.slug);
    return `
      <div class="mega-col">
        <a class="mega-title" href="products.html?category=${g.slug}">
          <span class="mega-ico" style="--c:${cat.color}"><i class="fa-solid ${cat.icon}"></i></span>${g.title}
        </a>
        <ul>${g.links.map(l => `<li><a href="products.html?category=${g.slug}&sub=${encodeURIComponent(l)}"><i class="fa-solid fa-arrow-right"></i>${l}</a></li>`).join('')}</ul>
      </div>`;
  }).join('');

  const activeCat = qs('category');
  mount.innerHTML = `
    <div class="topbar">
      <div class="container topbar-inner">
        <span><i class="fa-solid fa-truck-fast"></i> Free delivery on orders above ${formatINR(TW_CONFIG.freeDeliveryAbove)}</span>
        <span class="hide-sm"><i class="fa-solid fa-shield-halved"></i> 100% genuine products from licensed suppliers</span>
        <a href="#" data-whatsapp class="hide-sm"><i class="fa-brands fa-whatsapp"></i> Order on WhatsApp</a>
      </div>
    </div>
    <header class="site-header" id="siteHeader">
      <div class="container header-main">
        <button class="icon-btn menu-btn" id="menuBtn" aria-label="Open menu" aria-controls="drawer" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>
        <a href="index.html" class="logo" aria-label="TW Medical home">
          <span class="logo-mark" aria-hidden="true"><span>TW</span></span>
          <span class="logo-text"><span>TW <b>Medical</b></span><small>Healthcare delivered</small></span>
        </a>

        <div class="search" id="search" role="search">
          <i class="fa-solid fa-magnifying-glass search-ico" aria-hidden="true"></i>
          <input id="searchInput" type="search" autocomplete="off" spellcheck="false"
            placeholder="Search medicines, medical products, brands..."
            aria-label="Search products" aria-autocomplete="list" aria-controls="searchPanel" aria-expanded="false" value="${escapeHTML(qs('q') || '')}">
          <button class="search-clear" id="searchClear" aria-label="Clear search" hidden><i class="fa-solid fa-xmark"></i></button>
          <button class="search-go" id="searchGo" aria-label="Search"><i class="fa-solid fa-arrow-right"></i></button>
          <div class="search-panel" id="searchPanel" role="listbox" hidden></div>
        </div>

        <nav class="header-actions" aria-label="Account">
          <div class="profile">
            <button class="action" id="profileBtn" aria-haspopup="true" aria-expanded="false">
              <i class="fa-regular fa-circle-user"></i><span class="action-label">Profile</span>
            </button>
            <div class="profile-menu" id="profileMenu" hidden>
              <div class="profile-head">
                <span class="avatar"><i class="fa-solid fa-user"></i></span>
                <div><b>Hello, Guest</b><small>Welcome to TW Medical</small></div>
              </div>
              <a href="wishlist.html"><i class="fa-regular fa-heart"></i> My Wishlist</a>
              <a href="cart.html"><i class="fa-solid fa-bag-shopping"></i> My Cart</a>
              <a href="index.html#recent"><i class="fa-solid fa-clock-rotate-left"></i> Recently Viewed</a>
              <a href="products.html?category=doctor-consultation"><i class="fa-solid fa-user-doctor"></i> Consult a Doctor</a>
              <a href="index.html#support"><i class="fa-regular fa-circle-question"></i> Help Center</a>
            </div>
          </div>
          <a class="action ${page === 'wishlist' ? 'is-active' : ''}" href="wishlist.html" aria-label="Wishlist">
            <span class="ico-wrap"><i class="fa-regular fa-heart"></i><span class="badge" data-wish-count hidden>0</span></span>
            <span class="action-label">Wishlist</span>
          </a>
          <a class="action cart-action ${page === 'cart' ? 'is-active' : ''}" href="cart.html" aria-label="Cart">
            <span class="ico-wrap"><i class="fa-solid fa-cart-shopping"></i><span class="badge" data-cart-count hidden>0</span></span>
            <span class="action-label">Cart</span>
          </a>
        </nav>
      </div>

      <nav class="cat-nav" aria-label="Categories">
        <div class="container cat-nav-inner">
          <button class="cat-toggle" id="megaToggle" aria-expanded="false" aria-controls="megaMenu">
            <i class="fa-solid fa-grip"></i> Categories <i class="fa-solid fa-chevron-down caret"></i>
          </button>
          <div class="cat-scroll">
            ${CATEGORIES.map(c => `<a href="products.html?category=${c.slug}" class="${activeCat === c.slug ? 'is-active' : ''}">${c.name}</a>`).join('')}
          </div>
        </div>
        <div class="mega-menu" id="megaMenu" hidden>
          <div class="container">
            <div class="mega-grid">${megaCols}</div>
            <div class="mega-foot">
              <span><i class="fa-solid fa-circle-check"></i> Browse ${PRODUCTS.length}+ products across ${CATEGORIES.length} categories</span>
              <a href="products.html?view=categories">View all categories <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <div class="drawer-backdrop" id="drawerBackdrop" hidden></div>
    <aside class="drawer" id="drawer" aria-label="Menu" aria-hidden="true">
      <div class="drawer-head">
        <a href="index.html" class="logo"><span class="logo-mark"><span>TW</span></span><span class="logo-text"><span>TW <b>Medical</b></span></span></a>
        <button class="icon-btn" id="drawerClose" aria-label="Close menu"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="drawer-user"><span class="avatar"><i class="fa-solid fa-user"></i></span><div><b>Hello, Guest</b><small>Shop genuine healthcare products</small></div></div>
      <nav class="drawer-links">
        <a href="index.html"><i class="fa-solid fa-house"></i> Home</a>
        <a href="products.html"><i class="fa-solid fa-boxes-stacked"></i> All Products</a>
        <a href="products.html?view=brands"><i class="fa-solid fa-tags"></i> Brands</a>
        <a href="wishlist.html"><i class="fa-regular fa-heart"></i> Wishlist</a>
        <a href="cart.html"><i class="fa-solid fa-cart-shopping"></i> Cart</a>
        <a href="products.html?category=doctor-consultation"><i class="fa-solid fa-user-doctor"></i> Consult a Doctor</a>
      </nav>
      <p class="drawer-label">Shop by Category</p>
      <nav class="drawer-cats">
        ${CATEGORIES.map(c => `<a href="products.html?category=${c.slug}"><span class="mega-ico" style="--c:${c.color}"><i class="fa-solid ${c.icon}"></i></span>${c.name}<i class="fa-solid fa-chevron-right"></i></a>`).join('')}
      </nav>
      <a href="#" class="btn btn-whatsapp btn-block" data-whatsapp><i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp</a>
    </aside>`;

  initSearch();
  initMegaMenu();
  initProfile();
  initDrawer();
}

function initMegaMenu() {
  const btn = $('#megaToggle');
  const menu = $('#megaMenu');
  const setOpen = (open) => {
    btn.setAttribute('aria-expanded', open);
    btn.classList.toggle('is-open', open);
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
    } else {
      menu.classList.remove('is-open');
      setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 200);
    }
  };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(btn.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && btn.getAttribute('aria-expanded') === 'true') setOpen(false);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

function initProfile() {
  const btn = $('#profileBtn');
  const menu = $('#profileMenu');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.hidden = !menu.hidden;
    btn.setAttribute('aria-expanded', !menu.hidden);
  });
  document.addEventListener('click', (e) => {
    if (!menu.hidden && !menu.contains(e.target)) {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

function initDrawer() {
  const drawer = $('#drawer');
  const backdrop = $('#drawerBackdrop');
  const btn = $('#menuBtn');
  const setOpen = (open) => {
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', !open);
    btn.setAttribute('aria-expanded', open);
    backdrop.hidden = !open;
    document.body.classList.toggle('no-scroll', open);
  };
  btn.addEventListener('click', () => setOpen(true));
  $('#drawerClose').addEventListener('click', () => setOpen(false));
  backdrop.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

function initSearch() {
  const input = $('#searchInput');
  const panel = $('#searchPanel');
  const clear = $('#searchClear');
  let activeIndex = -1;

  const open = () => { panel.hidden = false; input.setAttribute('aria-expanded', 'true'); $('#search').classList.add('is-open'); };
  const close = () => { panel.hidden = true; input.setAttribute('aria-expanded', 'false'); $('#search').classList.remove('is-open'); activeIndex = -1; };
  const goToResults = (q) => { if (q.trim()) location.href = `products.html?q=${encodeURIComponent(q.trim())}`; };

  function renderPanel() {
    const q = input.value.trim();
    clear.hidden = !q;
    activeIndex = -1;

    if (!q) {
      const recent = Store.getRecent().slice(0, 3).map(twGetProduct);
      panel.innerHTML = `
        <div class="sp-section">
          <p class="sp-label">Popular searches</p>
          <div class="chips">${POPULAR_SEARCHES.map(s => `<button class="chip" data-term="${s}"><i class="fa-solid fa-arrow-trend-up"></i>${s}</button>`).join('')}</div>
        </div>
        ${recent.length ? `<div class="sp-section"><p class="sp-label">Recently viewed</p>${recent.map(p => resultRow(p, '')).join('')}</div>` : ''}`;
      open();
      return;
    }

    const results = twSearch(q);
    const cats = CATEGORIES.filter(c => twNormalize(c.name + ' ' + c.subs.join(' ')).includes(twStem(twNormalize(q))));

    if (!results.length) {
      panel.innerHTML = `
        <div class="sp-empty">
          <span class="empty-ico"><i class="fa-solid fa-magnifying-glass"></i></span>
          <b>No products found for “${escapeHTML(q)}”</b>
          <p>Check the spelling or try a more general term.</p>
          <div class="chips">${POPULAR_SEARCHES.slice(0, 4).map(s => `<button class="chip" data-term="${s}">${s}</button>`).join('')}</div>
        </div>`;
      open();
      return;
    }

    panel.innerHTML = `
      ${cats.length ? `<div class="sp-section sp-cats">${cats.slice(0, 3).map(c => `<a class="chip chip-cat" href="products.html?category=${c.slug}"><i class="fa-solid ${c.icon}"></i>in ${c.name}</a>`).join('')}</div>` : ''}
      <div class="sp-section">
        <p class="sp-label">${results.length} product${results.length > 1 ? 's' : ''} for “${escapeHTML(q)}”</p>
        ${results.slice(0, 7).map(p => resultRow(p, q)).join('')}
      </div>
      <a class="sp-all" href="products.html?q=${encodeURIComponent(q)}">View all results <i class="fa-solid fa-arrow-right"></i></a>`;
    open();
  }

  function resultRow(p, q) {
    return `
      <a class="sp-item" role="option" href="${productURL(p.id)}">
        <img src="${p.images[0]}" alt="" width="48" height="48">
        <span class="sp-text">
          <span class="sp-name">${highlight(p.name, q)}</span>
          <span class="sp-meta">${escapeHTML(p.brand)} · ${escapeHTML(p.subCategory)}</span>
        </span>
        <span class="sp-price">${formatINR(p.price)}<s>${formatINR(p.mrp)}</s></span>
      </a>`;
  }

  input.addEventListener('input', renderPanel);
  input.addEventListener('focus', renderPanel);
  input.addEventListener('keydown', (e) => {
    const items = $$('.sp-item, .sp-all', panel);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (panel.hidden) renderPanel();
      activeIndex = e.key === 'ArrowDown' ? Math.min(activeIndex + 1, items.length - 1) : Math.max(activeIndex - 1, -1);
      items.forEach((el, i) => el.classList.toggle('is-active', i === activeIndex));
      if (items[activeIndex]) items[activeIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex > -1 && items[activeIndex]) location.href = items[activeIndex].href;
      else goToResults(input.value);
    } else if (e.key === 'Escape') {
      close();
      input.blur();
    }
  });

  panel.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-term]');
    if (chip) {
      input.value = chip.dataset.term;
      input.focus();
      renderPanel();
    }
  });
  clear.addEventListener('click', () => { input.value = ''; input.focus(); renderPanel(); });
  $('#searchGo').addEventListener('click', () => goToResults(input.value));
  document.addEventListener('click', (e) => { if (!$('#search').contains(e.target)) close(); });
  clear.hidden = !input.value;
}

/* ---------- Layout: footer, floating buttons ---------- */
function renderFooter() {
  const mount = $('#site-footer');
  if (!mount) return;
  const year = 2026;
  mount.innerHTML = `
    <section class="newsletter">
      <div class="container newsletter-inner">
        <div>
          <h3>Get health tips & exclusive offers</h3>
          <p>Join 50,000+ customers who receive our weekly healthcare newsletter.</p>
        </div>
        <form class="newsletter-form" id="newsletterForm" novalidate>
          <label class="sr-only" for="newsletterEmail">Email address</label>
          <input id="newsletterEmail" type="email" placeholder="Enter your email address" required>
          <button class="btn btn-primary" type="submit">Subscribe</button>
        </form>
      </div>
    </section>
    <footer class="site-footer" id="contact">
      <div class="container footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="logo logo-light"><span class="logo-mark"><span>TW</span></span><span class="logo-text"><span>TW <b>Medical</b></span><small>Healthcare delivered</small></span></a>
          <p>TW Medical is a trusted online store for genuine medicines, surgical supplies and medical devices — sourced from licensed distributors and delivered across India.</p>
          <ul class="footer-contact">
            <li><i class="fa-solid fa-phone"></i> ${TW_CONFIG.supportPhone}</li>
            <li><i class="fa-regular fa-envelope"></i> ${TW_CONFIG.supportEmail}</li>
            <li><i class="fa-regular fa-clock"></i> Mon–Sat, 9:00 AM – 8:00 PM</li>
          </ul>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="index.html#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="products.html">Products</a></li>
            <li><a href="products.html?view=brands">Brands</a></li>
          </ul>
        </div>
        <div>
          <h4>Categories</h4>
          <ul>
            <li><a href="products.html?category=medicines">Medicines</a></li>
            <li><a href="products.html?category=diabetes-care">Diabetes Care</a></li>
            <li><a href="products.html?category=surgical-supplies">Surgical Supplies</a></li>
            <li><a href="products.html?category=medical-devices">Medical Devices</a></li>
            <li><a href="products.html?category=first-aid">First Aid</a></li>
          </ul>
        </div>
        <div>
          <h4>Customer Support</h4>
          <ul>
            <li><a href="index.html#support">Help Center</a></li>
            <li><a href="index.html#faq-shipping">Shipping</a></li>
            <li><a href="index.html#faq-returns">Returns</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4>Follow Us</h4>
          <div class="socials">
            <a href="#" data-whatsapp aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
          </div>
          <h4 class="mt">We Accept</h4>
          <div class="payments">
            <span><i class="fa-brands fa-cc-visa"></i></span><span><i class="fa-brands fa-cc-mastercard"></i></span>
            <span class="upi">UPI</span><span class="upi">COD</span>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container footer-bottom-inner">
          <span>© ${year} TW Medical. All Rights Reserved.</span>
          <span class="muted">Demo storefront · Prices and availability are illustrative.</span>
        </div>
      </div>
    </footer>

    <a class="whatsapp-float" href="#" data-whatsapp aria-label="Chat with TW Medical on WhatsApp">
      <i class="fa-brands fa-whatsapp"></i><span class="wa-tip">Chat with us</span>
    </a>
    <button class="to-top" id="toTop" aria-label="Back to top" hidden><i class="fa-solid fa-arrow-up"></i></button>
    <div class="toast-stack" id="toastStack" aria-live="polite" aria-atomic="false"></div>`;

  $$('[data-whatsapp]').forEach(a => {
    a.href = whatsappURL();
    a.target = '_blank';
    a.rel = 'noopener';
  });

  $('#newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#newsletterEmail');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      email.classList.add('is-invalid');
      toast('Please enter a valid email address', 'error');
      return;
    }
    email.classList.remove('is-invalid');
    email.value = '';
    toast('Subscribed! Watch your inbox for offers.');
  });

  const toTop = $('#toTop');
  window.addEventListener('scroll', () => {
    toTop.hidden = window.scrollY < 600;
    const header = $('#siteHeader');
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 10);
  }, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Toasts & modal ---------- */
function toast(message, type = 'success') {
  const stack = $('#toastStack');
  if (!stack) return;
  const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info', wish: 'fa-heart' };
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<i class="fa-solid ${icons[type] || icons.success}"></i><span>${escapeHTML(message)}</span>`;
  stack.appendChild(el);
  requestAnimationFrame(() => el.classList.add('is-in'));
  setTimeout(() => {
    el.classList.remove('is-in');
    setTimeout(() => el.remove(), 300);
  }, 2600);
  while (stack.children.length > 3) stack.firstElementChild.remove();
}

function showModal({ icon = 'fa-circle-info', title, message, actions = '' }) {
  const wrap = document.createElement('div');
  wrap.className = 'modal-backdrop';
  wrap.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <button class="icon-btn modal-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
      <span class="modal-ico"><i class="fa-solid ${icon}"></i></span>
      <h3 id="modalTitle">${title}</h3>
      <p>${message}</p>
      <div class="modal-actions">${actions || '<button class="btn btn-primary" data-close>Got it</button>'}</div>
    </div>`;
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add('is-in'));
  const close = () => { wrap.classList.remove('is-in'); setTimeout(() => wrap.remove(), 200); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  wrap.addEventListener('click', (e) => { if (e.target === wrap || e.target.closest('.modal-close, [data-close]')) close(); });
  document.addEventListener('keydown', onKey);
  $('[data-close], .modal-close', wrap).focus();
}

/* ---------- Product card component ---------- */
function productCard(p, opts = {}) {
  const wished = Store.inWishlist(p.id);
  const badge = p.badge && !/OFF$/.test(p.badge) ? p.badge : '';
  const actions = opts.wishlist
    ? `<div class="p-actions">
         <button class="btn btn-primary btn-sm" data-move="${p.id}"><i class="fa-solid fa-cart-plus"></i> Move to Cart</button>
         <button class="btn btn-ghost btn-sm" data-unwish="${p.id}" aria-label="Remove ${escapeHTML(p.name)} from wishlist"><i class="fa-regular fa-trash-can"></i></button>
       </div>`
    : `<button class="btn btn-cart" data-add="${p.id}"><i class="fa-solid fa-cart-plus"></i><span>${isService(p) ? 'Book Now' : 'Add to Cart'}</span></button>`;

  return `
    <article class="p-card" data-id="${p.id}">
      <div class="p-top">
        ${p.discount > 0 ? `<span class="p-off">${p.discount}% OFF</span>` : ''}
        ${badge ? `<span class="p-tag">${escapeHTML(badge)}</span>` : ''}
        <button class="wish-btn ${wished ? 'is-active' : ''}" data-wish="${p.id}" aria-pressed="${wished}" aria-label="${wished ? 'Remove from' : 'Add to'} wishlist">
          <i class="${wished ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
      </div>
      <a class="p-media" href="${productURL(p.id)}" tabindex="-1" aria-hidden="true">
        <img src="${p.images[0]}" alt="${escapeHTML(p.name)}" loading="lazy" width="400" height="400">
        <img class="p-alt" src="${p.images[1]}" alt="" loading="lazy" width="400" height="400">
      </a>
      <div class="p-body">
        ${opts.seller ? `<div class="p-seller"><i class="fa-solid fa-circle-check"></i> ${escapeHTML(p.seller)}<span>Verified</span></div>` : ''}
        <div class="p-brand">${escapeHTML(p.brand)}</div>
        <a class="p-name" href="${productURL(p.id)}">${escapeHTML(p.name)}</a>
        <p class="p-desc">${escapeHTML(p.description)}</p>
        <div class="p-rating">
          <span class="rating-pill">${p.rating.toFixed(1)} <i class="fa-solid fa-star"></i></span>
          ${starsHTML(p.rating)}
          <span class="p-count">(${p.reviews.toLocaleString('en-IN')})</span>
        </div>
        <div class="p-price">
          <span class="price">${formatINR(p.price)}</span>
          <span class="mrp">MRP <s>${formatINR(p.mrp)}</s></span>
          ${p.discount > 0 ? `<span class="off">${p.discount}% OFF</span>` : ''}
        </div>
        <div class="p-delivery"><i class="fa-solid ${isService(p) ? 'fa-calendar-check' : 'fa-truck-fast'}"></i> ${deliveryText(p)}</div>
        ${actions}
      </div>
    </article>`;
}

function skeletonCards(n = 4) {
  return Array.from({ length: n }, () => `
    <div class="p-card skeleton-card" aria-hidden="true">
      <div class="sk sk-img"></div>
      <div class="p-body">
        <div class="sk sk-line w40"></div><div class="sk sk-line w90"></div><div class="sk sk-line w70"></div>
        <div class="sk sk-line w50"></div><div class="sk sk-btn"></div>
      </div>
    </div>`).join('');
}

function emptyState({ icon, title, text, cta = '' }) {
  return `
    <div class="empty-state">
      <span class="empty-ico"><i class="fa-solid ${icon}"></i></span>
      <h3>${title}</h3>
      <p>${text}</p>
      ${cta}
    </div>`;
}

/* ---------- Global interactions ---------- */
function updateBadges() {
  const cartBadge = $$('[data-cart-count]');
  const count = Store.cartCount();
  cartBadge.forEach(b => {
    const prev = Number(b.textContent);
    b.textContent = count > 99 ? '99+' : count;
    b.hidden = count === 0;
    if (count > prev) {
      b.classList.remove('bump');
      void b.offsetWidth;
      b.classList.add('bump');
    }
  });
  const wishCount = Store.getWishlist().length;
  $$('[data-wish-count]').forEach(b => { b.textContent = wishCount; b.hidden = wishCount === 0; });
}

function syncWishButtons(id) {
  const active = Store.inWishlist(id);
  $$(`[data-wish="${id}"]`).forEach(btn => {
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', active);
    btn.setAttribute('aria-label', `${active ? 'Remove from' : 'Add to'} wishlist`);
    const icon = $('i', btn);
    if (icon) icon.className = `${active ? 'fa-solid' : 'fa-regular'} fa-heart`;
    const label = $('span', btn);
    if (label) label.textContent = active ? 'Wishlisted' : 'Wishlist';
  });
}

function flashAdded(btn) {
  if (!btn || btn.classList.contains('is-added')) return;
  const label = $('span', btn);
  const original = label ? label.textContent : '';
  btn.classList.add('is-added');
  if (label) label.textContent = 'Added';
  const icon = $('i', btn);
  const iconClass = icon ? icon.className : '';
  if (icon) icon.className = 'fa-solid fa-check';
  setTimeout(() => {
    btn.classList.remove('is-added');
    if (label) label.textContent = original;
    if (icon) icon.className = iconClass;
  }, 1500);
}

function initGlobalActions() {
  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) {
      e.preventDefault();
      const p = twGetProduct(add.dataset.add);
      Store.addToCart(p.id, 1);
      flashAdded(add);
      toast(`${isService(p) ? 'Booking' : p.name} added to cart`);
      return;
    }
    const wish = e.target.closest('[data-wish]');
    if (wish) {
      e.preventDefault();
      const id = wish.dataset.wish;
      const added = Store.toggleWishlist(id);
      syncWishButtons(id);
      wish.classList.remove('pop');
      void wish.offsetWidth;
      wish.classList.add('pop');
      toast(added ? 'Added to wishlist' : 'Removed from wishlist', added ? 'wish' : 'info');
    }
  });

  document.addEventListener('tw:storage', updateBadges);
  // Keep badges in sync when another tab changes storage.
  window.addEventListener('storage', updateBadges);
}

/* Reveal-on-scroll for sections */
function initReveal(root = document) {
  const els = $$('.reveal:not(.is-visible)', root);
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

/* ---------- Boot ---------- */
document.documentElement.classList.add('js');
renderHeader();
renderFooter();
initGlobalActions();
updateBadges();
initReveal();
