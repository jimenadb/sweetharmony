<?php

//$conexion = new mysqli("localhost","root","123456","dbximena_flores");
$conexion = new mysqli("localhost","rootsenati","Senatino#2025","dbximena_flores");

if ($conexion->connect_error) {
	die("Error de conexion: " . $conexion->connect_error);
} 

?>