<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../admin_dashboard/PHPMailer-master/PHPMailer-master/src/Exception.php';
require '../../admin_dashboard/PHPMailer-master/PHPMailer-master/src/PHPMailer.php';
require '../../admin_dashboard/PHPMailer-master/PHPMailer-master/src/SMTP.php';

// Asegúrate de tener $user_name, $order_id, $cart_items, $total definidos antes

// Si no existe, poner un correo por defecto
$default_admin_email = 'jimenavelardedb@gmail.com';
$user_name = $user_name ?? 'Cliente';

try {
    // Obtener todos los admins
    $admins_query = $conexion->query("SELECT email, first_name, last_name FROM users WHERE role='admin'");
    $admins = [];
    while ($admin = $admins_query->fetch_assoc()) {
        if (!empty($admin['email'])) {
            $admins[] = [
                'email' => $admin['email'],
                'name' => trim(($admin['first_name'] ?? '') . ' ' . ($admin['last_name'] ?? '')) ?: 'Admin'
            ];
        }
    }

    // Si no hay admins, usar correo por defecto
    if (empty($admins)) {
        $admins[] = ['email' => $default_admin_email, 'name' => 'Admin Default'];
    }

    // Preparar lista de productos en HTML
    $itemsHtml = "<ul>";
    foreach ($cart_items as $item) {
        $itemsHtml .= "<li>{$item['quantity']} × Producto ID {$item['product_id']} @ $" . number_format($item['price'],2) . "</li>";
    }
    $itemsHtml .= "</ul>";

    // Enviar correo a cada admin
    foreach ($admins as $admin) {
        $mail = new PHPMailer(true);
        $mail->CharSet = 'UTF-8';
        $mail->isSMTP();
        $mail->SMTPDebug = 0; // 2 para debug
        $mail->Debugoutput = 'error_log';
        $mail->Host = 'smtp.office365.com';
        $mail->SMTPAuth = true;
        $mail->Username = '1524431@senati.pe';
        $mail->Password = 'tiramisu1@';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;
        $mail->setFrom('1524431@senati.pe', 'Sweet Harmony');
        $mail->addAddress($admin['email'], $admin['name']);
        $mail->isHTML(true);
        $mail->Subject = "Nuevo pedido registrado #{$order_id}";
        $mail->Body = "
<table style='width:100%; max-width:600px; margin:auto; border-collapse:collapse; font-family:Arial,sans-serif;'>
<tr>
    <td style='background-color:#148A38; padding:20px; text-align:center; color:white; font-size:22px; font-weight:bold; border-radius:8px 8px 0 0;'>
        💬 Soporte Sweet Harmony
    </td>
</tr>
<tr>
    <td style='padding:25px; background-color:#ffffff; color:#333;'>
        <h2 style='color:#148A38; margin-top:0;'>Nuevo pedido registrado 🛍️</h2>
        <p>El usuario <strong>{$user_name}</strong> ha realizado un nuevo pedido con el ID <strong>#{$order_id}</strong>.</p>
        <p>Productos del pedido:</p>
        {$itemsHtml}
        <p><strong>Total:</strong> $" . number_format($total, 2) . "</p>
        <p>Revisa el panel de administración para confirmar el pago o actualizar el estado.</p>
    </td>
</tr>
<tr>
    <td style='background-color:#f0f0f0; text-align:center; padding:10px; font-size:12px; color:#777; border-radius:0 0 8px 8px;'>
        © 2025 Sweet Harmony. Todos los derechos reservados.
    </td>
</tr>
</table>
";
        try {
            $mail->send();
            error_log("Correo enviado a admin: {$admin['email']}");
        } catch (Exception $e) {
            error_log("Error enviando correo a {$admin['email']}: {$mail->ErrorInfo}");
        }
    }

} catch (Exception $e) {
    error_log("No se pudo enviar correo a los admins: {$e->getMessage()}");
}
