<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "../../conexion.php"; // sube un nivel desde php/ al root del dashboard
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

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8'; // importante
try {
    $mail->isSMTP();
    $mail->Host = 'smtp.office365.com';
    $mail->SMTPAuth = true;
    $mail->Username = '1524431@senati.pe';
    $mail->Password = 'tiramisu1@';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->setFrom('1524431@senati.pe', 'Sweet Harmony');
    $mail->addAddress('velardeximena28@gmail.com', 'Ximena'); // tu prueba

    $mail->isHTML(true);
    $mail->Subject = "Actualización de tu pedido #{$order_id}";

    $estadoMap = [
        'pending' => 'Pendiente',
        'paid' => 'Pagado',
        'processing' => 'En proceso',
        'shipped' => 'Enviado',
        'delivered' => 'Entregado',
        'completed' => 'Completado',
        'cancelled' => 'Cancelado'
    ];
    $estadoMostrar = $estadoMap[$new_status] ?? $new_status;

    $mail->Body = "
    <html>
    <head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9; }
        h2 { color: #2e8b57; }
        p { font-size: 16px; line-height: 1.5; }
        .footer { font-size: 12px; color: #777; margin-top: 20px; }
    </style>
    </head>
    <body>
    <div class='container'>
        <h2>Hola {$order['first_name']} 👋</h2>
        <p>Tu pedido <strong>#{$order_id}</strong> ahora tiene el estado: <strong>{$estadoMostrar}</strong>.</p>
        <p>Gracias por comprar con nosotros, esperamos que disfrutes tus productos 🌸.</p>
        <div class='footer'>
        Sweet Harmony - Tu tienda de plantas y decoración
        </div>
    </div>
    </body>
    </html>
    ";

    $mail->send();
    echo json_encode(["success" => true, "message" => "Estado actualizado y correo enviado."]);
} catch (Exception $e) {
    echo json_encode(["error" => "Estado actualizado pero no se pudo enviar el correo: {$mail->ErrorInfo}"]);
}
