document.getElementById("btn-generar").addEventListener("click", async () => {
    const nombreProducto = document.getElementById("product_name").value.trim();

    if (!nombreProducto) {
        alert("Escribe primero el nombre del producto");
        return;
    }

    const prompt = `Genera una descripción atractiva y corta para este producto llamado "${nombreProducto}".`;

    // Mostrar mensaje de carga
    const inputDescripcion = document.getElementById("product_descripction");
    inputDescripcion.value = "Generando descripción...";

    try {
        // 🔹 Fetch apuntando a tu proxy.php
        fetch("http://localhost/sweetharmony/sweetharmony/proxyserver/proxy_server.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ inputs: prompt })
        });

        // Verificar que la respuesta es OK
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }

        const data = await response.json();

        // La respuesta de Hugging Face viene en data[0].generated_text
        const descripcion = data[0]?.generated_text || "No se pudo generar la descripción";

        inputDescripcion.value = descripcion;

    } catch (error) {
        console.error(error);
        inputDescripcion.value = "Error al generar la descripción";
    }
});
