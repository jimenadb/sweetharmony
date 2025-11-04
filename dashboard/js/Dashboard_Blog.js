// Esperamos que el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
  const postsEl = document.getElementById('posts');
  const pagerEl = document.getElementById('pager');
  const searchEl = document.getElementById('search');

  const PAGE_SIZE = 4;
  let currentPage = 1;
  let filtered = [];

  // Función para cargar los posts desde el servidor
  function loadPosts() {
    fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/dashboard_blog.php')  // Ruta al script PHP
      .then(response => response.json())
      .then(data => {
        filtered = data; // Guarda los posts en la variable global
        renderPosts();
      })
      .catch(error => {
        console.error('Error al cargar los posts:', error);
        postsEl.innerHTML = '<p>No se pudieron cargar los posts.</p>';
      });
  }

  // Función para renderizar los posts
  function renderPosts() {
    postsEl.innerHTML = ''; // Limpiar contenido previo
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    if (pageItems.length === 0) {
      postsEl.innerHTML = '<div class="empty"><strong>No hay resultados.</strong><div>Intenta otra búsqueda.</div></div>';
      renderPager();
      return;
    }

    // Iterar sobre los posts y generarlos
    pageItems.forEach(post => {
      const article = document.createElement('article');
      article.className = 'post';
      article.innerHTML = `
        <img class="post-img" src="${post.image_url}" alt="${escapeHtml(post.title)}">
        <div class="post-body">
          <div class="post-meta">${formatDate(post.created_at)} • <span>${post.status}</span></div>
          <h2 class="post-title">${escapeHtml(post.title)}</h2>
          <p class="post-excerpt">${escapeHtml(post.content.slice(0, 100))}...</p>
          <div class="post-footer">
            <small>${formatDate(post.created_at)}</small>
            <button class="read-more" data-id="${post.id}" aria-label="Leer ${escapeHtml(post.title)}">Leer</button>
          </div>
        </div>
      `;
      postsEl.appendChild(article);
    });

    renderPager();
    attachReadButtons();
  }

  // Función para renderizar la paginación
  function renderPager() {
    pagerEl.innerHTML = '';
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
      btn.textContent = i;
      btn.setAttribute('aria-label', 'Ir a la página ' + i);
      btn.addEventListener('click', () => {
        currentPage = i;
        renderPosts();
        window.scrollTo({ top: 120, behavior: 'smooth' });
      });
      pagerEl.appendChild(btn);
    }
  }

  // Función para manejar el botón "Leer más"
  function attachReadButtons() {
    document.querySelectorAll('.read-more').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = +e.currentTarget.dataset.id;
        const post = filtered.find(x => x.id === id);
        if (!post) return;

        const demoHtml = `
          <html><head><title>${escapeHtml(post.title)}</title>
          <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700&display=swap" rel="stylesheet">
          <style>body{font-family:Urbanist,system-ui;line-height:1.6;padding:28px;max-width:820px;margin:auto} img{max-width:100%;height:auto;border-radius:8px}</style>
          </head><body>
          <h1>${escapeHtml(post.title)}</h1>
          <p style="color:#666">${formatDate(post.created_at)} • ${post.status}</p>
          <img src="${post.image_url}" alt="${escapeHtml(post.title)}">
          <p style="margin-top:18px">${escapeHtml(post.content)}</p>
          </body></html>
        `;
        const w = window.open('', '_blank');
        w.document.open();
        w.document.write(demoHtml);
        w.document.close();
      });
    });
  }

  // Función para formatear la fecha
  function formatDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
  }

  // Función para evitar ataques XSS
  function escapeHtml(s) {
    return (s || '').toString()
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Función de búsqueda
  searchEl.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    filtered = filtered.filter(p => {
      return p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q);
    });
    currentPage = 1;
    renderPosts();
  });

  // Cargar los posts al inicio
  loadPosts();
});
