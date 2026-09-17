/* =========================================================
   TW Medical — Product detail page
   ========================================================= */

const MAX_PACKS = 10;
const product = twGetProduct(qs('id'));

function renderNotFound() {
  $('#breadcrumb').innerHTML = '<a href="index.html">Home</a><i class="fa-solid fa-chevron-right"></i><span>Product not found</span>';
  $('#productView').innerHTML = `<div class="not-found">${emptyState({
    icon: 'fa-box-open',
    title: 'Product not found',
    text: 'The product you are looking for may have been removed or the link is incorrect.',
    cta: '<a class="btn btn-primary" href="products.html">Browse all products</a>'
  })}</div>`;
  document.title = 'Product not found — TW Medical';
}

function reviewData(p) {
  // Deterministic distribution derived from the average rating.
  const five = Math.min(88, Math.round((p.rating - 3.4) * 48));
  const four = Math.round((100 - five) * 0.55);
  const three = Math.round((100 - five - four) * 0.55);
  const two = Math.round((100 - five - four - three) * 0.5);
  const one = Math.max(0, 100 - five - four - three - two);
  return [five, four, three, two, one];
}

const SAMPLE_REVIEWS = [
  { name: 'Priya S.', city: 'Pune', rating: 5, title: 'Genuine product, quick delivery', text: 'Received well packed with a long expiry date. Exactly as described — will order again.' },
  { name: 'Rahul M.', city: 'Bengaluru', rating: 4, title: 'Good value for money', text: 'Works as expected and the price was better than my local pharmacy. Delivery was a day early.' },
  { name: 'Dr. Anita K.', city: 'Jaipur', rating: 5, title: 'Recommended for clinic use', text: 'We stock this at our clinic. Consistent quality and TW Medical support is responsive on WhatsApp.' }
];

function renderProduct(p) {
  const cat = twCategory(p.cats[0]);
  const service = isService(p);
  const dist = reviewData(p);
  const savings = p.mrp - p.price;
  const h = p.highlights;
  const specs = [
    ['Product Name', p.name],
    ['Product Code', h.productCode],
    ['Brand', p.brand],
    ['Generic Name', h.genericName],
    ['Available Colour', h.colour],
    ['Material', h.material],
    ['Net Quantity', h.netQuantity],
    ['Country of Origin', h.countryOfOrigin],
    ['Category', `${p.category} › ${p.subCategory}`],
    ['Sold by', p.seller]
  ];

  document.title = `${p.name} — TW Medical`;
  $('#breadcrumb').innerHTML = [
    '<a href="index.html">Home</a>',
    `<a href="products.html?category=${cat.slug}">${cat.name}</a>`,
    `<a href="products.html?category=${cat.slug}&sub=${encodeURIComponent(p.subCategory)}">${escapeHTML(p.subCategory)}</a>`,
    `<span>${escapeHTML(p.name)}</span>`
  ].join('<i class="fa-solid fa-chevron-right"></i>');

  $('#productView').innerHTML = `
    <div class="pd">
      <!-- Gallery -->
      <section class="gallery" aria-label="Product images" tabindex="-1">
        <div class="thumbs" id="thumbs" role="tablist">
          ${p.images.map((src, i) => `<button class="thumb ${i === 0 ? 'is-active' : ''}" role="tab" aria-selected="${i === 0}" aria-label="Image ${i + 1}" data-index="${i}"><img src="${src}" alt=""></button>`).join('')}
        </div>
        <div class="main-img" id="mainImg">
          <img id="mainImgEl" src="${p.images[0]}" alt="${escapeHTML(p.name)}">
          <button class="gal-arrow prev" id="galPrev" aria-label="Previous image"><i class="fa-solid fa-chevron-left"></i></button>
          <button class="gal-arrow next" id="galNext" aria-label="Next image"><i class="fa-solid fa-chevron-right"></i></button>
          <span class="gal-count" id="galCount">1 / ${p.images.length}</span>
          <span class="gal-hint"><i class="fa-solid fa-magnifying-glass-plus"></i> Hover to zoom</span>
        </div>
      </section>

      <!-- Info -->
      <div class="pd-info">
        <div class="card">
          <a class="pd-brand" href="products.html?brand=${encodeURIComponent(p.brand)}">Visit the ${escapeHTML(p.brand)} store <i class="fa-solid fa-arrow-right"></i></a>
          <h1 class="pd-title">${escapeHTML(p.name)}</h1>
          <p class="pd-seller">Sold by: <b>${escapeHTML(p.seller)}</b> <span class="verified"><i class="fa-solid fa-circle-check"></i> Verified Seller</span></p>
          <div class="pd-rating">
            <span class="rating-pill">${p.rating.toFixed(1)} <i class="fa-solid fa-star"></i></span>
            ${starsHTML(p.rating)}
            <a href="#reviews">${p.reviews.toLocaleString('en-IN')} Reviews</a>
          </div>
          <div class="pd-tags">
            <span class="tag">${escapeHTML(p.type)}</span>
            <span class="tag">${escapeHTML(p.subCategory)}</span>
            ${p.badge === 'Rx' ? '<span class="tag tag-rx"><i class="fa-solid fa-file-prescription"></i> Prescription required</span>' : ''}
            ${p.badge && p.badge !== 'Rx' && !/OFF$/.test(p.badge) ? `<span class="tag">${escapeHTML(p.badge)}</span>` : ''}
          </div>

          <div class="pd-price-box">
            <div class="pd-price-row">
              <span class="pd-price">${formatINR(p.price)}</span>
              <span class="pd-mrp">MRP <s>${formatINR(p.mrp)}</s></span>
              ${p.discount > 0 ? `<span class="pd-off">${p.discount}% OFF</span>` : ''}
            </div>
            <p class="pd-tax">Inclusive of all taxes · Price per ${service ? 'session' : 'pack'}</p>
            ${savings > 0 ? `<span class="pd-save"><i class="fa-solid fa-tag"></i> You save ${formatINR(savings)} on MRP</span>` : ''}
          </div>
        </div>

        <div class="card">
          ${p.variants.length ? `
            <div class="opt-block">
              <p class="opt-label">${escapeHTML(p.variantLabel || 'Select Option')} <span id="variantName">${escapeHTML(p.variants[0])}</span></p>
              <div class="variants" id="variants" role="radiogroup" aria-label="${escapeHTML(p.variantLabel || 'Options')}">
                ${p.variants.map((v, i) => `<button class="variant ${i === 0 ? 'is-active' : ''}" role="radio" aria-checked="${i === 0}" data-variant="${escapeHTML(v)}">${escapeHTML(v)}</button>`).join('')}
              </div>
            </div>
            <hr class="divider">` : ''}

          <p class="opt-label">${service ? 'Number of Sessions' : 'Select Pack'}</p>
          <div class="pack-row">
            <div class="stepper" role="group" aria-label="Pack quantity">
              <button id="packMinus" aria-label="Decrease pack quantity" disabled><i class="fa-solid fa-minus"></i></button>
              <output id="packValue" aria-live="polite">${service ? '1 Session' : 'Pack of 1'}</output>
              <button id="packPlus" aria-label="Increase pack quantity"><i class="fa-solid fa-plus"></i></button>
            </div>
            <div class="pack-total">
              <small id="packCalc">${formatINR(p.price)} × 1</small>
              <b id="packTotal">${formatINR(p.price)}</b>
            </div>
          </div>

          <hr class="divider">
          <div class="pd-buy">
            <button class="btn btn-outline" id="addToCart"><i class="fa-solid fa-cart-plus"></i> <span>${service ? 'Add Booking' : 'Add to Cart'}</span></button>
            <button class="btn btn-primary" id="buyNow"><i class="fa-solid fa-bolt"></i> ${service ? 'Book Now' : 'Buy Now'}</button>
            <button class="wish-btn ${Store.inWishlist(p.id) ? 'is-active' : ''}" data-wish="${p.id}" aria-pressed="${Store.inWishlist(p.id)}" aria-label="Add to wishlist">
              <i class="${Store.inWishlist(p.id) ? 'fa-solid' : 'fa-regular'} fa-heart"></i><span>${Store.inWishlist(p.id) ? 'Wishlisted' : 'Wishlist'}</span>
            </button>
          </div>
        </div>

        <div class="card">
          <p class="opt-label">${service ? 'Check Availability' : 'Check Delivery'}</p>
          <form class="pincode-form" id="pincodeForm" novalidate>
            <div class="input-wrap">
              <i class="fa-solid fa-location-dot"></i>
              <label class="sr-only" for="pincode">Pincode</label>
              <input id="pincode" inputmode="numeric" maxlength="6" placeholder="Enter Pincode" autocomplete="postal-code">
            </div>
            <button class="btn btn-primary" type="submit">Check</button>
          </form>
          <div id="pinResult"><p class="pin-hint">Enter a 6-digit pincode to see delivery dates and options.</p></div>
        </div>

        <div class="card">
          <ul class="trust">
            <li><i class="fa-solid fa-shield-heart"></i> 100% Genuine Products</li>
            <li><i class="fa-solid fa-truck-fast"></i> PAN India Delivery</li>
            <li><i class="fa-solid fa-lock"></i> Secure Payment</li>
            <li><i class="fa-solid fa-rotate-left"></i> 7-Day Return</li>
            <li><i class="fa-solid fa-money-bill-wave"></i> Cash on Delivery Available</li>
            <li><i class="fa-solid fa-file-invoice"></i> GST Invoice</li>
          </ul>
        </div>
      </div>
    </div>

    <section class="card section-card" style="margin-top:28px" id="highlights">
      <h3><i class="fa-solid fa-list-check"></i> Product Highlights</h3>
      <dl class="specs">
        ${specs.map(([k, v]) => `<div class="spec"><dt>${k}</dt><dd>${escapeHTML(v)}</dd></div>`).join('')}
      </dl>
    </section>

    <div class="pd-lower">
      <section class="card section-card">
        <h3><i class="fa-solid fa-circle-info"></i> About this ${service ? 'service' : 'product'}</h3>
        <p style="margin-bottom:14px;color:var(--ink-2)">${escapeHTML(p.description)}</p>
        <ul class="about-list">${p.about.map(a => `<li>${escapeHTML(a)}</li>`).join('')}</ul>
      </section>

      <section class="card section-card" id="reviews">
        <h3><i class="fa-solid fa-star"></i> Ratings & Reviews</h3>
        <div class="rating-summary">
          <div class="rating-big">
            <b>${p.rating.toFixed(1)}</b>
            ${starsHTML(p.rating)}
            <small>${p.reviews.toLocaleString('en-IN')} reviews</small>
          </div>
          <div class="bars">
            ${dist.map((pct, i) => `<div class="bar"><span>${5 - i}★</span><div><span style="width:${pct}%"></span></div><span>${pct}%</span></div>`).join('')}
          </div>
        </div>
        ${SAMPLE_REVIEWS.map(r => `
          <article class="review">
            <div class="review-head"><span class="rating-pill">${r.rating} <i class="fa-solid fa-star"></i></span><b>${r.title}</b></div>
            <p>${r.text}</p>
            <small>${r.name}, ${r.city} · <i class="fa-solid fa-circle-check" style="color:var(--accent)"></i> Verified buyer</small>
          </article>`).join('')}
      </section>
    </div>`;

  initGallery(p);
  initOptions(p);
  initPincode(p);
  renderSimilar(p);
}

/* ---------- Image gallery ---------- */
function initGallery(p) {
  let index = 0;
  const main = $('#mainImgEl');
  const box = $('#mainImg');
  const thumbs = $$('.thumb');

  function show(i) {
    index = (i + p.images.length) % p.images.length;
    main.classList.add('is-swapping');
    setTimeout(() => {
      main.src = p.images[index];
      main.classList.remove('is-swapping');
    }, 150);
    thumbs.forEach((t, k) => {
      t.classList.toggle('is-active', k === index);
      t.setAttribute('aria-selected', k === index);
    });
    thumbs[index].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    $('#galCount').textContent = `${index + 1} / ${p.images.length}`;
  }

  $('#thumbs').addEventListener('click', (e) => {
    const t = e.target.closest('.thumb');
    if (t) show(Number(t.dataset.index));
  });
  $('#galPrev').addEventListener('click', (e) => { e.stopPropagation(); show(index - 1); });
  $('#galNext').addEventListener('click', (e) => { e.stopPropagation(); show(index + 1); });
  $('.gallery').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });

  // Hover zoom (fine pointers only)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    box.addEventListener('mousemove', (e) => {
      if (e.target.closest('.gal-arrow')) { box.classList.remove('is-zoom'); return; }
      const r = box.getBoundingClientRect();
      main.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
      box.classList.add('is-zoom');
    });
    box.addEventListener('mouseleave', () => box.classList.remove('is-zoom'));
  }

  // Swipe on touch devices
  let startX = 0;
  box.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) show(dx < 0 ? index + 1 : index - 1);
  });
}

/* ---------- Variants, pack quantity & cart ---------- */
function initOptions(p) {
  const service = isService(p);
  let variant = p.variants[0] || '';
  let packs = 1;

  const variantsEl = $('#variants');
  if (variantsEl) {
    variantsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.variant');
      if (!btn) return;
      variant = btn.dataset.variant;
      $$('.variant', variantsEl).forEach(v => {
        v.classList.toggle('is-active', v === btn);
        v.setAttribute('aria-checked', v === btn);
      });
      $('#variantName').textContent = variant;
    });
  }

  function updatePack() {
    $('#packValue').textContent = service ? `${packs} Session${packs > 1 ? 's' : ''}` : `Pack of ${packs}`;
    $('#packMinus').disabled = packs <= 1;
    $('#packPlus').disabled = packs >= MAX_PACKS;
    $('#packCalc').textContent = `${formatINR(p.price)} × ${packs}`;
    const total = $('#packTotal');
    total.textContent = formatINR(p.price * packs);
    total.classList.remove('flash');
    void total.offsetWidth;
    total.classList.add('flash');
  }
  $('#packMinus').addEventListener('click', () => { if (packs > 1) { packs--; updatePack(); } });
  $('#packPlus').addEventListener('click', () => {
    if (packs < MAX_PACKS) { packs++; updatePack(); }
    else toast(`Maximum ${MAX_PACKS} packs per order`, 'info');
  });

  function add() {
    Store.addToCart(p.id, packs, variant);
    const label = [variant, service ? '' : `Pack of ${packs}`].filter(Boolean).join(' · ');
    toast(`Added to cart${label ? ` — ${label}` : ''}`);
  }
  $('#addToCart').addEventListener('click', (e) => { add(); flashAdded(e.currentTarget); });
  $('#buyNow').addEventListener('click', () => { add(); setTimeout(() => { location.href = 'cart.html'; }, 350); });
}

/* ---------- Pincode checker (frontend only) ---------- */
function initPincode(p) {
  const form = $('#pincodeForm');
  const input = $('#pincode');
  const result = $('#pinResult');
  const service = isService(p);

  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(0, 6);
    input.classList.remove('is-invalid');
  });

  function check(pin, silent = false) {
    if (!/^[1-9]\d{5}$/.test(pin)) {
      if (silent) return;
      input.classList.add('is-invalid');
      result.innerHTML = '<p class="pin-msg pin-error"><i class="fa-solid fa-circle-exclamation"></i> Please enter a valid 6-digit pincode.</p>';
      return;
    }
    Store.setPincode(pin);
    // Remote regions (e.g. North-East, J&K, islands) get slower delivery and no express.
    const remote = /^(18|19|79|744)/.test(pin);
    const standardDays = Math.max(p.deliveryDays, 2) + (remote ? 3 : 0);
    const standard = twFormatDate(twAddDays(standardDays), true);
    const express = twFormatDate(twAddDays(Math.max(1, standardDays - 2)), true);

    if (service) {
      result.innerHTML = `
        <div class="delivery-opts">
          <div class="delivery-opt"><i class="fa-solid fa-video"></i><div><b>✓ Video consultation available at ${pin}</b><span>Next slot: today, within 15 minutes</span></div></div>
          <div class="delivery-opt express"><i class="fa-solid fa-calendar-check"></i><div><b>In-clinic visits available</b><span>Earliest appointment ${twFormatDate(twAddDays(1), true)}</span></div></div>
        </div>`;
      return;
    }

    result.innerHTML = `
      <div class="delivery-opts">
        <div class="delivery-opt"><i class="fa-solid fa-circle-check"></i><div><b>✓ Standard Delivery available</b><span>Expected delivery: <strong>${standard}</strong> · ${formatINR(TW_CONFIG.deliveryCharge)} (Free above ${formatINR(TW_CONFIG.freeDeliveryAbove)})</span></div></div>
        ${remote
          ? '<div class="delivery-opt express"><i class="fa-solid fa-circle-info"></i><div><b>Express Delivery unavailable</b><span>Express is not yet serviceable for this pincode.</span></div></div>'
          : `<div class="delivery-opt express"><i class="fa-solid fa-bolt"></i><div><b>⚡ Express Delivery available</b><span>Guaranteed delivery by <strong>${express}</strong></span></div></div>`}
        <div class="delivery-opt"><i class="fa-solid fa-money-bill-wave"></i><div><b>Cash on Delivery available</b><span>Pay when your order arrives</span></div></div>
      </div>`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    check(input.value.trim());
  });

  const saved = Store.getPincode();
  if (saved) {
    input.value = saved;
    check(saved, true);
  }
}

/* ---------- Similar products ---------- */
function renderSimilar(p) {
  const similar = PRODUCTS
    .filter(x => x.id !== p.id && x.cats.some(c => p.cats.includes(c)))
    .sort((a, b) => (b.subCategory === p.subCategory) - (a.subCategory === p.subCategory) || b.rating - a.rating)
    .slice(0, 10);
  if (!similar.length) return;
  $('#similarSection').hidden = false;
  $('#similarLink').href = `products.html?category=${p.cats[0]}`;
  $('#similarRail').innerHTML = similar.map(x => productCard(x)).join('');
}

/* ---------- Boot ---------- */
if (!product) {
  renderNotFound();
} else {
  Store.addRecent(product.id);
  renderProduct(product);
}
