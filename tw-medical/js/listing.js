/* =========================================================
   TW Medical — Product listing (category / brand / search)
   State lives in the URL query string so views are shareable.
   ========================================================= */

const PRICE_RANGES = [
  { id: 'u250', label: 'Under ₹250', min: 0, max: 250 },
  { id: '250-500', label: '₹250 – ₹500', min: 250, max: 500 },
  { id: '500-1000', label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { id: '1000-2500', label: '₹1,000 – ₹2,500', min: 1000, max: 2500 },
  { id: 'a2500', label: 'Above ₹2,500', min: 2500, max: Infinity }
];
const RATINGS = [{ id: '4.5', label: '4.5★ & above' }, { id: '4', label: '4★ & above' }];
const DISCOUNTS = [{ id: '40', label: '40% or more' }, { id: '25', label: '25% or more' }, { id: '10', label: '10% or more' }];

const state = {
  q: qs('q') || '',
  category: qs('category') || '',
  sub: qs('sub') || '',
  brands: (qs('brand') || '').split(',').filter(Boolean),
  price: qs('price') || '',
  rating: qs('rating') || '',
  discount: qs('discount') || '',
  sort: qs('sort') || 'relevance',
  view: qs('view') || ''
};

function syncURL() {
  const params = new URLSearchParams();
  if (state.view) params.set('view', state.view);
  if (state.q) params.set('q', state.q);
  if (state.category) params.set('category', state.category);
  if (state.sub) params.set('sub', state.sub);
  if (state.brands.length) params.set('brand', state.brands.join(','));
  if (state.price) params.set('price', state.price);
  if (state.rating) params.set('rating', state.rating);
  if (state.discount) params.set('discount', state.discount);
  if (state.sort !== 'relevance') params.set('sort', state.sort);
  const query = params.toString();
  history.replaceState(null, '', query ? `?${query}` : location.pathname);
}

/* ---------- Filtering ---------- */
function baseSet() {
  return state.q ? twSearch(state.q) : PRODUCTS.slice();
}

function applyFilters(list, skip = '') {
  return list.filter(p => {
    if (skip !== 'category' && state.category && !p.cats.includes(state.category)) return false;
    if (skip !== 'category' && state.sub && p.subCategory !== state.sub && !matchesSub(p, state.sub)) return false;
    if (skip !== 'brand' && state.brands.length && !state.brands.includes(p.brand)) return false;
    if (state.price) {
      const r = PRICE_RANGES.find(x => x.id === state.price);
      if (r && (p.price < r.min || p.price >= r.max)) return false;
    }
    if (state.rating && p.rating < Number(state.rating)) return false;
    if (state.discount && p.discount < Number(state.discount)) return false;
    return true;
  });
}

// Loose sub-category matching so menu links like "Bandages" also catch "Crepe Bandages".
function matchesSub(p, sub) {
  const s = twNormalize(sub).trim().split(/\s+/).map(twStem).join(' ');
  return twNormalize(p.subCategory + ' ' + p.type).includes(s);
}

function sortList(list) {
  const sorted = list.slice();
  switch (state.sort) {
    case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
    case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
    case 'rating': sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews); break;
    case 'discount': sorted.sort((a, b) => b.discount - a.discount); break;
    case 'popular': sorted.sort((a, b) => b.reviews - a.reviews); break;
    default: break; // relevance: search order or catalogue order
  }
  return sorted;
}

/* ---------- Rendering ---------- */
function renderHead(count) {
  const cat = twCategory(state.category);
  let title = 'All Products';
  let sub = `Explore ${PRODUCTS.length} genuine healthcare products`;
  const crumbs = ['<a href="index.html">Home</a>', '<a href="products.html">Products</a>'];

  if (state.view === 'brands') { title = 'All Brands'; sub = 'Shop from the most trusted names in healthcare'; }
  if (state.view === 'categories') { title = 'All Categories'; sub = 'Find products by health need'; }
  if (cat) {
    title = state.sub || cat.name;
    sub = state.sub ? `in ${cat.name}` : `Quality ${cat.name.toLowerCase()} products from trusted brands`;
    crumbs.push(state.sub ? `<a href="products.html?category=${cat.slug}">${cat.name}</a>` : `<span>${cat.name}</span>`);
    if (state.sub) crumbs.push(`<span>${escapeHTML(state.sub)}</span>`);
  }
  if (state.brands.length === 1 && !cat) {
    const b = BRANDS.find(x => x.name === state.brands[0]);
    title = `${state.brands[0]} Products`;
    sub = b ? `${b.tag} — official products` : sub;
    crumbs.push(`<span>${escapeHTML(state.brands[0])}</span>`);
  }
  if (state.q) {
    title = `Results for “${state.q}”`;
    sub = count ? `${count} matching product${count > 1 ? 's' : ''}` : 'No exact matches';
    crumbs.push(`<span>Search</span>`);
  }
  if (crumbs.length === 2) crumbs[1] = '<span>Products</span>';

  $('#breadcrumb').innerHTML = crumbs.join('<i class="fa-solid fa-chevron-right"></i>');
  $('#pageTitle').textContent = title;
  $('#pageSub').textContent = sub;
  document.title = `${title} — TW Medical`;
}

function renderExtra() {
  const box = $('#listingExtra');
  if (state.view === 'brands') {
    box.hidden = false;
    box.innerHTML = `<div class="brand-grid">${BRANDS.map(b => {
      const count = PRODUCTS.filter(p => p.brand === b.name).length;
      const initials = b.name.replace(/[^A-Za-z0-9& ]/g, '').split(/\s+/).map(w => w[0]).join('').slice(0, 2);
      return `<a class="brand-card ${state.brands.includes(b.name) ? 'is-active' : ''}" href="products.html?brand=${encodeURIComponent(b.name)}" style="--c:${b.color}">
        <span class="brand-logo">${b.name.length <= 3 ? b.name : initials}</span>
        <span class="brand-meta"><b>${b.name}</b><small>${b.tag} · ${count} items</small></span></a>`;
    }).join('')}</div>`;
  } else if (state.view === 'categories') {
    box.hidden = false;
    box.innerHTML = `<div class="cat-grid">${CATEGORIES.map(c => {
      const count = PRODUCTS.filter(p => p.cats.includes(c.slug)).length;
      return `<a class="cat-card" href="products.html?category=${c.slug}" style="--c:${c.color}">
        <div class="cat-card-body">
          <span class="cat-ico"><i class="fa-solid ${c.icon}"></i></span>
          <h3>${c.name}</h3>
          <ul>${c.subs.map(s => `<li>${s}</li>`).join('')}</ul>
          <span class="cat-link">${count} products <i class="fa-solid fa-arrow-right"></i></span>
        </div></a>`;
    }).join('')}</div>`;
  } else {
    box.hidden = true;
  }
}

function optionHTML(type, name, value, label, checked, count) {
  return `
    <label class="opt">
      <input type="${type}" name="${name}" value="${escapeHTML(value)}" ${checked ? 'checked' : ''}>
      <span>${label}</span>
      ${count !== undefined ? `<span>${count}</span>` : ''}
    </label>`;
}

function renderFilters() {
  const base = baseSet();
  const forCats = applyFilters(base, 'category');
  const forBrands = applyFilters(base, 'brand');
  const cat = twCategory(state.category);

  const catOpts = [optionHTML('radio', 'category', '', 'All categories', !state.category)]
    .concat(CATEGORIES.map(c => {
      const n = forCats.filter(p => p.cats.includes(c.slug)).length;
      return n || state.category === c.slug ? optionHTML('radio', 'category', c.slug, c.name, state.category === c.slug, n) : '';
    })).join('');

  const subOpts = cat ? [optionHTML('radio', 'sub', '', `All ${cat.name}`, !state.sub)]
    .concat(cat.subs.map(s => {
      const n = forCats.filter(p => p.cats.includes(cat.slug) && (p.subCategory === s || matchesSub(p, s))).length;
      return optionHTML('radio', 'sub', s, s, state.sub === s, n);
    })).join('') : '';

  const brandOpts = BRANDS.map(b => {
    const n = forBrands.filter(p => p.brand === b.name).length;
    return n || state.brands.includes(b.name) ? optionHTML('checkbox', 'brand', b.name, b.name, state.brands.includes(b.name), n) : '';
  }).join('');

  $('#filterGroups').innerHTML = `
    <div class="filter-group"><h4>Category</h4>${catOpts}</div>
    ${cat ? `<div class="filter-group"><h4>${cat.name}</h4>${subOpts}</div>` : ''}
    <div class="filter-group"><h4>Brand</h4>${brandOpts || '<p class="muted">No brands</p>'}</div>
    <div class="filter-group"><h4>Price</h4>${optionHTML('radio', 'price', '', 'Any price', !state.price)}${PRICE_RANGES.map(r => optionHTML('radio', 'price', r.id, r.label, state.price === r.id)).join('')}</div>
    <div class="filter-group"><h4>Customer Rating</h4>${optionHTML('radio', 'rating', '', 'Any rating', !state.rating)}${RATINGS.map(r => optionHTML('radio', 'rating', r.id, r.label, state.rating === r.id)).join('')}</div>
    <div class="filter-group"><h4>Discount</h4>${optionHTML('radio', 'discount', '', 'Any discount', !state.discount)}${DISCOUNTS.map(d => optionHTML('radio', 'discount', d.id, d.label, state.discount === d.id)).join('')}</div>`;
}

function renderActiveChips() {
  const chips = [];
  const chip = (label, key, value = '') => `<button class="chip" data-remove="${key}" data-value="${escapeHTML(value)}">${escapeHTML(label)} <i class="fa-solid fa-xmark"></i></button>`;
  if (state.q) chips.push(chip(`“${state.q}”`, 'q'));
  if (state.category) chips.push(chip(twCategory(state.category)?.name || state.category, 'category'));
  if (state.sub) chips.push(chip(state.sub, 'sub'));
  state.brands.forEach(b => chips.push(chip(b, 'brand', b)));
  if (state.price) chips.push(chip(PRICE_RANGES.find(r => r.id === state.price)?.label || '', 'price'));
  if (state.rating) chips.push(chip(`${state.rating}★ & above`, 'rating'));
  if (state.discount) chips.push(chip(`${state.discount}%+ off`, 'discount'));
  $('#activeFilters').innerHTML = chips.join('');
  $('#activeFilters').hidden = !chips.length;
}

function renderProducts() {
  const list = sortList(applyFilters(baseSet()));
  renderHead(list.length);
  $('#resultCount').innerHTML = `Showing <b>${list.length}</b> of ${PRODUCTS.length} products`;
  const grid = $('#productGrid');
  if (!list.length) {
    grid.style.display = 'block';
    grid.innerHTML = emptyState({
      icon: 'fa-magnifying-glass',
      title: 'No products found',
      text: state.q ? `We couldn't find anything for “${escapeHTML(state.q)}” with the selected filters.` : 'Try removing some filters to see more products.',
      cta: '<button class="btn btn-primary" id="resetEmpty">Clear all filters</button>'
    });
    $('#resetEmpty').addEventListener('click', clearAll);
  } else {
    grid.style.display = '';
    grid.innerHTML = list.map(p => productCard(p)).join('');
  }
}

function renderAll() {
  renderFilters();
  renderActiveChips();
  renderProducts();
  syncURL();
}

function clearAll() {
  Object.assign(state, { q: '', category: '', sub: '', brands: [], price: '', rating: '', discount: '' });
  const input = $('#searchInput');
  if (input) input.value = '';
  renderAll();
}

/* ---------- Events ---------- */
$('#filterGroups').addEventListener('change', (e) => {
  const { name, value, checked } = e.target;
  if (name === 'brand') {
    state.brands = checked ? [...state.brands, value] : state.brands.filter(b => b !== value);
  } else {
    state[name] = value;
    if (name === 'category') state.sub = '';
  }
  renderAll();
});

$('#activeFilters').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-remove]');
  if (!btn) return;
  const key = btn.dataset.remove;
  if (key === 'brand') state.brands = state.brands.filter(b => b !== btn.dataset.value);
  else {
    state[key] = '';
    if (key === 'category') state.sub = '';
    if (key === 'q' && $('#searchInput')) $('#searchInput').value = '';
  }
  renderAll();
});

$('#sortSelect').value = state.sort;
$('#sortSelect').addEventListener('change', (e) => { state.sort = e.target.value; renderAll(); });
$('#clearFilters').addEventListener('click', clearAll);

const filtersEl = $('#filters');
const filterBackdrop = $('#filterBackdrop');
function setFiltersOpen(open) {
  filtersEl.classList.toggle('is-open', open);
  filterBackdrop.hidden = !open;
  document.body.classList.toggle('no-scroll', open);
}
$('#openFilters').addEventListener('click', () => setFiltersOpen(true));
$('#closeFilters').addEventListener('click', () => setFiltersOpen(false));
$('#applyFilters').addEventListener('click', () => { setFiltersOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); });
filterBackdrop.addEventListener('click', () => setFiltersOpen(false));

/* ---------- Boot ---------- */
renderExtra();
renderFilters();
renderActiveChips();
renderHead(0);
$('#productGrid').innerHTML = skeletonCards(6);
setTimeout(renderAll, 350);
