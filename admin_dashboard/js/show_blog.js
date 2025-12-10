document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("blogPostsTable");
  const modal = document.getElementById("newPostSection");
  const closeModal = document.getElementById("closeNewPostModal");
  const postIdInput = document.getElementById("postId");

  //  Cargar entradas del blog
  async function cargarEntradas() {
    try {
      const res = await fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/show_blog.php");
      const posts = await res.json();
      console.log(posts); // Verifica datos recibidos

      tableBody.innerHTML = ""; // limpiar tabla

      posts.forEach(post => {
        const tr = document.createElement("tr");
        tr.dataset.id = post.id; // importante para editar/eliminar

          // --- Columna título ---
        const tdTitle = document.createElement("td");
        const shortTitle = post.title?.length > 10 ? post.title.slice(0, 10) + "…" : post.title;
        tdTitle.textContent = shortTitle || "-";
        tdTitle.classList.add("post-title");

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

        divActions.appendChild(editBtn);
        divActions.appendChild(deleteBtn);
        tdActions.appendChild(divActions);

        // --- Columna contenido ---
        const tdContent = document.createElement("td");
        const shortContent = post.content?.length > 30 ? post.content.slice(0, 30) + "…" : post.content;
        tdContent.textContent = shortContent || "-";
        tdContent.classList.add("post-content");

        // --- Columna imagen ---
        const tdImage = document.createElement("td");
        tdImage.innerHTML = post.image_url
          ? `<img src="${post.image_url}" style="width:100px;height:100px;object-fit:cover;">`
          : "-";

        // Añadir todas las celdas a la fila
        tr.appendChild(tdTitle);
        tr.appendChild(tdDate);
        tr.appendChild(tdContent);
        tr.appendChild(tdImage);
        tr.appendChild(tdActions);

        tableBody.appendChild(tr);

        // 🔹 Evento Eliminar
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

        // 🔹 Evento Editar
        editBtn.addEventListener("click", () => {
          postIdInput.value = post.id;
          document.getElementById("title").value = post.title || "";
          document.getElementById("content").value = post.content || "";
          modal.querySelector(".modal-header h2").textContent = "Editar Post";
          modal.classList.add("active");
        });
      });
    } catch (err) {
      console.error("Error cargando entradas:", err);
    }
  }

  // 🔹 Cargar al iniciar
  cargarEntradas();

  // --- Cerrar modal ---
  closeModal.addEventListener("click", () => modal.classList.remove("active"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });
});



