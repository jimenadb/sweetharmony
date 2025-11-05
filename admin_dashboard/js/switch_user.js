<?php
session_start();
require_once "../conexion.php";

// Verificamos que el admin esté logueado
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

// Obtenemos el ID del usuario a simular
$user_id = $_POST['user_id'] ?? null;
if (!$user_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Usuario no especificado']);
    exit;
}

// Obtenemos datos del usuario
$stmt = $conn->prepare("SELECT id, email, role FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if (!$user) {
    http_response_code(404);
    echo json_encode(['error' => 'Usuario no encontrado']);
    exit;
}

// Cerramos la sesión de admin y creamos sesión de usuario
session_destroy();
session_start();
$_SESSION['user_id'] = $user['id'];
$_SESSION['role'] = $user['role'];

// Respondemos éxito
echo json_encode(['success' => true, 'redirect' => '../../dashboard/html/Dashboard.html']);
exit;
