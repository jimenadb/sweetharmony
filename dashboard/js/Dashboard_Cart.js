const cartItems = document.querySelectorAll('#cart-items tr');
const grandTotalEl = document.getElementById('grand-total');
const selectAllCheckbox = document.getElementById('select-all');

function updateTotals() {
  let total = 0;
  cartItems.forEach(row => {
    const price = parseFloat(row.querySelector('.price-unit').textContent.replace('$',''));
    const qty = parseInt(row.querySelector('.quantity').value);
    const rowTotal = price * qty;
    row.querySelector('.total-price').textContent = `$${rowTotal.toFixed(2)}`;
    total += rowTotal;
  });
  grandTotalEl.textContent = `$${total.toFixed(2)}`;
}

// actualizar al cambiar cantidad
cartItems.forEach(row => {
  row.querySelector('.quantity').addEventListener('change', updateTotals);
});

// seleccionar todos
selectAllCheckbox.addEventListener('change', e => {
  cartItems.forEach(row => {
    row.querySelector('.select-item').checked = e.target.checked;
  });
});

// eliminar seleccionados
document.getElementById('delete-selected').addEventListener('click', () => {
  cartItems.forEach(row => {
    if(row.querySelector('.select-item').checked){
      row.remove();
    }
  });
  updateTotals();
});

// vaciar carrito
document.getElementById('empty-cart').addEventListener('click', () => {
  document.getElementById('cart-items').innerHTML = '';
  updateTotals();
});

// inicializar totales
updateTotals();
