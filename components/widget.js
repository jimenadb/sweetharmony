// ===== WIDGET FLOTANTE HORIZONTAL =====
const style = document.createElement("style");
style.textContent = `
#floating-widget{
  position:fixed;
  bottom:20px;
  left:50%;
  transform:translateX(-50%);
  background:white;
  border-radius:10px;
  box-shadow:0 4px 12px rgba(0,0,0,0.2);
  padding:10px;
  z-index:9999;
  font-family:sans-serif;
  display:flex;
  flex-direction:column;
  align-items:center;
}
#floating-widget .close-btn{
  position:absolute;
  top:5px;
  right:8px;
  cursor:pointer;
  font-weight:bold;
  font-size:18px;
}
#floating-widget .bee-icon{
  width:170px;
  height:140px;
  margin-bottom:5px;
}
#floating-widget .product-list{
  display:flex;
  gap:8px;
  overflow-x:auto;
  padding:5px;
  width:100%;
  justify-content:center;
}
#floating-widget .product-list li{
  list-style:none;
  flex:0 0 auto;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:4px;
}
#floating-widget .product-list li img{
  width:100px;
  height:100px;
  object-fit:cover;
  border-radius:4px;
}
`;
document.head.appendChild(style);

const widget = document.createElement("div");
widget.id = "floating-widget";
widget.innerHTML = `
  <span class="close-btn">×</span>
  <div style="display:flex; align-items:center; gap:10px;">
  <ul class="product-list" id="recommendations-list"></ul>
  <img src="../../components/assets/abejitarecomend.png" class="bee-icon">
</div>
`;
document.body.appendChild(widget);

// Cerrar widget
widget.querySelector(".close-btn").onclick = () => widget.style.display="none";

const list = widget.querySelector("#recommendations-list");
let clickedProducts = JSON.parse(localStorage.getItem('clickedProducts')||'[]');

// Función para renderizar productos en fila
function updateWidget(products) {
  list.innerHTML = "";
  products.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.image_url ? `<img src="../../uploads/${p.image_url}" alt="${p.product || p.name}">` : ""}
      <span style="font-size:12px;">${p.product || p.name} (Score: ${p.score?.toFixed(3) || 0})</span>
    `;
    list.appendChild(li);
  });
}

// Mostrar último clic o top por vistas
if(clickedProducts.length){
  const lastClicked = clickedProducts[clickedProducts.length - 1];
  fetchRecommendations(lastClicked.name);
} else {
  fetch('http://localhost/sweetharmony/sweetharmony/components/widget.php')
    .then(res => res.json())
    .then(data => {
      if(data.recommendations.length){
        updateWidget(data.recommendations);
      }
    });
}

// Registrar clic y actualizar widget
window.productClicked = (id,name,image_url)=>{
  clickedProducts.push({id,name,image_url});
  localStorage.setItem('clickedProducts',JSON.stringify(clickedProducts));
  updateWidget(clickedProducts);
  fetchRecommendations(name);
};

// Obtener recomendaciones IA
async function fetchRecommendations(productName){
  const res = await fetch(`http://localhost/sweetharmony/sweetharmony/components/widget.php?product=${encodeURIComponent(productName)}`);
  const data = await res.json();
  if(data.recommendations.length){
    updateWidget(data.recommendations);
  }
}

// Asignar clics a productos en la página
document.querySelectorAll('.product-card').forEach(card=>{
  card.onclick = ()=>{
    const id = card.dataset.id;
    const name = card.querySelector('h3').textContent;
    const image = card.querySelector('img')?.src || '';
    window.productClicked(id,name,image);
  };
});
