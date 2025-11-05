document.addEventListener("DOMContentLoaded", () => {
  // ==============================
  // ELEMENTOS DEL DOM
  // ==============================
  const tabla = document.getElementById("tablaPedidos");
  const modal = document.getElementById("modalEstado");
  const cerrarModal = document.getElementById("cerrarModalEstado");
  const formEstado = document.getElementById("formActualizarEstado");
  const pedidoSeleccionado = document.getElementById("pedidoSeleccionado");
  const btnVerDetalles = document.getElementById("btnVerDetalles");

  // Mapa de estados traducidos
  const estadoMap = {
    pending: "Pendiente",
    paid: "Pagado",
    processing: "En proceso",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
    completed: "Completado"
  };

  let pedidoActivo = null; // Guarda el pedido seleccionado


  // ==============================
  // FUNCIÓN: CARGAR PEDIDOS
  // ==============================
  function cargarPedidos() {
    fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/get_orders.php")
      .then(res => res.json())
      .then(data => {
        tabla.innerHTML = "";
        data.forEach(order => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td><input type="radio" name="pedidoSeleccionado" value="${order.id}"></td>
            <td>${order.id}</td>
            <td>${order.cliente}</td>
            <td>S/ ${order.total}</td>
            <td>${estadoMap[order.status]}</td>
            <td>${order.direccion}</td>
            <td>${order.created_at}</td>
            <td>
              <button class="btnEditarEstado" data-id="${order.id}" data-status="${order.status}">
                Editar
              </button>
            </td>
          `;
          tabla.appendChild(fila);
        });

        // ==============================
        // EVENTO: SELECCIONAR PEDIDO
        // ==============================
        document.querySelectorAll('input[name="pedidoSeleccionado"]').forEach(radio => {
          radio.addEventListener("change", (e) => {
            pedidoActivo = e.target.value;
            pedidoSeleccionado.textContent = `Pedido seleccionado: #${pedidoActivo}`;

            // Quitar resaltado previo y aplicar al nuevo
            document.querySelectorAll("#tablaPedidos tr").forEach(tr => tr.classList.remove("selected"));
            e.target.closest("tr").classList.add("selected");
          });
        });

        // ==============================
        // EVENTO: ABRIR MODAL EDITAR ESTADO
        // ==============================
        document.querySelectorAll(".btnEditarEstado").forEach(btn => {
          btn.addEventListener("click", (e) => {
            document.getElementById("order_id").value = e.target.dataset.id;
            document.getElementById("status").value = e.target.dataset.status;
            modal.classList.add("active");
          });
        });
      })
      .catch(err => console.error("Error cargando pedidos:", err));
  }


  // ==============================
  // EVENTO: CERRAR MODAL DE ESTADO
  // ==============================
  cerrarModal.addEventListener("click", () => modal.classList.remove("active"));


  // ==============================
  // EVENTO: ACTUALIZAR ESTADO DEL PEDIDO
  // ==============================
  formEstado.addEventListener("submit", async (e) => {
    e.preventDefault();

    const orderId = document.getElementById("order_id").value;
    const newStatus = document.getElementById("status").value;

    try {
      // Actualiza estado en la base de datos
      const formData = new FormData(formEstado);
      const resUpdate = await fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/update_orders.php", {
        method: "POST",
        body: formData
      });
      const textUpdate = await resUpdate.text();
      alert(textUpdate);

      // Envía correo al cliente
      const response = await fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/send_email_status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, new_status: newStatus })
      });
      const result = await response.json();
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.error);
      }

    } catch (error) {
      console.error(error);
      alert("Ocurrió un error.");
    }

    modal.classList.remove("active");
    cargarPedidos();
  });


  // ==============================
  // EVENTO: VER DETALLES DEL PEDIDO
  // ==============================
  btnVerDetalles.addEventListener("click", () => {
    if (!pedidoActivo) {
      alert("Selecciona un pedido primero.");
      return;
    }

    fetch(`../php/get_details_orders.php?order_id=${pedidoActivo}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
          return;
        }

        // Crear modal dinámico
        const modalDetalles = document.createElement("div");
        modalDetalles.classList.add("modal");
        modalDetalles.innerHTML = `
          <div class="modal-content">
            <span class="close">&times;</span>
            <h3>Pedido #${data.id}</h3>
            <p><strong>Cliente:</strong> ${data.cliente}</p>
            <p><strong>Dirección:</strong> ${data.address}, ${data.district}, ${data.city}, ${data.postal_code}</p>
            <p><strong>Referencia:</strong> ${data.reference}</p>
            <p><strong>Estado:</strong> ${data.status}</p>
            <p><strong>Total:</strong> S/ ${data.total}</p>
            <hr>
            <h4>Productos:</h4>
            <ul>
              ${data.productos.map(p => `
                <li>
                  ${p.image_url ? `<img src="${p.image_url}" style="width:40px; vertical-align:middle; margin-right:5px;">` : ""}
                  ${p.product_name} — ${p.quantity} x S/ ${p.price}
                </li>
              `).join("")}
            </ul>
            <button id="descargarPDF">Descargar PDF</button>
          </div>
        `;
        document.body.appendChild(modalDetalles);
        modalDetalles.classList.add("active");

        // Cerrar modal de detalles
        modalDetalles.querySelector(".close").addEventListener("click", () => modalDetalles.remove());

        // Descargar PDF
        document.getElementById("descargarPDF").addEventListener("click", () => {
          const { jsPDF } = window.jspdf;
          const doc = new jsPDF();
          doc.setFontSize(14);
          doc.text(`Pedido #${data.id}`, 10, 10);
          doc.text(`Cliente: ${data.cliente}`, 10, 20);
          doc.text(`Dirección: ${data.address}, ${data.district}, ${data.city}, ${data.postal_code}`, 10, 30);
          doc.text(`Referencia: ${data.reference}`, 10, 40);
          doc.text(`Estado: ${data.status}`, 10, 50);
          doc.text(`Total: S/ ${data.total}`, 10, 60);
          doc.text("Productos:", 10, 70);
          let y = 80;
          data.productos.forEach(p => {
            doc.text(`${p.product_name} — ${p.quantity} x S/ ${p.price}`, 10, y);
            y += 10;
          });
          doc.save(`Pedido_${data.id}.pdf`);
        });
      })
      .catch(err => console.error(err));
  });


  // ==============================
  // INICIALIZACIÓN
  // ==============================
  cargarPedidos();
});
