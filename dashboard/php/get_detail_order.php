<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");
require_once "../../conexion.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Usuario no logueado"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Filtramos solo los pedidos visibles
$sql = "
  SELECT 
    o.id,
    o.total,
    o.status,
    o.created_at,
    o.receipt,
    o.courier,
    o.delivery_type,
    o.tracking_number,
    o.shipping_notes,
    o.shipping_receipt,
    ua.full_name AS cliente,
    ua.email,
    ua.dni,
    CONCAT(ua.address, ', ', ua.district, ', ', ua.city, ' - ', ua.postal_code) AS direccion,
    ua.reference
  FROM orders o
  LEFT JOIN user_addresses ua ON o.delivery_address_id = ua.id
  WHERE o.user_id = ? 
    AND o.visible = 1
  ORDER BY o.created_at DESC
";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];

while ($row = $result->fetch_assoc()) {
    $order_id = $row['id'];

    // Obtenemos los productos de cada pedido
    $sql_items = "
      SELECT p.product_name, p.image_url, oi.quantity, oi.price, oi.discount
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    ";
    $stmt_items = $conexion->prepare($sql_items);
    $stmt_items->bind_param("i", $order_id);
    $stmt_items->execute();
    $items_result = $stmt_items->get_result();

    $items = [];
    while ($item = $items_result->fetch_assoc()) {
        $item['image_url'] = '../../uploads/' . $item['image_url']; // ruta completa
        $items[] = $item;
    }

    $row['items'] = $items;      // agregamos productos al pedido
    $row['receipt'] = $row['receipt'] ? '../../' . $row['receipt'] : null; // agregamos comprobante
    $row['shipping_receipt'] = $row['shipping_receipt'] ? '../../uploads/shipping_receipts/' . $row['shipping_receipt'] : null; // agregamos comprobante de envío
    $orders[] = $row;
}

echo json_encode($orders, JSON_UNESCAPED_UNICODE);
?>
