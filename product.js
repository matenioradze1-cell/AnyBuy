function getCart() {
  try { return JSON.parse(localStorage.getItem("packgo_cart")) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem("packgo_cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("storage"));
}
function addToCart(product) {
  const cart = getCart();
  const found = cart.find(i => i.id === product.id);
  if (found) found.qty += 1;
  else cart.push({ id: product.id, title: product.title, price: product.price, qty: 1 });
  saveCart(cart);
}

function getIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

const titleEl = document.getElementById("productTitle");
const descEl = document.getElementById("productDesc");
const imgEl = document.getElementById("productImage");
const priceEl = document.getElementById("productPrice");
const tagsEl = document.getElementById("productTags");
const addBtn = document.getElementById("addToCartBtn");

async function loadOne() {
  const id = getIdFromQuery();
  if (!id) {
    titleEl.textContent = "პროდუქტი ვერ მოიძებნა";
    return;
  }

  try {
    const res = await fetch("data/products.json"); // ✅ ლოკალური GET
    const data = await res.json();
    const p = (data.products || []).find(x => x.id === id);

    if (!p) {
      titleEl.textContent = "პროდუქტი ვერ მოიძებნა";
      return;
    }

    titleEl.textContent = p.title;
    descEl.textContent = p.description;
    imgEl.src = p.thumbnail;
    imgEl.alt = p.title;
    priceEl.textContent = `$${p.price}`;

    tagsEl.innerHTML = `
      <span class="badge">Category: ${p.category}</span>
      <span class="badge">Brand: ${p.brand}</span>
      <span class="badge">⭐ ${p.rating}</span>
      <span class="badge">Stock: ${p.stock}</span>
    `;

    addBtn.addEventListener("click", () => {
      addToCart(p);
      addBtn.textContent = "დამატებულია ✅";
      setTimeout(()=> addBtn.textContent = "კალათაში დამატება", 1200);
    });
  } catch (e) {
    titleEl.textContent = "შეცდომა დატვირთვისას (Live Server)";
    console.error(e);
  }
}

loadOne();
