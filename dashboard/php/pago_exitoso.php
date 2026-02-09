<?php
require '../../conexion.php';

$order_id = $_GET['external_reference'] ?? null;
$status   = $_GET['status'] ?? null;

// Validar
if (!$order_id || $status !== 'approved') {
    header("Location: http://localhost/SWEETHARMONY/sweetharmony/dashboard/html/Dashboard_Cart.html?payment=error");
    exit;
}

// Obtener user_id de la orden
$stmt = $conexion->prepare("SELECT user_id FROM orders WHERE id = ?");
$stmt->bind_param("i", $order_id);
$stmt->execute();
$order = $stmt->get_result()->fetch_assoc();

if (!$order) {
    header("Location: http://localhost/SWEETHARMONY/sweetharmony/dashboard/html/Dashboard_Cart.html?payment=error");
    exit;
}

// Marcar orden como pagada
$stmt = $conexion->prepare("UPDATE orders SET status = 'paid' WHERE id = ?");
$stmt->bind_param("i", $order_id);
$stmt->execute();

// Vaciar carrito
$stmt = $conexion->prepare("DELETE FROM cart WHERE user_id = ?");
$stmt->bind_param("i", $order['user_id']);
$stmt->execute();

// ================================
// 📧 Enviar correo de confirmación
// ================================
require '../../admin_dashboard/PHPMailer-master/PHPMailer-master/src/Exception.php';
require '../../admin_dashboard/PHPMailer-master/PHPMailer-master/src/PHPMailer.php';
require '../../admin_dashboard/PHPMailer-master/PHPMailer-master/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Obtener datos del usuario
$stmt_user = $conexion->prepare("SELECT first_name, last_name, email FROM users WHERE id = ?");
$stmt_user->bind_param("i", $order['user_id']);
$stmt_user->execute();
$user = $stmt_user->get_result()->fetch_assoc();

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.office365.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = '1524431@senati.pe';
    $mail->Password   = 'tiramisu1@';
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    $mail->setFrom('1524431@senati.pe', 'Sweet Harmony 🌸');

    $user_email = $user['email'];
    $user_name  = trim($user['first_name'] . ' ' . $user['last_name']);

    $mail->addAddress($user_email, $user_name);

    $mail->isHTML(true);
    $mail->Subject = "Pago confirmado - Pedido #{$order_id}";
    $mail->Body = "
    <table style='max-width:600px;margin:auto;font-family:Arial;border-collapse:collapse;'>
        <tr>
            <td style='background:#94C973;padding:20px;color:white;text-align:center;font-size:24px;border-radius:8px 8px 0 0'>
                Sweet Harmony 🌸
            </td>
        </tr>
        <tr>
            <td style='padding:20px;background:#fff;color:#333'>
                <h2 style='color:#148A38;'>¡Pago confirmado!</h2>
                <p>Hola <strong>{$user_name}</strong>,</p>
                <p>Hemos recibido correctamente el pago de tu pedido <strong>#{$order_id}</strong>.</p>
                <p>🧁 Tu pedido ya se encuentra en preparación.</p>
                <p>🚚 En breve recibirás otro correo con el <strong>link de pago del envío</strong>, una vez que hayamos calculado el costo.</p>
                <hr style='border:none;border-top:1px solid #eee;margin:20px 0'>
                <p style='font-size:14px;color:#777'>
                    Si tienes alguna duda, escríbenos a 
                    <a href='mailto:1524431@senati.pe' style='color:#148A38'>1524431@senati.pe</a>
                </p>
            </td>
        </tr>
        <tr>
            <td style='background:#f0f0f0;text-align:center;padding:10px;font-size:12px;color:#777;border-radius:0 0 8px 8px'>
                © 2025 Sweet Harmony
            </td>
        </tr>
    </table>
    ";

    $mail->send();
    error_log("✅ Correo de pago enviado pedido #$order_id");

} catch (Exception $e) {
    error_log("❌ Error enviando correo pedido #$order_id: " . $mail->ErrorInfo);
}

// 🔁 Redirigir al dashboard con toast
header("Location: http://localhost/SWEETHARMONY/sweetharmony/dashboard/html/Dashboard_Cart.html?payment=success");
exit;
?>
