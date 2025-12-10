<?php
require_once "../../conexion.php";

// Obtener ID y nuevo estado desde GET
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$active = isset($_GET['active']) ? intval($_GET['active']) : 0; // default 0 = desactivar

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID no proporcionado']);
    exit;
}

// Actualizar solo la columna 'active' en lugar de eliminar
$stmt = $conexion->prepare("UPDATE products SET active = ? WHERE id = ?");
$stmt->bind_param("ii", $active, $id);

if ($stmt->execute()) {
    $mensaje = $active == 1 ? 'Producto activado correctamente' : 'Producto desactivado correctamente';
    echo json_encode(['success' => true, 'message' => $mensaje]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar el producto']);
}
