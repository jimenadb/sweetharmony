// admin_metrics.js o script dentro de <script> en HTML
fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/get_metricas.php")
  .then(response => {
    if (!response.ok) throw new Error("Error al cargar métricas");
    return response.json();
  })
  .then(data => {
    // --- Actualizar los totales ---
    document.getElementById('totalUsers').textContent = data.totalUsers || 0;
    document.getElementById('totalProducts').textContent = data.totalProducts || 0;
    document.getElementById('totalOrders').textContent = data.totalOrders || 0;

    // --- Productos más vistos ---
    const mostViewedUl = document.getElementById('mostViewed');
    const mostSoldUl = document.getElementById('mostSold');
    const notificationsUl = document.getElementById('notifications');

    // --- Notificaciones ---
 
    notificationsUl.innerHTML = '';
    // Nuevo pedido
    if (data.newOrders && data.newOrders.length > 0) {
      data.newOrders.forEach(order => {
          const li = document.createElement('li');
          li.textContent = ` Nuevo pedido #${order.id} `;
          notificationsUl.appendChild(li);
  
        
      });
  }

    // Productos agotados
    // --- Producto agotado ---
if (data.outOfStock && data.outOfStock.length > 0) {
  data.outOfStock.forEach(product => {
    const li = document.createElement('li');
    li.textContent = `Producto agotado: ${product.name}`;
    notificationsUl.appendChild(li);

  });
}

    
    mostSoldUl.innerHTML = '';
    data.mostSold.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
        <img src="${product.image || '../assets/default.jpg'}" alt="${product.name}" 
            style="width:40px;height:40px;object-fit:cover;border-radius:6px;margin-right:8px;">
        <span>${product.name} - ${product.sold} vendidos</span>
    `;
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.gap = '6px';
    mostSoldUl.appendChild(li);
    });

    mostViewedUl.innerHTML = '';
    data.mostViewed.forEach(product => {
      const li = document.createElement('li');

      const img = document.createElement('img');
      img.src = product.image || '../assets/default.jpg';
      img.alt = product.name;
      img.style.width = '50px';
      img.style.height = '50px';
      img.style.objectFit = 'cover';
      img.style.marginRight = '0.5rem';
      img.style.borderRadius = '6px';
      img.style.verticalAlign = 'middle';

      const text = document.createTextNode(`${product.name} - ${product.views} vistas`);

      li.appendChild(img);
      li.appendChild(text);
      mostViewedUl.appendChild(li);
    });

    // --- Productos agotados ---
    const outOfStockUl = document.getElementById('outOfStock');
    outOfStockUl.innerHTML = '';
    data.outOfStock.forEach(product => {
      const li = document.createElement('li');

      const img = document.createElement('img');
      img.src = product.image || '../assets/default.jpg';
      img.alt = product.name;
      img.style.width = '50px';
      img.style.height = '50px';
      img.style.objectFit = 'cover';
      img.style.marginRight = '0.5rem';
      img.style.borderRadius = '6px';
      img.style.verticalAlign = 'middle';

      const text = document.createTextNode(product.name);

      li.appendChild(img);
      li.appendChild(text);
      outOfStockUl.appendChild(li);
    });
  })
  .catch(error => console.error("Fetch error:", error));
