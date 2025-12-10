<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "../../conexion.php";

$order_id = intval($_GET['order_id'] ?? 0);
if (!$order_id) {
    echo json_encode(['error' => 'No se recibió el ID del pedido']);
    exit;
}

// ==============================
//  Datos del pedido + dirección + comprobantes + envío
// ==============================
$sql = "SELECT o.id, o.user_id, o.total, o.status, o.receipt,
               o.tracking_number, o.courier, o.shipping_notes, o.delivery_type, o.shipping_receipt, o.created_at,
               ua.full_name, ua.email, ua.dni, ua.address, ua.district, ua.city, ua.postal_code, ua.reference
        FROM orders o
        LEFT JOIN user_addresses ua ON o.delivery_address_id = ua.id
        WHERE o.id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $order_id);
$stmt->execute();
$order = $stmt->get_result()->fetch_assoc();

if (!$order) {
    echo json_encode(['error' => 'Pedido no encontrado']);
    exit;
}

// ==============================
// Traer productos del pedido
// ==============================
$sql_products = "SELECT p.product_name, p.image_url, oi.quantity, oi.price
                 FROM order_items oi
                 JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = ?";
$stmt2 = $conexion->prepare($sql_products);
$stmt2->bind_param("i", $order_id);
$stmt2->execute();
$result_products = $stmt2->get_result();
$productos = [];
while ($row = $result_products->fetch_assoc()) {
    $productos[] = $row;
}

// ==============================
// 3Combinar todo
// ==============================
$order['productos'] = $productos;

// ==============================
// Devolver JSON completo
// ==============================
echo json_encode($order, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
