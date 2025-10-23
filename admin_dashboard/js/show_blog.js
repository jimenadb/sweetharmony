document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("blogPostsTable");
  const modal = document.getElementById("editModal");
  const closeModal = document.getElementById("closeModal");

  async function cargarEntradas() {
    try {
      const res = await fetch("http://158.69.214.32/ximena_flores/sweetharmony/admin_dashboard/php/show_blog.php");
      const posts = await res.json();
      console.log(posts); // Verifica que traiga datos

      tableBody.innerHTML = ""; // limpiar tabla

      posts.forEach(post => {
        const tr = document.createElement("tr");
      
        // --- Columna título ---
        const tdTitle = document.createElement("td");
        tdTitle.textContent = post.title || "-";
      
        // --- Columna fecha ---
        const tdDate = document.createElement("td");
        tdDate.textContent = post.created_at
          ? new Date(post.created_at).toLocaleDateString()
          : "-";
      
        // --- Columna de acciones ---
        const tdActions = document.createElement("td");
        const divActions = document.createElement("div");
        divActions.classList.add("row-actions");
      
        const editBtn = document.createElement("button");
        editBtn.textContent = "Editar";
        editBtn.classList.add("edit-btn");
      
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.classList.add("delete-btn");
      
        // Añadir botones al div contenedor
        divActions.appendChild(editBtn);
        divActions.appendChild(deleteBtn);
      
        // Añadir el contenedor de botones a la celda
        tdActions.appendChild(divActions);
      
        // Finalmente, añadir las celdas a la fila
        tr.appendChild(tdTitle);
        tr.appendChild(tdDate);
        tr.appendChild(tdActions);
      
        // Añadir la fila a la tabla
        tableBody.appendChild(tr);
      });

    } catch (err) {
      console.error("Error cargando entradas:", err);
    }
  }

  cargarEntradas();

  // --- Cerrar modal ---
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
});
