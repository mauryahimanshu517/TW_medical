/* =========================================================
   TW Medical — Wishlist
   ========================================================= */

function renderWishlist() {
  const grid = $('#wishGrid');
  const ids = Store.getWishlist();
  $('#wishCountTitle').textContent = ids.length ? `(${ids.length})` : '';
  $('#moveAll').hidden = !ids.length;

  if (!ids.length) {
    grid.style.display = 'block';
    grid.innerHTML = emptyState({
      icon: 'fa-heart',
      title: 'Your wishlist is empty',
      text: 'Save products you like by tapping the heart icon — they’ll be waiting for you here.',
      cta: '<a class="btn btn-primary" href="products.html">Explore Products</a>'
    });
    return;
  }
  grid.style.display = '';
  grid.innerHTML = ids.map(id => productCard(twGetProduct(id), { wishlist: true })).join('');
}

$('#wishGrid').addEventListener('click', (e) => {
  const move = e.target.closest('[data-move]');
  const remove = e.target.closest('[data-unwish]');
  if (move) {
    const p = twGetProduct(move.dataset.move);
    Store.addToCart(p.id, 1);
    Store.removeFromWishlist(p.id);
    toast(`${p.name} moved to cart`);
  } else if (remove) {
    const card = remove.closest('.p-card');
    card.style.transition = 'opacity .2s, transform .2s';
    card.style.opacity = '0';
    card.style.transform = 'scale(.96)';
    setTimeout(() => {
      Store.removeFromWishlist(remove.dataset.unwish);
      toast('Removed from wishlist', 'info');
    }, 180);
  }
});

$('#moveAll').addEventListener('click', () => {
  const ids = Store.getWishlist();
  ids.forEach(id => Store.addToCart(id, 1));
  ids.forEach(id => Store.removeFromWishlist(id));
  toast(`${ids.length} item${ids.length > 1 ? 's' : ''} moved to cart`);
});

document.addEventListener('tw:storage', (e) => {
  if (e.detail.key === 'tw_wishlist') renderWishlist();
});
window.addEventListener('storage', (e) => {
  if (e.key === 'tw_wishlist') renderWishlist();
});

/* ---------- Boot ---------- */
$('#wishGrid').innerHTML = skeletonCards(4);
setTimeout(renderWishlist, 300);

$('#wishRecoRail').innerHTML = PRODUCTS
  .slice()
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 10)
  .map(p => productCard(p)).join('');
