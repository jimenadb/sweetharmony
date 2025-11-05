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

// Campos requeridos
$req = ['full_name','dni','address','district','city','postal_code','reference','email'];
foreach ($req as $r) {
    if (empty($d[$r])) {
        echo json_encode(["message" => "Falta el campo $r"]);
        exit;
    }
}

// Solo una dirección predeterminada
$is_default = isset($d['is_default']) && $d['is_default'] == 1 ? 1 : 0;

// Si es edición y marcada como predeterminada → desmarcar las demás
if(!empty($d['id']) && $is_default) {
    $conexion->query("UPDATE user_addresses SET is_default=0 WHERE user_id=$user_id AND id != ".$d['id']);
}
// Si es nueva y marcada como predeterminada → desmarcar todas
elseif(empty($d['id']) && $is_default) {
    $conexion->query("UPDATE user_addresses SET is_default=0 WHERE user_id=$user_id");
}

// 🔹 Detectar si es edición o creación
if (!empty($d['id'])) {
    // EDITAR
    $stmt = $conexion->prepare("UPDATE user_addresses 
        SET full_name=?, dni=?, address=?, district=?, city=?, postal_code=?, reference=?, email=?, is_default=?
        WHERE id=? AND user_id=?");
    $stmt->bind_param(
        "ssssssssiii",
        $d['full_name'],
        $d['dni'],
        $d['address'],
        $d['district'],
        $d['city'],
        $d['postal_code'],
        $d['reference'],
        $d['email'],
        $is_default,
        $d['id'],
        $user_id
    );
    $message = $stmt->execute() ? "Dirección actualizada correctamente" : "Error al actualizar dirección";
} else {
    // INSERTAR NUEVA
    $stmt = $conexion->prepare("INSERT INTO user_addresses 
        (user_id, full_name, dni, address, district, city, postal_code, reference, email, is_default)
        VALUES (?,?,?,?,?,?,?,?,?,?)");
    $stmt->bind_param(
        "issssssssi",
        $user_id,
        $d['full_name'],
        $d['dni'],
        $d['address'],
        $d['district'],
        $d['city'],
        $d['postal_code'],
        $d['reference'],
        $d['email'],
        $is_default
    );
    $message = $stmt->execute() ? "Dirección guardada correctamente" : "Error al guardar dirección";
}

echo json_encode(["message" => $message]);
