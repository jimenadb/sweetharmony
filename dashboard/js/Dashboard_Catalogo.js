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


    const btnCart = document.createElement("a");
    btnCart.href = `https://wa.me/51910405014?text=${encodeURIComponent(
      `Hola, estoy interesado en el producto: ${producto.product_name}`
    )}`

    btnCart.target = "_blank";
    btnCart.classList.add("action_btn");
    btnCart.setAttribute("aria-label","add to cart");
    btnCart.innerHTML = `<ion-icon name="bag-handle-outline" aria-hidden="true"></ion-icon>`;

 
    btnCart.classList.add('action-btn');
    btnCart.setAttribute('aria-label','add to cart');
    btnCart.innerHTML = `<ion-icon name="bag-handle-outline" aria-hidden="true"></ion-icon>`;

    const btnWishlist = document.createElement('button');
    btnWishlist.classList.add('action-btn');
    btnWishlist.setAttribute('aria-label', 'add to wishlist');
    btnWishlist.innerHTML = `<ion-icon name="star-outline" aria-hidden="true"></ion-icon>`;

    const btnCompare = document.createElement('button');
    btnCompare.classList.add('action-btn');
    btnCompare.setAttribute('aria-label', 'compare');
    btnCompare.innerHTML = `<ion-icon name="repeat-outline" aria-hidden="true"></ion-icon>`;

    cardActions.append(btnCart, btnWishlist, btnCompare);
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

