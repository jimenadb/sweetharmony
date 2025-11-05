// ----------------------
// 🚨 Variables globales
// ----------------------
let grandTotal = 0; // total del carrito accesible desde cualquier parte

// ----------------------
// 📦 Cargar carrito
// ----------------------
document.addEventListener("DOMContentLoaded", async () => {
  const cartTableBody = document.getElementById("cart-items");
  const grandTotalEl = document.getElementById("grand-total");

  try {
    const res = await fetch("http://localhost/sweetharmony/sweetharmony/dashboard/php/get_cart_for_dashboard_cart.php", {
      credentials: "include"
    });
    if (!res.ok) throw new Error("Error al obtener el carrito");

    const cart = await res.json();
    cartTableBody.innerHTML = "";

    if (cart.length === 0) {
      cartTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Tu carrito está vacío 🛒</td></tr>`;
      grandTotalEl.textContent = "$0.00";
      return;
    }

    // 🔹 Renderizar productos
    grandTotal = 0; // reinicia antes de sumar
    cart.forEach(item => {
      const total = item.price * item.quantity;
      grandTotal += total;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="checkbox" class="select-item" data-product-id="${item.id}"></td>
        <td class="product-info">
          <img src="${item.image ? '../../uploads/' + item.image : '/sweetharmony/assets/default.jpg'}" 
               alt="${item.name}" width="80">
          <span>${item.name}</span>
        </td>
        <td class="price-unit">$${item.price.toFixed(2)}</td>
        <td><input type="number" class="quantity" value="${item.quantity}" min="1"></td>
        <td class="total-price">$${total.toFixed(2)}</td>
      `;
      cartTableBody.appendChild(row);
    });

    // 🔹 Mostrar total general en la tabla
    grandTotalEl.textContent = `$${grandTotal.toFixed(2)}`;

  } catch (err) {
    console.error("Error cargando carrito:", err);
    cartTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Error al cargar el carrito</td></tr>`;
  }
});

// ----------------------
// 🛒 Checkout y Totales
// ----------------------
document.getElementById('checkout-btn').onclick = () => {
  document.querySelector('.checkout-section').style.display = 'block';

  const subtotalEl = document.getElementById('subtotal');
  const shippingEl = document.getElementById('shipping');
  const totalPayableEl = document.getElementById('total-payable');

  const subtotal = grandTotal;
  const shipping = 5.00; // envío fijo
  const totalPayable = subtotal + shipping;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  shippingEl.textContent = `$${shipping.toFixed(2)}`;
  totalPayableEl.textContent = `$${totalPayable.toFixed(2)}`;
};

// ----------------------
// ✅ Realizar pedido
// ----------------------
document.getElementById('place-order').addEventListener('click', () => {
  console.log("Botón de realizar pedido clickeado");
  alert('✅ Pedido realizado correctamente.\nGracias por tu compra en SWEET HARMONY.');
});

// ----------------------
// ✂️ Selección y eliminación de productos
// ----------------------
document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cart-items');
  const deleteSelectedBtn = document.getElementById('delete-selected');
  const selectAllCheckbox = document.getElementById('select-all');

  function toggleRowHighlight(checkbox) {
    const row = checkbox.closest('tr');
    if (!row) return;
    if (checkbox.checked) row.classList.add('selected');
    else row.classList.remove('selected');
  }

  function attachCheckboxEvents() {
    const checkboxes = cartItemsContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        toggleRowHighlight(cb);
        const allChecked = Array.from(checkboxes).every(c => c.checked);
        selectAllCheckbox.checked = allChecked;
      });
    });
  }

  attachCheckboxEvents();

  selectAllCheckbox.addEventListener('change', () => {
    const checkboxes = cartItemsContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.checked = selectAllCheckbox.checked;
      toggleRowHighlight(cb);
    });
  });

  deleteSelectedBtn.addEventListener('click', () => {
    const selectedCheckboxes = cartItemsContainer.querySelectorAll('input[type="checkbox"]:checked');
    if (selectedCheckboxes.length === 0) {
      alert("Selecciona al menos un producto para eliminar");
      return;
    }

    const productIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.productId));
    fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/delete_dashboard_cart.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_ids: productIds })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) selectedCheckboxes.forEach(cb => cb.closest('tr').remove());
      else alert(data.message || "Error al eliminar productos");
      selectAllCheckbox.checked = false;
    })
    .catch(err => {
      console.error(err);
      alert("Ocurrió un error al eliminar productos");
    });
  });
});

// ----------------------
// 🏠 Cargar direcciones
// ----------------------
document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("select-address");
  const info = document.getElementById("address-info");

  try {
    const res = await fetch("http://localhost/sweetharmony/sweetharmony/dashboard/php/get_addresses.php", { credentials: "include" });
    const data = await res.json();
    if (!data.success) throw new Error("No addresses");

    select.innerHTML = "";
    data.addresses.forEach(a => {
      const opt = new Option(`${a.full_name} - ${a.address}, ${a.district}, ${a.city} (${a.postal_code})`, a.id);
      select.appendChild(opt);
    });

    const show = () => {
      const sel = data.addresses.find(a => a.id == select.value);
      info.textContent = sel ? `${sel.full_name}, ${sel.address}, ${sel.district}, ${sel.city}, ${sel.postal_code}` : "No has seleccionado dirección.";
    };

    select.addEventListener("change", show);
    show();
  } catch {
    info.textContent = "Error al cargar direcciones";
  }
});
