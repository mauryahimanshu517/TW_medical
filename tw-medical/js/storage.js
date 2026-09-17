/* =========================================================
   TW Medical — localStorage persistence (cart, wishlist, recent)
   ========================================================= */
const Store = (() => {
  const KEYS = { cart: 'tw_cart', wishlist: 'tw_wishlist', recent: 'tw_recent', pincode: 'tw_pincode' };
  const RECENT_LIMIT = 12;

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { /* storage unavailable — demo keeps working in-memory for this page */ }
    document.dispatchEvent(new CustomEvent('tw:storage', { detail: { key } }));
  }

  /* ---------- Cart ---------- */
  // Items are keyed by product id + variant so different sizes are separate lines.
  const cartKey = (id, variant) => `${id}::${variant || ''}`;

  function getCart() {
    return read(KEYS.cart, []).filter(item => twGetProduct(item.id));
  }

  function addToCart(id, qty = 1, variant = '') {
    const cart = getCart();
    const product = twGetProduct(id);
    const v = variant || (product && product.variants[0]) || '';
    const key = cartKey(id, v);
    const existing = cart.find(i => i.key === key);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else cart.push({ key, id: Number(id), variant: v, qty });
    write(KEYS.cart, cart);
  }

  function setQty(key, qty) {
    const cart = getCart();
    const item = cart.find(i => i.key === key);
    if (!item) return;
    item.qty = Math.max(1, Math.min(99, qty));
    write(KEYS.cart, cart);
  }

  function removeFromCart(key) {
    write(KEYS.cart, getCart().filter(i => i.key !== key));
  }

  function cartCount() {
    return getCart().reduce((sum, i) => sum + i.qty, 0);
  }

  /* ---------- Wishlist ---------- */
  function getWishlist() {
    return read(KEYS.wishlist, []).filter(id => twGetProduct(id));
  }

  function inWishlist(id) {
    return getWishlist().includes(Number(id));
  }

  /** Toggles a product; returns true if it is now in the wishlist. */
  function toggleWishlist(id) {
    id = Number(id);
    const list = getWishlist();
    const idx = list.indexOf(id);
    if (idx > -1) list.splice(idx, 1);
    else list.unshift(id);
    write(KEYS.wishlist, list);
    return idx === -1;
  }

  function removeFromWishlist(id) {
    write(KEYS.wishlist, getWishlist().filter(x => x !== Number(id)));
  }

  /* ---------- Recently viewed ---------- */
  function getRecent() {
    return read(KEYS.recent, []).filter(id => twGetProduct(id));
  }

  function addRecent(id) {
    id = Number(id);
    const list = getRecent().filter(x => x !== id);
    list.unshift(id);
    write(KEYS.recent, list.slice(0, RECENT_LIMIT));
  }

  function clearRecent() {
    write(KEYS.recent, []);
  }

  /* ---------- Pincode ---------- */
  const getPincode = () => read(KEYS.pincode, '');
  const setPincode = (pin) => write(KEYS.pincode, pin);

  return {
    getCart, addToCart, setQty, removeFromCart, cartCount,
    getWishlist, inWishlist, toggleWishlist, removeFromWishlist,
    getRecent, addRecent, clearRecent,
    getPincode, setPincode
  };
})();
