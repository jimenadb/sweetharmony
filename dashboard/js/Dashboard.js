'use strict';

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
  NAVBAR TOGGLE
-----------------------------------*/
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function() {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
};
addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function() {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
};
addEventOnElem(navbarLinks, "click", closeNavbar);

/*-----------------------------------
  HEADER STICKY & BACK TOP BTN
-----------------------------------*/
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const headerActive = function() {
  if (window.scrollY > 150) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
};
addEventOnElem(window, "scroll", headerActive);

let lastScrolledPos = 0;
const headerSticky = function() {
  if (lastScrolledPos >= window.scrollY) {
    header.classList.remove("header-hide");
  } else {
    header.classList.add("header-hide");
  }
  lastScrolledPos = window.scrollY;
};
addEventOnElem(window, "scroll", headerSticky);

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

/*-----------------------------------
  USER DROPDOWN
-----------------------------------*/
const userBtn = document.getElementById('userBtn');
const dropdownMenu = document.getElementById('dropdownMenu');

// Verificar si el usuario está logueado
const username = sessionStorage.getItem("username");
const userId = sessionStorage.getItem("user_id");

if (username && userId) {
  // Si está logueado, redirigir al perfil directamente al hacer clic
  userBtn.addEventListener('click', () => {
    window.location.href = "../../dashboard/html/Edit_User.html";
  });

  // Ocultar el dropdown (ya no se necesita)
  dropdownMenu.style.display = "none";
} else {
  // Si no está logueado, mostrar el menú al hacer clic
  userBtn.addEventListener('click', () => {
    dropdownMenu.classList.toggle('active');
  });

  // Cerrar si hace clic fuera
  document.addEventListener('click', (e) => {
    if (!userBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove('active');
    }
  });
}


/*-----------------------------------
  HEADER LOGO Y BOTONES DINÁMICOS
-----------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.logo');
  const logoutBtn = document.getElementById('logoutBtn');
  const ordersBtn = document.getElementById('ordersBtn');
  const username = sessionStorage.getItem('username');

  if(username) {
    // Mostrar nombre y botones
    logo.textContent = `Bienvenido, ${username}`;
    logoutBtn.style.display = 'inline-block';
    ordersBtn.style.display = 'inline-block';

    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('username');
      window.location.href = "../../login_register_users/html/LoginForm.html";
    });
  } else {
    // Usuario no logeado: mostrar valores por defecto
    logo.textContent = 'SWEET-HARMONY';
    logoutBtn.style.display = 'none';
    ordersBtn.style.display = 'none';
  }
});
/*-----------------------------------
  LOG OUT BUTTON
-----------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  
  const logoutBtn = document.getElementById('logoutBtn');

  // Solo si el usuario está logueado mostramos el botón
  const username = sessionStorage.getItem('username');
  if(username){
    logoutBtn.style.display = 'inline-block';
  }

  // Función de logout
  logoutBtn.addEventListener('click', () => {
    sessionStorage.clear();
    sessionStorage.removeItem('username'); // limpia la sesión
    window.location.href = "../../index.html"; // redirige al login
  });
});

/*-----------------------------------
  MOSTRAR BOTON DE PEDIDOS y direccion
-----------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const username = sessionStorage.getItem("username"); // ← revisa si hay sesión guardada

  const ordersBtn = document.getElementById("ordersBtn");
  const addressesBtn = document.getElementById("addressesBtn");

  if (username) {
    // ✅ Usuario logueado → mostrar botones
    if (ordersBtn) ordersBtn.style.display = "inline-block";
    if (addressesBtn) addressesBtn.style.display = "inline-block";
  } else {
    // ❌ No logueado → ocultar botones
    if (ordersBtn) ordersBtn.style.display = "none";
    if (addressesBtn) addressesBtn.style.display = "none";
  }
});

/*-----------------------------------
  BLOG 
-----------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost/sweetharmony/sweetharmony/dashboard/php/dashboard_blog.php")
    .then(res => res.json())
    .then(posts => {
      const recentList = document.getElementById("recent-posts");
      if (!posts.length) {
        recentList.innerHTML = "<p>No hay blogs recientes disponibles.</p>";
        return;
      }

      // Mostrar solo 4 entradas
      const recentPosts = posts.slice(0, 4);

      recentList.innerHTML = recentPosts.map(post => `
        <li class="scrollbar-item">
          <a href="Dashboard_Blog.html?id=${post.id}" class="blog-card" style="text-decoration: none; color: inherit;">
            <div class="card-banner img-holder" 
                 style="--width:720; --height:480; overflow:hidden; border-radius:10px;">
              <img src="../../uploads/blog/${post.image_url}" 
                   alt="${post.title}" 
                   class="blog-img"
                   style="width:100%; height:100%; object-fit:cover; object-position:center;">
            </div>
            <div class="blog-content" style="padding-top: 0.5rem;">
              <h3 class="blog-title" style="text-align:center;">${post.title}</h3>
            </div>
          </a>
        </li>
      `).join("");
    })
    .catch(err => console.error("Error cargando blogs recientes:", err));
});

/*-----------------------------------
  MODAL 
-----------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  const userId = sessionStorage.getItem('user_id'); // ✅ corregido
  const wishlistBtn = document.getElementById('wishlistBtn');
  const cartLink = document.getElementById('cartLink');
  const modal = document.getElementById('loginModal');

  function showModal(e) {
    e.preventDefault(); // Evita que navegue
    modal.style.display = 'flex';
  }

  if (!userId) {
    // ❌ No logueado → muestra el modal
    wishlistBtn.addEventListener('click', showModal);
    cartLink.addEventListener('click', showModal);
  } else {
    // ✅ Logueado → redirige normalmente
    wishlistBtn.addEventListener('click', () => window.location.href = "Dashboard_Wishlist.html");
    cartLink.addEventListener('click', () => window.location.href = "Dashboard_Cart.html");
  }

  // Cerrar modal al hacer clic afuera
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});



