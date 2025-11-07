const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultsList = document.getElementById("search-results");

// Renderizar resultados
function renderResults(products) {
    resultsList.innerHTML = products.length 
        ? products.map(p => `
            <li class="search-item">
                <a href="product_detail.html?id=${p.id}">
                    <img src="uploads/products/${p.image_url}" alt="${p.product_name}" width="40">
                    <span>${p.product_name} - ${p.description}</span>
                </a>
            </li>
        `).join('')
        : '<li>No se encontraron productos</li>';
}

// Función de búsqueda
function fetchProducts(query) {
    if (!query) {
        resultsList.innerHTML = '';
        return;
    }
    fetch(`http://localhost/sweetharmony/sweetharmony/dashboard/php/search_bar.php?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(renderResults)
        .catch(err => console.error(err));
}

// Búsqueda en vivo (input)
let timeout = null;
searchInput.addEventListener("input", () => {
    clearTimeout(timeout);
    const query = searchInput.value.trim();
    timeout = setTimeout(() => fetchProducts(query), 300);
});

// Búsqueda al hacer click en el botón
searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    fetchProducts(query);
});
