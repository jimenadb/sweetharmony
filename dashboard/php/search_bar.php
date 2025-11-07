<?php
require_once "../../conexion.php";

$query = $_GET['q'] ?? '';
$query = trim($query);
$query = $conexion->real_escape_string($query);

if ($query === '') {
    echo json_encode([]);
    exit;
}

// Buscar en múltiples campos: nombre, descripción, tipo, color
$sql = "
SELECT id, product_name, description, price, discount, image_url 
FROM products 
WHERE 
    product_name LIKE '%$query%' OR
    description LIKE '%$query%' OR
    product_type LIKE '%$query%' OR
    pot_color LIKE '%$query%'
ORDER BY product_name ASC
LIMIT 10
";

$result = $conexion->query($sql);

$products = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($products);
?>
