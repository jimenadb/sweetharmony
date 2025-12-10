// Toggle sidebar
const menuToggle = document.createElement('button');
menuToggle.innerHTML = '☰';
menuToggle.classList.add('btn', 'btn-primary', 'me-3');
menuToggle.id = 'menu-toggle';
document.body.prepend(menuToggle);

const wrapper = document.getElementById('wrapper') || document.body;

menuToggle.addEventListener('click', () => {
  wrapper.classList.toggle('toggled');
});

// Activar scrollable tablas
document.querySelectorAll('.table-responsive').forEach(table => {
  table.style.maxHeight = '60vh';
  table.style.overflowY = 'auto';
  table.style.overflowX = 'auto';
});
