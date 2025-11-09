document.getElementById('generate_description').addEventListener('click', async () => {
  const nombre = document.getElementById('product_name').value.trim();
  const status = document.getElementById('status_desc');

  if (!nombre) {
    alert("Ingresa el nombre del producto primero");
    return;
  }

  status.innerText = "Generando descripción...";

  try {
    const res = await fetch('http://localhost/sweetharmony/sweetharmony/admin_dashboard/IAdescripcion/descripcion.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: document.getElementById('product_name').value })
      });
      
      const data = await res.json();
      document.getElementById('description').value = data.descripcion;

    if (data.descripcion) {
      document.getElementById('description').value = data.descripcion;
      status.innerText = "¡Descripción generada!";
    } else {
      status.innerText = "Error al generar descripción";
      console.log(data);
    }

  } catch (err) {
    status.innerText = "Error de conexión";
    console.error(err);
  }
});

