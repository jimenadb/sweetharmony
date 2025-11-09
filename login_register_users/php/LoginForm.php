<?php
session_start();

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require_once "../../conexion.php";

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
	http_response_code(400);
	echo json_encode(["message" => "Datos no recibidos"]);
	exit;
}

$email = $conexion->real_escape_string($input['email']);
$password = $input['password'];

// $sql = "SELECT password FROM users WHERE email='$email' LIMIT 1";
$sql = "SELECT id, password, role, first_name FROM users WHERE email='$email' LIMIT 1";
$result = $conexion->query($sql);

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["message" => "Usuario no encontrado"]);
    exit;
}

$user = $result->fetch_assoc();

if (password_verify($password, $user['password'])) {
    $_SESSION['user_id'] = $user['id'];           // id del usuario
    $_SESSION['username'] = $user['first_name'];  // nombre del usuario
    $_SESSION['role'] = $user['role'];           // rol del usuario
	//CAMBIO EN LA REDIRECCION 
    $redirect = ($user['role'] === 'admin')
        ? "http://localhost/sweetharmony/sweetharmony/admin_dashboard/html/Admin_catalogo.html"
        : "http://localhost/sweetharmony/sweetharmony/dashboard/html/Dashboard.html";

	echo json_encode([
        "message" => "Login exitoso",
        "redirect" => $redirect,
        "username" => $user['first_name'],
        "user_id" => $user['id'],
        "role" => $user['role'] 
    ]);
} else {
    http_response_code(401);
    echo json_encode(["message" => "Contraseña incorrecta"]);
}