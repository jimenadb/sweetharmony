

// Estilos del widget
const style = document.createElement("style");
style.textContent = `
#floating-widget {
  position: fixed;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
  padding: 8px 10px;
  z-index: 9999;
  font-family: 'Urbanist', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s;
}

#floating-widget:hover {
  transform: translateX(-50%) translateY(-5px);
}

#floating-widget .close-btn {
  position: absolute;
  top: 6px;
  right: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 20px;
  color:rgb(56, 56, 56);
  transition: color 0.2s;
}

#floating-widget .close-btn:hover {
  color:rgb(0, 0, 0);
}

#floating-widget .bee-icon {
  width: 170px;
  height: 150px;
  margin-left: 10px;
  transition: transform 0.3s;
}

#floating-widget .bee-icon:hover {
  transform: rotate(-10deg) scale(1.05);
}

#floating-widget .product-list {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 10px 6px;
  width: 100%;
  justify-content: flex-start;
}


#floating-widget .product-list li:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 15px rgba(0,0,0,0.25);
  border-radius: 8px;
}

#floating-widget .product-list li img {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  background: transparente
  transition: transform 0.3s, box-shadow 0.3s;
}

#floating-widget .product-list li span {
  font-size: 13px;
  font-weight: 500;
  color: rgb(0,0,0);
  max-width: 120px;
  word-wrap: break-word;
  text-align: center
}

.loader-icon {
  width: 80px !important;
  height: 80px !important;
  display: block;
  margin: 0 auto;
  object-fit: contain; /* asegura que la imagen no se deforme */
}





`;
document.head.appendChild(style);

//Crear widget
const widget = document.createElement("div");
widget.id = "floating-widget";
widget.innerHTML = `
  <span class="close-btn">×</span>
  <div style="display:flex; align-items:center; gap:10px;">
  <ul class="product-list" id="recommendations-list">
      <li id="loader-item" style="list-style:none; text-align:center;">
    <img id="loader" src="../../dashboard/assets/loader.svg" class="loader-icon" alt="Cargando">
  </li>
  </ul>
      <img src="../../components/assets/abejitarecomend.png" class="bee-icon" alt="Abejita">
  </div>
`;
document.body.appendChild(widget);

// Cerrar widget
widget.querySelector(".close-btn").onclick = () => widget.style.display = "none";

const list = widget.querySelector("#recommendations-list");
let clickedProducts = JSON.parse(localStorage.getItem('clickedProducts') || '[]');

//Función para mostrar productos recomendados
function updateWidget(products) {
  list.innerHTML = "";
  if (!products || !products.length) {
    list.innerHTML = `<li><span>Sin recomendaciones</span></li>`;
    return;
  }

  products.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.image_url ? `<img src="../../uploads/${p.image_url}" alt="${p.product}">` : ""}
        <span style="font-size:12px;">
    ${p.product || "Producto"}
  </span>
    `;

//Redirigir al producto al hacer clic
li.style.cursor = "pointer"; // que se note que es clickeable
li.onclick = () => {
  // Se asume que p.id viene del PHP
  window.location.href = `Dashboard_Catalogo.html?id=${p.id}`;
};

    
    list.appendChild(li);
  });
}

//Obtener recomendaciones desde PHP
async function fetchRecommendations(productName = null) {
  const url = productName
    ? `http://localhost/sweetharmony/sweetharmony/components/widget.php?product=${encodeURIComponent(productName)}`
    : `http://localhost/sweetharmony/sweetharmony/components/widget.php`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.recommendations && data.recommendations.length) {
      updateWidget(data.recommendations);
    }
  } catch (e) {
    console.error("Error al obtener recomendaciones:", e);
  }
}

// Guardar clic y pedir recomendaciones
window.productClicked = (id, name, image_url) => {
  clickedProducts = clickedProducts.filter(p => p.id !== id); // evita duplicados
  clickedProducts.push({ id, name, image_url });
  localStorage.setItem('clickedProducts', JSON.stringify(clickedProducts));

  fetchRecommendations(name);
};

// Detectar clics en los productos del catálogo
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('click', () => {
    const id = card.dataset.id;
    const name = card.querySelector('h3')?.textContent?.trim() || '';
    const image = card.querySelector('img')?.getAttribute('src')?.split('/').pop() || '';
    window.productClicked(id, name, image);
  });
});

// Cargar al iniciar
if (clickedProducts.length) {
  const lastClicked = clickedProducts[clickedProducts.length - 1];
  fetchRecommendations(lastClicked.name);
} else {
  fetchRecommendations();
}
