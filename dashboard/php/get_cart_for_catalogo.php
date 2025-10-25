<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "../../conexion.php";

session_start();
$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    http_response_code(401);
    echo json_encode([]);
    exit;
}

$sql = "SELECT product_id FROM cart WHERE user_id = $user_id";
$result = $conexion->query($sql);

$cart = [];
while ($row = $result->fetch_assoc()) {
    $cart[] = intval($row['product_id']);
}

echo json_encode($cart);