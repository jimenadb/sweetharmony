// agregar-tipos.js

const inputs = {
    product: document.getElementById("nuevoTipoProducto"),
    plant: document.getElementById("nuevoTipoPlanta")
  };
  
  // Función para agregar tipo
  function addType(type) {
    const value = inputs[type].value.trim();
    if (!value) return;
  
    // Envía al backend
    fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/admin_catalogo_tipos.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ [`${type}_type`]: value })
    })
      .then(r => r.json())
      .then(() => {
        inputs[type].value = "";
        abrirPopup("✅ Tipo agregado correctamente", "El nuevo tipo ha sido guardado en el sistema.");
      })
      .catch(err => {
        console.error(err);
        abrirPopup("❌ Error", "Ocurrió un problema al agregar el tipo. Intenta nuevamente.");
      });
  }
  
  // ===============================
  // EVENTOS DE BOTONES
  // ===============================
  document.getElementById("agregarTipoProducto").onclick = e => {
    e.preventDefault();
    addType("product");
  };
  
  document.getElementById("agregarTipoPlanta").onclick = e => {
    e.preventDefault();
    addType("plant");
  };
  
  // ===============================
  // FUNCIÓN: MOSTRAR POPUP
  // ===============================
  function abrirPopup(titulo, mensaje) {
    let popup = document.getElementById("popupNotificacion");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "popupNotificacion";
      popup.className = "popup";
      popup.innerHTML = `
        <div class="popup-content">
          <h3 id="popupTitulo"></h3>
          <p id="popupMensaje"></p>
          <button id="cerrarPopup">Cerrar</button>
        </div>
      `;
      document.body.appendChild(popup);
  
      document.getElementById("cerrarPopup").onclick = () => {
        popup.classList.remove("active");
      };
    }
  
    document.getElementById("popupTitulo").textContent = titulo;
    document.getElementById("popupMensaje").textContent = mensaje;
    popup.classList.add("active");
  }

  
  // ===============================
// ABRIR Y CERRAR MODAL DE TIPOS
// ===============================
const modalTipos = document.getElementById("modalTipos");
const btnTipos = document.getElementById("btnTipos");
const cerrarTipos = document.getElementById("cerrarTipos");

if (btnTipos && modalTipos && cerrarTipos) {
  // Abrir modal
  btnTipos.addEventListener("click", e => {
    e.preventDefault();
    modalTipos.classList.add("active");
    cargarTipos(); 
  });

  // Cerrar modal
  cerrarTipos.addEventListener("click", () => {
    modalTipos.classList.remove("active");
  });

  // Cerrar al hacer clic fuera del contenido
  modalTipos.addEventListener("click", e => {
    if (e.target === modalTipos) {
      modalTipos.classList.remove("active");
      
    }
  });
}




// ===============================
// CARGAR TIPOS DESDE PHP
// ===============================
function cargarTipos() {
    fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/get_tipos_catalogo.php")
      .then(r => r.json())
      .then(d => {
        // PRODUCTOS
        const ulProd = document.getElementById("listaTiposProducto");
        ulProd.innerHTML = d.product_types.map(t =>
          `<li>${t.name} <button class="borrar" data-id="${t.id}" data-tipo="product">🗑</button></li>`
        ).join("");
  
        // PLANTAS
        const ulPlanta = document.getElementById("listaTiposPlanta");
        ulPlanta.innerHTML = d.plant_types.map(t =>
          `<li>${t.name} <button class="borrar" data-id="${t.id}" data-tipo="plant">🗑</button></li>`
        ).join("");
      })
      .catch(err => console.error("Error al cargar tipos:", err));
  }
  
  // ===============================
  // BORRAR TIPO
  // ===============================
  document.addEventListener("click", e => {
    if (e.target.classList.contains("borrar")) {
      const id = e.target.dataset.id;
      const tipo = e.target.dataset.tipo;
  
      fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/get_tipos_catalogo.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${id}&tipo=${tipo}`
      })
        .then(r => r.json())
        .then(res => {
          if (res.success) cargarTipos();
          else alert("Error al eliminar: " + res.message);
        })
        .catch(err => console.error("Error al eliminar tipo:", err));
    }
  });
