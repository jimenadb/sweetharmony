function cargarProductos() {
    const tabla = document.getElementById("tablaProductos");
  
    fetch("http://158.69.214.32/ximena_flores/sweetharmony/panel_admin/php/get_products.php")
      .then(res => res.json())
      .then(productos => {
        tabla.innerHTML = "";
  
        if (!productos.length) {
          tabla.innerHTML = `<tr><td colspan="13">No hay productos registrados</td></tr>`;
          return;
        }
  
        productos.forEach(p => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td><img src="${p.image_url || '../assets/default.jpg'}" alt="${p.product_name}" style="width:50px;height:50px;object-fit:cover;"></td>
            <td>${p.product_name}</td>
            <td>${p.product_type || '-'}</td>
            <td>${p.plant_type || '-'}</td>
            <td>${p.price}</td>
            <td>${p.discount}</td>
            <td>${p.plant_height || '-'}</td>
            <td>${p.plant_width || '-'}</td>
            <td>${p.pot_height || '-'}</td>
            <td>${p.pot_width || '-'}</td>
            <td>${p.pot_color || '-'}</td>
            <td>${p.weight || '-'}</td>
            <td>
              <button class="btnEditar" data-id="${p.id}">Editar</button>
              <button class="btnEliminar" data-id="${p.id}">Eliminar</button>
              <button class="btnGuardar" data-id="${p.id}">Guardar</button>
            </td>
          `;
          tabla.appendChild(tr);
        });
      })
      .catch(err => {
        console.error("Error al cargar productos:", err);
        tabla.innerHTML = `<tr><td colspan="13">Error al cargar productos</td></tr>`;
      });
  }