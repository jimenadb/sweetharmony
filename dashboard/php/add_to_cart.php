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
$product_id = intval($input['product_id'] ?? 0);
$action = $input['action'] ?? 'add'; // <-- para saber si se elimina o agrega
$quantity = intval($input['quantity'] ?? 1);

if (!$product_id) {
    http_response_code(400);
    echo json_encode(["message" => "Producto no válido"]);
    exit;
}

// Verificar si ya existe en el carrito
$sql_check = "SELECT id FROM cart WHERE user_id = $user_id AND product_id = $product_id";
$result = $conexion->query($sql_check);

if ($result->num_rows > 0) {
    if ($action === 'remove') {
        $sql_delete = "DELETE FROM cart WHERE user_id = $user_id AND product_id = $product_id";
        if ($conexion->query($sql_delete)) {
            echo json_encode([
                "message" => "Producto eliminado del carrito",
                "action" => "removed"
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Error al eliminar: " . $conexion->error]);
        }
    } else {

        echo json_encode([
            "message" => "El producto ya está en el carrito",
            "action" => "exists"
        ]);
    }
} else {
    // 🆕 No existe → agregar
    $sql_insert = "INSERT INTO cart (user_id, product_id, quantity) VALUES ($user_id, $product_id, $quantity)";
    if ($conexion->query($sql_insert)) {
        echo json_encode([
            "message" => "Producto agregado al carrito",
            "action" => "added"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error al agregar: " . $conexion->error]);
    }
}
?>
