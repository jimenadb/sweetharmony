<?php
require_once "../../conexion.php";

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID de producto no recibido"]);
    exit;
}

$product_id = intval($_GET['id']);

// 🔹 Actualiza las vistas y la fecha de la última vista
$query = "UPDATE products 
          SET views = views + 1, 
              last_viewed_at = NOW() 
          WHERE id = ?";
$stmt = $conexion->prepare($query);
$stmt->bind_param("i", $product_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Vista registrada correctamente"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Error al actualizar las vistas"]);
}

$stmt->close();
$conexion->close();
