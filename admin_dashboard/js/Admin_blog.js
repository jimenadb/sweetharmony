document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("newPostSection");
  const openBtn = document.getElementById("toggleFormBtn");
  const closeBtn = document.getElementById("closeNewPostModal");
  const form = document.getElementById("newPostForm");
  const postIdInput = document.getElementById("postId");

  // --- ABRIR MODAL ---
  openBtn?.addEventListener("click", () => {
    postIdInput.value = ""; 
    form.reset();
    modal.classList.add("active");
  });

  // --- CERRAR MODAL ---
  closeBtn?.addEventListener("click", () => modal.classList.remove("active"));
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });

  // --- ABRIR MODAL PARA EDITAR ---
  document.addEventListener("click", (e) => {
    if (e.target.closest(".edit-btn")) {
      const row = e.target.closest("tr");
      const id = row.dataset.id;
      const title = row.querySelector(".post-title")?.textContent || "";
      const content = row.querySelector(".post-content")?.textContent || "";

      postIdInput.value = id;
      form.querySelector("#title").value = title.trim();
      form.querySelector("#content").value = content.trim();

      modal.classList.add("active");
    }
  });

  // --- ENVIAR FORMULARIO ---
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const isEditing = postIdInput.value !== "";

    try {
      const res = await fetch(
        isEditing
          ? "http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/update_blog.php"
          : "http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/save_blog.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      alert(data.message);

      if (data.success) {
        form.reset();
        modal.classList.remove("active");
      }
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  });

   // --- PREVIEW DE IMAGEN ---
   const imageInput = document.getElementById("image");
   const previewImg = document.getElementById("previewImg");
 
   if (imageInput && previewImg) {
     imageInput.addEventListener("change", () => {
       const file = imageInput.files[0];
       if (file) {
         const reader = new FileReader();
         reader.onload = (e) => {
           previewImg.src = e.target.result;
           previewImg.style.display = "block";
         };
         reader.readAsDataURL(file);
       } else {
         previewImg.src = "";
         previewImg.style.display = "none";
       }
     });
   }
});


