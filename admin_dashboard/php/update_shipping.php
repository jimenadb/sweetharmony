<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "../../conexion.php";

$order_id = $_POST['order_id'] ?? ''; // ID del pedido existente
$courier = $_POST['courier'] ?? '';
$tracking_number = $_POST['tracking_number'] ?? '';
$shipping_notes = $_POST['shipping_notes'] ?? '';
$shipping_receipt = null;

try {
  if (empty($order_id)) {
    throw new Exception("Falta el ID del pedido para actualizar.");
  }

  // 🔹 Procesar archivo si existe
  if (isset($_FILES['shipping_receipt']) && $_FILES['shipping_receipt']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = "../../uploads/shipping_receipts/";
    if (!file_exists($uploadDir)) {
      mkdir($uploadDir, 0777, true);
    }

    $fileTmpPath = $_FILES['shipping_receipt']['tmp_name'];
    $fileName = basename($_FILES['shipping_receipt']['name']);
    $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
    $newFileName = uniqid("receipt_", true) . "." . $fileExtension;
    $destPath = $uploadDir . $newFileName;

    if (move_uploaded_file($fileTmpPath, $destPath)) {
      $shipping_receipt = $newFileName;
    } else {
      throw new Exception("No se pudo mover el archivo subido.");
    }
  }

  // 🔹 Actualizar el pedido existente
  $query = "UPDATE orders SET courier = ?, tracking_number = ?, shipping_notes = ?";
  $params = [$courier, $tracking_number, $shipping_notes];
  $types = "sss";

  if ($shipping_receipt) {
    $query .= ", shipping_receipt = ?";
    $params[] = $shipping_receipt;
    $types .= "s";
  }

  $query .= " WHERE id = ?";
  $params[] = $order_id;
  $types .= "i";

  $stmt = $conexion->prepare($query);
  $stmt->bind_param($types, ...$params);

  if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Datos de envío actualizados correctamente"]);
  } else {
    echo json_encode(["success" => false, "message" => "Error al actualizar: " . $conexion->error]);
  }

} catch (Exception $e) {
  echo json_encode(["success" => false, "message" => "Excepción: " . $e->getMessage()]);
}
?>
