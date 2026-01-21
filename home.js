const featuredGrid = document.getElementById("featuredGrid");

async function loadFeatured() {
  if (!featuredGrid) return;
  featuredGrid.innerHTML = `<p class="lead">იტვირთება...</p>`;

  try {
    const res = await fetch("data/products.json"); // ლოკალური GET
    const data = await res.json();
    const list = (data.products || []).slice(0, 8);

    featuredGrid.innerHTML = "";
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
          </div>
        </div>
      `;
      featuredGrid.appendChild(card);
    });
  } catch (e) {
    featuredGrid.innerHTML = `<p class="lead">შეცდომა დატვირთვისას (Live Server).</p>`;
    console.error(e);
  }
}

loadFeatured();
