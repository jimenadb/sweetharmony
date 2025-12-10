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

            <td>${order.id}</td>
            <td>${order.cliente || 'Cliente'}</td>
            <td>S/ ${order.total}</td>
            <td>${estadoMap[order.status]}</td>
            <td>${order.direccion || 'Retiro en tienda' }</td>
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
          <td>
            <button class="btnVerPedido" data-id="${order.id}">Datos Pedido</button>
          </td>
          `;
          tabla.appendChild(fila);
        });

        // ==============================
        // EVENTO: SELECCIONAR PEDIDO
        // ==============================
        // document.querySelectorAll('input[name="pedidoSeleccionado"]').forEach(radio => {
        //   radio.addEventListener("change", (e) => {
        //     pedidoActivo = e.target.value;
        //     pedidoSeleccionado.textContent = `Pedido seleccionado: #${pedidoActivo}`;

        //     // Quitar resaltado previo y aplicar al nuevo
        //     document.querySelectorAll("#tablaPedidos tr").forEach(tr => tr.classList.remove("selected"));
        //     e.target.closest("tr").classList.add("selected");
        //   });
        // });

        // ==============================
        // EVENTO: ABRIR MODAL EDITAR ESTADO
        // ==============================
        document.querySelectorAll(".btnEditarEstado").forEach(btn => {
          btn.addEventListener("click", e => {
            const orderId = e.target.dataset.id;
            const currentStatus = e.target.dataset.status || "processing";
            
            document.getElementById("order_id").value = orderId;
            const selectStatus = document.getElementById("status");
            selectStatus.value = currentStatus;
        
            // Oculta los estados anteriores al actual !!!!!!!
            const options = Array.from(selectStatus.options);
            const currentIndex = options.findIndex(op => op.value === currentStatus);
            
            options.forEach((opt, i) => {
              opt.hidden = i < currentIndex; // los anteriores se ocultan
            });
        
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
        // EVENTO: VER DETALLES DEL PEDIDO (delegado)
        // ==============================
        tabla.addEventListener("click", (e) => {
          if (e.target.classList.contains("btnVerPedido")) {
            const orderId = e.target.dataset.id;
            verDetallesPedido(orderId);
          }
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

    // Enviar al backend
    const res = await fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/update_shipping.php", {
      method: "POST",
      body: formData
    });
    const result = await res.json();

    if (result.success) {
      //  Actualiza el estado a 'shipped' y envía el correo
      try {
        const resStatus = await fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/send_email_status.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderId,
            new_status: "shipped",
            courier,
            tracking_number
          })
        });
        const statusResult = await resStatus.json();
    
        if (statusResult.error) {
          alert("Pedido actualizado pero error al cambiar estado: " + statusResult.error);
        } else {
          alert("Envío actualizado y estado del pedido cambiado a 'Enviado'. Correo enviado al cliente.");
        }
      } catch (err) {
        console.error("Error al actualizar estado del pedido:", err);
        alert("Envío actualizado pero hubo un error al actualizar el estado del pedido.");
      }
    
      //  Cerrar modal y refrescar tabla
      modalenvio.classList.remove("active");
      cargarPedidos(); 
    } else {
      alert("Error al actualizar el envío: " + result.message);
    }
    

  } catch (error) {
    console.error("Error al actualizar el envío:", error);
    alert("Ocurrió un error al guardar los datos de envío");
  }
});

  // ==============================
  // INICIALIZACIÓN
  // ==============================
  cargarPedidos();
});


// ==============================
// FUNCIÓN: VER DETALLES DEL PEDIDO
// ==============================
function verDetallesPedido(orderId) {
  fetch(`http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/get_details_orders.php?order_id=${orderId}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
        return;
      }

      const modalDetalles = document.createElement("div");
      modalDetalles.classList.add("modal-detalles", "active");
modalDetalles.innerHTML = `
  <div class="modal-content">
    <span class="close">&times;</span>

    <h3>Pedido N°${data.id}</h3>

    <p><strong>Estado:</strong> ${estadoMap[data.status] || data.status}</p>
    <p><strong>Fecha:</strong> ${data.created_at || "-"}</p>
    <p><strong>Total:</strong> S/ ${data.total}</p>
    <p><strong>Tipo de envio:</strong> ${data.delivery_type}</p>

    <hr>

    <h4>Productos</h4>
    <ul>
      ${
        data.productos?.length
          ? data.productos
              .map(item => `
                <li>
                  <img src="../../uploads/${item.image_url}" alt="producto">
                  <div class="product-info">
                    <p><strong>${item.product_name}</strong></p>
                    <p>Cantidad: ${item.quantity}</p>
                    <p>Precio unitario: S/ ${Number(item.price).toFixed(2)}</p>
                    <p><strong>Total: S/ ${(item.quantity * item.price).toFixed(2)}</strong></p>
                  </div>
                </li>
              `)
              .join("")
          : "<p>No hay productos registrados</p>"
      }
    </ul>

    <hr>

    <h4>Comprobante de pago</h4>
    ${
      data.receipt
        ? `<img src="../../${data.receipt}" class="modal-img-box">`
        : "<p>No se ha subido comprobante de pago.</p>"
    }

    <h4>Datos del cliente</h4>
    <p><strong>Nombre:</strong> ${data.cliente || "N/A"}</p>
    <p><strong>DNI:</strong> ${data.dni || "N/A"}</p>
    <p><strong>Email:</strong> ${data.email || "N/A"}</p>
    <p><strong>Dirección:</strong> ${data.direccion || "N/A"}</p>
    <p><strong>Referencia:</strong> ${data.reference || "N/A"}</p>

    <h4>Datos de Envío</h4>
    <p><strong>Courier:</strong> ${data.courier || "-"}</p>
    <p><strong>Tracking:</strong> ${data.tracking_number || "-"}</p>
    <p><strong>Notas:</strong> ${data.shipping_notes || "-"}</p>

    <h4>Comprobante de envío</h4>
    ${
      data.shipping_receipt
        ? `<img src="../../uploads/shipping_receipts/${data.shipping_receipt}" class="modal-img-box">`
        : "<p>No hay comprobante de envío</p>"
    }

    <button id="descargarPDF">Descargar PDF</button>
  </div>
`;


      document.body.appendChild(modalDetalles);
      modalDetalles.classList.add("active");

      modalDetalles.querySelector(".close").addEventListener("click", () => modalDetalles.remove());

      document.getElementById("descargarPDF").addEventListener("click", () => {

        // Clonar contenido del modal
        let cleanContent = modalDetalles.querySelector(".modal-content").cloneNode(true);
      
        // --- Crear wrapper oculto pero en el DOM ---
        const hiddenWrapper = document.createElement("div");
        hiddenWrapper.style.position = "absolute";
        hiddenWrapper.style.left = "-9999px";
        hiddenWrapper.style.top = "0";
        hiddenWrapper.style.width = "800px"; /* ancho consistente */
        document.body.appendChild(hiddenWrapper);
      
        hiddenWrapper.appendChild(cleanContent);
      
        // ---------- LIMPIAR ELEMENTOS QUE NO DEBEN IR AL PDF ----------
        cleanContent.querySelectorAll(".close, #descargarPDF").forEach(el => el?.remove());
      
        // ---------- Estilos para que NO se corte ----------
        cleanContent.style.width = "100%";
        cleanContent.style.boxShadow = "none";
        cleanContent.style.borderRadius = "0";
        cleanContent.style.padding = "20px";
        cleanContent.style.background = "#fff";
      
        // ---------- Forzar que html2canvas no corte texto ----------
        cleanContent.style.pageBreakInside = "avoid";
      
        // ---------- Ajuste de imágenes ----------
        cleanContent.querySelectorAll("img").forEach(img => {
          img.style.maxWidth = "130px";
          img.style.width = "100px";
          img.style.height = "130px";
          img.style.objectFit = "cover";
          img.style.borderRadius = "8px";
          img.style.display = "block";
          img.style.margin = "10px 0";
        });
        cleanContent.querySelectorAll("li").forEach(li => {
          li.style.display = "flex";
          li.style.alignItems = "flex-start";
          li.style.gap = "10px";
          li.style.pageBreakInside = "avoid";  // ❗ evita cortes
        });
        
        cleanContent.querySelectorAll(".product-info p").forEach(p => {
          p.style.margin = "2px 0";
          p.style.pageBreakInside = "avoid";  // ❗ no corta texto
        });
      
        const opt = {
          margin: 0.5,
          filename: `Pedido_${data.id}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            scrollX: 0,
            scrollY: 0
          },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
      
        // Esperar carga de imágenes
        setTimeout(() => {
          html2pdf()
            .set(opt)
            .from(cleanContent)
            .save()
            .then(() => hiddenWrapper.remove());
        }, 300);
      });
      
    })
    .catch(err => console.error("Error al cargar detalles:", err));
}
