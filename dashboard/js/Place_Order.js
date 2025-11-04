document.getElementById('place-order').addEventListener('click', async () => {
    const selectAddress = document.getElementById('select-address');
    const delivery_address_id = parseInt(selectAddress.value); // <-- convertimos a número
  
    if (!delivery_address_id) {
      alert("Selecciona una dirección de entrega");
      return;
    }

    
  
    try {
      const res = await fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/place_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_address_id })
      });
      const data = await res.json();
  
      if (data.success) {
        alert(`✅ Pedido realizado correctamente.\nNúmero de seguimiento: ${data.order_id}`);
        location.reload();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al generar el pedido");
    }
  });
  