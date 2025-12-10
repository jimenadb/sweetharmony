<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "../../conexion.php";

// Traemos todos los pedidos sin filtrar por usuario
$sql = "
  SELECT 
    o.id,
    o.total,
    o.status,
    o.created_at,
    o.receipt,
    o.courier,
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
  ORDER BY o.created_at DESC
";

$result = $conexion->query($sql);

$orders = [];

while ($row = $result->fetch_assoc()) {
    $order_id = $row['id'];

    // Obtener productos del pedido
    $sql_items = "
      SELECT p.product_name, p.image_url, oi.quantity, oi.price, oi.discount
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    ";

    $stmt_items = $conexion->prepare($sql_items);
    $stmt_items->bind_param("i", $order_id);
    $stmt_items->execute();
    $result_items = $stmt_items->get_result();

    $items = [];
    while ($item = $result_items->fetch_assoc()) {
        $item['image_url'] = '../../uploads/' . $item['image_url'];
        $items[] = $item;
    }

    // Ajustes de archivos
    $row['items'] = $items;
    $row['receipt'] = $row['receipt'] ? '../../uploads/receipts/' . $row['receipt'] : null;
    $row['shipping_receipt'] = $row['shipping_receipt']
        ? '../../uploads/shipping_receipts/' . $row['shipping_receipt']
        : null;

    $orders[] = $row;
}

echo json_encode($orders, JSON_UNESCAPED_UNICODE);
?>
