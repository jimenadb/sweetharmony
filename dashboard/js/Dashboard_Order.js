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
      <div class="order-footer">
        <span>Total: $${order.total}</span>
        <span class="tracking-number">Seguimiento: N/A</span>
      </div>
    `;

    // Abrir modal al hacer clic
    orderCard.addEventListener("click", () => showModal(order));

    ordersContainer.appendChild(orderCard);
  }

  // Función para mostrar el modal con detalles del pedido
  function showModal(order) {
    let itemsHTML = '';
    if (order.items && order.items.length > 0) {
      itemsHTML = '<h4>Productos:</h4><ul>';
      order.items.forEach(item => {
        itemsHTML += `<li>${item.quantity} x ${item.product_name} ($${item.price})</li>`;
      });
      itemsHTML += '</ul>';
    } else {
      itemsHTML = '<p>No hay productos registrados</p>';
    }

    modalBody.innerHTML = `
      <p><strong>Pedido #:</strong> ${order.id}</p>
      <p><strong>Estado:</strong> ${order.status}</p>
      <p><strong>Total:</strong> $${order.total}</p>
      <p><strong>Cliente:</strong> ${order.cliente || "N/A"}</p>
      <p><strong>Dirección:</strong> ${order.direccion || "N/A"}</p>
      ${itemsHTML}
    `;

    modal.classList.add("active");
  }

  // Llamada inicial para cargar los pedidos
  fetchOrders();
});



function renderOrder(order) {
  // Revisar si el pedido está oculto
  const hiddenOrders = JSON.parse(localStorage.getItem("hiddenOrders") || "[]");
  if (hiddenOrders.includes(order.id)) return; // no renderiza

  const orderCard = document.createElement("div");
  orderCard.className = "order-card";

  orderCard.innerHTML = `
    <div class="order-header">
      <span class="order-number">Pedido #${order.id}</span>
      <span class="order-status">${order.status}</span>
    </div>
    <div class="order-footer">
      <span>Total: $${order.total}</span>
      <span class="tracking-number">Seguimiento: N/A</span>
      <button class="delete-btn">Eliminar</button>
    </div>
  `;

  // Abrir modal al hacer clic
  orderCard.addEventListener("click", e => {
    if (e.target.classList.contains("delete-btn")) return;
    showModal(order);
  });

  // Botón eliminar
  const deleteBtn = orderCard.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    orderCard.style.display = "none"; // oculta la tarjeta

    // Guardar ID en LocalStorage para mantener oculto
    hiddenOrders.push(order.id);
    localStorage.setItem("hiddenOrders", JSON.stringify(hiddenOrders));
  });

  ordersContainer.appendChild(orderCard);
}
