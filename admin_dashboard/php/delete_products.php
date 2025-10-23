<?php
require_once "../../conexion.php";
header("Content-Type: application/json");

if (!isset($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'No se proporcionó ID']);
    exit;
}

$id = intval($_GET['id']);

if ($conexion->query("DELETE FROM products WHERE id = $id")) {
    echo json_encode(['success' => true, 'message' => 'Producto eliminado']);
} else {
    echo json_encode(['success' => false, 'message' => $conexion->error]);
}
?>