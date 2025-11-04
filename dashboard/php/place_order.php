<?php
ini_set('display_errors', 0);  // No mostrar errores en navegador
error_reporting(E_ALL);        // Registrar todos los errores
ob_start();                     // Buffer para evitar salida accidental

header("Content-Type: application/json; charset=UTF-8");
require_once "../../conexion.php";
session_start();

// Log inicial
error_log("DEBUG place_order.php: Inicio del script");

// Obtener usuario
$user_id = $_SESSION['user_id'] ?? null;
error_log("DEBUG: user_id desde session = ".var_export($user_id, true));
if (!$user_id) {
    http_response_code(401);
    echo json_encode(["message"=>"No has iniciado sesión"]);
    ob_end_flush();
    exit;
}

// Obtener datos JSON del POST
$raw_input = file_get_contents('php://input');
error_log("DEBUG: raw POST input = ". $raw_input);
$data = json_decode($raw_input, true);

$delivery_address_id = $data['delivery_address_id'] ?? null;
error_log("DEBUG: delivery_address_id recibido = ".var_export($delivery_address_id, true));

if (!$delivery_address_id) {
    http_response_code(400);
    echo json_encode(["message"=>"Selecciona una dirección"]);
    ob_end_flush();
    exit;
}

// Verificar que la dirección pertenece al usuario
$stmt_check = $conexion->prepare("SELECT id FROM user_addresses WHERE id=? AND user_id=?");
if (!$stmt_check) {
    error_log("ERROR prepare stmt_check: " . $conexion->error);
    http_response_code(500);
    echo json_encode(["message"=>"Error al preparar verificación de dirección"]);
    ob_end_flush();
    exit;
}
$stmt_check->bind_param("ii", $delivery_address_id, $user_id);
$stmt_check->execute();
$result_check = $stmt_check->get_result();
if ($result_check->num_rows === 0) {
    error_log("ERROR: Dirección no pertenece al usuario");
    http_response_code(400);
    echo json_encode(["message"=>"Dirección no válida"]);
    ob_end_flush();
    exit;
}
error_log("DEBUG: Dirección válida encontrada");

// Obtener productos del carrito
$sql_cart = "SELECT c.product_id, c.quantity, p.price 
             FROM cart c 
             INNER JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ?";
$stmt_cart = $conexion->prepare($sql_cart);
if (!$stmt_cart) {
    error_log("ERROR prepare stmt_cart: " . $conexion->error);
    http_response_code(500);
    echo json_encode(["message"=>"Error al preparar consulta del carrito"]);
    ob_end_flush();
    exit;
}
$stmt_cart->bind_param("i", $user_id);
$stmt_cart->execute();
$result = $stmt_cart->get_result();
if (!$result || $result->num_rows === 0) {
    error_log("ERROR: Carrito vacío");
    http_response_code(400);
    echo json_encode(["message"=>"Carrito vacío"]);
    ob_end_flush();
    exit;
}

$cart_items = [];
$total = 0;
while ($row = $result->fetch_assoc()) {
    $cart_items[] = $row;
    $total += $row['price'] * $row['quantity'];
}
error_log("DEBUG: Total carrito = $total, Items = ".json_encode($cart_items));

// Insertar pedido en orders
$stmt_order = $conexion->prepare("INSERT INTO orders (user_id, total, status, delivery_address_id, created_at) VALUES (?, ?, 'pending', ?, NOW())");
if (!$stmt_order) {
    error_log("ERROR prepare stmt_order: " . $conexion->error);
    http_response_code(500);
    echo json_encode(["message"=>"Error al preparar la orden"]);
    ob_end_flush();
    exit;
}
$stmt_order->bind_param("idi", $user_id, $total, $delivery_address_id);
if (!$stmt_order->execute()) {
    error_log("ERROR execute stmt_order: " . $stmt_order->error);
    http_response_code(500);
    echo json_encode(["message"=>"Error al insertar la orden"]);
    ob_end_flush();
    exit;
}
$order_id = $stmt_order->insert_id;
error_log("DEBUG: Orden insertada con order_id = $order_id");

// Insertar productos en order_items
$stmt_item = $conexion->prepare("INSERT INTO order_items (order_id, product_id, quantity, price, created_at) VALUES (?, ?, ?, ?, NOW())");
if (!$stmt_item) {
    error_log("ERROR prepare stmt_item: " . $conexion->error);
    http_response_code(500);
    echo json_encode(["message"=>"Error al preparar los items"]);
    ob_end_flush();
    exit;
}

foreach ($cart_items as $item) {
    $stmt_item->bind_param("iiii", $order_id, $item['product_id'], $item['quantity'], $item['price']);
    if (!$stmt_item->execute()) {
        error_log("ERROR execute stmt_item: " . $stmt_item->error);
        http_response_code(500);
        echo json_encode(["message"=>"Error al insertar item"]);
        ob_end_flush();
        exit;
    }
}
error_log("DEBUG: Items insertados correctamente");

// Vaciar carrito
$delete_cart = $conexion->query("DELETE FROM cart WHERE user_id = $user_id");
if (!$delete_cart) {
    error_log("ERROR al vaciar carrito: " . $conexion->error);
} else {
    error_log("DEBUG: Carrito vaciado");
}

// Responder éxito
echo json_encode(["success"=>true,"order_id"=>$order_id]);
ob_end_flush();  // Limpiar buffer
error_log("DEBUG place_order.php: Fin del script exitoso");
