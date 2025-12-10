const isUnavailable = product.units === 0 || product.active === 0;

if (isUnavailable) {
  detailEl.innerHTML = `
    <div class="product-detail">
      <img src="${product.image_url ? '../../uploads/' + encodeURIComponent(product.image_url) : '../dashboard/assets/product-01.jpg'}" alt="${product.product_name}" style="display:block; margin:0 auto;">
      <p class="agotado" style="color:red; font-weight:bold; font-size:1.5rem; text-align:center; margin:1rem 0;">¡Producto agotado!</p>
      <div style="text-align:center; margin-top:1rem;">
        <button id="back-to-catalog">Volver al catálogo</button>
      </div>
    </div>
  `;

  document.getElementById('back-to-catalog').addEventListener('click', () => {
    detailEl.style.display = 'none';
    catalogoEl.style.display = 'grid';
  });

  return; // Termina la función aquí
}