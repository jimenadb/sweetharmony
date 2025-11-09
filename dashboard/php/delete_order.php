<?php
session_start();
header("Content-Type: application/json");
require_once "../../conexion.php";

if (!isset($_SESSION['user_id'])) {
  echo json_encode(["success" => false, "error" => "Usuario no logueado"]);
  exit;
}

if (!isset($_GET['id'])) {
  echo json_encode(["success" => false, "error" => "Falta el ID del pedido"]);
  exit;
}

$order_id = intval($_GET['id']);
$user_id = $_SESSION['user_id'];

// 🔹 Marcar como no visible en vez de eliminar
$sql = "UPDATE orders SET visible = 0 WHERE id = ? AND user_id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ii", $order_id, $user_id);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "error" => $stmt->error]);
}
?>
