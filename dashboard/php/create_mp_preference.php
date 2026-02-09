<?php
session_start();
header('Content-Type: application/json');


require_once "../../conexion.php";

// --------------------
// Validar sesión
// --------------------
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// --------------------
// Obtener carrito
// --------------------
$sql = "
SELECT 
  p.id AS product_id,
  p.product_name,
  p.price,
  p.discount,
  c.quantity
FROM cart c
JOIN products p ON p.id = c.product_id
WHERE c.user_id = ?
";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$items_mp = [];      // para Mercado Pago
$cart_items = [];    // para DB
$total = 0;

while ($row = $result->fetch_assoc()) {
    $price = (float)$row['price'];
    $discount = (float)($row['discount'] ?? 0);
    $quantity = (int)$row['quantity'];

    $final_price = $price - ($price * $discount / 100);

    // Para Mercado Pago
    $items_mp[] = [
        "title" => $row['product_name'],
        "quantity" => $quantity,
        "currency_id" => "PEN",
        "unit_price" => round($final_price, 2)
    ];

    // Para BD
    $cart_items[] = $row;

    $total += $final_price * $quantity;
}

if (empty($cart_items)) {
    echo json_encode(["error" => "Carrito vacío"]);
    exit;
}

// --------------------
// Crear orden
// --------------------
$stmt_order = $conexion->prepare("
    INSERT INTO orders (user_id, total, status, created_at)
    VALUES (?, ?, 'pending', NOW())
");
$stmt_order->bind_param("id", $user_id, $total);
$stmt_order->execute();
$order_id = $stmt_order->insert_id;

// --------------------
// Insertar items en order_items
// --------------------
$stmt_item = $conexion->prepare("
INSERT INTO order_items 
(order_id, product_id, quantity, price, discount, total_price, price_final, created_at)
VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
");

foreach ($cart_items as $item) {
    $price = (float)$item['price'];
    $discount = (float)($item['discount'] ?? 0);
    $quantity = (int)$item['quantity'];

    $total_price = $price * $quantity;
    $price_final = $total_price * (1 - $discount / 100);

    $stmt_item->bind_param(
        "iiidddd",
        $order_id,
        $item['product_id'],
        $quantity,
        $price,
        $discount,
        $total_price,
        $price_final
    );

    $stmt_item->execute();
}

// --------------------
// 3️⃣ Crear preferencia Mercado Pago
// --------------------
$preference = [
    "items" => [[
        "title" => "Pedido Sweet Harmony",
        "quantity" => 1,
        "unit_price" => (float)$total
    ]],
    "external_reference" => (string)$order_id,
    "back_urls" => [
        "success" => "https://c462dbf46c22.ngrok-free.app/sweetharmony/sweetharmony/dashboard/php/pago_exitoso.php",
        "failure" => "https://c462dbf46c22.ngrok-free.app/sweetharmony/sweetharmony/dashboard/php/pago_error.php",
        "pending" => "https://c462dbf46c22.ngrok-free.app/sweetharmony/sweetharmony/dashboard/php/pago_pendiente.php"
    ],
    "auto_return" => "approved"
];

$ch = curl_init("https://api.mercadopago.com/checkout/preferences");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer $ACCESS_TOKEN",
        "Content-Type: application/json"
    ],
    CURLOPT_POSTFIELDS => json_encode($preference)
]);

$response = curl_exec($ch);

if ($response === false) {
    echo json_encode(["error" => "Error cURL", "detail" => curl_error($ch)]);
    exit;
}

curl_close($ch);

$data = json_decode($response, true);

if (!isset($data['id'])) {
    echo json_encode($data);
    exit;
}

// --------------------
// Guardar payment
// --------------------
$stmt_payment = $conexion->prepare("
INSERT INTO payments (order_id, user_id, amount, mp_preference_id, mp_status)
VALUES (?, ?, ?, ?, 'pending')
");
$stmt_payment->bind_param("iids", $order_id, $user_id, $total, $data['id']);
$stmt_payment->execute();

// --------------------
// Respuesta al frontend
// --------------------
echo json_encode([
    "id" => $data['id'],
    "order_id" => $order_id,
    "total" => $total
]);
