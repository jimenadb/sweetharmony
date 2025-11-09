document.getElementById('place-order').addEventListener('click', async () => {
    const selectAddress = document.getElementById('select-address');
    const delivery_address_id = parseInt(selectAddress.value);
    const yapeInput = document.getElementById('yape-proof');
    const file = yapeInput?.files[0];
  
    if (!delivery_address_id) {
      alert("Selecciona una dirección de entrega");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('delivery_address_id', delivery_address_id);
      if (file) formData.append('yape-proof', file);
  
      const res = await fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/place_order.php', {
        method: 'POST',
        body: formData
      });
  
      const data = await res.json();
      if (data.success) {

        
        alert(`✅ Pedido realizado correctamente.\nNúmero de seguimiento: ${data.order_id}`);
        location.reload();
      } else {
        alert(`⚠️ Error: ${data.message}`);
      }


  
    } catch (err) {
      console.error("Error al realizar pedido:", err);
      alert("Ocurrió un error al generar el pedido");
    }
  });
  