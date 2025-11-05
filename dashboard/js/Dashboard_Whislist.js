const tbody = document.querySelector(".wishlist-table tbody");

fetch("http://localhost/sweetharmony/sweetharmony/dashboard/php/get_wishlist_details.php", { credentials: "include" })
  .then(res => res.json())
  .then(productos => {
    if (!productos || productos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center;">No tienes productos en tu lista de deseos.</td>
        </tr>
      `;
      return;
    }

    // Construye toda la tabla de una vez
    tbody.innerHTML = productos.map(p => `
      <tr>
        <td><input type="checkbox" class="select-item"></td>
        <td class="product-info">
          <img src="../../uploads/${p.image_url}" alt="${p.product_name}">
          <span>${p.product_name}</span>
        </td>
        <td class="price">$${p.price}</td>
        <td>
          <button class="btn btn-secondary remove-btn" data-id="${p.id}">Eliminar</button>
          <button class="btn btn-primary add-cart-btn" data-id="${p.id}">Agregar al carrito</button>
        </td>
      </tr>
    `).join("");
  })
  .catch(err => {
    console.error("Error al cargar wishlist:", err);
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;color:red;">
          Error al cargar la lista de deseos.
        </td>
      </tr>
    `;
  });




tbody.addEventListener('click', e => {
  if (e.target.classList.contains('remove-btn')) {
    const btn = e.target;
    const productId = btn.dataset.id;

    fetch("http://localhost/sweetharmony/sweetharmony/dashboard/php/delete_product_wishlist.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId }),
      credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Elimina la fila visualmente
        btn.closest("tr").remove();
      } else {
        alert(data.message || "Error al eliminar el producto");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Ocurrió un error al eliminar el producto");
    });
  }
});




tbody.addEventListener('click', e => {
  if (e.target.classList.contains('add-cart-btn')) {
    const btn = e.target;
    const productId = btn.dataset.id;

    fetch("http://localhost/sweetharmony/sweetharmony/dashboard/php/add_to_cart.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId }),
      credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Producto agregado al carrito");
      } else {
        alert(data.message || "Error al agregar el producto");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Ocurrió un error al agregar el producto");
    });
  }
});