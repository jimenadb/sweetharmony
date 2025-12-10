document.addEventListener("DOMContentLoaded", () => {

  /*===============================
  =            VARIABLES          =
  ===============================*/
  const ordersContainer = document.querySelector(".orders-container");
  const modal = document.getElementById("orderModal");
  const modalBody = document.getElementById("modalBody");
  const closeModalBtn = document.getElementById("closeModal");
  const supportNumber = "51910405014"; // WhatsApp sin + ni 00
  const estadoMap = {
    pending: "Pendiente",
    paid: "Pagado",
    processing: "En proceso",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
    completed: "Completado"
  };

  /*===============================
  =       EVENTOS GENERALES       =
  ===============================*/

  // Cerrar modal
  closeModalBtn.addEventListener("click", () => modal.classList.remove("active"));
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("active");
  });

  // Botón de "Reportar Problema" para WhatsApp
  document.addEventListener("click", (e) => {
    const problemBtn = e.target.closest(".problem-btn");
    if (problemBtn) {
      e.stopPropagation(); // evita abrir modal
      const orderId = problemBtn.dataset.id;
      const message = `Hola, quiero reportar un problema con el pedido N°: ${orderId}.`;
      const url = `https://wa.me/${supportNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    }
  });


  /*===============================
  =       FUNCIONES PRINCIPALES    =
  ===============================*/

  // Cargar todos los pedidos desde la API
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

  // Renderizar cada pedido en tarjeta
  function renderOrder(order) {
    const orderCard = document.createElement("div");
    orderCard.className = "order-card";

    const estadoTraducido = estadoMap[order.status] || order.status;

    orderCard.innerHTML = `
      <div class="order-header">
        <span class="order-number">Pedido N°${order.id}</span>
        <span class="order-status">${estadoTraducido}</span>
      </div>
      <div class="order-actions">
        <button class="view-btn" data-id="${order.id}">Ver detalles</button>
        <button class="delete-btn" data-id="${order.id}">Eliminar</button>
        <button class="problem-btn" data-id="${order.id}">
          <ion-icon name="logo-whatsapp"></ion-icon> Reportar Problema
        </button>
      </div>
    `;

    // Botón "Ver detalles" abre modal
    orderCard.querySelector(".view-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      showModal(order);
    });

    // Botón "Eliminar"
    orderCard.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(`¿Seguro que deseas eliminar el pedido #${order.id}?`)) {
        fetch(`http://localhost/sweetharmony/sweetharmony/dashboard/php/delete_order.php?id=${order.id}`, { method: "DELETE" })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              alert("Pedido eliminado correctamente");
              orderCard.remove();
            } else {
              alert("Error al eliminar: " + (data.error || "desconocido"));
            }
          })
          .catch(err => {
            console.error("Error:", err);
            alert("No se pudo conectar con el servidor.");
          });
      }
    });

    ordersContainer.appendChild(orderCard);
  }


// Mostrar modal con los detalles del pedido
function showModal(order) {

  const estadoTraducido = estadoMap[order.status] || order.status;
  // --- Productos ---
  let itemsHTML = '';
  if (order.items && order.items.length > 0) {
    itemsHTML = '<h4>Productos:</h4><ul>';
    order.items.forEach(item => {
      const priceNum = Number(item.price);           // convertir a número
      const discountNum = Number(item.discount ?? 0); // asegurar número
      const totalPrice = (priceNum * item.quantity * (1 - discountNum / 100)).toFixed(2);
    
      itemsHTML += `
        <div class="modal-product-item" style="display:flex; align-items:center; gap:12px; padding:8px 0; border-bottom:1px solid #f0f0f0;">
          ${item.image_url ? `<img src="${item.image_url}" alt="${item.product_name}" style="width:80px; height:130px; object-fit:cover; border-radius:8px;">` : ''}
          <div class="modal-product-info" style="line-height:1.4;">
            <p><strong>${item.product_name}</strong></p>
            <p>Cantidad: ${item.quantity}</p>
            <p>Precio Unitario: $${priceNum.toFixed(2)}</p>
            <p>Descuento: ${discountNum}%</p>
            <p><strong>Total: $${totalPrice}</strong></p>
          </div>
        </div>
      `;
    });
    itemsHTML += '</ul>';
  } else {
    itemsHTML = '<p>No hay productos registrados</p>';
  }

  // --- Comprobante de pago ---
  const receiptHTML = order.receipt 
    ? `<div style="margin-top: 1rem;">
         <h4>Comprobante de pago:</h4>
         <img src="${order.receipt}" alt="Comprobante" style="width: 100%; max-width: 150px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); margin-top: 0.5rem;">
       </div>`
    : '<p><em>No se ha subido comprobante de pago.</em></p>';

  // --- Información de envío ---
  const envioHTML = `
    <h4>Datos de Envio</h4>
    <p><strong>Tipo de envio:</strong> ${order.delivery_type || '-'}</p>
    <p><strong>Courier:</strong> ${order.courier || '-'}</p>
    <p><strong>Tracking:</strong> ${order.tracking_number || '-'}</p>
    <p><strong>Notas:</strong> ${order.shipping_notes || '-'}</p>
    <h4>Comprobante de envío:</h4>
    ${order.shipping_receipt 
      ? `<img src="../../uploads/shipping_receipts/${order.shipping_receipt}" style="max-width:200px; display:block; margin-bottom:1rem;">`
      : `<p>No hay comprobante de envío</p>`}
    <hr>
  `;

  // --- Asignar contenido al modal ---
  modalBody.innerHTML = `
    <p><strong>Pedido N°:</strong> ${order.id}</p>
    <p><strong>Estado:</strong> ${estadoTraducido}</p>
    <p><strong>Fecha:</strong> ${order.created_at}</p>
    <p><strong>Total:</strong> $${order.total}</p>

    <hr style="margin: 1rem 0;">

    ${itemsHTML}       <!-- Productos antes del total -->
    ${receiptHTML}     <!-- Comprobante de pago después de los productos -->

    <h4>Datos del cliente</h4>
    <p><strong>Nombre:</strong> ${order.cliente || "N/A"}</p>
    <p><strong>DNI:</strong> ${order.dni || "N/A"}</p>
    <p><strong>Email:</strong> ${order.email || "N/A"}</p>
    <p><strong>Dirección:</strong> ${order.direccion || "N/A"}</p>
    <p><strong>Referencia:</strong> ${order.reference || "N/A"}</p>

    ${envioHTML}       <!-- Info de envío al final -->
  `;

  // --- Mostrar modal ---
  modal.classList.add("active");
}


  // ================================
  //       EJECUCIÓN INICIAL
  // ================================
  fetchOrders();

});
