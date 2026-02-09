let cart = []; // carrito global
let grandTotal = 0;

// Función para cargar carrito desde backend
async function loadCart() {
  try {
    const res = await fetch("http://localhost/sweetharmony/sweetharmony/dashboard/php/get_cart_for_dashboard_cart.php", {
      credentials: "include"
    });
    if (!res.ok) throw new Error("Error al obtener el carrito");
    cart = await res.json();
    return cart;
  } catch (err) {
    console.error("Error cargando carrito:", err);
    cart = [];
    return cart;
  }
}

// ----------------------
// Cargar carrito
// ----------------------
document.addEventListener("DOMContentLoaded", async () => {
  const cartTableBody = document.getElementById("cart-items");
  const grandTotalEl = document.getElementById("grand-total");
  const subtotalEl = document.getElementById("subtotal");
  const discountEl = document.getElementById("discount");
  const totalPayableEl = document.getElementById("total-payable");

  try {
    const res = await fetch("http://localhost/sweetharmony/sweetharmony/dashboard/php/get_cart_for_dashboard_cart.php", {
      credentials: "include"
    });
    if (!res.ok) throw new Error("Error al obtener el carrito");

    const cart = await res.json();
    cartTableBody.innerHTML = "";

    if (cart.length === 0) {
      cartTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Tu carrito está vacío 🛒</td></tr>`;
      grandTotalEl.textContent = "$0.00";
      if(subtotalEl) subtotalEl.textContent = "$0.00";
      if(discountEl) discountEl.textContent = "$0.00";
      if(totalPayableEl) totalPayableEl.textContent = "$0.00";
      return;
    }

    // Renderizar productos y calcular total/descuento
    //let grandTotal = 0;      // total sin descuentos
    let totalDiscount = 0;   // descuento acumulado
    const shipping = 5;      // ejemplo de envío

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      const itemDiscount = itemTotal * (item.discount || 0) / 100;
      const totalWithDiscount = itemTotal - itemDiscount;
    
      grandTotal += totalWithDiscount; // ahora sumamos total ya descontado
      totalDiscount += itemDiscount;   // acumulamos el descuento
    
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="checkbox" class="select-item" data-product-id="${item.id}"></td>
        <td class="product-info">
          <img src="${item.image ? '../../uploads/' + item.image : '/sweetharmony/assets/default.jpg'}" 
               alt="${item.name}" width="80">
          <span>${item.name}</span>
        </td>
        <td class="price-unit">$${item.price.toFixed(2)}</td>
        <td class="discount">${item.discount ? item.discount.toFixed(2) + "%" : "-"}</td>
        <td><input type="number" class="quantity-input" 
            value="${item.quantity}" 
            min="1" 
            max="${item.units}"></td>
        <td class="total-price">$${totalWithDiscount.toFixed(2)}</td>
      `;
      cartTableBody.appendChild(row);
    });

    // Mostrar totales en tabla y factura previa
    grandTotalEl.textContent = `$${grandTotal.toFixed(2)}`;
    if(subtotalEl) subtotalEl.textContent = `$${grandTotal.toFixed(2)}`;
    if(discountEl) discountEl.textContent = `$${totalDiscount.toFixed(2)}`;
    if(totalPayableEl) totalPayableEl.textContent = `$${(grandTotal - totalDiscount + shipping).toFixed(2)}`;

  } catch (err) {
    console.error("Error cargando carrito:", err);
    cartTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Error al cargar el carrito</td></tr>`;
  }
});





document.addEventListener("input", async (e) => {
  if (!e.target.classList.contains("quantity-input")) return;

  const input = e.target;
  const row = input.closest("tr");
  const productId = parseInt(row.querySelector(".select-item").dataset.productId);
  const newQuantity = parseInt(input.value);
  const maxUnits = parseInt(input.getAttribute("max"));
  if (newQuantity > maxUnits) {
    input.value = maxUnits;
    alert(`Solo hay ${maxUnits} unidades disponibles`);
    return;
  }

  if (newQuantity < 1) return; // mínimo 1

  try {
    const res = await fetch("http://localhost/sweetharmony/sweetharmony/dashboard/php/update_cart_quantity.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, quantity: newQuantity })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "No se pudo actualizar");

    // Actualizar total de la fila y total general
    const price = parseFloat(row.querySelector(".price-unit").textContent.replace("$", ""));
    row.querySelector(".total-price").textContent = `$${(price * newQuantity).toFixed(2)}`;

    // Recalcular total general
    grandTotal = Array.from(document.querySelectorAll(".total-price"))
                     .reduce((sum, td) => sum + parseFloat(td.textContent.replace("$", "")), 0);
    document.getElementById("grand-total").textContent = `$${grandTotal.toFixed(2)}`;

  } catch (err) {
    console.error(err);
    alert("Error al actualizar cantidad");
  }
});


// ----------------------
// 🛒 Checkout y Totales
// ----------------------
document.getElementById('checkout-btn').onclick = async () => {
  document.querySelector('.checkout-section').style.display = 'block';
  const invoiceBody = document.getElementById('invoice-body');
  const totalPayableEl = document.getElementById('total-payable');

  try {
    const res = await fetch("http://localhost/sweetharmony/sweetharmony/dashboard/php/get_cart_for_dashboard_cart.php", {
      credentials: "include"
    });
    if (!res.ok) throw new Error("Error al obtener el carrito");

    const cart = await res.json();
    invoiceBody.innerHTML = "";
    if (cart.length === 0) {
      invoiceBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Tu carrito está vacío 🛒</td></tr>`;
      totalPayableEl.textContent = "$0.00";
      return;
    }

    let grandTotal = 0;
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;                 // precio sin descuento
      const discountValue = itemTotal * (item.discount || 0) / 100; // descuento en dinero
      const totalWithDiscount = itemTotal - discountValue;          // total después de descuento
      grandTotal += totalWithDiscount;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${item.discount ? "$" + discountValue.toFixed(2) : "-"}</td>
        <td>$${totalWithDiscount.toFixed(2)}</td>
      `;
      invoiceBody.appendChild(row);
    });

    totalPayableEl.textContent = `$${grandTotal.toFixed(2)}`;
  } catch (err) {
    console.error("Error cargando carrito:", err);
    invoiceBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">Error al cargar el carrito</td></tr>`;
    totalPayableEl.textContent = "$0.00";
  }
};



// ----------------------
// Selección y eliminación de productos
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
      if (data.success) {
        selectedCheckboxes.forEach(cb => cb.closest('tr').remove());
      
        // 🔁 Recalcular total después de eliminar
        grandTotal = Array.from(document.querySelectorAll(".total-price"))
          .reduce((sum, td) => sum + parseFloat(td.textContent.replace("$", "")), 0);
      
        document.getElementById("grand-total").textContent = `$${grandTotal.toFixed(2)}`;
      }
      
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
//  Cargar direcciones
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
// ----------------------
// SECCION PARA SUBIR EL YAPEO
// ----------------------

const yapeInput = document.getElementById('yape-proof');
const yapePreview = document.getElementById('yape-preview');

yapeInput.addEventListener('change', () => {
  const file = yapeInput.files[0];
  if (!file) {
    yapePreview.style.display = 'none';
    yapePreview.src = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    yapePreview.src = e.target.result;
    yapePreview.style.display = 'block';
  };
  reader.readAsDataURL(file);
});

// ----------------------
// CARGAR BOTONES DE SELECCIÓN DE ENVÍO
// ----------------------

// Elementos
const shippingBtns = document.querySelectorAll('.shipping-btn');
const shippingInfo = document.getElementById('shipping-info');
const whatsappLinkEl = document.getElementById('whatsapp-link');


// Función para generar mensaje WhatsApp con carrito
function generarMensajeWhatsApp(cart) {
  if (!cart || cart.length === 0) 
    return "Hola, quiero cotizar el costo del envio de mi pedido.";

  let mensaje = "Hola, quiero cotizar el costo del envio de mi pedido:%0A"; 
  let total = 0;

  cart.forEach(item => {
    const priceUnit = item.price;                                 // precio unitario
    const discountValue = priceUnit * (item.discount || 0) / 100; // descuento unitario
    const priceWithDiscount = priceUnit - discountValue;          // precio unitario con descuento
    const totalItem = priceWithDiscount * item.quantity;          // total por producto
    total += totalItem;

    // Formato limpio: cantidad - nombre - precio unitario - total
    mensaje += `${item.quantity} × ${item.name} - $${priceWithDiscount.toFixed(2)} c/u → $${totalItem.toFixed(2)}\n`;
});

  mensaje += `Total aproximado: $${total.toFixed(2)}`;
  return mensaje;
}

// Función para cargar carrito desde backend
async function loadCart() {
  try {
    const res = await fetch("http://localhost/sweetharmony/sweetharmony/dashboard/php/get_cart_for_dashboard_cart.php", {
      credentials: "include"
    });
    if (!res.ok) throw new Error("Error al obtener el carrito");
    const cart = await res.json(); 
    return cart;
  } catch (err) {
    console.error("Error cargando carrito:", err);
    return [];
  }
}

// Escucha click en botones de envío
shippingBtns.forEach(btn => {
  btn.addEventListener('click', async () => {
    // Marca visual del botón
    shippingBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    const value = btn.querySelector('input').value;
    const addressSection = document.querySelector('.delivery-address');

    if (value === 'domicilio') {
      // Mostrar sección de dirección solo para delivery
      if (addressSection) addressSection.style.display = 'block';

      shippingInfo.innerHTML = `
        <p style="color:black;">📦 Coordina con nuestro personal el tipo de envío que más te convenga.</p>
        <p style="color:black;">💳 Después te enviaremos un link para realizar el pago.</p>
        <p style="color:black;">⚠️ Recuerda que todo envío se realiza únicamente después de pagar el costo total.</p>
      `;

      // Cargar carrito solo aquí y generar mensaje
      const cart = await loadCart(); 
      const mensaje = generarMensajeWhatsApp(cart);
      whatsappLinkEl.href = `https://wa.me/51910405014?text=${mensaje}`;
      whatsappLinkEl.style.display = "inline-flex";

    } else if (value === 'local') {
      // Ocultar sección de dirección para retiro en tienda
      if (addressSection) addressSection.style.display = 'none';

      shippingInfo.innerHTML = `
        <p>🏠 Dirección de la tienda: Av. Ejército 123, Arequipa</p>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30614.1717690948!2d-71.5128832!3d-16.436428799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91424b1afbd7b04f%3A0x442c75b676221e9c!2sRipley%20Arequipa%20-%20Mall%20Aventura%20Paucarpata!5e0!3m2!1ses!2spe!4v1763352086393!5m2!1ses!2spe" 
          width="300" 
          height="200" 
          style="border:0; border-radius:8px;" 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      `;

      whatsappLinkEl.style.display = "none";
      whatsappLinkEl.href = "#";
    }
  });
});


// Validación al continuar (puedes integrarlo al botón "Realizar Pedido")
document.getElementById('place-order').addEventListener('click', () => {
  const selected = document.querySelector('input[name="shipping"]:checked');
  if (!selected) {
    alert('Por favor seleccione un tipo de envío.');
    return;
  }
  const tipoEnvio = selected.value;
  alert(`Has seleccionado: ${tipoEnvio}`);
});



document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  if (params.get('payment') === 'success') {
      alert("Pago realizado correctamente. ¡Gracias por tu compra!");

      // Limpia la URL
      window.history.replaceState({}, document.title, window.location.pathname);
  }

  if (params.get('payment') === 'error') {
      alert("El pago no pudo confirmarse");
  }
});