// Widget con imágenes y nombres
(function() {
  // Estilos con nombres
  const style = document.createElement("style");
  style.textContent = `
    #product-suggestions {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      border-radius: 12px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.15);
      padding: 12px;
      z-index: 10000;
      font-family: 'Urbanist', sans-serif;
      display: flex;
      align-items: center;
      gap: 10px;
      border: 2px solid #3B5849;
    }
    
    .suggestions-title {
      color: #3B5849;
      font-size: 12px;
      font-weight: 700;
      white-space: normal;
      line-height: 1.2;
      padding-right: 8px;
      border-right: 2px solid #eee;
      text-align: center;
      width: 60px;
    }
    
    .suggestions-container {
      display: flex;
      gap: 15px;
      align-items: center;
    }
    
    .suggestion-item {
      width: 110px;
      text-align: center;
      cursor: pointer;
      transition: transform 0.2s;
      flex-shrink: 0;
      text-decoration: none;
      color: inherit;
    }
    
    .suggestion-item:hover {
      transform: translateY(-5px);
    }
    
    .suggestion-image {
      width: 110px;
      height: 110px;
      border-radius: 8px;
      object-fit: cover;
      display: block;
      margin-bottom: 6px;
      border: 2px solid #eee;
      transition: all 0.2s;
    }
    
    .suggestion-item:hover .suggestion-image {
      border-color: #3B5849;
      box-shadow: 0 5px 15px rgba(59, 88, 73, 0.2);
    }
    
    .suggestion-name {
      font-size: 11px;
      font-weight: 600;
      color: #333;
      line-height: 1.3;
      max-height: 28px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    .close-suggestions-btn {
      background: #ff5555;
      border: none;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      color: white;
      font-weight: bold;
      transition: background 0.2s;
      flex-shrink: 0;
      margin-left: 5px;
    }
    
    .close-suggestions-btn:hover {
      background: #ff3333;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      #product-suggestions {
        padding: 10px;
      }
      
      .suggestion-item {
        width: 95px;
      }
      
      .suggestion-image {
        width: 95px;
        height: 95px;
      }
      
      .suggestion-name {
        font-size: 10px;
      }
    }
  `;
  document.head.appendChild(style);

  // Crear widget
  const widget = document.createElement("div");
  widget.id = "product-suggestions";
  widget.innerHTML = `
    <div class="suggestions-title">También te<br>puede interesar</div>
    <div class="suggestions-container" id="suggestions-container">
      <div>Cargando...</div>
    </div>
    <button class="close-suggestions-btn" title="Cerrar">×</button>
  `;
  
  document.body.appendChild(widget);

  // Elementos
  const widgetEl = document.getElementById('product-suggestions');
  const closeBtn = widget.querySelector('.close-suggestions-btn');
  const container = widget.querySelector('#suggestions-container');

  // Cerrar widget
  closeBtn.addEventListener('click', () => {
    widgetEl.remove();
  });

  // Mostrar sugerencias con nombres
  function showSuggestions(products) {
    container.innerHTML = '';
    
    if (!products || products.length === 0) return;

    // Tomar 3 productos (para que quepan mejor con los nombres)
    const suggestions = products.slice(0, 3);
    
    suggestions.forEach(p => {
      const item = document.createElement('a');
      item.href = `Dashboard_Catalogo.html?id=${p.id}`;
      item.className = 'suggestion-item';
      
      // Cortar nombre si es muy largo
      const shortName = p.product.length > 30 
        ? p.product.substring(0, 30) + '...' 
        : p.product;
      
      item.innerHTML = `
        <img src="../../uploads/${p.image_url || ''}" 
             class="suggestion-image" 
             alt="${p.product}"
             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEwIiBoZWlnaHQ9IjExMCIgdmlld0JveD0iMCAwIDExMCAxMTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjExMCIgaGVpZ2h0PSIxMTAiIHJ4PSI4IiBmaWxsPSIjZjBmNWY3Ii8+PHBhdGggZD0iTTU1IDQwQzUwLjAzIDQwIDQ2IDQ0LjAzIDQ2IDQ5QzQ2IDUzLjk3IDUwLjAzIDU4IDU1IDU4QzU5Ljk3IDU4IDY0IDUzLjk3IDY0IDQ5QzY0IDQ0LjAzIDU5Ljk3IDQwIDU1IDQwWiIgZmlsbD0iIzNiNTg0OSIvPjxwYXRoIGQ9Ik0zNSA4MEw1NSA1MEw3NSA4MCIgc3Ryb2tlPSIjM2I1ODQ5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==';">
        <div class="suggestion-name">${shortName}</div>
      `;
      
      container.appendChild(item);
    });
  }

  // Obtener sugerencias
  async function fetchSuggestions() {
    try {
      const url = 'http://localhost/sweetharmony/sweetharmony/components/widget.php';
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.recommendations && data.recommendations.length) {
        showSuggestions(data.recommendations);
      }
    } catch (e) {
      console.log("Widget de sugerencias cargado");
    }
  }

  setTimeout(() => {
    fetchSuggestions();
  }, 1000);

})();