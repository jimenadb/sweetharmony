// ===== CARGAR TIPOS DE PRODUCTO Y PLANTA =====
async function loadFilters() {
    const res = await fetch("'http://localhost/sweetharmony/sweetharmony/dashboard/php/filtros.php"); // PHP que devuelve product_types y plant_types
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
    const productId = document.getElementById("filter_product_type").value;
    const plantId   = document.getElementById("filter_plant_type").value;
    const priceOrder = document.getElementById("filter_price_order").value;

    fetch(`catalogo.php?product_type=${productId}&plant_type=${plantId}&price_order=${priceOrder}`)
        .then(res => res.json())
        .then(data => {
            renderProducts(data); // función que dibuja los productos en el HTML
        });
};

// ===== LIMPIAR FILTROS =====
document.getElementById("clearFilterBtn").onclick = () => {
    document.getElementById("filter_product_type").value = "";
    document.getElementById("filter_plant_type").value = "";
    document.getElementById("filter_price_order").value = "";

    fetch(`catalogo.php`)
        .then(res => res.json())
        .then(data => renderProducts(data));
};

// ===== LLAMAR LA FUNCION AL CARGAR LA PÁGINA =====
loadFilters();
