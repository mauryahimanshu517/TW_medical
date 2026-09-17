/* =========================================================
   TW Medical — Shopping cart
   ========================================================= */

const COUPONS = {
  TWFIRST: { label: '10% off (max ₹150)', calc: (subtotal) => Math.min(Math.round(subtotal * 0.10), 150) },
  HEALTH50: { label: 'Flat ₹50 off on orders above ₹500', calc: (subtotal) => (subtotal >= 500 ? 50 : 0) }
};
let appliedCoupon = '';
let renderedKeys = '';

function cartLines() {
  return Store.getCart().map(item => ({ ...item, p: twGetProduct(item.id) }));
}

function calcTotals(lines) {
  const items = lines.reduce((s, l) => s + l.qty, 0);
  const mrpTotal = lines.reduce((s, l) => s + l.p.mrp * l.qty, 0);
  const discount = lines.reduce((s, l) => s + (l.p.mrp - l.p.price) * l.qty, 0);
  const subtotal = mrpTotal - discount;
  const coupon = appliedCoupon ? COUPONS[appliedCoupon].calc(subtotal) : 0;
  const taxable = subtotal - coupon;
  const onlyServices = lines.every(l => isService(l.p));
  const delivery = onlyServices || taxable >= TW_CONFIG.freeDeliveryAbove ? 0 : TW_CONFIG.deliveryCharge;
  const taxes = Math.round(taxable * TW_CONFIG.taxRate);
  const total = taxable + delivery + taxes;
  return { items, mrpTotal, discount, coupon, subtotal, taxable, delivery, taxes, total, savings: discount + coupon, onlyServices };
}

/* ---------- Rendering ---------- */
function itemHTML(l) {
  const p = l.p;
  const wished = Store.inWishlist(p.id);
  return `
    <article class="cart-item" data-key="${escapeHTML(l.key)}">
      <a class="ci-img" href="${productURL(p.id)}"><img src="${p.images[0]}" alt="${escapeHTML(p.name)}"></a>
      <div class="ci-body">
        <span class="p-brand">${escapeHTML(p.brand)}</span>
        <a class="ci-name" href="${productURL(p.id)}">${escapeHTML(p.name)}</a>
        <span class="ci-meta">${l.variant ? `${escapeHTML(p.variantLabel.replace('Select ', '') || 'Option')}: <b>${escapeHTML(l.variant)}</b> · ` : ''}Seller: <b>${escapeHTML(p.seller)}</b></span>
        <div class="ci-price">
          <span class="price">${formatINR(p.price)}</span>
          <span class="mrp">MRP <s>${formatINR(p.mrp)}</s></span>
          ${p.discount > 0 ? `<span class="off">${p.discount}% OFF</span>` : ''}
        </div>
        <span class="p-delivery"><i class="fa-solid ${isService(p) ? 'fa-calendar-check' : 'fa-truck-fast'}"></i> ${deliveryText(p)}</span>
        <div class="ci-controls">
          <div class="stepper sm" role="group" aria-label="Quantity for ${escapeHTML(p.name)}">
            <button data-dec aria-label="Decrease quantity" ${l.qty <= 1 ? 'disabled' : ''}><i class="fa-solid fa-minus"></i></button>
            <output data-qty aria-live="polite">${l.qty}</output>
            <button data-inc aria-label="Increase quantity" ${l.qty >= 99 ? 'disabled' : ''}><i class="fa-solid fa-plus"></i></button>
          </div>
          <button class="ci-link ${wished ? 'is-active' : ''}" data-wish="${p.id}" aria-pressed="${wished}"><i class="${wished ? 'fa-solid' : 'fa-regular'} fa-heart"></i><span>${wished ? 'Wishlisted' : 'Wishlist'}</span></button>
          <button class="ci-link danger" data-remove aria-label="Remove ${escapeHTML(p.name)}"><i class="fa-regular fa-trash-can"></i><span>Remove</span></button>
        </div>
      </div>
      <div class="ci-total">
        <small data-line-calc>${formatINR(p.price)} × ${l.qty}</small>
        <b data-line-total>${formatINR(p.price * l.qty)}</b>
      </div>
    </article>`;
}

function summaryHTML() {
  return `
    <aside class="summary">
      <div class="card">
        <p class="opt-label"><span style="color:var(--ink);font-weight:700"><i class="fa-solid fa-ticket" style="color:var(--primary)"></i> Apply Coupon</span></p>
        <form class="coupon" id="couponForm" novalidate>
          <label class="sr-only" for="couponInput">Coupon code</label>
          <input id="couponInput" placeholder="Enter code" autocomplete="off" value="${appliedCoupon}">
          <button class="btn btn-outline btn-sm" type="submit" id="couponBtn">${appliedCoupon ? 'Remove' : 'Apply'}</button>
        </form>
        <p class="coupon-hint" id="couponHint">${appliedCoupon ? `<i class="fa-solid fa-circle-check" style="color:var(--accent)"></i> ${COUPONS[appliedCoupon].label} applied` : 'Try <b>TWFIRST</b> or <b>HEALTH50</b>'}</p>
      </div>
      <div class="card">
        <h3>Price Details</h3>
        <div id="priceRows"></div>
        <button class="btn btn-accent btn-lg" id="proceedBtn">Proceed to Buy <i class="fa-solid fa-arrow-right"></i></button>
      </div>
      <p class="secure-note"><i class="fa-solid fa-shield-halved"></i> Safe and secure checkout · 100% genuine products</p>
    </aside>`;
}

function renderPriceRows(t) {
  $('#priceRows').innerHTML = `
    <div class="sum-row"><span>Price (${t.items} item${t.items > 1 ? 's' : ''})</span><span>${formatINR(t.mrpTotal)}</span></div>
    <div class="sum-row"><span>Discount</span><span class="green">−${formatINR(t.discount)}</span></div>
    ${t.coupon ? `<div class="sum-row"><span>Coupon (${appliedCoupon})</span><span class="green">−${formatINR(t.coupon)}</span></div>` : ''}
    <div class="sum-row"><span>Delivery Charges</span><span>${t.delivery ? formatINR(t.delivery) : `<small><s>${formatINR(TW_CONFIG.deliveryCharge)}</s></small> <span class="green">FREE</span>`}</span></div>
    <div class="sum-row"><span>Taxes <small>(GST ${Math.round(TW_CONFIG.taxRate * 100)}%)</small></span><span>${formatINR(t.taxes)}</span></div>
    <div class="sum-total"><span>Total Payable</span><span>${formatINR(t.total)}</span></div>
    ${t.savings > 0 ? `<div class="sum-save"><i class="fa-solid fa-piggy-bank"></i> You save ${formatINR(t.savings)} on this order</div>` : ''}`;

  const mobile = $('#mobileCheckout');
  if (mobile) {
    $('b', mobile).textContent = formatINR(t.total);
    $('small', mobile).textContent = t.savings > 0 ? `You save ${formatINR(t.savings)}` : 'Incl. taxes';
  }
}

function renderBanner(t) {
  const banner = $('#deliveryBanner');
  if (!banner) return;
  if (t.onlyServices) { banner.hidden = true; return; }
  banner.hidden = false;
  const remaining = TW_CONFIG.freeDeliveryAbove - t.taxable;
  if (remaining > 0) {
    banner.className = 'cart-banner warn';
    banner.innerHTML = `<i class="fa-solid fa-truck"></i><span>Add ${formatINR(remaining)} more for <b>FREE delivery</b></span><span class="meter"><span style="width:${Math.min(100, (t.taxable / TW_CONFIG.freeDeliveryAbove) * 100)}%"></span></span>`;
  } else {
    banner.className = 'cart-banner';
    banner.innerHTML = '<i class="fa-solid fa-circle-check"></i><span>Yay! Your order qualifies for <b>FREE delivery</b></span>';
  }
}

function renderCart() {
  const root = $('#cartRoot');
  const lines = cartLines();
  const keys = lines.map(l => l.key).join('|');
  const t = calcTotals(lines);
  $('#cartCountTitle').textContent = t.items ? `(${t.items} item${t.items > 1 ? 's' : ''})` : '';

  if (!lines.length) {
    renderedKeys = '';
    root.innerHTML = emptyState({
      icon: 'fa-cart-shopping',
      title: 'Your cart is empty',
      text: 'Looks like you haven’t added anything yet. Explore genuine medicines, devices and supplies.',
      cta: `<div class="modal-actions" style="margin-top:0"><a class="btn btn-primary" href="products.html">Start Shopping</a>${Store.getWishlist().length ? '<a class="btn btn-outline" href="wishlist.html"><i class="fa-regular fa-heart"></i> View Wishlist</a>' : ''}</div>`
    });
    return;
  }

  if (keys !== renderedKeys) {
    // Item set changed: full render.
    renderedKeys = keys;
    root.innerHTML = `
      <div class="cart-layout">
        <div class="cart-list">
          <div class="cart-banner" id="deliveryBanner"></div>
          ${lines.map(itemHTML).join('')}
        </div>
        ${summaryHTML()}
      </div>
      <div class="mobile-checkout" id="mobileCheckout">
        <div><b></b><small></small></div>
        <button class="btn btn-accent" data-proceed>Proceed to Buy</button>
      </div>`;
    bindSummary();
  } else {
    // Same items: update quantities and totals in place.
    lines.forEach(l => {
      const el = $(`.cart-item[data-key="${CSS.escape(l.key)}"]`);
      if (!el) return;
      $('[data-qty]', el).textContent = l.qty;
      $('[data-dec]', el).disabled = l.qty <= 1;
      $('[data-inc]', el).disabled = l.qty >= 99;
      $('[data-line-calc]', el).textContent = `${formatINR(l.p.price)} × ${l.qty}`;
      $('[data-line-total]', el).textContent = formatINR(l.p.price * l.qty);
    });
  }
  renderPriceRows(t);
  renderBanner(t);
}

function bindSummary() {
  $('#couponForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#couponInput');
    if (appliedCoupon) {
      appliedCoupon = '';
      input.value = '';
      toast('Coupon removed', 'info');
    } else {
      const code = input.value.trim().toUpperCase();
      if (!COUPONS[code]) {
        toast('Invalid coupon code', 'error');
        $('#couponHint').innerHTML = '<span style="color:var(--danger)">This code is not valid.</span> Try <b>TWFIRST</b> or <b>HEALTH50</b>';
        return;
      }
      appliedCoupon = code;
      const t = calcTotals(cartLines());
      if (!t.coupon) {
        appliedCoupon = '';
        toast('Cart value too low for this coupon', 'error');
        return;
      }
      toast(`Coupon ${code} applied — you saved ${formatINR(t.coupon)}`);
    }
    $('#couponBtn').textContent = appliedCoupon ? 'Remove' : 'Apply';
    $('#couponHint').innerHTML = appliedCoupon
      ? `<i class="fa-solid fa-circle-check" style="color:var(--accent)"></i> ${COUPONS[appliedCoupon].label} applied`
      : 'Try <b>TWFIRST</b> or <b>HEALTH50</b>';
    renderCart();
  });
}

function proceed() {
  const t = calcTotals(cartLines());
  showModal({
    icon: 'fa-bag-shopping',
    title: 'Order flow demo',
    message: `Order flow demo — payment integration will be added later.<br><br>Order total: <b>${formatINR(t.total)}</b> for ${t.items} item${t.items > 1 ? 's' : ''}.`,
    actions: `<button class="btn btn-primary" data-close>Continue Shopping</button><a class="btn btn-whatsapp" href="${whatsappURL(`Hello TW Medical, I would like to place an order worth ${formatINR(t.total)} (${t.items} items).`)}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> Order on WhatsApp</a>`
  });
}

/* ---------- Events ---------- */
$('#cartRoot').addEventListener('click', (e) => {
  if (e.target.closest('#proceedBtn, [data-proceed]')) { proceed(); return; }
  const item = e.target.closest('.cart-item');
  if (!item) return;
  const key = item.dataset.key;
  const current = Store.getCart().find(i => i.key === key);
  if (!current) return;

  if (e.target.closest('[data-inc]')) Store.setQty(key, current.qty + 1);
  else if (e.target.closest('[data-dec]')) Store.setQty(key, current.qty - 1);
  else if (e.target.closest('[data-remove]')) {
    item.classList.add('is-removing');
    setTimeout(() => {
      Store.removeFromCart(key);
      toast('Removed from cart', 'info');
    }, 220);
  }
});

document.addEventListener('tw:storage', (e) => {
  if (e.detail.key === 'tw_cart') renderCart();
});
window.addEventListener('storage', (e) => {
  if (e.key === 'tw_cart') renderCart();
});

/* ---------- Boot ---------- */
$('#cartRoot').innerHTML = `<div class="cart-layout"><div class="cart-list">${[1, 2].map(() => '<div class="cart-item"><div class="sk" style="width:100%;aspect-ratio:1"></div><div><div class="sk sk-line w70"></div><div class="sk sk-line w40"></div><div class="sk sk-line w50"></div></div></div>').join('')}</div><div class="card"><div class="sk sk-line w50"></div><div class="sk sk-line w90"></div><div class="sk sk-line w90"></div><div class="sk sk-btn"></div></div></div>`;
setTimeout(renderCart, 300);

$('#recoRail').innerHTML = PRODUCTS
  .filter(p => ['first-aid', 'surgical-supplies', 'personal-care'].some(c => p.cats.includes(c)))
  .sort((a, b) => b.reviews - a.reviews)
  .slice(0, 10)
  .map(p => productCard(p)).join('');
