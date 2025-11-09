<?php
session_start();
require_once "../../conexion.php";

$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    http_response_code(401);
    echo json_encode(['message' => 'No has iniciado sesión']);
    exit;
}

// Obtener datos del usuario solo si es admin
$sql = "SELECT first_name, last_name, email, role 
        FROM users 
        WHERE id = ? AND role = 'admin'";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

header("Content-Type: application/json");

if ($user) {
    echo json_encode($user);
} else {
    http_response_code(403); // Prohibido
    echo json_encode(['message' => 'No tienes permisos de administrador']);
}

exit;
