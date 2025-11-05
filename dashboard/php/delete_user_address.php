<?php
header("Content-Type: application/json; charset=UTF-8");
require "../../conexion.php";
session_start();

if(empty($_SESSION['user_id'])){
    echo json_encode(["message" => "Usuario no autenticado"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$id = $_POST['id'] ?? null;

if(!$id){
    echo json_encode(["message" => "No se indicó la dirección"]);
    exit;
}

$stmt = $conexion->prepare("DELETE FROM user_addresses WHERE id=? AND user_id=?");
$stmt->bind_param("ii", $id, $user_id);
$message = $stmt->execute() ? "Dirección eliminada correctamente" : "Error al eliminar dirección";

echo json_encode(["message" => $message]);
