<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require_once "../../conexion.php";

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(["message" => "Datos no recibidos"]);
    exit;
}

// Sanitizar datos
$first_name = $conexion->real_escape_string($input['first_name']);
$last_name  = $conexion->real_escape_string($input['last_name']);
$email      = $conexion->real_escape_string($input['email']);
$password   = password_hash($input['password'], PASSWORD_DEFAULT);

// Insertar usuario
$sql = "INSERT INTO users (first_name, last_name, email, password)
        VALUES ('$first_name', '$last_name', '$email', '$password')";

if ($conexion->query($sql)) {
    echo json_encode([
        "message" => "Registro exitoso",
        "redirect" => "/html/LoginForm.html"
    ]);
} else {
    http_response_code(400);
    echo json_encode(["message" => "Error: " . $conexion->error]);
}
