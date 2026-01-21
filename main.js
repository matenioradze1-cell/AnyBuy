// ===== Helpers =====
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("packgo_cart")) || [];
  } catch {
    return [];
  }
// ===== Helpers & Cart =====n+function getCart() {
  try { return JSON.parse(localStorage.getItem('packgo_cart')) || []; }
  catch { return []; }
}

function saveCart(cart){
  localStorage.setItem('packgo_cart', JSON.stringify(cart));
  setCartCountUI();
}

function addToCart(item){
  const cart = getCart();
  const found = cart.find(i => i.id === item.id);
  if (found) found.qty = (found.qty || 1) + 1;
  else cart.push({...item, qty: 1});
  saveCart(cart);
}

function getCartCount(){
  return getCart().reduce((s,i) => s + (i.qty||1), 0);
}

function setCartCountUI(){
  const count = getCartCount();
  const el1 = document.getElementById('cartCount');
  const el2 = document.getElementById('cartCountMobile');
  if (el1) el1.textContent = String(count);
  if (el2) el2.textContent = String(count);
}

// ===== Header scroll effect (background change) =====
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  if (!header) return;
  if (window.scrollY > 10) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

// ===== Scroll to top =====
const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (!scrollBtn) return;
  if (window.scrollY > 400) scrollBtn.classList.add('show');
  else scrollBtn.classList.remove('show');
});
if (scrollBtn) scrollBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

// ===== Cookies banner (persist via localStorage) =====
const cookiesBanner = document.getElementById('cookiesBanner');
const cookiesAccept = document.getElementById('cookiesAccept');
function initCookies(){
  const accepted = localStorage.getItem('packgo_cookies_accepted');
  if (!accepted && cookiesBanner) cookiesBanner.classList.add('show');
  if (cookiesAccept) cookiesAccept.addEventListener('click', () => {
    localStorage.setItem('packgo_cookies_accepted', '1');
    cookiesBanner?.classList.remove('show');
  });
}

// ===== Burger / Drawer (mobile) =====
const burgerBtn = document.getElementById('burgerBtn');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerClose = document.getElementById('drawerClose');
function closeNav(){
  document.body.classList.remove('nav-open');
  burgerBtn?.classList.remove('open');
  burgerBtn?.setAttribute('aria-expanded','false');
}
function openNav(){
  document.body.classList.add('nav-open');
  burgerBtn?.classList.add('open');
  burgerBtn?.setAttribute('aria-expanded','true');
}
if (burgerBtn) burgerBtn.addEventListener('click', () => {
  if (document.body.classList.contains('nav-open')) closeNav(); else openNav();
});
if (drawerOverlay) drawerOverlay.addEventListener('click', closeNav);
if (drawerClose) drawerClose.addEventListener('click', closeNav);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });

// ===== Featured products (fetch from DummyJSON) =====
const featuredGrid = document.getElementById('featuredGrid');
async function fetchFeatured(){
  if (!featuredGrid) return;
  featuredGrid.innerHTML = `<div class="featured-loading"><div class="spinner" aria-hidden="true"></div><div style="margin-left:12px">სატვირთი...</div></div>`;
  try{
    const res = await fetch('https://dummyjson.com/products?limit=8');
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    const items = data.products || [];
    if (!items.length) throw new Error('No products');

    featuredGrid.innerHTML = items.map(p => `
      <article class="card" data-id="${p.id}">
        <div class="thumb"><img src="${p.thumbnail}" alt="${escapeHtml(p.title)}"/></div>
        <div class="card-body">
          <h3 class="title">${escapeHtml(p.title)}</h3>
          <p class="muted">${escapeHtml(p.brand || '')} • ⭐ ${p.rating}</p>
          <div class="price-row">
            <div class="price">${p.price}₾</div>
            <button class="btn" data-action="add" data-id="${p.id}">კალათაში</button>
          </div>
        </div>
      </article>
    `).join('');

  }catch(err){
    featuredGrid.innerHTML = `<div class="featured-error">პროდუქტების ჩატვირთვა ვერ მოხერხდა — სცადე თავიდან.</div>`;
    console.error('Fetch featured error', err);
  }
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s]);
}

// event delegation for add to cart
if (featuredGrid) featuredGrid.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const action = btn.getAttribute('data-action');
  const id = Number(btn.getAttribute('data-id'));
  if (action === 'add'){
    // simple approach: fetch product detail then add
    try{
      btn.disabled = true;
      const r = await fetch(`https://dummyjson.com/products/${id}`);
      const p = await r.json();
      addToCart({id: p.id, title: p.title, price: p.price, thumbnail: p.thumbnail});
      btn.textContent = '✔ დამატებულია';
      setTimeout(() => btn.textContent = 'კალათაში', 1200);
    }catch(err){
      alert('ქვე-შეცდომა — სცადე თავიდან');
      console.error(err);
    }finally{ btn.disabled = false; }
  }
});

// initialize
document.addEventListener('DOMContentLoaded', () => {
  initCookies();
  fetchFeatured();
  setCartCountUI();
});

window.addEventListener('storage', setCartCountUI);
