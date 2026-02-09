<?php
require_once "../../conexion.php";
header("Content-Type: application/json; charset=UTF-8");


// Obtener la query enviada desde el buscador
$searchTerm = isset($_GET['search']) ? trim($_GET['search']) : '';

if (!$searchTerm) {
    echo json_encode(["error" => "No se recibió término de búsqueda"]);
    exit;
}

// 1. PALABRAS CLARAMENTE IRRELEVANTES - DEVOLVER VACÍO INMEDIATAMENTE
$irrelevantWords = ['perro', 'gato', 'auto', 'coche', 'mascota', 'animal', 
                   'casa', 'computadora', 'teléfono', 'ropa', 'comida'];

$searchLower = strtolower($searchTerm);
if (in_array($searchLower, $irrelevantWords)) {
    echo json_encode([
        "query" => $searchTerm,
        "results" => [],
        "message" => "Búsqueda no relacionada"
    ]);
    exit;
}

// 2. Obtener todos los productos
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

// 3. Solicitar a Hugging Face
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

// 4. Combinar y filtrar resultados
$combined = [];
foreach ($products as $i => $p) {
    $score = $scores[$i] ?? 0;
    
    // FILTROS ESTRICTOS:
    // a. Eliminar productos con nombre vacío
    if (empty(trim($p))) {
        continue;
    }
    
    // b. Solo incluir si la puntuación es razonable
    if ($score < 0.6) { // Ajusta este valor según necesites
        continue;
    }
    
    // c. Si la búsqueda es corta (<4 chars) y no hay coincidencia parcial, filtrar
    if (strlen($searchTerm) < 4 && stripos($p, $searchTerm) === false) {
        continue;
    }
    
    $combined[] = [
        "id" => $idMap[$p] ?? null,
        "product" => $p,
        "score" => $score,
        "image_url" => $imageMap[$p] ?? null,
        "price" => isset($priceMap[$p]) ? (float)$priceMap[$p] : 0,
        "discount" => isset($discountMap[$p]) ? (float)$discountMap[$p] : 0
    ];
}

// 5. Ordenar y eliminar duplicados
usort($combined, fn($a, $b) => $b['score'] <=> $a['score']);

// Eliminar duplicados por ID
$uniqueResults = [];
$seenIds = [];
foreach ($combined as $item) {
    if (!in_array($item['id'], $seenIds)) {
        $seenIds[] = $item['id'];
        $uniqueResults[] = $item;
    }
}

// Tomar solo los top 5 después de filtrar
$top = array_slice($uniqueResults, 0, 5);

// 6. Respuesta final
echo json_encode([
    "query" => $searchTerm,
    "results" => $top,
    "count" => count($top)
]);
?>