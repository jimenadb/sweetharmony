document.addEventListener("DOMContentLoaded", () => {

  fetch("sidebar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("sidebar-container").innerHTML = html;

      document.querySelectorAll("#sidebar-container a[data-view]").forEach(link => {
        link.addEventListener("click", e => {
          e.preventDefault();
          const viewFile = link.getAttribute("data-view");
          loadView(viewFile);
        });
      });
      const logoutBtn = document.getElementById("logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          try {
            await fetch("http://158.69.214.32/ximena_flores/sweetharmony/login_register_user/php/Logout.php");
            window.location.href = "http://158.69.214.32/ximena_flores/sweetharmony/dashboard/html/Dashboard.html";
          } catch (err) {
            console.error("Error al cerrar sesión:", err);
            alert("No se pudo cerrar sesión");
          }
        });
      }

      loadView("view_catalog.html");  // Vista por defecto
    })
    .catch(err => console.error("Error cargando sidebar:", err));
});


function loadView(viewFile) {
  fetch(viewFile)
    .then(res => res.text())
    .then(html => {
      document.getElementById("main-content").innerHTML = html;

      // SI la vista cargada es la del catálogo, activamos los listeners del modal:
      if(viewFile === "view_catalog.html") {
        // activarModalCatalogo(); // coméntala o elimínala
        cargarProductos(); // función que llena la tabla
    }
    })
    .catch(err => console.error("Error cargando vista:", err));
}


