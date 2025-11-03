<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../../conexion.php";

if (!isset($_GET["order_id"])) {
    echo json_encode(["error" => "No se proporcionó el ID del pedido."]);
    exit;
}

$order_id = intval($_GET["order_id"]);

// Datos del pedido y dirección
$sql = "SELECT o.id, o.user_id, o.total, o.status, o.delivery_address_id, o.created_at,
               a.full_name AS cliente, a.address, a.district, a.city, a.postal_code, a.reference
        FROM orders o
        LEFT JOIN user_addresses a ON o.delivery_address_id = a.id
        WHERE o.id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();
$order = $result->fetch_assoc();

if (!$order) {
    echo json_encode(["error" => "Pedido no encontrado."]);
    exit;
}

// Productos del pedido
$sqlItems = "SELECT p.id AS product_id, p.product_name, p.price, p.image_url, oi.quantity
             FROM order_items oi
             INNER JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?";
$stmtItems = $conexion->prepare($sqlItems);
$stmtItems->bind_param("i", $order_id);
$stmtItems->execute();
$resultItems = $stmtItems->get_result();

$productos = [];
while ($row = $resultItems->fetch_assoc()) {
    $productos[] = $row;
}

$order["productos"] = $productos;

echo json_encode($order, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
