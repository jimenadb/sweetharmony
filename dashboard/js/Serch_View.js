// Elementos
const loaderContainer = document.getElementById('search-loader');
const resultsList = document.getElementById('search-results-list');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// Funciones para mostrar/ocultar loader
function searchLoader() {
  loaderContainer.style.display = 'block';
  resultsList.style.display = 'none';

  loaderContainer.innerHTML = `
    <lottie-player
      src="../../dashboard/assets/loaderplant.json"
      background="transparent"
      speed="1"
      style="width:150px; height:150px; margin:auto;"
      loop
      autoplay>
    </lottie-player>
  `;
}

function hideLoader() {
  loaderContainer.style.display = 'none';
  resultsList.style.display = 'flex';
  loaderContainer.innerHTML = '';
}

// Función para ejecutar búsqueda
async function performSearch(query) {
  searchLoader();

  try {
    const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    const products = await response.json();

    // Ocultar loader
    hideLoader();

    // Renderizar resultados
    resultsList.innerHTML = products.map(p => `
      <li>
        <h3>${p.product || 'Producto'}</h3>
      </li>
    `).join('');

  } catch (error) {
    hideLoader();
    resultsList.innerHTML = `<li>Error al cargar productos</li>`;
    console.error(error);
  }
}

// Evento click en botón
searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if(query) performSearch(query);
});

// Evento Enter en input
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim();
    if(query) performSearch(query);
  }
});
