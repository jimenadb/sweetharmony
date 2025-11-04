document.addEventListener("DOMContentLoaded", async () => {
  const cartTableBody = document.getElementById("cart-items");
  const grandTotalEl = document.getElementById("grand-total");

  try {
    // 🔹 Llamar al backend
    const res = await fetch("http://localhost/sweetharmony/sweetharmony/dashboard/php/get_cart_for_dashboard_cart.php", {
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
        <td><input type="checkbox" class="select-item" data-product-id="${item.id}"></td>
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


document.addEventListener('DOMContentLoaded', () => {

  const cartItemsContainer = document.getElementById('cart-items');
  const deleteSelectedBtn = document.getElementById('delete-selected');
  const selectAllCheckbox = document.getElementById('select-all');

  // Función para resaltar fila
  function toggleRowHighlight(checkbox) {
    const row = checkbox.closest('tr');
    if (!row) return;
    if (checkbox.checked) {
      row.classList.add('selected');
    } else {
      row.classList.remove('selected');
    }
  }

  // Eventos para checkboxes
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

  // Seleccionar todo
  selectAllCheckbox.addEventListener('change', () => {
    const checkboxes = cartItemsContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.checked = selectAllCheckbox.checked;
      toggleRowHighlight(cb);
    });
  });

  // Eliminar seleccionados
  deleteSelectedBtn.addEventListener('click', () => {
    const selectedCheckboxes = cartItemsContainer.querySelectorAll('input[type="checkbox"]:checked');
    if (selectedCheckboxes.length === 0) {
      alert("Selecciona al menos un producto para eliminar");
      return;
    }

    const productIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.productId));

    fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/delete_dashboard_cart.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ product_ids: productIds })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Eliminar filas seleccionadas del DOM
        selectedCheckboxes.forEach(cb => {
          const row = cb.closest('tr');
          row.remove();
        });
        // Resetear checkbox "select all"
        selectAllCheckbox.checked = false;
      } else {
        alert(data.message || "Error al eliminar productos");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Ocurrió un error al eliminar productos");
    });
  });

});



document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("select-address");
  const info = document.getElementById("address-info");

  try {
    const res = await fetch("http://localhost/sweetharmony/sweetharmony/dashboard/php/get_addresses.php", { credentials: "include" });
    const data = await res.json();
    if (!data.success) throw new Error("No addresses");

    select.innerHTML = "";
    data.addresses.forEach(a => {
      const opt = new Option(
        `${a.full_name} - ${a.address}, ${a.district}, ${a.city} (${a.postal_code})`,
        a.id
      );
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
