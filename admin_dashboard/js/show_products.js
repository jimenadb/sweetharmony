document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("tablaProductos");
  const panelAcciones = document.getElementById("accionesProducto");
  const spanProducto = document.getElementById("productoSeleccionado");
  let productoSeleccionado = null;

  function cargarProductos() {
    fetch("http://158.69.214.32/ximena_flores/sweetharmony/admin_dashboard/php/show_products.php")
      .then(res => res.json())
      .then(productos => {
        tabla.innerHTML = "";
        productos.forEach(p => {
          const tr = document.createElement("tr");
          tr.dataset.id = p.id; 
          tr.innerHTML = `
            <td><img src="${p.image_url || '../assets/default.jpg'}" alt="${p.product_name}" style="width:50px;height:50px;object-fit:cover;"></td>
            <td>${p.product_name || '-'}</td>
            <td>${p.product_type || '-'}</td>
            <td>${p.plant_type || '-'}</td>
            <td>${p.price != null ? '$' + p.price : '-'}</td>
            <td>${p.discount != null ? p.discount + '%' : '-'}</td>
            <td>${p.plant_height != null ? p.plant_height + 'cm' : '-'}</td>
            <td>${p.plant_width != null ? p.plant_width + 'cm' : '-'}</td>
            <td>${p.pot_height != null ? p.pot_height + 'cm' : '-'}</td>
            <td>${p.pot_width != null ? p.pot_width + 'cm' : '-'}</td>
            <td>${p.pot_color || '-'}</td>
            <td>${p.weight != null ? p.weight + 'kg' : '-'}</td>
            <td><input type="number" class="unidades-input" value="${p.units != null ? p.units : 0}" min="0" style="width:60px;text-align:center;"></td>
          `;
          tr.addEventListener("click", () => {
            productoSeleccionado = p;
            panelAcciones.style.display = "block";
            spanProducto.textContent = `Producto seleccionado: ${p.product_name}`;
          });
          tabla.appendChild(tr);
        });
      });
  }

  document.getElementById("btnEditar").addEventListener("click", () => {
    if (productoSeleccionado) alert(`Editar producto: ${productoSeleccionado.product_name}`);
  });

  document.getElementById("btnEliminar").addEventListener("click", async () => {
    if (!productoSeleccionado) return alert("Selecciona un producto");
  
    const confirmDelete = confirm(`¿Seguro que deseas eliminar: ${productoSeleccionado.product_name}?`);
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`http://158.69.214.32/ximena_flores/sweetharmony/admin_dashboard/php/delete_products.php?id=${productoSeleccionado.id}`, {
        method: "GET"
      });
      const data = await res.json();
  
      if (data.success) {
        alert("Producto eliminado correctamente");
        productoSeleccionado = null;
        panelAcciones.style.display = "none";
        cargarProductos(); // recarga la tabla para reflejar el cambio
      } else {
        alert("Error al eliminar producto: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión al eliminar");
    }
  });

  cargarProductos();
});


