<?php

//$conexion = new mysqli("localhost","root","123456","dbximena_flores");
//$conexion = new mysqli("localhost","rootsenati","Senatino#2025","dbximena_flores");
$conexion = new mysqli("158.69.214.32","rootsenati","Senatino#2025","dbximena_flores");

if ($conexion->connect_error) {
	die("Error de conexion: " . $conexion->connect_error);
} 
//Se comento ya que al intentar realizar la conexion envia el mensaje en vez de los datos
// else{
// 	echo "conexion exitosa";
// }

?>