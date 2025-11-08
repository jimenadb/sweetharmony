document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("blogPostsTable");
  const modal = document.getElementById("editModal");
  const closeModal = document.getElementById("closeModal");

  // 🔹 Cargar entradas del blog
  async function cargarEntradas() {
    try {
      const res = await fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/show_blog.php");
      const posts = await res.json();
      console.log(posts); // ✅ Verifica datos recibidos

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

        // --- Botón editar ---
        const editBtn = document.createElement("button");
        editBtn.textContent = "Editar";
        editBtn.classList.add("edit-btn");
        editBtn.dataset.id = post.id; // 👈 Importante: asignamos el ID

        // --- Botón eliminar ---
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.dataset.id = post.id; // 👈 Importante: asignamos el ID

        // Añadir botones
        divActions.appendChild(editBtn);
        divActions.appendChild(deleteBtn);
        tdActions.appendChild(divActions);

        // Añadir las celdas a la fila
        tr.appendChild(tdTitle);
        tr.appendChild(tdDate);
        tr.appendChild(tdActions);

        // Añadir la fila a la tabla
        tableBody.appendChild(tr);

        // 🔹 Evento Eliminar (aquí dentro porque el botón se crea dinámicamente)
        deleteBtn.addEventListener("click", async () => {
          if (confirm("¿Seguro que deseas eliminar esta entrada?")) {
            const formData = new FormData();
            formData.append("id", post.id);

            try {
              const res = await fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/delete_blog.php", {
                method: "POST",
                body: formData,
              });

              const data = await res.json();
              alert(data.message);

              if (data.success) tr.remove();
            } catch (err) {
              alert("Error al eliminar la entrada.");
              console.error(err);
            }
          }
        });
      });
    } catch (err) {
      console.error("Error cargando entradas:", err);
    }
  }

  // 🔹 Cargar al iniciar
  cargarEntradas();

  // --- Cerrar modal ---
  closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });
});


