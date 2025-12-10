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

// Obtener email del usuario y nombre
$sql = "SELECT o.id, u.email, u.first_name, o.tracking_number, o.courier, o.delivery_type
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

// Actualizar el estado del pedido
$update = "UPDATE orders SET status = ? WHERE id = ?";
$stmt2 = $conexion->prepare($update);
$stmt2->bind_param("si", $new_status, $order_id);
$stmt2->execute();

// Enviar correo simple
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
    $mail->addAddress($order['email'], $order['first_name']);

    $mail->isHTML(true);
    $mail->Subject = "Actualización de tu pedido #{$order_id}";
    
    // Mensaje básico según el estado
    $statusMessages = [
        'pending' => "Tu pedido #{$order_id} está pendiente. Aún no hemos confirmado el pago, por favor espera nuestra confirmacion.",
        'paid' => "Genial, El pago de tu pedido ha sido confirmado. Pronto comenzaremos a procesarlo para su entrega.",
        'processing' => "Tu pedido #{$order_id} está en proceso. Nuestro equipo está preparando todo para que llegue a tus manos en un plazo máximo de 3 días.",
        'shipped' => "¡Tu pedido #{$order_id} ha sido enviado! ✨\nCourier: {$order['courier']}\nNúmero de seguimiento: {$order['tracking_number']}\nPuedes usar este número para rastrear tu paquete.",
        'delivered' => "¡Tu pedido #{$order_id} ha sido entregado! 🎉\nEsperamos que disfrutes tu compra. Gracias por confiar en Sweet Harmony 🌸.",
        'completed' => "¡Tu pedido #{$order_id} se ha completado con éxito! 🌸\n" .
               ($order['delivery_type'] === 'retiro'
                   ? "Tu pedido ya está listo para RETIRO EN TIENDA. Podrás retirarlo cuando quieras."
                   : "Tu pedido será enviado a la dirección indicada. Muchas gracias por tu preferencia."),
        'cancelled' => "Tu pedido #{$order_id} ha sido cancelado. Si crees que esto es un error, por favor contáctanos para ayudarte."
    ];

    

    $messageBody = $statusMessages[$new_status] ?? "Tu pedido #{$order_id} tiene un nuevo estado: {$new_status}.";

    $mail->Body = "<table style='width:100%; max-width:600px; margin:auto; border-collapse:collapse; font-family:Arial,sans-serif;'>
    <tr>
        <td style='background-color:#94C973; padding:20px; text-align:center; color:white; font-size:22px; font-weight:bold; border-radius:8px 8px 0 0;'>
            Sweet Harmony 🌸
        </td>
    </tr>
    <tr>
        <td style='padding:20px; background-color:#ffffff; color:#333;'>
            <p style='font-size:16px; line-height:1.5; margin-bottom:15px;'>{$messageBody}</p>
            <p style='font-size:14px; color:#555;'>Gracias por comprar en Sweet Harmony 🌸</p>
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
    echo json_encode(["success" => true, "message" => "Estado actualizado y correo enviado."]);

} catch (Exception $e) {
    echo json_encode(["error" => "Estado actualizado pero no se pudo enviar el correo: {$mail->ErrorInfo}"]);
}


?>
