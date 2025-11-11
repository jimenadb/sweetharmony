<?php
require_once "../../conexion.php";

$sql = "
  SELECT 
    o.id,
    o.total,
    o.status,
    o.created_at,
    ua.full_name AS cliente,
    CONCAT(ua.address, ', ', ua.district, ', ', ua.city) AS direccion,
    o.courier,
    o.tracking_number,
    o.shipping_notes,
    o.shipping_receipt
  FROM orders o
  LEFT JOIN user_addresses ua ON o.delivery_address_id = ua.id
  ORDER BY o.created_at DESC
";

$result = $conexion->query($sql);

$orders = [];
while ($row = $result->fetch_assoc()) {
  $orders[] = $row;
}

echo json_encode($orders);
?>

