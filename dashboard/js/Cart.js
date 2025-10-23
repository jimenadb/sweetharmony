// --- Mini carrito usando solo JS ---

// Inicializa carrito desde localStorage o vacío
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Elementos del botón del carrito
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

// Actualiza contador y total
function updateCartUI() {
  cartCount.textContent = cart.length;
  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;
  // Guarda en localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Función para agregar producto al carrito
function addToCart(product) {
  // Verifica si ya existe
  const existing = cart.find(p => p.id === product.id);
  if (existing) {
    existing.quantity += product.quantity || 1;
  } else {
    cart.push(product);
  }
  updateCartUI();
}

// Mostrar carrito (por ahora con alert o console.log)
cartBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  let content = "Productos en el carrito:\n\n";
  cart.forEach(p => {
    content += `${p.name} x${p.quantity} - $${(p.price * p.quantity).toFixed(2)}\n`;
  });

  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
  content += `\nTotal: $${total.toFixed(2)}`;

  alert(content);
});

// --- EJEMPLO: agregar producto al carrito ---
// Llama a esta función cuando el usuario haga clic en un botón de "Agregar"
function ejemploAgregarProducto() {
  addToCart({
    id: 1,
    name: "Planta Ficus",
    price: 25.50,
    quantity: 1
  });
}

// Inicializa UI al cargar la página
updateCartUI();
