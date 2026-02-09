// search.js - Búsqueda IA
const API_URL = 'http://localhost/sweetharmony/sweetharmony/dashboard/php/search_ai.php';

// NUEVA: Función para mostrar carga
function showLoading() {
  const searchResults = document.getElementById('search-results');
  if (!searchResults) return;
  
  searchResults.innerHTML = `
    <li class="loading-item">
      <div class="loading-spinner"></div>
      <span>Buscando...</span>
    </li>
  `;
  searchResults.style.display = 'block';
}

// NUEVO: Estilos para la carga
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
  .loading-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    color: #666;
  }
  
  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid hsl(148, 20%, 38%);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(loadingStyles);

// Inicializar búsqueda
function initSearch(products) {
  window.allProducts = products;
  setupSearch();
}

// Configurar eventos
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  
  if (!searchInput) return;
  
  // Buscar al escribir
  let timeoutId;
  searchInput.addEventListener('input', function() {
    const query = this.value.trim();
    
    clearTimeout(timeoutId);
    
    if (query.length < 2) {
      hideResults();
      return;
    }
    
    // 🔄 NUEVO: Mostrar carga mientras espera
    showLoading();
    
    // Debounce para evitar demasiadas peticiones
    timeoutId = setTimeout(() => {
      // Usar IA para búsqueda en tiempo real
      searchWithAI(query);
    }, 300);
  });
  
  // Cerrar resultados al hacer clic fuera
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && 
        !searchResults?.contains(e.target)) {
      hideResults();
    }
  });
}

// Buscar con IA (MODIFICADO para quitar carga al terminar)
async function searchWithAI(query) {
  const searchResults = document.getElementById('search-results');
  if (!searchResults) return;
  
  try {
    const response = await fetch(`${API_URL}?search=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      showResults(data.results);
    } else {
      searchResults.innerHTML = '<li class="no-results">No hay resultados</li>';
      searchResults.style.display = 'block';
    }
  } catch (error) {
    console.error('Error IA:', error);
    searchResults.innerHTML = '<li class="no-results">Error en la búsqueda</li>';
    searchResults.style.display = 'block';
  }
}

// Mostrar resultados de IA
function showResults(results) {
  const searchResults = document.getElementById('search-results');
  if (!searchResults) return;
  
  searchResults.innerHTML = '';
  
  // Tomar top 5
  results.slice(0, 5).forEach(result => {
    const li = document.createElement('li');
    
    li.innerHTML = `
      <img src="${result.image_url || 'assets/product-01.jpg'}" width="40" height="40">
      <span>${result.product}</span>
      <span class="price">$${result.price}</span>
    `;
    
    li.addEventListener('click', function() {
      // Llenar el input con el resultado seleccionado
      document.getElementById('search-input').value = result.product;
      hideResults();
      
      // Ejecutar búsqueda completa con este término
      executeSearch(result.product, result.id);
    });
    
    searchResults.appendChild(li);
  });
  
  searchResults.style.display = 'block';
}

// Ejecutar búsqueda completa (usada tanto por IA como por Enter)
async function executeSearch(query, productId = null) {
  const enCatalogo = window.location.pathname.includes('Catalogo');
  
  if (enCatalogo && window.allProducts && window.renderCatalogo) {
    // NUEVO: Mostrar carga en el catálogo
    const container = document.getElementById('catalogo');
    if (container) {
      container.innerHTML = `
        <div class="search-loading">
          <div class="search-spinner"></div>
          <p>Buscando "${query}"...</p>
        </div>
      `;
    }
    
    // Opción 1: Buscar localmente
    const resultadosLocales = buscarLocalmente(query);
    
    if (resultadosLocales.length > 0) {
      window.renderCatalogo(resultadosLocales);
    } else {
      // Opción 2: Si no hay resultados locales, buscar con IA
      const resultadosIA = await buscarConIA(query);
      
      if (resultadosIA.length > 0) {
        renderizarResultadosIA(resultadosIA);
      } else {
        mostrarSinResultados(query);
      }
    }
  } else if (productId) {
    // Si tenemos un ID específico, ir directamente al producto
    window.location.href = `Dashboard_Catalogo.html?id=${productId}`;
  } else {
    // Para otras páginas, redirigir al catálogo
    window.location.href = `Dashboard_Catalogo.html?search=${encodeURIComponent(query)}`;
  }
}

// Buscar localmente (para búsqueda rápida)
function buscarLocalmente(query) {
  if (!window.allProducts) return [];
  
  const busqueda = query.toLowerCase();
  return window.allProducts.filter(producto => {
    const nombre = (producto.product_name || '').toLowerCase();
    const tipo = (producto.product_type_name || '').toLowerCase();
    const desc = (producto.description || '').toLowerCase();
    
    return nombre.includes(busqueda) || 
           tipo.includes(busqueda) || 
           desc.includes(busqueda);
  });
}

// Buscar con IA (para búsqueda más inteligente)
async function buscarConIA(query) {
  try {
    const response = await fetch(`${API_URL}?search=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error en búsqueda IA:', error);
    return [];
  }
}

// Renderizar resultados de IA en catálogo
function renderizarResultadosIA(resultadosIA) {
  const container = document.getElementById('catalogo');
  if (!container) return;
  
  // Transformar resultados de IA al formato que espera tu renderCatalogo
  const productosFormateados = resultadosIA.map(result => ({
    product_id: result.id,
    product_name: result.product,
    price: result.price,
    image_url: result.image_url || 'assets/product-01.jpg',
    // Añadir otros campos necesarios
  }));
  
  if (window.renderCatalogo) {
    window.renderCatalogo(productosFormateados);
  } else {
    // Si no existe renderCatalogo, crear un renderizado básico
    container.innerHTML = productosFormateados.map(producto => `
      <div class="producto">
        <img src="${producto.image_url}" alt="${producto.product_name}">
        <h3>${producto.product_name}</h3>
        <p>$${producto.price}</p>
      </div>
    `).join('');
  }
}

// Ocultar resultados
function hideResults() {
  const searchResults = document.getElementById('search-results');
  if (searchResults) {
    searchResults.style.display = 'none';
  }
}

// Mostrar mensaje "no hay resultados"
function mostrarSinResultados(query) {
  const container = document.getElementById('catalogo');
  if (!container) return;
  
  container.innerHTML = `
    <div class="no-resultados">
      <h3>No se encontraron productos para "${query}"</h3>
      <p>Intenta con otras palabras o revisa la ortografía.</p>
      <button onclick="mostrarTodos()" class="btn-volver">
        Ver todos los productos
      </button>
    </div>
  `;
}

// =============================
// BÚSQUEDA UNIVERSAL (para todas las páginas)
// =============================

// Configurar búsqueda universal
function setupUniversalSearch() {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  
  if (!searchInput) return;
  
  // Configurar Enter
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const query = this.value.trim();
      if (!query) return;
      
      executeSearch(query);
    }
  });
  
  // Configurar botón (si existe)
  if (searchButton) {
    searchButton.addEventListener('click', function() {
      const query = searchInput.value.trim();
      if (!query) return;
      
      executeSearch(query);
    });
  }
}

// Botón para mostrar todos
window.mostrarTodos = function() {
  if (window.allProducts && window.renderCatalogo) {
    window.renderCatalogo(window.allProducts);
  }
};

// Modificar initSearch para incluir búsqueda universal
const originalInit = window.initSearch;
window.initSearch = function(products) {
  window.allProducts = products;
  setupSearch();           // Sugerencias al escribir
  setupUniversalSearch();  // Búsqueda con Enter/botón
};

// Si no es catálogo, configurar búsqueda básica
if (!window.location.pathname.includes('Catalogo')) {
  document.addEventListener('DOMContentLoaded', function() {
    setupUniversalSearch();
  });
}

// Exportar funciones para uso global
window.executeSearch = executeSearch;

// NUEVO: Agregar estilos para carga en catálogo
const catalogLoadingStyles = document.createElement('style');
catalogLoadingStyles.textContent = `
  .search-loading {
    text-align: center;
    padding: 60px 20px;
    color: hsl(148, 20%, 38%);
  }
  
  .search-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid hsl(148, 20%, 38%);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px auto;
  }
`;
document.head.appendChild(catalogLoadingStyles);