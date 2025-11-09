<?php
// Conexión a la DB
require_once "../../conexion.php";



// 1️⃣ Obtener todos los nombres de productos
$sql = "SELECT product_name FROM products";
$result = $conexion->query($sql);

$products = [];
if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        $products[] = $row['product_name'];
    }
}

// 2️⃣ Producto de prueba (simula el clic del usuario)
$clickedProduct = "Rosa Roja";

// 3️⃣ Preparar payload para Hugging Face

$payload = [
    "inputs" => [
        "source_sentence" => $clickedProduct,
        "sentences" => $products
    ]
];

// 4️⃣ Llamada al endpoint de Hugging Face
$ch = curl_init("https://router.huggingface.co/hf-inference/models/BAAI/bge-m3/pipeline/sentence-similarity");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $HF_TOKEN",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$response = curl_exec($ch);
curl_close($ch);

$scores = json_decode($response, true);

// 5️⃣ Combinar productos con sus scores
$combined = [];
foreach($products as $i => $p){
    $combined[] = ['product'=>$p, 'score'=>$scores[$i]];
}

// 6️⃣ Ordenar por similitud descendente y tomar top 3
usort($combined, fn($a,$b)=>$b['score']<=>$a['score']);
$top = array_slice($combined, 0, 3);

echo "<h2>Producto clicado: $clickedProduct</h2>";
echo "<h3>Top 3 recomendaciones:</h3><ul>";
foreach($top as $rec){
    echo "<li>".$rec['product']." (Score: ".round($rec['score'],3).")</li>";
}
echo "</ul>";
