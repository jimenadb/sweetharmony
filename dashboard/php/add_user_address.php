<?php
header("Content-Type: application/json; charset=UTF-8");
require "../../conexion.php";
session_start();

if (empty($_SESSION['user_id'])) {
  echo json_encode(["message" => "Usuario no autenticado"]);
  exit;
}

$user_id = $_SESSION['user_id'];
$d = $_POST;

$req = ['full_name','dni','address','district','city','postal_code','reference'];
foreach ($req as $r)
  if (empty($d[$r])) exit(json_encode(["message" => "Falta el campo $r"]));

$predet = isset($d['es_predeterminada']) ? 1 : 0;
if ($predet) $conexion->query("UPDATE user_addresses SET es_predeterminada=0 WHERE user_id=$user_id");

$stmt = $conexion->prepare("INSERT INTO user_addresses 
  (user_id, full_name, dni, address, district, city, postal_code, reference, is_default)
  VALUES (?,?,?,?,?,?,?,?,?)");

$stmt->bind_param("isssssssi", $user_id, $d['full_name'], $d['dni'], $d['address'],
                  $d['district'], $d['city'], $d['postal_code'], $d['reference'], $predet);

echo json_encode([
  "message" => $stmt->execute() ? "Dirección guardada correctamente" : "Error al guardar dirección"
]);
