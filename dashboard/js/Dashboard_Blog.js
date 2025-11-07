document.addEventListener('DOMContentLoaded', function() {
  const postsEl = document.getElementById('posts');
  const pagerEl = document.getElementById('pager');
  const searchEl = document.getElementById('search');
  const params = new URLSearchParams(window.location.search);
  const postIdFromURL = params.get('id');

  const PAGE_SIZE = 6; //controla cuantos posts se mostraran
  let currentPage = 1;
  let allPosts = [];
  let filtered = [];

  // Cargar posts desde el servidor
  function loadPosts() {
    fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/dashboard_blog.php')
      .then(response => response.json())
      .then(data => {
        allPosts = data;
        filtered = data;

        // 🟢 Si había un post guardado, mostrarlo directamente
        const savedPostId = localStorage.getItem("currentPostId");
        if (savedPostId) {
          const post = filtered.find(p => p.id === parseInt(savedPostId));
          if (post) {
            openPost(post.id);
            return;
          }
        }

        renderPosts();
      })
      .catch(error => {
        console.error('Error al cargar los posts:', error);
        postsEl.innerHTML = '<p>No se pudieron cargar los posts.</p>';
      });
  }

  // Renderizar los posts
  function renderPosts() {
    postsEl.innerHTML = '';
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    if (pageItems.length === 0) {
      postsEl.innerHTML = `
        <div class="empty">
          <strong>No hay resultados.</strong>
          <div>Intenta otra búsqueda.</div>
        </div>
      `;
      renderPager();
      return;
    }

    pageItems.forEach(post => {
      const article = document.createElement('article');
      article.className = 'post';
      article.innerHTML = `
        <img class="post-img" src="../../uploads/blog/${post.image_url}" alt="${escapeHtml(post.title)}">
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

  function loadPosts() {
    fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/dashboard_blog.php')
      .then(response => response.json())
      .then(data => {
        allPosts = data;
        filtered = data;
  
        // 1️⃣ Leer id del post desde la URL
        const params = new URLSearchParams(window.location.search);
        const postIdFromURL = params.get('id');
  
        if (postIdFromURL) {
          const post = filtered.find(p => p.id === parseInt(postIdFromURL));
          if (post) {
            openPost(post.id);  // abre directamente el post
            return;
          }
        }
  
        // 2️⃣ Si no hay id en URL, mostrar la lista normal
        renderPosts();
      })
      .catch(error => {
        console.error('Error al cargar los posts:', error);
        postsEl.innerHTML = '<p>No se pudieron cargar los posts.</p>';
      });
  }
  
  

  // Renderizar paginación
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

  // Manejar botón "Leer más"
  function attachReadButtons() {
    document.querySelectorAll('.read-more').forEach(btn => {
      btn.addEventListener('click', (e) => openPost(+e.currentTarget.dataset.id));
    });
  }

  // Abrir detalle del post
  function openPost(id) {
    const index = filtered.findIndex(x => x.id === id);
    const post = filtered[index];
    if (!post) return;

    // 🟢 Guardar el post actual
    localStorage.setItem("currentPostId", post.id);

    const prevPost = filtered[index - 1];
    const nextPost = filtered[index + 1];

    // 🟢 Ocultar paginador
    pagerEl.style.display = "none";


    postsEl.innerHTML = `
      <article class="post-detail">
        <img class="post-img" src="../../uploads/blog/${post.image_url}" alt="${escapeHtml(post.title)}">
        <h1 class="post-title">${escapeHtml(post.title)}</h1>
        <p class="post-meta">${formatDate(post.created_at)} • ${post.status}</p>
        <p class="post-content">${escapeHtml(post.content)}</p>

        <div class="post-nav">
          ${prevPost ? `<button class="nav-btn prev" data-id="${prevPost.id}">⬅ Anterior</button>` : '<span></span>'}
          <button id="back-btn">Volver a la lista</button>
          ${nextPost ? `<button class="nav-btn next" data-id="${nextPost.id}">Siguiente ➡</button>` : '<span></span>'}
        </div>
      </article>
    `;

    // 🟢 Botón volver
    document.getElementById("back-btn").addEventListener("click", () => {
      localStorage.removeItem("currentPostId");
      renderPosts();
      pagerEl.style.display = "block"; // <--- vuelve a mostrarlo
    });

    // 🟢 Botones de navegación
    document.querySelectorAll('.nav-btn').forEach(navBtn => {
      navBtn.addEventListener('click', (ev) => {
        const newId = +ev.currentTarget.dataset.id;
        openPost(newId);
      });
    });
  }

  // Utilidades
  function formatDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return (
      String(d.getDate()).padStart(2, '0') + '/' +
      String(d.getMonth() + 1).padStart(2, '0') + '/' +
      d.getFullYear()
    );
  }

  function escapeHtml(s) {
    return (s || '').toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Búsqueda en tiempo real
  searchEl.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    filtered = allPosts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q)
    );
    currentPage = 1;
    renderPosts();
  });

  // Iniciar carga inicial
  loadPosts();
});
