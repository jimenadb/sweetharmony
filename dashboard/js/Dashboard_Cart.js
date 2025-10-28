document.addEventListener("DOMContentLoaded", async () => {
  const cartTableBody = document.getElementById("cart-items");
  const grandTotalEl = document.getElementById("grand-total");

  try {
    // 🔹 Llamar al backend
    const res = await fetch("http://158.69.214.32/ximena_flores/sweetharmony/dashboard/php/get_cart_for_dashboard_cart.php", {
      credentials: "include"
    });

    if (!res.ok) throw new Error("Error al obtener el carrito");

    const cart = await res.json();

    // 🔹 Limpiar la tabla antes de renderizar
    cartTableBody.innerHTML = "";

    // 🔹 Si no hay productos
    if (cart.length === 0) {
      cartTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Tu carrito está vacío 🛒</td></tr>`;
      grandTotalEl.textContent = "$0.00";
      return;
    }

    // 🔹 Renderizar los productos
    let grandTotal = 0;

    cart.forEach(item => {
      const total = item.price * item.quantity;
      grandTotal += total;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="checkbox" class="select-item"></td>
        <td class="product-info">
          <img src="${item.image}" alt="${item.name}" width="80">
          <span>${item.name}</span>
        </td>
        <td class="price-unit">$${item.price.toFixed(2)}</td>
        <td><input type="number" class="quantity" value="${item.quantity}" min="1"></td>
        <td class="total-price">$${total.toFixed(2)}</td>
      `;
      cartTableBody.appendChild(row);
    });

    // 🔹 Mostrar total general
    grandTotalEl.textContent = `$${grandTotal.toFixed(2)}`;

  } catch (err) {
    console.error("Error cargando carrito:", err);
    cartTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Error al cargar el carrito</td></tr>`;
  }
});


document.getElementById('place-order').addEventListener('click', () => {
  console.log("Botón de realizar pedido clickeado"); // para verificar
  alert('✅ Pedido realizado correctamente.\nGracias por tu compra en SWEET HARMONY.');
});
document.getElementById('checkout-btn').onclick = () => {
  document.querySelector('.checkout-section').style.display = 'block';
};
