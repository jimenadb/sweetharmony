<?php
require_once "../../conexion.php";
header("Content-Type: application/json");
session_start();

$user_id = $_SESSION['user_id'] ?? 0;
$data = json_decode(file_get_contents("php://input"), true);
$product_id = (int)($data['product_id'] ?? 0);
$quantity = max(1, (int)($data['quantity'] ?? 1));

if ($product_id && $user_id) {
    $stmt = $conexion->prepare("UPDATE cart SET quantity=? WHERE product_id=? AND user_id=?");
    $stmt->bind_param("iii", $quantity, $product_id, $user_id);
    if ($stmt->execute()) echo json_encode(['success'=>true]);
    else echo json_encode(['success'=>false,'message'=>'No se pudo actualizar']);
} else {
    echo json_encode(['success'=>false,'message'=>'Datos inválidos']);
}
