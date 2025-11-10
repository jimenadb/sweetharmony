// ===== CARGAR TIPOS DE PRODUCTO Y PLANTA =====
async function loadFilters() {
    const res = await fetch("http://localhost/sweetharmony/sweetharmony/dashboard/php/filtros.php"); // PHP que devuelve product_types y plant_types
    const data = await res.json();

    if (!data.success) return;

    const productSelect = document.getElementById("filter_product_type");
    const plantSelect   = document.getElementById("filter_plant_type");

    productSelect.innerHTML = '<option value="">-- Todos --</option>';
    plantSelect.innerHTML   = '<option value="">-- Todos --</option>';

    data.product_types.forEach(pt => {
        const option = document.createElement("option");
        option.value = pt.id;
        option.textContent = pt.name;
        productSelect.appendChild(option);
    });

    data.plant_types.forEach(pl => {
        const option = document.createElement("option");
        option.value = pl.id;
        option.textContent = pl.name;
        plantSelect.appendChild(option);
    });
}

// ===== APLICAR FILTROS =====
document.getElementById("filterBtn").onclick = () => {
    const productType = document.getElementById("filter_product_type").value;
    const plantType   = document.getElementById("filter_plant_type").value;
    const priceOrder  = document.getElementById("filter_price_order").value;

    fetch(`http://localhost/sweetharmony/sweetharmony/dashboard/php/dashboard_catalogo.php?product_type=${productType}&plant_type=${plantType}&price_order=${priceOrder}`)
        .then(res => res.json())
        .then(data => {
            if (data.products.length === 0) {
                document.getElementById('catalogo').innerHTML = '<p>No hay productos disponibles.</p>';
            } else {
                renderProducts(data.products); // Llama a tu función larga que ya genera todo el catálogo
            }
        });
};

// ===== LIMPIAR FILTROS =====
document.getElementById("clearFilterBtn").onclick = () => {
    document.getElementById("filter_product_type").value = '';
    document.getElementById("filter_plant_type").value = '';
    document.getElementById("filter_price_order").value = '';

    fetch(`http://localhost/sweetharmony/sweetharmony/dashboard/php/dashboard_catalogo.php`)
        .then(res => res.json())
        .then(data => renderProducts(data.products));
};


// ===== LLAMAR LA FUNCION AL CARGAR LA PÁGINA =====
loadFilters();
