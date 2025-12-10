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

$input = json_decode(file_get_contents('php://input'), true);
$product_id = intval($input['product_id']);

if (!$product_id) {
    http_response_code(400);
    echo json_encode(["message" => "Producto no válido"]);
    exit;
}

// Verificar si ya existe en wishlist
$sql_check = "SELECT id FROM wishlist WHERE user_id = $user_id AND product_id = $product_id";
$result = $conexion->query($sql_check);

if ($result->num_rows > 0) {
    $sql_delete = "DELETE FROM wishlist WHERE user_id = $user_id AND product_id = $product_id";
    if ($conexion->query($sql_delete)) {
        echo json_encode([
            "message" => "Producto eliminado de favoritos",
            "action" => "removed"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error al eliminar: " . $conexion->error]);
    }
} else {

    $sql_insert = "INSERT INTO wishlist (user_id, product_id) VALUES ($user_id, $product_id)";
    if ($conexion->query($sql_insert)) {
        echo json_encode([
            "message" => "Producto agregado a favoritos",
            "action" => "added"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error al agregar: " . $conexion->error]);
    }
}
