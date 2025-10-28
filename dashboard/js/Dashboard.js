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

userBtn.addEventListener('click', () => {
  dropdownMenu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!userBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.remove('active');
  }
});

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
  MOSTRAR BOTON DE PEDIDOS
-----------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = true; // ← cambia esto según tu lógica real de login
  if (isLoggedIn) {
    document.getElementById("ordersBtn").style.display = "inline-block";
    document.getElementById("addressesBtn").style.display = "inline-block";
  }
});