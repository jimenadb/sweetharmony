document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ JS cargado y DOM listo");
  
    const modal = document.getElementById("address-modal");
    const form = document.getElementById("address-form");
    const addBtn = document.getElementById("add-address-btn");
    const closeBtn = document.querySelector(".close-btn");
    const API = "http://158.69.214.32/ximena_flores/sweetharmony/dashboard/php/add_user_address.php";
  
    if (!modal || !form || !addBtn || !closeBtn) {
      console.error("❌ No se encontraron elementos. Revisa los IDs en el HTML.");
      return;
    }
  
    // Mostrar el formulario
    addBtn.addEventListener("click", () => {
      console.log("🟢 Abriendo modal...");
      form.reset();
      modal.style.display = "flex";
    });
  
    // Cerrar modal
    closeBtn.addEventListener("click", () => {
      console.log("🔴 Cerrando modal...");
      modal.style.display = "none";
    });
  
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  
    // Guardar dirección
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const formData = new FormData(form);
      console.log("📦 Enviando datos:", [...formData.entries()]);
  
      try {
        const res = await fetch(API, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
  
        const text = await res.text();
        console.log("📩 Respuesta del servidor:", text);
  
        const data = JSON.parse(text);
        alert(data.message);
        modal.style.display = "none";
      } catch (err) {
        console.error("❌ Error al guardar dirección:", err);
        alert("Error al guardar la dirección.");
      }
    });
  });
  