// ---- Variables ----
const openCartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

let cart = [];

// ---- Abrir carrito ----
openCartBtn.addEventListener('click', () => {
  cartSidebar.classList.add('active');
});

// ---- Cerrar carrito ----
closeCartBtn.addEventListener('click', () => {
  cartSidebar.classList.remove('active');
});

// ---- Añadir producto ----
function addToCart(product) {
  const existing = cart.find(p => p.name === product.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
}

// ---- Actualizar carrito ----
function updateCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <p>${item.name} x ${item.qty}</p>
      <span>$${(item.price * item.qty).toFixed(2)}</span>
      <button onclick="removeItem(${index})">❌</button>
    `;
    cartItemsContainer.appendChild(div);
  });
  cartTotal.textContent = total.toFixed(2);
}

// ---- Quitar item ----
function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}
