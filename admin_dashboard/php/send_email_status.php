<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "../../conexion.php";
require '../PHPMailer-master/PHPMailer-master/src/Exception.php';
require '../PHPMailer-master/PHPMailer-master/src/PHPMailer.php';
require '../PHPMailer-master/PHPMailer-master/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Recibir datos vía POST
$data = json_decode(file_get_contents('php://input'), true);
$order_id = intval($data['order_id'] ?? 0);
$new_status = $data['new_status'] ?? '';

if (!$order_id || !$new_status) {
    echo json_encode(["error" => "Datos incompletos"]);
    exit;
}

// 1️⃣ Obtener email del usuario y nombre
$sql = "SELECT o.id, u.email, u.first_name 
        FROM orders o
        INNER JOIN users u ON o.user_id = u.id
        WHERE o.id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();
$order = $result->fetch_assoc();

if (!$order) {
    echo json_encode(["error" => "Pedido no encontrado"]);
    exit;
}

// 2️⃣ Actualizar el estado del pedido
$update = "UPDATE orders SET status = ? WHERE id = ?";
$stmt2 = $conexion->prepare($update);
$stmt2->bind_param("si", $new_status, $order_id);
$stmt2->execute();

// Definir variables con valor por defecto si no vienen en $data
$courier = $data['courier'] ?? 'No especificado';
$tracking_number = $data['tracking_number'] ?? 'No disponible';

// 3️⃣ Definir mensajes según el estado
$estadoMensajes = [
    'paid' => [
        'title' => '¡Pago recibido! 💚',
        'message' => "Tu pedido <strong>#{$order_id}</strong> ha sido confirmado exitosamente. Pronto estará listo para envío."
    ],
    'processing' => [
        'title' => 'Pedido en proceso 🔄',
        'message' => "Tu pedido <strong>#{$order_id}</strong> está siendo preparado. Se espera que se envíe pronto."
    ],
    'shipped' => [
        'title' => 'Pedido enviado 🚚',
        'message' => "¡Tu pedido <strong>#{$order_id}</strong> ha salido de nuestro almacén!
        <br><strong>Courier:</strong> $courier
        <br><strong>Número de seguimiento:</strong> $tracking_number"
    ],
    'delivered' => [
        'title' => 'Pedido entregado ✅',
        'message' => "Tu pedido <strong>#{$order_id}</strong> ha sido entregado. Esperamos que disfrutes tu compra 🌸."
    ],
    'cancelled' => [
        'title' => 'Pedido cancelado ❌',
        'message' => "Lamentamos informarte que tu pedido <strong>#{$order_id}</strong> ha sido cancelado."
    ]
];



$estadoInfo = $estadoMensajes[$new_status] ?? [
    'title' => 'Actualización de pedido',
    'message' => "Tu pedido <strong>#{$order_id}</strong> ahora tiene el estado: {$new_status}."
];

// 4️⃣ Enviar correo
try {
    $mail = new PHPMailer(true);
    $mail->CharSet = 'UTF-8';
    $mail->isSMTP();
    $mail->Host = 'smtp.office365.com';
    $mail->SMTPAuth = true;
    $mail->Username = '1524431@senati.pe';
    $mail->Password = 'tiramisu1@';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->setFrom('1524431@senati.pe', 'Sweet Harmony');
    $mail->addAddress($order['email'], $order['first_name']); // correo real del cliente

    $mail->isHTML(true);
    $mail->Subject = "Actualización de tu pedido #{$order_id}";

    $mail->Body = "
    <table style='width:100%; max-width:600px; margin:auto; border-collapse:collapse; font-family:Arial,sans-serif;'>
        <tr>
            <td style='background-color:#94C973; padding:20px; text-align:center; color:white; font-size:24px; font-weight:bold; border-radius:8px 8px 0 0;'>
                Sweet Harmony 🌸
            </td>
        </tr>
        <tr>
            <td style='padding:20px; background-color:#ffffff; color:#333;'>
                <h2 style='color:#148A38;'>{$estadoInfo['title']}</h2>
                <p>{$estadoInfo['message']}</p>
                <hr style='border:none; border-top:1px solid #eee; margin:20px 0;'/>
            </td>
        </tr>
        <tr>
        <td style='background-color:#f0f0f0; text-align:center; padding:15px; font-size:14px; color:#777; border-radius:0 0 8px 8px;'>
            Si tienes dudas, contáctanos en: <br>
            <a href='mailto:1524431@senati.pe' style='color:#148A38;'>1524431@senati.pe</a> 
            o por WhatsApp: 
            <a href='https://wa.me/51987654321' target='_blank' style='color:#148A38; text-decoration:none;'>📱 Chatea con nosotros</a>
            <br><br>
        </td>
    </tr>
    </table>
    ";

    $mail->send();
    echo json_encode(["success" => true, "message" => "Estado actualizado y correo enviado."]);
} catch (Exception $e) {
    echo json_encode(["error" => "Estado actualizado pero no se pudo enviar el correo: {$mail->ErrorInfo}"]);
}
?>
