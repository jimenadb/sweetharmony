<?php

require_once "../../conexion.php";
header("Content-Type: application/json; charset=UTF-8");
$HF_TOKEN = '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'; 

//  Obtener la query enviada desde el buscador
$searchTerm = isset($_GET['search']) ? trim($_GET['search']) : '';

if (!$searchTerm) {
    echo json_encode(["error" => "No se recibió término de búsqueda"]);
    exit;
}

// Obtener todos los productos
$sql = "SELECT id, product_name, image_url, price, discount FROM products";
$result = $conexion->query($sql);

$products = [];
$imageMap = [];
$idMap = [];
$priceMap = [];
$discountMap = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row['product_name'];
        $imageMap[$row['product_name']] = $row['image_url'];
        $idMap[$row['product_name']] = $row['id'];
        $priceMap[$row['product_name']] = $row['price'];
        $discountMap[$row['product_name']] = $row['discount'];
    }
}

// Preparar solicitud al modelo de similitud usando la query del buscador
$payload = [
    "inputs" => [
        "source_sentence" => $searchTerm,
        "sentences" => $products
    ]
];

$ch = curl_init("https://router.huggingface.co/hf-inference/models/BAAI/bge-m3/pipeline/sentence-similarity");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $HF_TOKEN",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo json_encode(["error" => curl_error($ch)]);
    curl_close($ch);
    exit;
}
curl_close($ch);

$scores = json_decode($response, true);

// Combinar productos con puntuaciones, IDs, precio y descuento
$combined = [];
foreach ($products as $i => $p) {
    $combined[] = [
        "id" => $idMap[$p] ?? null,
        "product" => $p,
        "score" => $scores[$i] ?? 0,
        "image_url" => $imageMap[$p] ?? null,
        "price" => isset($priceMap[$p]) ? (float)$priceMap[$p] : 0,
        "discount" => isset($discountMap[$p]) ? (float)$discountMap[$p] : 0
    ];
}

// Ordenar por score descendente y tomar los top 5
usort($combined, fn($a, $b) => $b['score'] <=> $a['score']);
$top = $combined;

// Respuesta final
echo json_encode([
    "query" => $searchTerm,
    "results" => $top
]);
