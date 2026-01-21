const grid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const cartBox = document.getElementById("cartBox");

let allProducts = [];
let filtered = [];

function getCart() {
  try { return JSON.parse(localStorage.getItem("packgo_cart")) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem("packgo_cart", JSON.stringify(cart));
  // განაახლებს counter-ს main.js-დან
  window.dispatchEvent(new Event("storage"));
}
function addToCart(product) {
  const cart = getCart();
  const found = cart.find(i => i.id === product.id);
  if (found) found.qty += 1;
  else cart.push({ id: product.id, title: product.title, price: product.price, qty: 1 });
  saveCart(cart);
  renderCart();
}

function renderProducts(list) {
  if (!grid) return;
  grid.innerHTML = "";
  if (!list.length) {
    grid.innerHTML = `<p class="lead">ვერ მოიძებნა პროდუქტი.</p>`;
    return;
  }

  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb">
        <img src="${p.thumbnail}" alt="${p.title}">
      </div>
      <div class="card-body">
        <h3 class="title">${p.title}</h3>
        <p class="muted">${p.category} • ⭐ ${p.rating}</p>
        <div class="price-row">
          <span class="price">$${p.price}</span>
          <div style="display:flex; gap:10px;">
            <button class="btn primary" data-add="${p.id}">Add</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // add buttons
  grid.querySelectorAll("button[data-add]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-add"));
      const prod = allProducts.find(x => x.id === id);
      if (prod) addToCart(prod);
    });
  });
}

function applyFilters() {
  const q = (searchInput?.value || "").trim().toLowerCase();
  filtered = allProducts.filter(p => p.title.toLowerCase().includes(q));

  const mode = sortSelect?.value || "default";
  if (mode === "priceAsc") filtered.sort((a,b)=>a.price-b.price);
  if (mode === "priceDesc") filtered.sort((a,b)=>b.price-a.price);
  if (mode === "titleAZ") filtered.sort((a,b)=>a.title.localeCompare(b.title));
  if (mode === "titleZA") filtered.sort((a,b)=>b.title.localeCompare(a.title));

  renderProducts(filtered);
}

function renderCart() {
  if (!cartBox) return;
  const cart = getCart();

  if (!cart.length) {
    cartBox.innerHTML = `<p class="lead">კალათა ცარიელია.</p>`;
    return;
  }

  const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

  cartBox.innerHTML = `
    <div style="display:flex; gap:10px; flex-direction:column;">
      ${cart.map(i => `
        <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; border-bottom:1px solid rgba(255,255,255,.08); padding:10px 0;">
          <div>
            <strong>${i.title}</strong>
            <div class="muted">Qty: ${i.qty} • $${i.price}</div>
          </div>
          <div style="display:flex; gap:10px; align-items:center;">
            <button class="btn" data-dec="${i.id}">-</button>
            <button class="btn" data-inc="${i.id}">+</button>
            <button class="btn" data-del="${i.id}">Remove</button>
          </div>
        </div>
      `).join("")}

      <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-top:8px;">
        <strong>Total:</strong>
        <strong>$${total.toFixed(2)}</strong>
      </div>

      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:8px;">
        <button class="btn" id="clearCartBtn">Clear cart</button>
      </div>
    </div>
  `;

  cartBox.querySelectorAll("button[data-inc]").forEach(b => {
    b.addEventListener("click", () => {
      const id = Number(b.getAttribute("data-inc"));
      const cart = getCart();
      const item = cart.find(x=>x.id===id);
      if (item) item.qty += 1;
      saveCart(cart);
      renderCart();
    });
  });

  cartBox.querySelectorAll("button[data-dec]").forEach(b => {
    b.addEventListener("click", () => {
      const id = Number(b.getAttribute("data-dec"));
      const cart = getCart();
      const item = cart.find(x=>x.id===id);
      if (item) item.qty = Math.max(1, item.qty - 1);
      saveCart(cart);
      renderCart();
    });
  });

  cartBox.querySelectorAll("button[data-del]").forEach(b => {
    b.addEventListener("click", () => {
      const id = Number(b.getAttribute("data-del"));
      const cart = getCart().filter(x=>x.id!==id);
      saveCart(cart);
      renderCart();
    });
  });

  const clearBtn = document.getElementById("clearCartBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem("packgo_cart");
      window.dispatchEvent(new Event("storage"));
      renderCart();
    });
  }
}

async function loadProducts() {
  if (!grid) return;
  grid.innerHTML = `<p class="lead">იტვირთება...</p>`;

  try {
    // Outdoor theme: categories ვერ გვაქვს ზუსტად, მაგრამ პროდუქტები დემოსთვის საკმარისია
    const res = await fetch("https://dummyjson.com/products?limit=24");
    const data = await res.json();
    allProducts = data.products || [];
    filtered = [...allProducts];

    applyFilters();
    renderCart();
  } catch (err) {
    grid.innerHTML = `<p class="lead">შეცდომა დატვირთვისას. სცადე თავიდან.</p>`;
    console.error(err);
  }
}

if (searchInput) searchInput.addEventListener("input", applyFilters);
if (sortSelect) sortSelect.addEventListener("change", applyFilters);

loadProducts();
