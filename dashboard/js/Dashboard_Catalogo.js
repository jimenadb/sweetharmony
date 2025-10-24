//Catalogo Completo

fetch('http://158.69.214.32/ximena_flores/sweetharmony/dashboard/php/dashboard_catalogo.php')
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
        const response = await fetch('http://158.69.214.32/ximena_flores/sweetharmony/dashboard/php/add_wishlist.php', {
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
    btnCart.innerHTML = `<ion-icon name="bag-handle-outline" aria-hidden="true"></ion-icon>`;

    cardActions.append(btnWhatsapp, btnWishlist, btnCart);
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
    const res = await fetch('http://158.69.214.32/ximena_flores/sweetharmony/dashboard/php/get_wishlist.php', {
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
