// Función para armar el HTML de un producto "Más Vistos"
function crearProductoHTMLMostView(product) {
    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;
    const precioFinal = discount > 0 ? (price * (1 - discount / 100)).toFixed(2) : price.toFixed(2);
  
    return `
      <li class="scrollbar-item">
        <div class="shop-card" data-id="${product.id}" style="cursor: pointer;">
          <div class="card-banner img-holder" style="--width:540; --height:720;">
            <img src="${product.image_url ? '../../uploads/' + product.image_url : '../assets/placeholder.png'}"
                 class="img-cover" alt="${product.product_name}">
            ${discount > 0 ? `<span class="badge" aria-label="${discount}% off">-${discount}%</span>` : ''}
          </div>
          <div class="card-content">
            <div class="price">
              ${discount > 0 ? `<del class="del">$${price.toFixed(2)}</del>` : ''}
              <span class="span">$${precioFinal}</span>
            </div>
            <h3 class="card-title">${product.product_name}</h3>
          </div>
        </div>
      </li>
    `;
  }
  
  // Cargar productos desde PHP
  fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/most_view_products.php')
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById('most-view-products');
      lista.innerHTML = data.map(crearProductoHTMLMostView).join('');

      lista.querySelectorAll('.shop-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.dataset.id;
          window.location.href = `Dashboard_Catalogo.html?id=${id}`;
        });
      });
    })
    .catch(err => console.error('Error cargando productos más vistos:', err));