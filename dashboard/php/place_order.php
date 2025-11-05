<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json; charset=UTF-8");
require_once "../../conexion.php";
session_start();

error_log("DEBUG place_order.php: Inicio del script");

$user_id = $_SESSION['user_id'] ?? null;
if (!$user_id) {
    http_response_code(401);
    echo json_encode(["success"=>false,"message"=>"No has iniciado sesión"]);
    exit;
}

// ✅ Si llega por FormData, usamos $_POST en lugar de JSON
$delivery_address_id = $_POST['delivery_address_id'] ?? null;

if (!$delivery_address_id) {
    http_response_code(400);
    echo json_encode(["success"=>false,"message"=>"Selecciona una dirección"]);
    exit;
}

// Verificar dirección del usuario
$stmt_check = $conexion->prepare("SELECT id FROM user_addresses WHERE id=? AND user_id=?");
$stmt_check->bind_param("ii", $delivery_address_id, $user_id);
$stmt_check->execute();
$result_check = $stmt_check->get_result();
if ($result_check->num_rows === 0) {
    echo json_encode(["success"=>false,"message"=>"Dirección no válida"]);
    exit;
}

// Obtener carrito
$sql_cart = "SELECT c.product_id, c.quantity, p.price 
             FROM cart c 
             INNER JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ?";
$stmt_cart = $conexion->prepare($sql_cart);
$stmt_cart->bind_param("i", $user_id);
$stmt_cart->execute();
$result = $stmt_cart->get_result();
if (!$result || $result->num_rows === 0) {
    echo json_encode(["success"=>false,"message"=>"Carrito vacío"]);
    exit;
}

$cart_items = [];
$total = 0;
while ($row = $result->fetch_assoc()) {
    $cart_items[] = $row;
    $total += $row['price'] * $row['quantity'];
}

// Crear orden
$stmt_order = $conexion->prepare("INSERT INTO orders (user_id, total, status, delivery_address_id, created_at) VALUES (?, ?, 'pending', ?, NOW())");
$stmt_order->bind_param("idi", $user_id, $total, $delivery_address_id);
$stmt_order->execute();
$order_id = $stmt_order->insert_id;

// Insertar items
$stmt_item = $conexion->prepare("INSERT INTO order_items (order_id, product_id, quantity, price, created_at) VALUES (?, ?, ?, ?, NOW())");
foreach ($cart_items as $item) {
    $stmt_item->bind_param("iiii", $order_id, $item['product_id'], $item['quantity'], $item['price']);
    $stmt_item->execute();
}

// Vaciar carrito
$conexion->query("DELETE FROM cart WHERE user_id = $user_id");

// ✅ Subir comprobante Yape si existe
if (isset($_FILES['yape_proof']) && $_FILES['yape_proof']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = "../../uploads/receipts/";
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $filename = time() . "_" . basename($_FILES['yape_proof']['name']);
    $target_path = $upload_dir . $filename;

    if (move_uploaded_file($_FILES['yape_proof']['tmp_name'], $target_path)) {
        $relative_path = "uploads/receipts/" . $filename;
        $stmt_update = $conexion->prepare("UPDATE orders SET comprobante=? WHERE id=? AND user_id=?");
        $stmt_update->bind_param("sii", $relative_path, $order_id, $user_id);
        $stmt_update->execute();
        error_log("DEBUG: Comprobante subido y guardado en BD: $relative_path");
    } else {
        error_log("ERROR: Falló move_uploaded_file()");
    }
}

echo json_encode([
    "success" => true,
    "order_id" => $order_id,
    "message" => "Pedido realizado correctamente"
]);

error_log("DEBUG place_order.php: Fin exitoso");
?>
