document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("newPostForm");
    const postIdInput = document.getElementById("postId");
    const modal = document.getElementById("newPostSection");
  
    // --- ABRIR MODAL PARA EDITAR ---
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".edit-btn");
      if (!btn) return;
  
      const row = btn.closest("tr");
      const id = row.dataset.id;
  
      // Tomamos título y contenido según columnas (posición)
      const title = row.cells[0]?.textContent || "";
      const content = row.cells[3]?.textContent || ""; // columna 4 según tu HTML (Descripcion)
  
      postIdInput.value = id;
      document.getElementById("title").value = title.trim();
      document.getElementById("content").value = content.trim();
  
      modal.querySelector(".modal-header h2").textContent = "Editar Post";
      modal.classList.add("active");
    });
  
    // --- ENVIAR FORMULARIO SOLO PARA ACTUALIZAR ---
    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      if (!postIdInput.value) return; // solo actualizaciones
  
      const formData = new FormData(form);
  
      try {
        const res = await fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/update_blog.php", {
          method: "POST",
          body: formData,
        });
  
        const data = await res.json();
        alert(data.message);
  
        if (data.success) {
          form.reset();
          modal.classList.remove("active");
          // Refrescar tabla si tienes función cargarEntradas
          if (typeof cargarEntradas === "function") cargarEntradas();
        }
      } catch (err) {
        console.error("Error al actualizar:", err);
      }
    });
  
    // --- CERRAR MODAL ---
    const closeBtn = document.getElementById("closeNewPostModal");
    closeBtn?.addEventListener("click", () => modal.classList.remove("active"));
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });
  });
  