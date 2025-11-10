<?php
require_once "../conexion.php";
header("Content-Type: application/json; charset=UTF-8");

// 1️⃣ Producto clicado (puede venir por GET)
$clickedProduct = $_GET['product'] ?? null;

// 2️⃣ Si no hay producto clicado, devolver top por vistas
if (!$clickedProduct) {
    $sql = "SELECT id, product_name, views, image_url FROM products ORDER BY views DESC LIMIT 3";
    $result = $conexion->query($sql);

    $top = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $top[] = [
                "product" => $row['product_name'],
                "score" => (float)$row['views'], // usamos views como “score”
                "image_url" => $row['image_url']
            ];
        }
    }

    echo json_encode([
        "clicked" => null,
        "recommendations" => $top
    ]);
    exit;
}

// 3️⃣ Si hay producto clicado, obtener todos los productos con su image_url
$sql = "SELECT product_name, image_url FROM products";
$result = $conexion->query($sql);

$products = [];
$imageMap = []; // Mapa product_name => image_url
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row['product_name'];
        $imageMap[$row['product_name']] = $row['image_url'];
    }
}

// 4️⃣ Llamada a Hugging Face

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
curl_close($ch);

$scores = json_decode($response, true);

// 5️⃣ Combinar productos con scores y agregar image_url
$combined = [];
foreach ($products as $i => $p) {
    $combined[] = [
        'product' => $p,
        'score' => $scores[$i],
        'image_url' => $imageMap[$p] ?? null
    ];
}

// 6️⃣ Ordenar y top 3
usort($combined, fn($a,$b) => $b['score'] <=> $a['score']);
$top = array_slice($combined, 0, 3);

// 7️⃣ Devolver JSON
echo json_encode([
    "clicked" => $clickedProduct,
    "recommendations" => $top
]);
