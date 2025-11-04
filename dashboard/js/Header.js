// header.js
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('header-container');
    if (!container) return;
  
    container.innerHTML = `
  <header class="header">
    <div class="header-top" data-header>
      <div class="container">
        <button class="nav-open-btn" aria-label="open menu" data-nav-toggler>
          <span class="line line-1"></span>
          <span class="line line-2"></span>
          <span class="line line-3"></span>
        </button>
        <div class="input-wrapper">
          <input type="search" name="search" placeholder="Search product" class="search-field">
          <button class="search-submit" aria-label="search">
            <ion-icon name="search-outline" aria-hidden="true"></ion-icon>
          </button>
        </div>
        <a href="#" class="logo">SWEET-HARMONY</a>
        <div class="header-actions">
          <div class="user-dropdown">
            <button class="header-action-btn" id="userBtn">
              <ion-icon name="person-outline"></ion-icon>
            </button>
            <div class="dropdown-menu" id="dropdownMenu">
              <a href="../../login_register_users/html/LoginForm.html">Iniciar sesión</a>
              <a href="../../login_register_users/html/RegisterForm.html">Registrarse</a>
            </div>
          </div>
          <a href="Dashboard_Wishlist.html" id="wishlistBtn" class="header-action-btn">
            <ion-icon name="star-outline"></ion-icon>
          </a>
          <a href="Dashboard_Cart.html" id="cartLink">
            <button id="cartBtn" class="header-action-btn">
              <data id="cartTotal" class="btn-text" value="0"></data>
              <ion-icon name="bag-handle-outline"></ion-icon>
            </button>
          </a>
          <a href="Dashboard_Order.html">
            <button id="ordersBtn" style="display:none;" class="header-action-btn">
              <ion-icon name="cube-outline"></ion-icon>
            </button>
          </a>
          <a href="User_Address.html">
            <button id="addressesBtn" style="display:none;" class="header-action-btn">
              <ion-icon name="home-outline"></ion-icon>
            </button>
          </a>
          <button class="header-action-btn" id="logoutBtn">
            <ion-icon name="log-out-outline"></ion-icon>
          </button>
        </div>
        <nav class="navbar">
          <ul class="navbar-list">
            <li><a href="Dashboard.html" class="navbar-link has-after">INICIO</a></li>
            <li><a href="Dashboard_Catalogo.html" class="navbar-link has-after">CATÁLOGO</a></li>
            <li><a href="Dashboard_Blog.html" class="navbar-link has-after">BLOG</a></li>
            <li><a href="Dashboard_About.html" class="navbar-link has-after">NOSOTROS</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
    `;
  
    // Inicializa las funciones del Dashboard.js si es necesario
    if (typeof initDashboardHeader === "function") {
      initDashboardHeader();
    }
  });
  