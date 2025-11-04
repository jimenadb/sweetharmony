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

// Recibir IDs vía POST
$data = json_decode(file_get_contents('php://input'), true);
$product_ids = $data['product_ids'] ?? [];

if (empty($product_ids)) {
    http_response_code(400);
    echo json_encode(["message" => "No se enviaron productos a eliminar"]);
    exit;
}

// Convertir a lista segura para SQL
$ids = implode(',', array_map('intval', $product_ids));

// Eliminar productos del carrito de este usuario
$sql = "DELETE FROM cart WHERE user_id = $user_id AND product_id IN ($ids)";
if ($conexion->query($sql)) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $conexion->error]);
}
?>
