<?php

//$conexion = new mysqli("localhost","root","123456","dbximena_flores"); //Base de datos local
$conexion = new mysqli("localhost","rootsenati","Senatino#2025","dbximena_flores"); // para el servidor
//$conexion = new mysqli("158.69.214.32","rootsenati","Senatino#2025","dbximena_flores"); //Con xammp

if ($conexion->connect_error) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        "error" => true,
        "message" => "Error de conexión: " . $conexion->connect_error
    ]);
    exit;
}
//Se comento ya que al intentar realizar la conexion envia el mensaje en vez de los datos
// else{
// 	echo "conexion exitosa";
// }

?>