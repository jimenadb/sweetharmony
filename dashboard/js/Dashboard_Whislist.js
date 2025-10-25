const tbody = document.querySelector(".wishlist-table tbody");

fetch("../php/get_wishlist_details.php", { credentials: "include" })
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
          <img src="${p.image_url}" alt="${p.product_name}">
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