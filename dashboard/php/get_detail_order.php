<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");
require_once "../../conexion.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Usuario no logueado"]);
    exit;
}

$user_id = $_SESSION['user_id'];

$sql = "SELECT o.id, o.total, o.status 
        FROM orders o 
        WHERE o.user_id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];
while($row = $result->fetch_assoc()) {
    // Aquí puedes incluir los productos de cada pedido si quieres
    $orders[] = $row;
}

echo json_encode($orders, JSON_UNESCAPED_UNICODE);