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

// Recibir datos desde FormData
$delivery_address_id = $_POST['delivery_address_id'] ?? null;
$delivery_type = $_POST['delivery_type'] ?? 'retiro';

// Validar dirección solo si es delivery
if ($delivery_type === 'delivery' && !$delivery_address_id) {
    http_response_code(400);
    echo json_encode(["success"=>false,"message"=>"Selecciona una dirección"]);
    exit;
}

// Verificar dirección solo si es delivery
if ($delivery_type === 'delivery') {
    $stmt_check = $conexion->prepare("SELECT id FROM user_addresses WHERE id=? AND user_id=?");
    $stmt_check->bind_param("ii", $delivery_address_id, $user_id);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();
    if ($result_check->num_rows === 0) {
        echo json_encode(["success"=>false,"message"=>"Dirección no válida"]);
        exit;
    }
}

// Obtener carrito
$sql_cart = "SELECT c.product_id, c.quantity, p.price, p.discount
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

// Preparar delivery_address_id para el insert
$delivery_address_param = $delivery_type === 'delivery' ? $delivery_address_id : null;

// Crear orden
$stmt_order = $conexion->prepare("
    INSERT INTO orders (user_id, total, status, delivery_type, delivery_address_id, created_at) 
    VALUES (?, ?, 'pending', ?, ?, NOW())
");
$stmt_order->bind_param("idss", $user_id, $total, $delivery_type, $delivery_address_param);
$stmt_order->execute();
$order_id = $stmt_order->insert_id;

// Insertar items
$stmt_item = $conexion->prepare("
  INSERT INTO order_items 
(order_id, product_id, quantity, price, discount, total_price, price_final, created_at) 
VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
");

foreach ($cart_items as $item) {
    $price = isset($item['price']) ? doubleval($item['price']) : 0.00;
    $discount = isset($item['discount']) ? doubleval($item['discount']) : 0.00;
    $quantity = isset($item['quantity']) ? intval($item['quantity']) : 1;

    $total_price = $price * $quantity;                  // precio sin descuento por cantidad
    $price_final = $total_price * (1 - $discount / 100); // total con descuento

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


//  Disminuir unidades de los productos
foreach ($cart_items as $item) {
    $stmt_units = $conexion->prepare("UPDATE products SET units = units - ? WHERE id = ?");
    $stmt_units->bind_param("ii", $item['quantity'], $item['product_id']);
    $stmt_units->execute();
}

// Vaciar carrito
$conexion->query("DELETE FROM cart WHERE user_id = $user_id");

// Subir comprobante Yape si existe
if (isset($_FILES['yape-proof']) && $_FILES['yape-proof']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = "../../uploads/receipts/";
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $filename = time() . "_" . basename($_FILES['yape-proof']['name']);
    $target_path = $upload_dir . $filename;

    if (move_uploaded_file($_FILES['yape-proof']['tmp_name'], $target_path)) {
        $relative_path = "uploads/receipts/" . $filename;
        $stmt_update = $conexion->prepare("UPDATE orders SET receipt=? WHERE id=? AND user_id=?");
        $stmt_update->bind_param("sii", $relative_path, $order_id, $user_id);
        $stmt_update->execute();
        error_log("DEBUG: Comprobante subido y guardado en BD: $relative_path");
    } else {
        error_log("ERROR: Falló move_uploaded_file()");
    }
}







// --- Enviar correo de confirmación ---
require '../../admin_dashboard/PHPMailer-master/PHPMailer-master/src/Exception.php';
require '../../admin_dashboard/PHPMailer-master/PHPMailer-master/src/PHPMailer.php';
require '../../admin_dashboard/PHPMailer-master/PHPMailer-master/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.office365.com';
    $mail->SMTPAuth = true;
    $mail->Username = '1524431@senati.pe';
    $mail->Password = 'tiramisu1@';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->setFrom('1524431@senati.pe', 'Sweet Harmony');

    $stmt_email = $conexion->prepare("SELECT first_name, last_name, email FROM users WHERE id=?");
    $stmt_email->bind_param("i", $user_id);
    $stmt_email->execute();
    $result_email = $stmt_email->get_result();
    $user = $result_email->fetch_assoc();
    
    $user_email = $user['email'] ?? 'default@example.com';
    $user_name = trim(($user['first_name'] ?? '') . ' ' . ($user['last_name'] ?? '')) ?: 'Cliente';

    // Aquí tus correos de prueba
    $mail->addAddress($user_email, $user_name); // Usuario real
    // $mail->addAddress('velardeximena28@gmail.com', 'Admin Prueba');   // Admin

    $mail->isHTML(true);
    $mail->Subject = "Confirmación de tu pedido #{$order_id}";
    $mail->Body = "
    <table style='width:100%; max-width:600px; margin:auto; border-collapse:collapse; font-family:Arial,sans-serif;'>
        <tr>
            <td style='background-color:#94C973; padding:20px; text-align:center; color:white; font-size:24px; font-weight:bold; border-radius:8px 8px 0 0;'>
                Sweet Harmony 🌸
            </td>
        </tr>
        <tr>
            <td style='padding:20px; background-color:#ffffff; color:#333;'>
        <h2 style='color:#148A38;'>¡Pedido recibido!</h2>
        <p>Tu pedido <strong>N°-{$order_id}</strong> se ha recibido correctamente.</p>
        <p>Recibirás un correo con la confirmación del pago.</p>
        <p>Gracias por comprar con nosotros 💛</p>
        <hr style='border:none; border-top:1px solid #eee; margin:20px 0;'/>
        <p style='font-size:14px; color:#777;'>
            Si tienes alguna duda, contáctanos en 
            <a href='mailto:1524431@senati.pe' style='color:#148A38;'>1524431@senati.pe</a>
            o por WhatsApp: 
            <a href='https://wa.me/51987654321' target='_blank' style='color:#148A38; text-decoration:none;'>📱 Chatea con nosotros</a>
        </p>
    </td>
    </tr>
    <tr>
        <td style='background-color:#f0f0f0; text-align:center; padding:10px; font-size:12px; color:#777; border-radius:0 0 8px 8px;'>
            © 2025 Sweet Harmony. Todos los derechos reservados.
        </td>
    </tr>
</table>
";
    $mail->send();

    
    error_log("Correo enviado para pedido #$order_id");
} catch (Exception $e) {
    error_log("No se pudo enviar correo para pedido #$order_id: {$mail->ErrorInfo}");
}



echo json_encode([
    "success" => true,
    "order_id" => $order_id,
    "message" => "Pedido realizado correctamente"
]);

error_log("Pedido agregado");
?>
