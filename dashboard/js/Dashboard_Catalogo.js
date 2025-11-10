// =============================
// FETCH CATALOGO COMPLETO
// =============================
fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/dashboard_catalogo.php')
  .then(response => response.json())
  .then(data => {
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

      if (producto.discount) {
        const spanBadge = document.createElement('span');
        spanBadge.classList.add('badge');
        spanBadge.setAttribute('aria-label', `${producto.discount}% off`);
        spanBadge.textContent = `-${producto.discount}%`;
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

      const btnCart = document.createElement('button');
      btnCart.classList.add('action-btn');
      btnCart.setAttribute('aria-label', 'add to cart');
      btnCart.setAttribute('data-type', 'cart');
      btnCart.setAttribute('data-product-id', producto.id);
      btnCart.innerHTML = `<ion-icon name="bag-handle-outline" aria-hidden="true"></ion-icon>`;
      btnCart.addEventListener('click', async (e) => {
        const button = e.currentTarget;
        const productId = button.getAttribute('data-product-id');
        const isInCart = button.classList.contains('in-cart');
        try {
          const response = await fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/add_to_cart.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, action: isInCart ? 'remove' : 'add' }),
            credentials: 'include'
          });
          const data = await response.json();
          if (response.ok) {
            if (isInCart) {
              button.classList.remove('in-cart');
              button.innerHTML = `<ion-icon name="bag-handle-outline" aria-hidden="true"></ion-icon>`;
            } else {
              button.classList.add('in-cart');
              button.innerHTML = `<ion-icon name="bag-handle" aria-hidden="true"></ion-icon>`;
            }
            console.log(data.message);
          } else {
            console.error(data.message);
          }
        } catch (err) {
          console.error('Error al actualizar carrito:', err);
        }
      });

      const btnViewDetails = document.createElement('button');
      btnViewDetails.classList.add('action-btn','view-details-btn');
      btnViewDetails.setAttribute('aria-label', 'view product details');
      btnViewDetails.setAttribute('data-product-id', producto.id);
      btnViewDetails.innerHTML = `<ion-icon name="add-circle-outline" aria-hidden="true"></ion-icon>`;

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
      
      document.querySelectorAll('.product-card').forEach(card => {
        card.onclick = () => {
          const id = card.dataset.id;
          const name = card.querySelector('h3').textContent;
          window.productClicked(id, name);
        };
      });

      cardActions.append(btnWhatsapp, btnWishlist, btnCart, btnViewDetails);
      cardBanner.appendChild(cardActions);
      


      // --- Card Content ---
      const cardContent = document.createElement('div');
      cardContent.classList.add('card-content');

      const priceDiv = document.createElement('div');
      priceDiv.classList.add('price');
      if (producto.old_price) {
        const del = document.createElement('del');
        del.classList.add('del');
        del.textContent = `$${producto.old_price}`;
        priceDiv.appendChild(del);
      }
      const spanPrice = document.createElement('span');
      spanPrice.classList.add('span');
      spanPrice.textContent = `$${producto.price}`;
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
  })
  .catch(error => console.error("Error al cargar", error));

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
// FETCH CARRITO
// =============================
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/get_cart_for_catalogo.php', { credentials: 'include' });
    const carrito = await res.json();
    carrito.forEach(id => {
      const btn = document.querySelector(`[data-type='cart'][data-product-id='${id}']`);
      if (btn) btn.innerHTML = `<ion-icon name="bag-handle" aria-hidden="true"></ion-icon>`;
    });
  } catch (err) {
    console.error('Error al obtener carrito:', err);
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
      <p>${product.product_type || 'Tipo no disponible'}</p>
      <p>${product.plant_type || 'Tipo de planta no disponible'}</p>
      <p>${product.discount > 0 ? 'Descuento: ' + product.discount + '%' : ''}</p>
      <p>Precio: ${product.price ? '$' + product.price : '-'}</p>
      <p>Dimensiones de la planta: ${product.plant_height || '-'} x ${product.plant_width || '-'}</p>
      <p>Dimensiones de la maceta: ${product.pot_height || '-'} x ${product.pot_width || '-'}</p>
      <p>Peso: ${product.weight || '-'}</p>
      <p>Unidades: ${product.units != null ? product.units : '-'}</p>

      <div class="product-detail-quantity">
        <button id="detail-qty-decrease">-</button>
        <input type="number" id="detail-quantity" value="1" min="1">
        <button id="detail-qty-increase">+</button>
      </div>

      <div class="product-detail-buttons">
        <button id="detail-add-to-cart">Añadir al carrito</button>
        <button id="back-to-catalog">Volver al catálogo</button>
      </div>
    </div>
  </div>
`;

  document.getElementById('back-to-catalog').addEventListener('click', () => {
    detailEl.style.display = 'none';
    catalogoEl.style.display = 'grid';
  });
  const qtyInput = document.getElementById('detail-quantity');
  document.getElementById('detail-qty-increase').onclick = () => { qtyInput.value = parseInt(qtyInput.value) + 1; };
  document.getElementById('detail-qty-decrease').onclick = () => { if(qtyInput.value > 1) qtyInput.value--; };
  document.getElementById('detail-add-to-cart').onclick = async () => {
    const quantity = parseInt(qtyInput.value);
    try {
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
// CAPTURA DE CLICKS
// =============================
btnViewDetails.addEventListener('click', (e) => {
  e.stopPropagation();
  const productId = producto.id;
  const productName = producto.product_name;

  // 🚀 Registrar para recomendaciones
  productClicked(productId, productName);

  window.location.href = `Dashboard_Catalogo.html?id=${productId}`;
});

// Captura clics en el título
enlace.addEventListener('click', (e) => {
  e.preventDefault(); // si no quieres navegar inmediatamente
  productClicked(producto.id, producto.product_name);
});


