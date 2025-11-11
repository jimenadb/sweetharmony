document.addEventListener("DOMContentLoaded", () => {
  const ordersContainer = document.querySelector(".orders-container");
  const modal = document.getElementById("orderModal");
  const modalBody = document.getElementById("modalBody");
  const closeModalBtn = document.getElementById("closeModal");

  // Función para cerrar modal
  function closeModal() {
    modal.classList.remove("active");
  }
  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });

  // Función para cargar pedidos
  async function fetchOrders() {
    try {
      const response = await fetch("http://localhost/sweetharmony/sweetharmony/dashboard/php/get_detail_order.php");
      const orders = await response.json();
      if (orders.error) {
        console.error(orders.error);
        return;
      }
      orders.forEach(order => renderOrder(order));
    } catch (error) {
      console.error("Error al cargar los pedidos:", error);
    }
  }

  // Función para renderizar cada pedido en tarjeta
  function renderOrder(order) {
    const orderCard = document.createElement("div");
    orderCard.className = "order-card";

    orderCard.innerHTML = `
      <div class="order-header">
        <span class="order-number">Pedido #${order.id}</span>
        <span class="order-status">${order.status}</span>
      </div>
<div class="order-actions">
  <button class="view-btn" data-id="${order.id}"> Ver detalles</button>
  <button class="delete-btn" data-id="${order.id}"> Eliminar</button>
</div>

    `;

    // Abrir modal al hacer clic
    orderCard.addEventListener("click", () => showModal(order));
    ordersContainer.appendChild(orderCard);


    // Evento eliminar pedido
orderCard.querySelector(".delete-btn").addEventListener("click", (e) => {
  e.stopPropagation(); // evita abrir el modal

  if (confirm(`¿Seguro que deseas eliminar el pedido #${order.id}?`)) {
    fetch(`http://localhost/sweetharmony/sweetharmony/dashboard/php/delete_order.php?id=${order.id}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("✅ Pedido eliminado correctamente");
        orderCard.remove();
      } else {
        alert("❌ Error al eliminar: " + (data.error || "desconocido"));
      }
    })
    .catch(err => {
      console.error("Error:", err);
      alert("No se pudo conectar con el servidor.");
    });
  }
});
  }

  function showModal(order) {
    let itemsHTML = '';
    
    // 🔹 Mostrar los productos
    if (order.items && order.items.length > 0) {
      itemsHTML = '<h4>Productos:</h4><ul>';
      order.items.forEach(item => {
        itemsHTML += `
          <li style="margin-bottom: 8px;">
            ${item.image_url ? `<img src="${item.image_url}" style="width:40px; height:40px; object-fit:cover; vertical-align:middle; margin-right:8px; border-radius:4px;">` : ""}
            ${item.quantity} × <strong>${item.product_name}</strong> — $${item.price}
          </li>
        `;
      });
      itemsHTML += '</ul>';
    } else {
      itemsHTML = '<p>No hay productos registrados</p>';
    }
  
    // 🔹 Mostrar comprobante (si existe)
    let receiptHTML = '';
    if (order.receipt) {
      receiptHTML = `
        <div style="margin-top: 1rem;">
          <h4>Comprobante de pago:</h4>
          <img src="${order.receipt}" 
               alt="Comprobante" 
               style="width: 100%; max-width: 150px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); margin-top: 0.5rem;">
        </div>
      `;
    } else {
      receiptHTML = '<p><em>No se ha subido comprobante de pago.</em></p>';
    }

    
// 🔹 Aquí agregas envioHTML
const envioHTML = `
<h4>Envío:</h4>
<p><strong>Courier:</strong> ${order.courier || '-'}</p>
<p><strong>Tracking:</strong> ${order.tracking_number || '-'}</p>
<p><strong>Notas:</strong> ${order.shipping_notes || '-'}</p>
<h4>Comprobante de envío:</h4>
${order.shipping_receipt 
  ? `<img src="../../uploads/shipping_receipts/${order.shipping_receipt}" style="max-width:200px; display:block; margin-bottom:1rem;">`
  : `<p>No hay comprobante de envío</p>`}
<hr>
`;
 
  
    // 🔹 Finalmente se asigna todo al modal
modalBody.innerHTML = `
<p><strong>Pedido #:</strong> ${order.id}</p>
<p><strong>Estado:</strong> ${order.status}</p>
<p><strong>Fecha:</strong> ${order.created_at}</p>
<p><strong>Total:</strong> $${order.total}</p>

<hr style="margin: 1rem 0;">

<h4>Datos del cliente:</h4>
<p><strong>Nombre:</strong> ${order.cliente || "N/A"}</p>
<p><strong>DNI:</strong> ${order.dni || "N/A"}</p>
<p><strong>Email:</strong> ${order.email || "N/A"}</p>
<p><strong>Dirección:</strong> ${order.direccion || "N/A"}</p>
<p><strong>Referencia:</strong> ${order.reference || "N/A"}</p>

${envioHTML}   <!-- <- Aquí se muestra la info de envío -->
${itemsHTML}
${receiptHTML}
`;
    // 🔹 Mostrar modal
    modal.classList.add("active");
  }
  

  // Llamada inicial para cargar los pedidos
  fetchOrders();
});

