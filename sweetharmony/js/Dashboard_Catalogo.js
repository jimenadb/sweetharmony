//Catalogo

fetch('../php/dashboard_catalogo.php')
.then(response => response.json())
.then(data => {
  const contenedor = document.getElementById('catalogo');

  data.forEach(producto => {
    const li = document.createElement('li');
    li.classList.add('product-grid');

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    const h3 = document.createElement('h3');
    const enlace = document.createElement('a');
    enlace.href = "#";
    enlace.classList.add("product-title");
    enlace.textContent = producto.product_name;

    h3.appendChild(enlace);
    contenedor.appendChild(h3);

    li.appendChild(cardContent);
    contenedor.appendChild(li);
  });
})
.catch(error =>{
  console.error("Error al cargar", error);
})

//CATALOGO DE PRUEBA//
// fetch('../php/dashboard_catalogo.php')
//   .then(response => {
//     console.log('Respuesta recibida:', response);
//     return response.json();
//   })
//   .then(data => {
//     console.log('Datos obtenidos del servidor:', data);

//     const contenedor = document.getElementById('catalogo');

//     if (!contenedor) {
//       console.error('No se encontró el contenedor con id "catalogo"');
//       return;
//     }

//     data.forEach(producto => {
//       const div = document.createElement('div');
//       div.textContent = producto.product_name; // Solo el nombre
//       contenedor.appendChild(div);
//     });
//   })
//   .catch(error => {
//     console.error("Error al cargar productos:", error);
//   });

