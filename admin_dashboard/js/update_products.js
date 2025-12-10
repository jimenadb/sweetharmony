
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("catalogoForm");
    const modal = document.getElementById("modalAgregar");
    
    // 🔹 modoEditar global
    window.modoEditar = false;
  
    // Cuando el usuario hace clic en el botón editar
    document.getElementById("btnEditar").addEventListener("click", () => {
      if (!window.productoSeleccionado) {
        alert("Selecciona un producto primero");
        return;
      }
  
      window.modoEditar = true;
      modal.style.display = "block";
  
      // Rellenar los campos del formulario
      document.getElementById("product_name").value = window.productoSeleccionado.product_name;
      document.getElementById("price").value = window.productoSeleccionado.price;
      document.getElementById("units").value = window.productoSeleccionado.units;
  
      // Crear o asignar input oculto con el ID
      let inputId = document.getElementById("product_id");
      if (!inputId) {
        inputId = document.createElement("input");
        inputId.type = "hidden";
        inputId.id = "product_id";
        inputId.name = "id";
        form.appendChild(inputId);
      }
      inputId.value = window.productoSeleccionado.id;
    });
  
    // Envío del formulario solo si está en modo editar
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!window.modoEditar) return; // 🚫 evita que se cree un nuevo producto
  
      const formData = new FormData(form);
      try {
        const res = await fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/update_products.php", {
          method: "POST",
          body: formData
        });
        const data = await res.json();
  
        if (data.success) {
          alert("Producto actualizado correctamente");
          modal.style.display = "none";
          window.modoEditar = false; 
          form.reset();
          window.cargarProductos(); 
        } else {
          alert("Error: " + data.message);
        }
      } catch (err) {
        console.error(err);
        alert("Error de conexión");
      }
    });
  });
  