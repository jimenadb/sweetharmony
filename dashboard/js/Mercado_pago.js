document.getElementById("mp-btn").addEventListener("click", async () => {

    // Validar envío
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    if (!selectedShipping) {
      alert("Seleccione un tipo de envío antes de pagar");
      return;
    }
  
    // Si es delivery, validar dirección
    if (selectedShipping.value === "domicilio") {
      const address = document.getElementById("select-address").value;
      if (!address) {
        alert("Seleccione una dirección de entrega");
        return;
      }
    }
  
    // Crear preferencia Mercado Pago
    const res = await fetch(
      "http://localhost/sweetharmony/sweetharmony/dashboard/php/create_mp_preference.php",
      { credentials: "include" }
    );
  
    const data = await res.json();
  
    if (!data.id) {
      alert("Error al iniciar pago");
      return;
    }
  
    // Redirigir a Mercado Pago
    window.location.href =
      `https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=${data.id}`;
  });