<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require_once "conexion.php";

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(["message" => "Datos no recibidos"]);
    exit;
}

$first_name   = $conexion->real_escape_string($input['first_name']);
$last_name    = $conexion->real_escape_string($input['last_name']);
$email        = $conexion->real_escape_string($input['email']);
$phone        = !empty($input['phone']) ? $conexion->real_escape_string($input['phone']) : null;
$address      = !empty($input['address']) ? $conexion->real_escape_string($input['address']) : null;
$city_id      = !empty($input['city_id']) ? intval($input['city_id']) : null;
$department   = !empty($input['department']) ? $conexion->real_escape_string($input['department']) : null;
$province     = !empty($input['province']) ? $conexion->real_escape_string($input['province']) : null;
$postal_code  = !empty($input['postal_code']) ? $conexion->real_escape_string($input['postal_code']) : null;
$password     = password_hash($input['password'], PASSWORD_DEFAULT);

$sql = "INSERT INTO users 
        (first_name, last_name, email, phone, address, city_id, department, province, postal_code, password)
        VALUES ('$first_name', '$last_name', '$email', 
                " . ($phone ? "'$phone'" : "NULL") . ", 
                " . ($address ? "'$address'" : "NULL") . ", 
                " . ($city_id ? $city_id : "NULL") . ", 
                " . ($department ? "'$department'" : "NULL") . ", 
                " . ($province ? "'$province'" : "NULL") . ", 
                " . ($postal_code ? "'$postal_code'" : "NULL") . ", 
                '$password')";

if ($conexion->query($sql)) {
    echo json_encode(["message" => "Registro exitoso"]);
    windows.
} else {
    http_response_code(400);
    echo json_encode(["message" => "Error: " . $conexion->error]);
}


