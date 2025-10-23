<?php
require_once "../../conexion.php"; 

session_start();
$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(["success" => false, "message" => "Usuario no logueado"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$product_id = intval($data['product_id']);
$quantity = intval($data['quantity'] ?? 1);

$sql = "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("iiii", $user_id, $product_id, $quantity, $quantity);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
?>
