<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "../../conexion.php";

session_start();
$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    http_response_code(401);
    echo json_encode(["message" => "No has iniciado sesión"]);
    exit;
}

// Consulta con JOIN para obtener los productos del carrito, incluyendo discount
$sql = "
SELECT 
  c.product_id,
  c.quantity,
  p.product_name,
  p.price,
  p.image_url,
  p.units,
  p.discount
FROM cart AS c
INNER JOIN products AS p ON c.product_id = p.id
WHERE c.user_id = $user_id
";

$result = $conexion->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(["message" => "Error en la consulta: " . $conexion->error]);
    exit;
}

// Crear array con los productos del carrito
$cart = [];
while ($row = $result->fetch_assoc()) {
    $cart[] = [
        "id" => (int)$row['product_id'],
        "name" => $row['product_name'],
        "price" => (float)$row['price'],
        "image" => $row['image_url'],
        "quantity" => (int)$row['quantity'],
        "units" => (int)$row['units'],
        "discount" => (float)$row['discount'] // agregado
    ];
}

echo json_encode($cart, JSON_UNESCAPED_UNICODE);
?>
