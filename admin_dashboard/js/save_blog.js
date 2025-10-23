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
      // Cambiar ruta al PHP según tu estructura
      const response = await fetch("../php/save_blog.php", 
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

// ------------------------
// Inicialización al cargar la página
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
  initBlogForm();
});
