document.addEventListener("DOMContentLoaded", () => {
  // --- MODAL NUEVO POST ---
  const newPostModal = document.getElementById("newPostSection");
  const openNewPostBtn = document.getElementById("toggleFormBtn");
  const closeNewPostBtn = document.getElementById("closeNewPostModal");

  // Abrir modal de nuevo post
  openNewPostBtn?.addEventListener("click", () => {
    newPostModal.classList.add("active");
  });

  // Cerrar con botón
  closeNewPostBtn?.addEventListener("click", () => {
    newPostModal.classList.remove("active");
  });

  // Cerrar clic fuera
  newPostModal?.addEventListener("click", (e) => {
    if (e.target === newPostModal) newPostModal.classList.remove("active");
  });

  // --- MODAL DE EDICIÓN ---
  const editModal = document.getElementById("editModal");
  const closeEditModalBtn = document.getElementById("closeModal");

  // Cerrar modal de edición
  closeEditModalBtn?.addEventListener("click", () => {
    editModal.classList.remove("active");
  });

  // Delegar evento para abrir modal de edición
  document.addEventListener("click", (e) => {
    if (e.target.closest(".edit-btn")) {
      const row = e.target.closest("tr");
      const title = row.querySelector(".post-title")?.textContent || "";
      const content = row.querySelector(".post-content")?.textContent || "";
      const status = row.querySelector(".post-status")?.textContent || "draft";
      const id = row.dataset.id;

      // Llenar campos del modal de edición
      document.getElementById("editTitle").value = title.trim();
      document.getElementById("editContent").value = content.trim();
      document.getElementById("editStatus").value = status.trim();
      document.getElementById("editPostForm").dataset.postId = id;

      // Mostrar modal
      editModal.classList.add("active");
    }
  });
});