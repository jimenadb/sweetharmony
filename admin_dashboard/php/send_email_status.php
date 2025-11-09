<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "../../conexion.php";
require '../PHPMailer-master/PHPMailer-master/src/Exception.php';
require '../PHPMailer-master/PHPMailer-master/src/PHPMailer.php';
require '../PHPMailer-master/PHPMailer-master/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Recibir order_id vía POST o GET
$order_id = intval($_POST['order_id'] ?? $_GET['order_id'] ?? 0);
if (!$order_id) {
    echo json_encode(["error" => "Falta order_id"]);
    exit;
}

// --- PHPMailer ---
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

    // Correo de prueba: usuario + admin
    $mail->addAddress('velardeximena28@gmail.com', 'Usuario Prueba'); // Usuario
    $mail->addAddress('velardeximena28@gmail.com', 'Admin Prueba');   // Admin

    $mail->isHTML(true);
    $mail->Subject = "Confirmación de tu pedido #{$order_id}";
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
            <h2>Hola 👋</h2>
            <p>Tu pedido <strong>#{$order_id}</strong> se ha recibido correctamente.</p>
            <p>Gracias por comprar con nosotros 🌸.</p>
            <div class='footer'>
            Sweet Harmony - Tu tienda de plantas y decoración
            </div>
        </div>
    </body>
    </html>
    ";

    $mail->send();
    echo json_encode(["success" => true, "message" => "Correo enviado correctamente."]);

} catch (Exception $e) {
    echo json_encode(["error" => "No se pudo enviar el correo: {$mail->ErrorInfo}"]);
}
