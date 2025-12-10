
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
  