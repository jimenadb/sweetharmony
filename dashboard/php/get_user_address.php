<?php
// consulta para la vista de direccion para la tabla
header("Content-Type: application/json; charset=UTF-8");
require "../../conexion.php";
session_start();

// Verificar sesión
if (empty($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Usuario no autenticado"
    ]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Preparar consulta para traer SOLO las direcciones activas
$sql = "SELECT 
            id,
            full_name,
            email,
            dni,
            address,
            district,
            city,
            postal_code,
            reference,
            is_default,
            created_at,
            updated_at
        FROM user_addresses
        WHERE user_id = ? AND active = 1
        ORDER BY is_default DESC, created_at DESC";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$addresses = [];
while ($row = $result->fetch_assoc()) {
    $addresses[] = $row;
}

// Responder con JSON
echo json_encode([
    "success" => true,
    "addresses" => $addresses
]);
