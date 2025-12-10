document.getElementById('place-order').addEventListener('click', async () => {
  const selectAddress = document.getElementById('select-address');
  const delivery_address_id = parseInt(selectAddress.value);
  const yapeInput = document.getElementById('yape-proof');
  const file = yapeInput?.files[0];
  const shippingSelected = document.querySelector('input[name="shipping"]:checked').value;
  const delivery_type = shippingSelected === 'domicilio' ? 'delivery' : 'retiro';
  

  // Validaciones
  if (delivery_type === 'delivery' && !delivery_address_id) {
    alert("Selecciona una dirección de entrega");
    return;
  }

  if (!file) {
    alert("⚠️ Por favor sube tu comprobante de Yape antes de continuar.⚠️");
    return;
  }

  try {
    
    // Crear FormData correctamente
    const formData = new FormData();
    formData.append('delivery_type', delivery_type);

    // Solo agregar dirección si es delivery
    if (delivery_type === 'delivery') {
      formData.append('delivery_address_id', delivery_address_id);
    }

    formData.append('yape-proof', file);

    // Enviar al backend
    const res = await fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/place_order.php', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (data.success) {
      alert(`Pedido realizado correctamente.\nNúmero de seguimiento: ${data.order_id}`);
      location.reload();
    } else {
      alert(`Error: ${data.message}`);
    }

  } catch (err) {
    console.error("Error al realizar pedido:", err);
    alert("Ocurrió un error al generar el pedido");
  }
});




// document.getElementById('place-order').addEventListener('click', async () => {
//   const selectAddress = document.getElementById('select-address');
//   const delivery_address_id = parseInt(selectAddress.value);
//   const yapeInput = document.getElementById('yape-proof');
//   const file = yapeInput?.files[0];
  

//   // Validaciones
//   if (!delivery_address_id) {
//     alert("Selecciona una dirección de entrega");
//     return;
//   }

//   if (!file) { // <-- aquí bloqueas si no hay comprobante
//     alert("⚠️ Por favor sube tu comprobante de Yape antes de continuar.⚠️");
//     return;
//   }

//   try {
//     const formData = new FormData();
//     formData.append('delivery_address_id', delivery_address_id);
//     formData.append('yape-proof', file);

//     const res = await fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/place_order.php', {
//       method: 'POST',
//       body: formData
//     });

//     const data = await res.json();
//     if (data.success) {
//       alert(`Pedido realizado correctamente.\nNúmero de seguimiento: ${data.order_id}`);
//       location.reload();
//     } else {
//       alert(`Error: ${data.message}`);
//     }

//   } catch (err) {
//     console.error("Error al realizar pedido:", err);
//     alert("Ocurrió un error al generar el pedido");
//   }
// });
