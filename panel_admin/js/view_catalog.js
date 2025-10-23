document.getElementById("catalogoForm")?.addEventListener("submit", async (e) => {
  e.preventDefault(); 

  const formData = new FormData(e.target);

  try {
    const response = await fetch(
      "http://158.69.214.32/ximena_flores/sweetharmony/panel_admin/php/view_catalog.php", 
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (result.success) {
      alert(result.message);
      e.target.reset();
    } else {
      alert("Error: " + result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al conectar con el servidor");
  }
});


