 
const tabla = document.getElementById('tablaProductos');
const span = document.getElementById('productoSeleccionado');
const btnEditar = document.getElementById('btnEditar');
const btnEliminar = document.getElementById('btnEliminar');
    
tabla.addEventListener('click', e => {
  const fila = e.target.closest('tr');
  if (!fila) return;
    
  tabla.querySelectorAll('tr').forEach(r => r.classList.remove('seleccionada'));
  fila.classList.add('seleccionada');
    
  span.textContent = `Seleccionado: ${fila.cells[1].textContent}`;
  btnEditar.dataset.id = btnEliminar.dataset.id = fila.dataset.id;
});
    
// Referencias
const btnAgregar = document.getElementById('btnAgregar');
const modal = document.getElementById('modalAgregar');
const spanCerrar = document.getElementById('cerrarModal');
const form = document.getElementById("catalogoForm");

// Abrir modal al hacer clic en "Agregar"
btnAgregar.addEventListener('click', () => {
  form.reset();
  document.getElementById("previewImagen").innerHTML = "<span>Sin imagen</span>"; // limpia preview
  modal.style.display = 'block';
  form.querySelector("input[name='id']")?.remove();
});

// Cerrar modal al hacer clic en la "X"
spanCerrar.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Cerrar modal si se hace clic fuera del contenido
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});


const preview = document.getElementById("previewImagen");
const inputImg = document.getElementById("image_url");

// Mostrar imagen actual o "Sin imagen"
function mostrarImagen(url) {
  preview.innerHTML = url ? `<img src="${url}" style="width:100%;height:100%;object-fit:cover;">` : "<span>Sin imagen</span>";
}

// Cargar imagen actual al abrir formulario
mostrarImagen(productoSeleccionado?.image_url);

// Actualizar preview al cambiar archivo
inputImg.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => mostrarImagen(reader.result);
  reader.readAsDataURL(file);
});
