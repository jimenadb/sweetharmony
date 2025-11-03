<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../../conexion.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $order_id = $_POST["order_id"] ?? null;
    $status = $_POST["status"] ?? null;

    if (!$order_id || !$status) {
        echo "Error: Faltan datos.";
        exit;
    }

    $stmt = $conexion->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $order_id);

    if ($stmt->execute()) {
        echo "Estado del pedido actualizado correctamente.";
    } else {
        echo "Error al actualizar el estado: " . $conexion->error;
    }

} else {
    echo "Método no permitido.";
}
?>
