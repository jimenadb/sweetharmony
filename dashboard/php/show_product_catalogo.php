<?php
session_start(); 
header("Content-Type: application/json; charset=UTF-8");
require_once "../../conexion.php";

$user_id = $_SESSION['user_id'] ?? null;
if (!$user_id) {
    http_response_code(401);
    echo json_encode(["message" => "No has iniciado sesión"]);
    exit;
}

// Recibe JSON del fetch
$input = json_decode(file_get_contents('php://input'), true);
$product_id = intval($input['product_id'] ?? 0);
$quantity = intval($input['quantity'] ?? 1);

if (!$product_id || $quantity <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "Datos inválidos"]);
    exit;
}

// Verificar si ya existe
$stmt = $conexion->prepare("SELECT id FROM cart WHERE user_id = ? AND product_id = ?");
$stmt->bind_param("ii", $user_id, $product_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Si existe, actualiza cantidad
    $stmt = $conexion->prepare("UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?");
    $stmt->bind_param("iii", $quantity, $user_id, $product_id);
    $stmt->execute();
    echo json_encode(["status" => "success", "message" => "Cantidad actualizada"]);
} else {
    // Si no existe, inserta nuevo
    $stmt = $conexion->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
    $stmt->bind_param("iii", $user_id, $product_id, $quantity);
    $stmt->execute();
    echo json_encode(["status" => "success", "message" => "Producto agregado al carrito"]);
}

?>
