document.addEventListener("DOMContentLoaded", () => {
  const ordersContainer = document.querySelector(".orders-container");

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
    ordersContainer.appendChild(orderCard);
  }

  fetchOrders();
});
