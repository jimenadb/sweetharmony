<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "../../conexion.php";
session_start();

$user_id = $_SESSION['user_id'] ?? null;
if (!$user_id) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "No has iniciado sesión"]);
    exit;
}

$sql = "SELECT id, full_name, address, district, city, postal_code, is_default
        FROM user_addresses
        WHERE user_id = $user_id
        ORDER BY is_default DESC, id ASC";

$result = $conexion->query($sql);
$addresses = [];
while($row = $result->fetch_assoc()) {
    $addresses[] = $row;
}

echo json_encode(["success" => true, "addresses" => $addresses]);
?>