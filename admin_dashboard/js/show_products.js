
//------------------------------------
// VARIABLES Y ESTADO GLOBAL
//------------------------------------
let modoEditar = false;

document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("tablaProductos");
  const panelAcciones = document.getElementById("accionesProducto");
  const spanProducto = document.getElementById("productoSeleccionado");
  window.productoSeleccionado = null;

//------------------------------------
// FUNCION CARGAR PRODUCTOS
//------------------------------------
  window.cargarProductos = function() {
    fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/show_products.php")
      .then(res => res.json())
      .then(productos => {
        tabla.innerHTML = "";
        productos.forEach(p => {
          const tr = document.createElement("tr");
          tr.dataset.id = p.id; 
          tr.innerHTML = `
            <td><img src="${p.image_url}" alt="${p.product_name}" style="width:50px;height:50px;object-fit:cover;"></td>
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
            window.productoSeleccionado = p; // <-- lo hacemos global
            panelAcciones.style.display = "block";
            spanProducto.textContent = `Producto seleccionado: ${p.product_name}`;
          });
          tabla.appendChild(tr);
        });
      });
  }
//------------------------------------
// BOTON EDITAR PRODUCTO
//------------------------------------
  document.getElementById("btnEditar").addEventListener("click", () => {
    if (!productoSeleccionado) return alert("Selecciona un producto");
  
    modoEditar = true; 
    
    // Abrir modal
    const modal = document.getElementById("modalAgregar");
    modal.style.display = "block";
  
    // Rellenar campos del formulario
    document.getElementById("product_name").value = productoSeleccionado.product_name || '';
    document.getElementById("product_type").value = productoSeleccionado.product_type || '';
    document.getElementById("plant_type").value = productoSeleccionado.plant_type || '';
    document.getElementById("price").value = productoSeleccionado.price || '';
    document.getElementById("discount").value = productoSeleccionado.discount || '0.00';
    document.getElementById("plant_height").value = productoSeleccionado.plant_height || '';
    document.getElementById("plant_width").value = productoSeleccionado.plant_width || '';
    document.getElementById("pot_height").value = productoSeleccionado.pot_height || '';
    document.getElementById("pot_width").value = productoSeleccionado.pot_width || '';
    document.getElementById("pot_color").value = productoSeleccionado.pot_color || '';
    document.getElementById("weight").value = productoSeleccionado.weight || '';
    document.getElementById("units").value = productoSeleccionado.units || 0;
  
    // Mostrar imagen actual
    const preview = document.getElementById("previewImagen");
    preview.innerHTML = productoSeleccionado.image_url
      ? `<img src="${productoSeleccionado.image_url}" style="width:100px;height:100px;object-fit:cover;">`
      : '<span>Sin imagen</span>';
  
    // Guardar el id del producto en un campo oculto
    let inputId = document.getElementById("product_id");
    if (!inputId) {
      inputId = document.createElement("input");
      inputId.type = "hidden";
      inputId.id = "product_id";
      inputId.name = "id";
      document.getElementById("catalogoForm").appendChild(inputId);
    }
    inputId.value = productoSeleccionado.id;
  });


//------------------------------------
// BOTON ELIMINAR PRODUCTO
//------------------------------------
  document.getElementById("btnEliminar").addEventListener("click", async () => {
    if (!productoSeleccionado) return alert("Selecciona un producto");
  
    const confirmDelete = confirm(`¿Seguro que deseas eliminar: ${productoSeleccionado.product_name}?`);
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/delete_products.php?id=${productoSeleccionado.id}`, {
        method: "GET"
      });
      const data = await res.json();
  
      if (data.success) {
        alert("Producto eliminado correctamente");
        productoSeleccionado = null;
        cargarProductos(); // recarga la tabla
      } else {
        alert("Error al eliminar producto: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión al eliminar");
    }
  });

//------------------------------------
// CARGAR PRODUCTOS INICIAL
//------------------------------------
  cargarProductos();
});






// //------------------------------------
// // VARIABLES Y ESTADO GLOBAL
// //------------------------------------
// let modoEditar = false;

// document.addEventListener("DOMContentLoaded", () => {
//   const tabla = document.getElementById("tablaProductos");
//   const panelAcciones = document.getElementById("accionesProducto");
//   const spanProducto = document.getElementById("productoSeleccionado");
//   let productoSeleccionado = null;

// //------------------------------------
// // FUNCION CARGAR PRODUCTOS
// //------------------------------------
//   function cargarProductos() {
//     fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/show_products.php")
//       .then(res => res.json())
//       .then(productos => {
//         tabla.innerHTML = "";
//         productos.forEach(p => {
//           const tr = document.createElement("tr");
//           tr.dataset.id = p.id; 
//           tr.innerHTML = `
//             <td><img src="${p.image_url}" alt="${p.product_name}" style="width:50px;height:50px;object-fit:cover;"></td>
//             <td>${p.product_name || '-'}</td>
//             <td>${p.product_type || '-'}</td>
//             <td>${p.plant_type || '-'}</td>
//             <td>${p.price != null ? '$' + p.price : '-'}</td>
//             <td>${p.discount != null ? p.discount + '%' : '-'}</td>
//             <td>${p.plant_height != null ? p.plant_height + 'cm' : '-'}</td>
//             <td>${p.plant_width != null ? p.plant_width + 'cm' : '-'}</td>
//             <td>${p.pot_height != null ? p.pot_height + 'cm' : '-'}</td>
//             <td>${p.pot_width != null ? p.pot_width + 'cm' : '-'}</td>
//             <td>${p.pot_color || '-'}</td>
//             <td>${p.weight != null ? p.weight + 'kg' : '-'}</td>
//             <td><input type="number" class="unidades-input" value="${p.units != null ? p.units : 0}" min="0" style="width:60px;text-align:center;"></td>
//           `;
//           tr.addEventListener("click", () => {
//             productoSeleccionado = p;
//             panelAcciones.style.display = "block";
//             spanProducto.textContent = `Producto seleccionado: ${p.product_name}`;
//           });
//           tabla.appendChild(tr);
//         });
//       });
//   }

// //------------------------------------
// // BOTON EDITAR PRODUCTO
// //------------------------------------
//   document.getElementById("btnEditar").addEventListener("click", () => {
//     if (!productoSeleccionado) return alert("Selecciona un producto");
  
//     modoEditar = true; 
    
//     // Abrir modal
//     const modal = document.getElementById("modalAgregar");
//     modal.style.display = "block";
  
//     // Rellenar campos del formulario
//     document.getElementById("product_name").value = productoSeleccionado.product_name || '';
//     document.getElementById("product_type").value = productoSeleccionado.product_type || '';
//     document.getElementById("plant_type").value = productoSeleccionado.plant_type || '';
//     document.getElementById("price").value = productoSeleccionado.price || '';
//     document.getElementById("discount").value = productoSeleccionado.discount || '0.00';
//     document.getElementById("plant_height").value = productoSeleccionado.plant_height || '';
//     document.getElementById("plant_width").value = productoSeleccionado.plant_width || '';
//     document.getElementById("pot_height").value = productoSeleccionado.pot_height || '';
//     document.getElementById("pot_width").value = productoSeleccionado.pot_width || '';
//     document.getElementById("pot_color").value = productoSeleccionado.pot_color || '';
//     document.getElementById("weight").value = productoSeleccionado.weight || '';
//     document.getElementById("units").value = productoSeleccionado.units || 0;
  
//     // Mostrar imagen actual
//     const preview = document.getElementById("previewImagen");
//     preview.innerHTML = productoSeleccionado.image_url
//       ? `<img src="${productoSeleccionado.image_url}" style="width:100px;height:100px;object-fit:cover;">`
//       : '<span>Sin imagen</span>';
  
//     // Guardar el id del producto en un campo oculto
//     let inputId = document.getElementById("product_id");
//     if (!inputId) {
//       inputId = document.createElement("input");
//       inputId.type = "hidden";
//       inputId.id = "product_id";
//       inputId.name = "id";
//       document.getElementById("catalogoForm").appendChild(inputId);
//     }
//     inputId.value = productoSeleccionado.id;
//   });

// //------------------------------------
// // BOTON ELIMINAR PRODUCTO
// //------------------------------------
//   document.getElementById("btnEliminar").addEventListener("click", async () => {
//     if (!productoSeleccionado) return alert("Selecciona un producto");
  
//     const confirmDelete = confirm(`¿Seguro que deseas eliminar: ${productoSeleccionado.product_name}?`);
//     if (!confirmDelete) return;
  
//     try {
//       const res = await fetch(`http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/delete_products.php?id=${productoSeleccionado.id}`, {
//         method: "GET"
//       });
//       const data = await res.json();
  
//       if (data.success) {
//         alert("Producto eliminado correctamente");
//         productoSeleccionado = null;
//         cargarProductos(); // recarga la tabla
//       } else {
//         alert("Error al eliminar producto: " + data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error de conexión al eliminar");
//     }
//   });

// //------------------------------------
// // CARGAR PRODUCTOS INICIAL
// //------------------------------------
//   cargarProductos();
// });

// //------------------------------------
// // EDITAR PRODUCTOS (ENVIO DEL FORMULARIO)
// //------------------------------------
// form.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const modal = document.getElementById("modalAgregar"); 
//   const formData = new FormData(form);

//   let url = "http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/update_products.php"; // siempre editar

//   try {
//     const res = await fetch(url, {
//       method: "POST",
//       body: formData
//     });

//     const data = await res.json();

//     if (data.success) {
//       alert("Producto actualizado correctamente");
//       modal.style.display = "none"; 
//       cargarProductos();

//       // Resetear estado
//       modoEditar = false;
//       form.reset();
//     } else {
//       alert("Error: " + data.message);
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Error de conexión");
//   }
// });

