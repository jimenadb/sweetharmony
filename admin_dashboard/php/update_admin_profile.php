<?php
session_start();
require_once "../../conexion.php";

// Asegúrate de que el usuario haya iniciado sesión
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status'=>'error', 'message'=>'No has iniciado sesión']);
    exit;
}

// Leer datos enviados
$data = json_decode(file_get_contents('php://input'), true);

$user_id = $_SESSION['user_id'];
$first_name = $data['first_name'] ?? '';
$last_name = $data['last_name'] ?? '';
$email = $data['email'] ?? '';
$current_password = $data['current_password'] ?? '';
$new_password = $data['new_password'] ?? '';

// Obtener usuario de la base
$sql = "SELECT password FROM users WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user || !password_verify($current_password, $user['password'])) {
    echo json_encode(['status'=>'error', 'message'=>'Porfavor ingrese su contraseña actual para guardar los cambios']);
    exit;
}

// Si la contraseña actual es correcta, actualizar datos
$update_sql = "UPDATE users SET first_name=?, last_name=?, email=?".($new_password ? ", password=?" : "")." WHERE id=?";
if ($new_password) {
    $hashed = password_hash($new_password, PASSWORD_DEFAULT);
    $stmt = $conexion->prepare($update_sql);
    $stmt->bind_param('ssssi', $first_name, $last_name, $email, $hashed, $user_id);
} else {
    $stmt = $conexion->prepare($update_sql);
    $stmt->bind_param('sssi', $first_name, $last_name, $email, $user_id);
}

if ($stmt->execute()) {
    echo json_encode(['status'=>'success', 'message'=>'Perfil actualizado correctamente']);
} else {
    echo json_encode(['status'=>'error', 'message'=>'Error al actualizar el perfil']);
}
?>
