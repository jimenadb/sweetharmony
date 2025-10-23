console.log("JS del blog cargado");

function initBlogForm() {
  const form = document.getElementById("newPostForm");
  if (!form) {
    console.warn("No se encontró el formulario #newPostForm");
    return;
  }

  console.log("Formulario de blog cargado, listener agregado");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const formData = new FormData(form);

    try {
      const response = await fetch(
        "http://158.69.214.32/ximena_flores/sweetharmony/panel_admin/php/view_blog.php", 
        { method: "POST", body: formData }
      );

      const result = await response.json();
      console.log("Respuesta PHP:", result);

      if (result.success) {
        alert(result.message || "Entrada guardada correctamente");
        form.reset();
      } else {
        alert("Error: " + (result.message || "No se pudo guardar la entrada"));
      }
    } catch (err) {
      console.error("Error enviando formulario:", err);
      alert("Error al conectar con el servidor");
    }
  });
}


function loadBlogView() {
  fetch("view_blog.html") 
    .then(res => res.text())
    .then(html => {
      document.getElementById("main-content").innerHTML = html;
      initBlogForm(); 
    })
    .catch(err => console.error("Error cargando view_blog.html:", err));
}


document.addEventListener("DOMContentLoaded", () => {
  loadBlogView();
});
