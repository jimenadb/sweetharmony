const token = "TU_TOKEN_HUGGINGFACE"; // Pega tu token aquí

document.getElementById("btn-generar").addEventListener("click", async () => {
    const nombreProducto = document.getElementById("product_name").value.trim();

    if (!nombreProducto) {
        alert("Escribe primero el nombre del producto");
        return;
    }

    const prompt = `Genera una descripción atractiva y corta para este producto llamado "${nombreProducto}".`;

    // Mostrar un mensaje de carga
    const inputDescripcion = document.getElementById("product_descripction");
    inputDescripcion.value = "Generando descripción...";

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: prompt })
        });

        const data = await response.json();
        const descripcion = data[0]?.generated_text || "No se pudo generar la descripción";

        inputDescripcion.value = descripcion;
    } catch (error) {
        console.error(error);
        inputDescripcion.value = "Error al generar la descripción";
    }
});
