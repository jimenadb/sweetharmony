// =============================
// FETCH CATALOGO COMPLETO
// =============================
function renderCatalogo(data) {
  const contenedor = document.getElementById('catalogo');
  contenedor.innerHTML = '';
    
    data.forEach(producto => {
      const li = document.createElement('li');
      li.classList.add('product-grid');

      // --- Shop Card ---
      const shopCard = document.createElement('div');
      shopCard.classList.add('shop-card');

      // --- Card Banner ---
      const cardBanner = document.createElement('div');
      cardBanner.classList.add('card-banner','img-holder');
      cardBanner.style.setProperty('--width','540');
      cardBanner.style.setProperty('--height','720');

      const img = document.createElement('img');
      img.src = producto.image_url || '../assets/product-01.jpg';
      img.width = 540;
      img.height = 720;
      img.loading = 'lazy';
      img.alt = producto.product_name;
      img.classList.add('img-cover');
      cardBanner.appendChild(img);


      if (Number(producto.discount) > 0) {
        const spanBadge = document.createElement('span');
        spanBadge.classList.add('badge');
        spanBadge.setAttribute('aria-label', `${Number(producto.discount)}% off`);
        spanBadge.textContent = `-${Number(producto.discount) % 1 === 0 ? Number(producto.discount) : Number(producto.discount).toFixed(2)}%`;
        cardBanner.appendChild(spanBadge);
      }

      // --- Card Actions ---
      const cardActions = document.createElement('div');
      cardActions.classList.add('card-actions');

      const btnWhatsapp = document.createElement("a");
      btnWhatsapp.href = `https://wa.me/51910405014?text=${encodeURIComponent(`Hola, estoy interesado en el producto: ${producto.product_name}`)}`;
      btnWhatsapp.target = "_blank";
      btnWhatsapp.classList.add('action-btn');
      btnWhatsapp.setAttribute('aria-label','whatsapp');
      btnWhatsapp.innerHTML = `<ion-icon name="logo-whatsapp" aria-hidden="true"></ion-icon>`;

      const btnWishlist = document.createElement('button');
      btnWishlist.classList.add('action-btn');
      btnWishlist.setAttribute('aria-label', 'add to wishlist');
      btnWishlist.setAttribute('data-product-id', producto.id);
      btnWishlist.innerHTML = `<ion-icon name="star-outline" aria-hidden="true"></ion-icon>`;
      btnWishlist.addEventListener('click', async (e) => {
        const button = e.currentTarget;
        const productId = button.getAttribute('data-product-id');
        const isFavorito = button.classList.contains('favorito');
        try {
          const response = await fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/add_wishlist.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, action: isFavorito ? 'remove' : 'add' }),
            credentials: 'include'
          });
          const data = await response.json();
          if (response.ok) {
            if (isFavorito) {
              button.classList.remove('favorito');
              button.innerHTML = `<ion-icon name="star-outline" aria-hidden="true"></ion-icon>`;
            } else {
              button.classList.add('favorito');
              button.innerHTML = `<ion-icon name="star" aria-hidden="true"></ion-icon>`;
            }
          } else {
            console.error(data.message);
          }
        } catch (err) {
          console.error('Error al actualizar favoritos:', err);
        }
      });


      const btnViewDetails = document.createElement('button');
      btnViewDetails.classList.add('action-btn','view-details-btn');
      btnViewDetails.setAttribute('aria-label', 'view product details');
      btnViewDetails.setAttribute('data-product-id', producto.id);
      btnViewDetails.innerHTML = `<ion-icon name="cart-outline" aria-hidden="true"></ion-icon>`;

      // Redirige al catálogo con el ID del producto
      btnViewDetails.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = producto.id;
        window.location.href = `Dashboard_Catalogo.html?id=${productId}`;
      });

      // Función para registrar vistas
      btnViewDetails.addEventListener('click', (e) => {
        e.stopPropagation();
      
        const productId = producto.id;
      
        fetch(`http://localhost/sweetharmony/sweetharmony/dashboard/php/register_view.php?id=${productId}`, {
          method: 'GET',
          credentials: 'include'
        })
        .then(res => res.json())
        .then(data => console.log('Vista registrada:', data))
        .catch(err => console.error('Error registrando vista:', err));

        window.location.href = `Dashboard_Catalogo.html?id=${productId}`;
      });
      

      cardActions.append(btnWhatsapp, btnWishlist, btnViewDetails);
      cardBanner.appendChild(cardActions);
      


      // --- Card Content ---
      const cardContent = document.createElement('div');
      cardContent.classList.add('card-content');

      const priceDiv = document.createElement('div');
      priceDiv.classList.add('price');
      if (producto.old_price) {
        const del = document.createElement('del');
        del.classList.add('del');
        del.textContent = `s/.${producto.old_price}`;
        priceDiv.appendChild(del);
      }
      const spanPrice = document.createElement('span');
      spanPrice.classList.add('span');
      spanPrice.textContent = `s/.${producto.price}`;
      priceDiv.appendChild(spanPrice);

      const h3 = document.createElement('h3');
      const enlace = document.createElement('a');
      enlace.href = "#";
      enlace.classList.add('product-title');
      enlace.textContent = producto.product_name;
      h3.appendChild(enlace);

      cardContent.append(priceDiv, h3);

      shopCard.append(cardBanner, cardContent);
      li.appendChild(shopCard);
      contenedor.appendChild(li);
    }); 
  } 
  window.renderCatalogo = renderCatalogo; 

// =============================
// FETCH WISHLIST
// =============================
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/get_wishlist.php', { credentials: 'include' });
    const favoritos = await res.json();
    favoritos.forEach(id => {
      const button = document.querySelector(`[data-product-id='${id}']`);
      if (button) {
        button.classList.add('favorito');
        button.innerHTML = `<ion-icon name="star" aria-hidden="true"></ion-icon>`;
      }
    });
  } catch (err) {
    console.error('Error al obtener favoritos:', err);
  }
});

// =============================
// FUNCION DETALLE DEL PRODUCTO
// =============================
function openProductDetail(product) {
  
  const catalogoEl = document.getElementById('catalogo');
  const detailEl = document.getElementById('product-detail-page');
  catalogoEl.style.display = 'none';
  detailEl.style.display = 'block';

  detailEl.innerHTML = `
  <div class="product-detail">
    <img src="${product.image_url ? '../../uploads/' + encodeURIComponent(product.image_url) : '../dashboard/assets/product-01.jpg'}" alt="${product.product_name}">
    
    <div class="product-detail-info">
    
      <h2>${product.product_name}</h2>
      <p>Tipo de producto: ${product.product_type_name ?? '---'}</p>
      <p>Tipo de planta: ${product.plant_type_name ?? '---'}</p>
      <p>Dimensiones de la planta: ${product.plant_height || '-'} x ${product.plant_width || '-'}</p>
      <p>Dimensiones de la maceta: ${product.pot_height || '-'} x ${product.pot_width || '-'}</p>
      <p>Peso: ${product.weight || '-'}</p>
      <p>Unidades: ${product.units != null ? product.units : '-'}</p>
      <p>Precio: ${product.price ? 's/.' + product.price : '-'}</p>
      <p>${Number(product.discount) > 0 ? 'Descuento: ' + (Number(product.discount) % 1 === 0 ? Number(product.discount) : Number(product.discount).toFixed(2)) + '%' : ''}</p>
      <p class="price-total">
        ${
          product.price 
            ? 's/.' + (
                product.discount > 0 
                  ? (product.price * (1 - product.discount / 100)).toFixed(2) 
                  : product.price
              ) 
            : '-'
        }
      </p>
      <p>Descripción: ${product.description || '-'}</p>

      <div class="product-detail-quantity">
        <button id="detail-qty-decrease">-</button>
        <input type="number" id="detail-quantity" value="1" min="1" max="${product.units || 1}">
        <button id="detail-qty-increase">+</button>
      </div>

      <div class="product-detail-buttons">
        <button id="detail-add-to-cart">Añadir al carrito</button>
        <button id="add-to-wishlist">Añadir a favoritos</button>
        <button id="back-to-catalog">Volver al catálogo</button>
      </div>
    </div>
  </div>
`;

// Botón añadir a favoritos
const favBtn = document.getElementById('add-to-wishlist');

favBtn.onclick = async () => {
  try {
    const res = await fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/add_wishlist.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: product.id }),
      credentials: 'include'
    });

    const data = await res.json();
    console.log("DATA:", data);

  
    alert(data.message);

  } catch (err) {
    alert('Error de conexión con el servidor');
  }
};

  // Registrar la vista automáticamente al abrir el detalle
fetch(`http://localhost/sweetharmony/sweetharmony/dashboard/php/register_view.php?id=${product.id}`, {
  method: 'GET',
  credentials: 'include'
})
.then(res => res.json())
.then(data => {
  console.log('Vista registrada al abrir:', data);


})
.catch(err => console.error('Error registrando vista:', err));


  document.getElementById('back-to-catalog').addEventListener('click', () => {
    detailEl.style.display = 'none';
    catalogoEl.style.display = 'grid';
  });
      const qtyInput = document.getElementById('detail-quantity');
    document.getElementById('detail-qty-increase').onclick = () => { 
      if (parseInt(qtyInput.value) < (product.units || 1)) qtyInput.value++; 
      else alert(`Solo hay ${product.units || 1} unidades disponibles`);
    };
    document.getElementById('detail-qty-decrease').onclick = () => { 
      if (qtyInput.value > 1) qtyInput.value--; 
    };
    document.getElementById('detail-add-to-cart').onclick = async () => {
      const quantity = parseInt(qtyInput.value);
        try { ' '
      const res = await fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/show_product_catalogo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, quantity }),
        credentials: 'include'
      });
      const data = await res.json();
      alert(data.message || 'Error al añadir al carrito');
    } catch {
      alert('Error de conexión con el servidor.');
    }
  
  };
}

// =============================
// UTILIDADES
// =============================
const addEventOnElemCatalog = function(elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) elem[i].addEventListener(type, callback);
  } else {
    elem.addEventListener(type, callback);
  }
};

// =============================
// CARGA EXTERNA DE PRODUCTOS
// =============================
document.addEventListener('DOMContentLoaded', () => {
  // Cargar todos los productos primero (tu código actual)...

  // Revisar si hay ?id= en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (productId) {
    // Obtener detalle del producto y abrirlo
    fetch(`http://localhost/sweetharmony/sweetharmony/dashboard/php/get_product_cart.php?product_id=${productId}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          openProductDetail(data.product);
        }
      })
      .catch(err => console.error('Error al cargar el producto:', err));
  }
});

// =============================
// FETCH DEL CATALOGO (MODIFICADO)
// =============================
fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/dashboard_catalogo.php')
  .then(res => res.json())
  .then(data => {
    // 1. Guardar productos
    window.allProducts = data;
    
    // 2. Verificar si hay búsqueda en URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
      // 🔥 CAMBIA ESTO: Usar executeSearch en lugar de buscarEnCatalogo
      setTimeout(() => {
        if (window.executeSearch) {
          // Decodificar el query
          const decodedQuery = decodeURIComponent(searchQuery);
          
          // Rellenar el campo de búsqueda
          const searchInput = document.getElementById('search-input');
          if (searchInput) {
            searchInput.value = decodedQuery;
          }
          
          // Ejecutar la búsqueda
          window.executeSearch(decodedQuery);
        } else if (typeof buscarEnCatalogo === 'function') {
          buscarEnCatalogo(searchQuery);
        }
      }, 300);
    } else {
      // 3. Renderizar normalmente
      renderCatalogo(data);
    }
    
    // 4. Inicializar búsqueda
    if (typeof initSearch === 'function') {
      initSearch(data);
    }
  })
  .catch(err => console.error("Error:", err));
  