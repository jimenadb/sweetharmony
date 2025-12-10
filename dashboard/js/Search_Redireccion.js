document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const resultsList = document.getElementById("search-results-list");

    const loaderContainer = document.getElementById("search-loader");

    function showLoader() {
      if(loaderContainer) loaderContainer.style.display = "flex";
    }

    function hideLoader() {
      if(loaderContainer) loaderContainer.style.display = "none";
    }
  
    // --- Función para renderizar productos ---
    function renderResults(products) {
      resultsList.innerHTML = "";
  
      if (!products.length) {
        resultsList.innerHTML = `<li>No se encontraron productos</li>`;
        return;
      }
  
      products.forEach(product => {
        const li = document.createElement("li");
  
        const finalPrice = (product.price * (1 - (product.discount || 0) / 100)).toFixed(2);
        const hasDiscount = product.discount && product.discount > 0;
  
        li.innerHTML = `
        <a href="Dashboard_Catalogo.html?id=${product.id}">
            <img src="../../uploads/${product.image_url}" alt="${product.product}">
            <span class="product-name">${product.product}</span>
            <span class="product-price">
            ${hasDiscount ? `<span class="original-price">S/. ${product.price.toFixed(2)}</span>` : ""}
            <span class="final-price">S/. ${finalPrice}</span>
            </span>
        </a>
        `;

        //Redirigir al producto al hacer clic

        li.onclick = () => {
            window.location.href = `Dashboard_Catalogo.html?id=${product.id}`;
          };
          
        resultsList.appendChild(li);
      });
    }

    // --- Función para buscar productos en PHP ---
    async function searchProducts(query) {
      if (!query) return;
    
      showLoader();
    
      try {
        const response = await fetch(`http://localhost/sweetharmony/sweetharmony/dashboard/php/search.php?search=${encodeURIComponent(query)}`);
        const data = await response.json();
    
        hideLoader();
    
        if (data.error) {
          resultsList.innerHTML = `<li>${data.error}</li>`;
        } else {
          // --- FILTRAR POR EMBEDDINGS (score) ---
          const minEmbedding = 0.6; // mínimo aceptable
          const maxEmbedding = 0.92; // máximo aceptable
    
          const filteredResults = data.results.filter(product => {
            const score = parseFloat(product.score);
            return score >= minEmbedding && score <= maxEmbedding;
          });
    
          renderResults(filteredResults);
        }
    
      } catch (err) {
        hideLoader();
        console.error(err);
        resultsList.innerHTML = `<li>Error al buscar productos</li>`;
      }
    }

  
    // --- Redirección al hacer click / Enter ---
    function redirectSearch() {
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `http://localhost/sweetharmony/sweetharmony/dashboard/html/Search_View.html?q=${encodeURIComponent(query)}`;
      }
    }
  
    if (searchButton) {
      searchButton.addEventListener("click", redirectSearch);
    }
    if (searchInput) {
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") redirectSearch();
      });
    }
  
    // --- Ejecutar búsqueda si viene 'q' en la URL ---
    const params = new URLSearchParams(window.location.search);
    const queryFromUrl = params.get("q");
    if (queryFromUrl) {
      searchInput.value = queryFromUrl; // mostrar en el input
      searchProducts(queryFromUrl);      // hacer fetch automático
    }
  
  });
  