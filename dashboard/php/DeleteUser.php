<?php
session_start();
require_once 'conexion.php'; // tu conexión $mysqli

if (!isset($_SESSION['user_id'])) {
    die("No autorizado");
}

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'];

    // 1️⃣ Obtener la contraseña actual del usuario
    $sql = "SELECT password FROM users WHERE id = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $res = $stmt->get_result();
    $user = $res->fetch_assoc();

    if (!$user) {
        die("Usuario no encontrado");
    }

    // 2️⃣ Verificar contraseña
    if (!password_verify($password, $user['password'])) {
        die("Contraseña incorrecta");
    }

    // 3️⃣ Ocultar cuenta (soft delete)
    $sql = "UPDATE users SET deleted_at = NOW() WHERE id = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("i", $user_id);
    if ($stmt->execute()) {
        // 4️⃣ Cerrar sesión
        session_unset();
        session_destroy();
        echo "Cuenta eliminada (oculta) correctamente";
    } else {
        echo "Error al eliminar cuenta";
    }
}
?>
