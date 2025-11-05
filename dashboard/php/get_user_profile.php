<?php
session_start();
require_once "../../conexion.php";

$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    http_response_code(401);
    echo json_encode(['message' => 'No has iniciado sesión']);
    exit;
}

// Obtener datos del usuario
$sql = "SELECT first_name, last_name, email FROM users WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

header("Content-Type: application/json");
echo json_encode($user);
exit;
