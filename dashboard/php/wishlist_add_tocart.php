<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit;
}

require_once '../../conexion.php';

$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['product_id'])) {
    echo json_encode(['success' => false, 'message' => 'Falta el ID del producto']);
    exit;
}

$user_id = $_SESSION['user_id'];
$product_id = intval($data['product_id']);

try {
    // Revisar si ya existe en el carrito
    $stmt = $conexion->prepare("SELECT quantity FROM cara WHERE user_id = ? AND product_id = ?");
    $stmt->bind_param("ii", $user_id, $product_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Si ya existe, sumamos 1 a la cantidad
        $row = $result->fetch_assoc();
        $new_qty = $row['quantity'] + 1;

        $stmt_update = $conexion->prepare("UPDATE cara SET quantity = ? WHERE user_id = ? AND product_id = ?");
        $stmt_update->bind_param("iii", $new_qty, $user_id, $product_id);
        $stmt_update->execute();
        $stmt_update->close();
    } else {
        // Si no existe, lo insertamos
        $stmt_insert = $conexion->prepare("INSERT INTO cara (user_id, product_id, quantity, created_at) VALUES (?, ?, 1, NOW())");
        $stmt_insert->bind_param("ii", $user_id, $product_id);
        $stmt_insert->execute();
        $stmt_insert->close();
    }

    $stmt->close();
    echo json_encode(['success' => true, 'message' => 'Producto agregado al carrito']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
