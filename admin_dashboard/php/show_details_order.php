<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "../../conexion.php";

$order_id = intval($_GET['order_id'] ?? 0);
if (!$order_id) {
    echo json_encode(['error' => 'No se recibió el ID del pedido']);
    exit;
}

$sql = "SELECT courier, tracking_number, shipping_notes, shipping_receipt
        FROM orders WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $order_id);
$stmt->execute();
$order = $stmt->get_result()->fetch_assoc();

if (!$order) {
    echo json_encode(['error' => 'Pedido no encontrado']);
    exit;
}

echo json_encode($order, JSON_UNESCAPED_UNICODE);
