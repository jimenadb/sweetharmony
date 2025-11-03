<?php
require_once "../../conexion.php";

$sql = "SELECT * FROM orders ORDER BY created_at DESC";
$result = $conexion->query($sql);
$orders = [];

while ($row = $result->fetch_assoc()) {
  $orders[] = $row;
}

echo json_encode($orders);
?>
