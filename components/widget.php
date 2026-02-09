<?php


require_once "../conexion.php";
header("Content-Type: application/json; charset=UTF-8");


// Obtener el último producto clickeado
$sqlLast = "SELECT id, product_name, image_url FROM products ORDER BY last_viewed_at DESC LIMIT 1";
$resultLast = $conexion->query($sqlLast);

if (!$resultLast || $resultLast->num_rows === 0) {
    echo json_encode(["error" => "No hay productos con last_viewed_at registrado"]);
    exit;
}

$lastProduct = $resultLast->fetch_assoc();
$clickedProduct = $lastProduct['product_name'];

// Obtener todos los productos
$sql = "SELECT id, product_name, image_url FROM products";
$result = $conexion->query($sql);

$products = [];
$imageMap = [];
$idMap = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row['product_name'];
        $imageMap[$row['product_name']] = $row['image_url'];
        $idMap[$row['product_name']] = $row['id'];
    }
}

// Preparar solicitud al modelo de similitud

$payload = [
    "inputs" => [
        "source_sentence" => $clickedProduct,
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

// Combinar productos con puntuaciones
$combined = [];
foreach ($products as $i => $p) {
    $combined[] = [
        "id" => $idMap[$p] ?? null,
        "product" => $p,
        "score" => $scores[$i] ?? 0,
        "image_url" => $imageMap[$p] ?? null
    ];
}


// Excluir el mismo producto clickeado y tomar los 3 más similares
$combined = array_filter($combined, fn($x) => $x['product'] !== $clickedProduct);
usort($combined, fn($a, $b) => $b['score'] <=> $a['score']);
$top = array_slice($combined, 0, 3);

// Respuesta final
echo json_encode([
    "clicked" => $clickedProduct,
    "recommendations" => $top
]);

