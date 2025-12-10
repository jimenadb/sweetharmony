document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/get_tipos_catalogo.php") // 🔹 Ajusta la ruta si está en otro lugar
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          console.error("Error al cargar tipos:", data.message);
          return;
        }
  
        const productSelect = document.getElementById("product_types");
        const plantSelect = document.getElementById("plant_types");
  
        // Limpiar selects
        productSelect.innerHTML = '<option value="">-- Selecciona --</option>';
        plantSelect.innerHTML = '<option value="">-- Selecciona --</option>';
  
        // Agregar opciones de tipos de producto
        data.product_types.forEach(pt => {
          const opt = document.createElement("option");
          opt.value = pt.id;       // Guarda el ID real (FK)
          opt.textContent = pt.name; // Muestra el nombre
          productSelect.appendChild(opt);
        });
  
        // Agregar opciones de tipos de planta
        data.plant_types.forEach(pt => {
          const opt = document.createElement("option");
          opt.value = pt.id;
          opt.textContent = pt.name;
          plantSelect.appendChild(opt);
        });
      })
      .catch(err => console.error("Error al obtener tipos:", err));
  });