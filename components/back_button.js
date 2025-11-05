document.addEventListener("DOMContentLoaded", () => {
  const btn = document.createElement('button');
  btn.title = "Volver";

  // Imagen de la flecha
  const img = document.createElement('img');
  img.src = '../../components/assets/flecha.png'; // ruta correcta
  img.alt = 'Volver';
  img.style.cssText = `
    width: 50px;
    height: 50px;
    object-fit: contain;
    display: block;
  `;

  btn.appendChild(img);

  // Click del botón
  btn.onclick = () => history.length > 1 ? history.back() : location.href = '/';

  // Estilos del botón (sin fondo)
  btn.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    width: 50px;
    height: 50px;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    z-index: 9999;
  `;

  document.body.appendChild(btn);
});


// Como llamar al boton
// <script src="./component/back_button.js"></script>

