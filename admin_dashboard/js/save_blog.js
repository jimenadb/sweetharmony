document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newPostForm");
  if (!form) {
    console.error("No se encontró el formulario #newPostForm");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    try {
      const res = await fetch("php/save_blog.php", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert(data.message);

      if (data.success) {
        form.reset();
        document.getElementById("newPostSection").classList.remove("active");
      }
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  });
});