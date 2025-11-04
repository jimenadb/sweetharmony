//Catalogo Completo

fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/dashboard_catalogo.php')
.then(response => response.json())
.then(data => {
  const contenedor = document.getElementById('catalogo');

  contenedor.innerHTML = '';

  data.forEach(producto => {
    const li = document.createElement('li');
    li.classList.add('product-grid');
//----------shop card--------------
    const shopCard = document.createElement('div');
    shopCard.classList.add('shop-card');
//------------card banner----------------
    const cardBanner = document.createElement('div');
    cardBanner.classList.add('card-banner','img-holder');
    cardBanner.style.setProperty('--width','540');
    cardBanner.style.setProperty('--height','720');
//-------------imagen------------
    const img = document.createElement('img');
    img.src = producto.img_url || '../assets/product-01.jpg';
    img.width = 540;
    img.height = 720;
    img.loading = 'lazy';
    img.alt = producto.product_name;
    img.classList.add('img-cover');
    cardBanner.appendChild(img);

    if (producto.discount) {
      const spanBadge = document.createElement('span');
      spanBadge.classList.add('badge');
      spanBadge.setAttribute('aria-label',`${producto.discount}% off`);
      spanBadge.textContent = `-${producto.discount}%`;
      cardBanner.appendChild(spanBadge);
    }

//-------------card actions ---------------
    const cardActions = document.createElement('div');
    cardActions.classList.add('card-actions');


    const btnWhatsapp = document.createElement("a");
    btnWhatsapp.href = `https://wa.me/51910405014?text=${encodeURIComponent(
      `Hola, estoy interesado en el producto: ${producto.product_name}`
    )}`
    btnWhatsapp.target = "_blank";
    btnWhatsapp.classList.add("action_btn");
    btnWhatsapp.setAttribute("aria-label","whatsapp");
    btnWhatsapp.innerHTML = `<ion-icon name="logo-whatsapp" aria-hidden="true"></ion-icon>`;
    btnWhatsapp.classList.add('action-btn');
    btnWhatsapp.setAttribute('aria-label','whatsapp');
    btnWhatsapp.innerHTML = `<ion-icon name="logo-whatsapp" aria-hidden="true"></ion-icon>`;

    const btnWishlist = document.createElement('button');
    btnWishlist.classList.add('action-btn');
    btnWishlist.setAttribute('aria-label', 'add to wishlist');
    btnWishlist.setAttribute('data-product-id', producto.id); // <--- CORRECTO
    btnWishlist.innerHTML = `<ion-icon name="star-outline" aria-hidden="true"></ion-icon>`;
    

    // -----------------------------------
    // Botón para guardar en wishlist
    // -----------------------------------
    btnWishlist.addEventListener('click', async (e) => {
      const button = e.currentTarget;
      const productId = button.getAttribute('data-product-id');
      const isFavorito = button.classList.contains('favorito'); // clase para saber si ya está

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
            // quitar de favoritos
            button.classList.remove('favorito');
            button.innerHTML = `<ion-icon name="star-outline" aria-hidden="true"></ion-icon>`;
          } else {
            // agregar a favoritos
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
    // -----------------------------------
    // Evento: agregar o quitar del carrito
    // -----------------------------------
    btnCart.addEventListener('click', async (e) => {
      const button = e.currentTarget;
      const productId = button.getAttribute('data-product-id');
      const isInCart = button.classList.contains('in-cart'); // saber si ya está agregado

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
            // Eliminar del carrito
            button.classList.remove('in-cart');
            button.innerHTML = `<ion-icon name="bag-handle-outline" aria-hidden="true"></ion-icon>`;
          } else {
            // Agregar al carrito
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


    // Crear botón de "Ver detalles"
    const btnViewDetails = document.createElement('button');
    btnViewDetails.classList.add('action-btn');  // Clase común para el estilo
    btnViewDetails.classList.add('view-details-btn');  // Clase específica para el botón de detalles
    btnViewDetails.setAttribute('aria-label', 'view product details');
    btnViewDetails.setAttribute('data-product-id', producto.id);
    btnViewDetails.innerHTML = `<ion-icon name="add-circle-outline" aria-hidden="true"></ion-icon>`;  // Ícono "+" con el estilo de Ionicons

    // Añadir evento para abrir popup
    btnViewDetails.addEventListener('click', async (e) => {
      e.stopPropagation(); // Prevenir que el click también abra el popup en la tarjeta

      const productId = producto.id;
      
      // Obtener detalles del producto desde el servidor
      try {
        const response = await fetch(`http://localhost/sweetharmony/sweetharmony/dashboard/php/get_product_cart.php?product_id=${productId}`);
        const data = await response.json();

        if (response.ok && data.status === 'success') {
          // Aquí abrirías el popup con los detalles del producto
          openProductPopup(data.product); // Supón que esta función llena los datos en el popup
        } else {
          console.error('Error al cargar detalles del producto');
        }
      } catch (err) {
        console.error('Error al obtener los detalles del producto:', err);
      }
    });


    cardActions.append(btnWhatsapp, btnWishlist, btnCart, btnViewDetails);
    cardBanner.appendChild(cardActions);

    // --- card-content ---
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

    // --- unir todo ---
    shopCard.append(cardBanner, cardContent);


    shopCard.addEventListener('click', async () => {
      const productId = producto.id;
    
      // Registrar la vista (aunque no esté logeado)
      navigator.sendBeacon(`http://localhost/sweetharmony/sweetharmony/dashboard/php/register_view.php?id=${productId}`);
    
      // Obtener detalles del producto
      try {
        const response = await fetch(`http://localhost/sweetharmony/sweetharmony/dashboard/php/get_product_cart.php?product_id=${productId}`);
        const data = await response.json();
    
        if (response.ok && data.status === 'success') {
          openProductPopup(data.product);
        }
      } catch (err) {
        console.error('Error al obtener los detalles del producto:', err);
      }
    });
    


    li.appendChild(shopCard);
    contenedor.appendChild(li);
  });
})
.catch(error => {
  console.error("Error al cargar", error);
});

// -----------------------------------
// Trae los datos del wishlist
// -----------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/get_wishlist.php', {
      credentials: 'include'
    });
    const favoritos = await res.json();

    // Marcar las estrellitas de los productos que ya son favoritos
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
// -----------------------------------
// Trae los datos del carrito
// -----------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/get_cart_for_catalogo.php', {
      credentials: 'include'
    });
    const carrito = await res.json();

    carrito.forEach(id => {
      const btn = document.querySelector(`[data-type='cart'][data-product-id='${id}']`);
      if (btn) btn.innerHTML = `<ion-icon name="bag-handle" aria-hidden="true"></ion-icon>`;
    });
  } catch (err) {
    console.error('Error al obtener carrito:', err);
  }
});

// -----------------------------------
// ABRIR EL POPUP
// -----------------------------------
function openProductPopup(product) {
  // Obtener referencias a los elementos
  const nameEl = document.getElementById('popup-product-name');
  const imgEl = document.getElementById('popup-product-img');
  const typeEl = document.getElementById('popup-product-type');
  const plantTypeEl = document.getElementById('popup-plant-type');
  const discountEl = document.getElementById('popup-discount');
  const priceEl = document.getElementById('popup-price');
  const plantDimEl = document.getElementById('popup-plant-dimensions');
  const potDimEl = document.getElementById('popup-pot-dimensions');
  const weightEl = document.getElementById('popup-weight');
  const unitsEl = document.getElementById('popup-units');

  // Llenar los datos, aunque sean null
  nameEl.textContent = product.product_name || 'Nombre no disponible';
  imgEl.src = product.image_url && product.image_url !== '' ? product.image_url : '../assets/product-01.jpg';
  typeEl.textContent = product.product_type || 'Tipo no disponible';
  plantTypeEl.textContent = product.plant_type || 'Tipo de planta no disponible';
  discountEl.textContent = product.discount > 0 ? `Descuento: ${product.discount}%` : '';
  priceEl.textContent = product.price ? `$${product.price}` : 'Precio no disponible';
  plantDimEl.textContent = `Dimensiones de la planta: ${product.plant_height || '-'} cm x ${product.plant_width || '-'} cm`;
  potDimEl.textContent = `Dimensiones de la maceta: ${product.pot_height || '-'} cm x ${product.pot_width || '-'} cm`;
  weightEl.textContent = `Peso: ${product.weight || '-'} kg`;
  unitsEl.textContent = `Unidades disponibles: ${product.units != null ? product.units : '-'}`;

  // Mostrar el popup
  document.getElementById('product-popup').style.display = 'block';

  // Cerrar popup al hacer clic en el botón
  document.getElementById('popup-close').addEventListener('click', () => {
    document.getElementById('product-popup').style.display = 'none';

  });
  document.getElementById('add-to-cart').onclick = async () => {
    const quantity = parseInt(document.getElementById('product-quantity').value) || 1;
  
    try {
      const res = await fetch('http://localhost/sweetharmonysweetharmony/dashboard/php/add_item_popup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, quantity }),
        credentials: 'include' // mantiene la sesión PHP
      });
  
      const data = await res.json();
      alert(data.message || 'Error al añadir al carrito');
      if (data.status === 'success') document.getElementById('product-popup').style.display = 'none';
    } catch {
      alert('Error de conexión con el servidor.');
    }
  };

  
  // -----------------------------------
  // BOTONES DE CANTIDAD (+ y -)
  // -----------------------------------
  const quantityInput = document.getElementById('product-quantity');
  const btnIncrease = document.getElementById('quantity-increase');
  const btnDecrease = document.getElementById('quantity-decrease');

  // Evita agregar múltiples listeners cada vez que se abre el popup
  btnIncrease.onclick = () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
  };

  btnDecrease.onclick = () => {
    const current = parseInt(quantityInput.value);
    if (current > 1) quantityInput.value = current - 1;
  };
}




/*-----------------------------------
  UTILS
-----------------------------------*/
const addEventOnElem = function(elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
};


/*-----------------------------------
  BACK TO TOP BUTTON
-----------------------------------*/
const backTopBtn = document.querySelector("[data-back-top-btn]");

const backTopBtnActive = function() {
  if (backTopBtn) {
    if (window.scrollY > 150) {
      backTopBtn.classList.add("active");
    } else {
      backTopBtn.classList.remove("active");
    }
  }
};
addEventOnElem(window, "scroll", backTopBtnActive);
/*-----------------------------------
  SCROLL REVEAL EFFECT
-----------------------------------*/
const sections = document.querySelectorAll("[data-section]");
const scrollReveal = function() {
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].getBoundingClientRect().top < window.innerHeight / 2) {
      sections[i].classList.add("active");
    }
  }
};
scrollReveal();
addEventOnElem(window, "scroll", scrollReveal);
