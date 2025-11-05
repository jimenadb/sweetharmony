<?php
session_start();
header('Content-Type: application/json');

// Verificar que el usuario esté logueado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit;
}

require_once '../../conexion.php'; // tu archivo de conexión

// Obtener datos del POST
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['product_id'])) {
    echo json_encode(['success' => false, 'message' => 'Falta el ID del producto']);
    exit;
}

$user_id = $_SESSION['user_id'];
$product_id = intval($data['product_id']);

try {
    $stmt = $conexion->prepare("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?");
    $stmt->bind_param("ii", $user_id, $product_id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Producto eliminado de la lista de deseos']);
    } else {
        echo json_encode(['success' => false, 'message' => 'El producto no estaba en la lista de deseos']);
    }


} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
