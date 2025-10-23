
    /* ---------- sample posts ---------- */
    const POSTS = [
      {
        id: 1,
        title: "Cómo elegir plantas para espacios con poca luz",
        excerpt: "Si tu departamento recibe poca luz, aquí tienes 7 especies resistentes y bellas que sobreviven con cariño y poca luz.",
        img: "../assets/product-01.jpg",
        tags: ["interiores", "poca-luz"],
        date: "2025-04-12"
      },
      {
        id: 2,
        title: "Macetas decorativas: materiales y estilos para 2025",
        excerpt: "Un repaso práctico por materiales (cerámica, barro, cemento, fibras naturales) y cómo combinarlos con tus plantas.",
        img: "../assets/product-02.jpg",
        tags: ["macetas", "decoración"],
        date: "2025-03-28"
      }

      /* puedes añadir más objetos aquí para probar la paginación */
    ];

    /* ---------- rendering logic ---------- */
    const PAGE_SIZE = 4;      // posts per page
    let currentPage = 1;
    let filtered = POSTS.slice();

    const postsEl = document.getElementById('posts');
    const pagerEl = document.getElementById('pager');
    const searchEl = document.getElementById('search');

    function renderPosts(page = 1){
      postsEl.innerHTML = '';
      const start = (page-1)*PAGE_SIZE;
      const pageItems = filtered.slice(start, start + PAGE_SIZE);

      if(pageItems.length === 0){
        postsEl.innerHTML = '<div class="empty"><strong>No hay resultados.</strong><div style="margin-top:8px">Intenta otra búsqueda.</div></div>';
        renderPager();
        return;
      }

      for(const p of pageItems){
        const article = document.createElement('article');
        article.className = 'post';
        article.innerHTML = `
          <img class="post-img" src="${p.img}" alt="${escapeHtml(p.title)}">
          <div class="post-body">
            <div class="post-meta">${formatDate(p.date)} • <span style="text-transform:capitalize">${p.tags.join(', ')}</span></div>
            <h2 class="post-title">${escapeHtml(p.title)}</h2>
            <p class="post-excerpt">${escapeHtml(p.excerpt)}</p>
            <div class="post-tags">${p.tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
            <div class="post-footer">
              <small>${formatDate(p.date)}</small>
              <button class="read-more" data-id="${p.id}" aria-label="Leer ${escapeHtml(p.title)}">Leer</button>
            </div>
          </div>
        `;
        postsEl.appendChild(article);
      }
      renderPager();
      attachReadButtons();
    }

    function renderPager(){
      pagerEl.innerHTML = '';
      const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
      // previous
      if(totalPages > 1){
        for(let i=1;i<=totalPages;i++){
          const btn = document.createElement('button');
          btn.className = 'page-btn' + (i===currentPage ? ' active' : '');
          btn.textContent = i;
          btn.setAttribute('aria-label','Ir a la página '+i);
          btn.addEventListener('click', ()=>{ currentPage = i; renderPosts(i); window.scrollTo({top:120,behavior:'smooth'}); });
          pagerEl.appendChild(btn);
        }
      }
    }

    /* search */
    searchEl.addEventListener('input', (e)=>{
      const q = e.target.value.trim().toLowerCase();
      filtered = POSTS.filter(p => {
        return p.title.toLowerCase().includes(q) ||
               p.excerpt.toLowerCase().includes(q) ||
               p.tags.join(' ').toLowerCase().includes(q);
      });
      currentPage = 1;
      renderPosts(1);
    });

    /* read buttons - show an alert demo (replace with actual article page link) */
    function attachReadButtons(){
      document.querySelectorAll('.read-more').forEach(btn=>{
        btn.addEventListener('click', (e)=>{
          const id = +e.currentTarget.dataset.id;
          const post = POSTS.find(x=>x.id===id);
          if(!post) return;
          // demo behavior: open new page or modal - here we open a simple new window for demo:
          const demoHtml = `
            <html><head><title>${escapeHtml(post.title)}</title>
            <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700&display=swap" rel="stylesheet">
            <style>body{font-family:Urbanist,system-ui;line-height:1.6;padding:28px;max-width:820px;margin:auto} img{max-width:100%;height:auto;border-radius:8px}</style>
            </head><body>
            <h1>${escapeHtml(post.title)}</h1>
            <p style="color:#666">${formatDate(post.date)} • ${post.tags.join(', ')}</p>
            <img src="${post.img}" alt="${escapeHtml(post.title)}">
            <p style="margin-top:18px">${escapeHtml(post.excerpt)}</p>
            <p>Entrada de muestra. Reemplaza con el contenido real del artículo.</p>
            </body></html>
          `;
          const w = window.open('', '_blank');
          w.document.open();
          w.document.write(demoHtml);
          w.document.close();
        });
      });
    }

    /* utils */
    function formatDate(iso){ // naive formatting yyyy-mm-dd -> dd/mm/yyyy
      const d = new Date(iso);
      if(isNaN(d)) return iso;
      return String(d.getDate()).padStart(2,'0') + '/' + String(d.getMonth()+1).padStart(2,'0') + '/' + d.getFullYear();
    }
    function escapeHtml(s){
      return (s||'').toString()
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    /* initial render */
    renderPosts(1);
