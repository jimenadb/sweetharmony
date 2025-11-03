document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("tablaPedidos");
    const modal = document.getElementById("modalEstado");
    const cerrarModal = document.getElementById("cerrarModalEstado");
    const formEstado = document.getElementById("formActualizarEstado");
    const pedidoSeleccionado = document.getElementById("pedidoSeleccionado");
    const btnVerDetalles = document.getElementById("btnVerDetalles");
    const btnEliminar = document.getElementById("btnEliminarPedido");
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
  
    function cargarPedidos() {
      fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/get_orders.php")
      //fetch("http://158.69.214.32/ximena_flores/sweetharmony/admin_dashboard/php/get_orders.php")
        .then(res => res.json())
        .then(data => {
          tabla.innerHTML = "";
          data.forEach(order => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
              <td><input type="radio" name="pedidoSeleccionado" value="${order.id}"></td>
              <td>${order.id}</td>
              <td>${order.user_id}</td>
              <td>S/ ${order.total}</td>
              <td>${estadoMap[order.status]}</td> <!-- Aquí se traduce -->
              <td>${order.delivery_address_id}</td>
              <td>${order.created_at}</td>
              <td><button class="btnEditarEstado" data-id="${order.id}" data-status="${order.status}">Editar</button></td>
            `;
            tabla.appendChild(fila);
          });
  
          // --- Selección de pedido ---
          document.querySelectorAll('input[name="pedidoSeleccionado"]').forEach(radio => {
            radio.addEventListener("change", (e) => {
              pedidoActivo = e.target.value;
              pedidoSeleccionado.textContent = `Pedido seleccionado: #${pedidoActivo}`;
  
              // Quitar resaltado previo
              document.querySelectorAll("#tablaPedidos tr").forEach(tr => tr.classList.remove("selected"));
              e.target.closest("tr").classList.add("selected");
            });
          });
  
          // --- Botón Editar estado ---
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
  
    cerrarModal.addEventListener("click", () => modal.classList.remove("active"));
  
    formEstado.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(formEstado);
  
      fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/update_orders.php", {
      //fetch("http://158.69.214.32/ximena_flores/sweetharmony/admin_dashboard/php/update_orders.php", {
        method: "POST",
        body: formData
      })
        .then(res => res.text())
        .then(data => {
          alert(data);
          modal.classList.remove("active");
          cargarPedidos();
        })
        .catch(err => console.error("Error actualizando:", err));
    });
  
    btnVerDetalles.addEventListener("click", () => {
        if (!pedidoActivo) { alert("Selecciona un pedido primero."); return; }
    
        fetch(`../php/get_details_orders.php?order_id=${pedidoActivo}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) { alert(data.error); return; }
    
                const modalDetalles = document.createElement("div");
                modalDetalles.classList.add("modal-detalles");
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
                          ${p.image_url ? `<img src="${p.image_url}">` : ''}
                          ${p.product_name} — ${p.quantity} x S/ ${p.price}
                        </li>
                      `).join("")}
                    </ul>
                    <button id="descargarPDF">Descargar PDF</button>
                  </div>
                `;
                document.body.appendChild(modalDetalles);
                modalDetalles.classList.add("active");
    
                modalDetalles.querySelector(".close").addEventListener("click", () => modalDetalles.remove());
    
                // Botón descargar PDF
                document.getElementById("descargarPDF").addEventListener("click", () => {
                    const { jsPDF } = window.jspdf; // 👈 Importación correcta
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
    
    
  
    // // --- Eliminar pedido ---
    // btnEliminar.addEventListener("click", () => {
    //   if (!pedidoActivo) {
    //     alert("Selecciona un pedido para eliminar.");
    //     return;
    //   }
    //   if (confirm(`¿Seguro que deseas eliminar el pedido #${pedidoActivo}?`)) {
    //     // Aquí iría la lógica del fetch para eliminar
    //     alert(`Pedido #${pedidoActivo} eliminado (simulación).`);
    //   }
    // });
  
    cargarPedidos();
  });
  
  