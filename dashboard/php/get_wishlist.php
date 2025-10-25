<?php

require_once "../../conexion.php";
session_start();

$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    http_response_code(401);
    echo json_encode(["message" => "No has iniciado sesión"]);
    exit;
}

$sql = "SELECT product_id FROM wishlist WHERE user_id = $user_id";
$result = $conexion->query($sql);

$favoritos = [];
while ($row = $result->fetch_assoc()) {
    $favoritos[] = intval($row['product_id']);
}

echo json_encode($favoritos);