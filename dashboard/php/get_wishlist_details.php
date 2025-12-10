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

// Consulta con JOIN para traer detalles del producto y descuento
$sql = "
    SELECT 
        p.id AS product_id,
        p.product_name,
        p.price,
        p.discount,      -- <-- agregamos descuento
        p.image_url,
        w.created_at
    FROM wishlist w
    INNER JOIN products p ON w.product_id = p.id
    WHERE w.user_id = $user_id
    ORDER BY w.created_at DESC
";

$result = $conexion->query($sql);

if (!$result) {
    http_response_code(500);
    die(json_encode(["error" => "Error en la consulta: " . $conexion->error]));
}

$wishlist = [];
while ($row = $result->fetch_assoc()) {
    $wishlist[] = [
        "id" => intval($row['product_id']),
        "product_name" => $row['product_name'],
        "price" => floatval($row['price']),
        "discount" => floatval($row['discount']), // <-- agregamos descuento
        "image_url" => $row['image_url'],
        "created_at" => $row['created_at']
    ];
}

echo json_encode($wishlist);
