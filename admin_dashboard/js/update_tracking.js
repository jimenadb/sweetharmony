// Modal Estado
document.querySelectorAll(".btnEditarEstado").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const orderId = e.target.dataset.id;
      const status = e.target.dataset.status;
  
      document.getElementById("order_id_estado").value = orderId;
      document.getElementById("status").value = status;
  
      document.getElementById("modalActualizarEstado").classList.add("active");
    });
  });
  
  // Modal Envío
  document.querySelectorAll(".btnEditarEnvio").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const orderId = e.target.dataset.id;
      const courier = e.target.dataset.courier || '';
      const tracking = e.target.dataset.tracking || '';
      const notes = e.target.dataset.notes || '';
  
      document.getElementById("order_id_envio").value = orderId;
      document.getElementById("courier").value = courier;
      document.getElementById("tracking_number").value = tracking;
      document.getElementById("shipping_notes").value = notes;
  
      document.getElementById("modalDatosEnvio").classList.add("active");
    });
  });
  
  // Cerrar modales
  document.getElementById("cerrarModalEstado").onclick = () => {
    document.getElementById("modalActualizarEstado").classList.remove("active");
  };
  document.getElementById("cerrarModalEnvio").onclick = () => {
    document.getElementById("modalDatosEnvio").classList.remove("active");
  };
  