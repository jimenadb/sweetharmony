document.addEventListener("DOMContentLoaded", async () => {
    const addressList = document.getElementById("address-list");
    const modal = document.getElementById("address-modal");
    const closeBtn = modal.querySelector(".close-btn");
    const form = document.getElementById("address-form");
    const addBtn = document.getElementById("add-address-btn");
  
    // Abrir modal para nueva dirección
    addBtn.addEventListener("click", () => {
      form.reset();
      form.querySelector("#address-id").value = "";
      modal.style.display = "flex";
    });
  
    // Cerrar modal
    closeBtn.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", e => { if(e.target === modal) modal.style.display = "none"; });
  
    // Función para cargar direcciones
    async function loadAddresses() {
      try {
        const res = await fetch("http://localhost/sweetharmony/sweetharmony/dashboard/php/get_user_address.php", { credentials: "include" });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Error al cargar direcciones");
  
        addressList.innerHTML = "";
  
        data.addresses.forEach(addr => {
          const card = document.createElement("div");
          card.classList.add("address-card");
          if(addr.is_default) card.innerHTML += `<div class="badge">Predeterminada</div>`;
  
          card.innerHTML += `
            <h4>${addr.full_name}</h4>
            <p>Email: ${addr.email || "-"}</p>
            <p>DNI: ${addr.dni}</p>
            <p>${addr.address}, ${addr.district}, ${addr.city} - ${addr.postal_code}</p>
            <p>Referencia: ${addr.reference || "-"}</p>
            <button class="btn btn-secondary edit-btn" data-id="${addr.id}">Editar</button>
            <button class="btn btn-danger delete-btn" data-id="${addr.id}">Eliminar</button>

          `;
  
          addressList.appendChild(card);
        });
  
        // Agregar eventos de edición
        document.querySelectorAll(".edit-btn").forEach(btn => {
          btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            const addr = data.addresses.find(a => a.id == id);
            if (!addr) return;
  
            form.querySelector("#address-id").value = addr.id;
            form.querySelector("#full_name").value = addr.full_name;
            form.querySelector("#email").value = addr.email;
            form.querySelector("#dni").value = addr.dni;
            form.querySelector("#address").value = addr.address;
            form.querySelector("#district").value = addr.district;
            form.querySelector("#city").value = addr.city;
            form.querySelector("#postal_code").value = addr.postal_code;
            form.querySelector("#reference").value = addr.reference;
            form.querySelector("#is_default").checked = addr.is_default ? true : false;
  
            modal.style.display = "flex";
          });
        });

        // Agregar eventos de eliminar
document.querySelectorAll(".delete-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const id = btn.dataset.id;
    if(!confirm("¿Seguro que deseas eliminar esta dirección?")) return;

    try {
      const res = await fetch("http://localhost/sweetharmony/sweetharmony/dashboard/php/delete_user_address.php", {
        method: "POST",
        body: new URLSearchParams({ id }),
        credentials: "include"
      });
      const data = await res.json();
      alert(data.message);
      loadAddresses(); // recargar lista
    } catch(err) {
      console.error(err);
      alert("Error al eliminar dirección");
    }
  });
});
  
      } catch(err) {
        console.error(err);
        addressList.innerHTML = `<p style="color:red;text-align:center;">Error al cargar direcciones</p>`;
      }
    }
  
    // Guardar / actualizar dirección
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const formData = new FormData(form);
    
      // Asegurarse de enviar "is_default" aunque no esté marcado
    // Enviar siempre 1 o 0 según si está marcado
    formData.set("is_default", form.querySelector("#is_default").checked ? 1 : 0);
    
      try {
        const res = await fetch("http://localhost/sweetharmony/sweetharmony/dashboard/php/add_user_address.php", {
          method: "POST",
          body: formData,
          credentials: "include"
        });
        const data = await res.json();
        alert(data.message);
        if(data.message.includes("guardada")) {
          modal.style.display = "none";
          loadAddresses(); // recargar lista
        }
      } catch(err) {
        console.error(err);
        alert("Error al guardar dirección");
      }
    });
    // Inicializar lista
    loadAddresses();
  });
  