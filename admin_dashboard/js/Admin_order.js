document.addEventListener("DOMContentLoaded", () => {
  // ==============================
  // ELEMENTOS DEL DOM
  // ==============================
  const tabla = document.getElementById("tablaPedidos");
  const modal = document.getElementById("modalEstado");
  const modalenvio = document.getElementById("modalDatosEnvio");
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
              Editar Estado
            </button>
          </td>
           <td>
            <button class="btnEditarEnvio" 
        data-id="${order.id}" 
        data-courier="${order.courier || ''}" 
        data-tracking="${order.tracking_number || ''}" 
        data-notes="${order.shipping_notes || ''}">
  Editar Envío
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


        // ==============================
        // EVENTO: ABRIR MODAL EDITAR ENVÍO
        // ==============================
        document.querySelectorAll(".btnEditarEnvio").forEach(btn => {
          btn.addEventListener("click", (e) => {
            const button = e.currentTarget; // Esto asegura que es el botón
            const orderId = button.dataset.id;
            const courier = button.dataset.courier || "";
            const tracking = button.dataset.tracking || "";
            const notes = button.dataset.notes || "";
        
            // Asignar valores al modal
            document.getElementById("order_id_envio").value = orderId;
            document.getElementById("courier").value = courier;
            document.getElementById("tracking_number").value = tracking;
            document.getElementById("shipping_notes").value = notes;
        
            // Mostrar el modal
            modalenvio.classList.add("active");
          });
        });
        

        // ==============================
        // EVENTO: CERRAR MODAL ENVÍO
        // ==============================
        document.getElementById("cerrarModalEnvio").addEventListener("click", () => {
          modalenvio.classList.remove("active");
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
// EVENTO: ACTUALIZAR DATOS DE ENVÍO
// ==============================
const formActualizarEnvio = document.getElementById("formActualizarEnvio");

formActualizarEnvio.addEventListener("submit", async (e) => {
  e.preventDefault();

  const orderId = document.getElementById("order_id_envio").value;
  const courier = document.getElementById("courier").value;
  const trackingNumber = document.getElementById("tracking_number").value;
  const shippingNotes = document.getElementById("shipping_notes").value;
  const shippingReceiptFile = document.getElementById("shipping_receipt").files[0];

  try {
    const formData = new FormData();
    formData.append("order_id", orderId);
    formData.append("courier", courier);
    formData.append("tracking_number", trackingNumber);
    formData.append("shipping_notes", shippingNotes);
    if (shippingReceiptFile) formData.append("shipping_receipt", shippingReceiptFile);

    // 🔹 Enviar al backend
    const res = await fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/update_shipping.php", {
      method: "POST",
      body: formData
    });
    const result = await res.json();

    if (result.success) {
      alert("✅ Envío actualizado correctamente");
      modalenvio.classList.remove("active");
      cargarPedidos(); // refresca la tabla
    } else {
      alert("⚠️ Error al actualizar el envío: " + result.message);
    }

  } catch (error) {
    console.error("Error al actualizar el envío:", error);
    alert("❌ Ocurrió un error al guardar los datos de envío");
  }
});

// ==============================
// EVENTO: VER DETALLES DEL PEDIDO
// ==============================
btnVerDetalles.addEventListener("click", () => {
  if (!pedidoActivo) {
    alert("Selecciona un pedido primero.");
    return;
  }

  fetch(`http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/get_details_orders.php?order_id=${pedidoActivo}`)
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

          <h4>Cliente:</h4>
          <p><strong>Nombre:</strong> ${data.full_name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>DNI:</strong> ${data.dni}</p>

          <h4>Dirección de entrega:</h4>
          <p>${data.address}, ${data.district}, ${data.city}, ${data.postal_code}</p>
          <p><strong>Referencia:</strong> ${data.reference}</p>

          <p><strong>Estado:</strong> ${data.status}</p>
          <p><strong>Total:</strong> S/ ${data.total}</p>

          <h4>Comprobante de pago:</h4>
          ${data.receipt ? `<img src="../../${data.receipt}" style="max-width:200px; display:block; margin-bottom:1rem;">` : `<p>No hay comprobante</p>`}

          <h4>Envío:</h4>
          <p><strong>Courier:</strong> ${data.courier || '-'}</p>
          <p><strong>Tracking:</strong> ${data.tracking_number || '-'}</p>
          <p><strong>Notas:</strong> ${data.shipping_notes || '-'}</p>
          <h4>Comprobante de envío:</h4>
          ${data.shipping_receipt 
            ? `<img src="../../uploads/shipping_receipts/${data.shipping_receipt}" style="max-width:200px; display:block; margin-bottom:1rem;">`
            : `<p>No hay comprobante de envío</p>`}
          <hr>
          <hr>
          <h4>Productos:</h4>
          <ul>
            ${data.productos.map(p => `
              <li>
                ${p.image_url ? `<img src="../../uploads/${p.image_url}" style="width:40px; vertical-align:middle; margin-right:5px;">` : ""}
                ${p.product_name} — ${p.quantity} x S/ ${p.price}
              </li>
            `).join("")}
          </ul>

          <button id="descargarPDF">Descargar PDF</button>
        </div>
      `;
      document.body.appendChild(modalDetalles);
      modalDetalles.classList.add("active");

      // Cerrar modal
      modalDetalles.querySelector(".close").addEventListener("click", () => modalDetalles.remove());

      // Descargar PDF
      document.getElementById("descargarPDF").addEventListener("click", () => {
        const modalContent = modalDetalles.querySelector(".modal-content");
      
        // Opciones para html2pdf
        const opt = {
          margin:       0.5,
          filename:     `Pedido_${data.id}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, logging: true, useCORS: true },
          jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
      
        html2pdf().set(opt).from(modalContent).save();
      });

    })
    .catch(err => console.error(err));
});

  // ==============================
  // INICIALIZACIÓN
  // ==============================
  cargarPedidos();
});