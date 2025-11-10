<?php
require_once "../../conexion.php";
header("Content-Type: application/json; charset=UTF-8");

// ===============================
// VERIFICAR CONEXIÓN
// ===============================
if (!$conexion) {
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit;
}

$method = $_SERVER["REQUEST_METHOD"];

// ===============================
// MOSTRAR TIPOS (GET)
// ===============================
if ($method === "GET") {
    $sql_productos = "SELECT id, name FROM product_types ORDER BY id DESC";
    $sql_plantas   = "SELECT id, name FROM plant_types ORDER BY id DESC";

    $tipos_productos = [];
    $tipos_plantas = [];

    if ($res = $conexion->query($sql_productos)) {
        while ($row = $res->fetch_assoc()) {
            $tipos_productos[] = $row;
        }
    }

    if ($res = $conexion->query($sql_plantas)) {
        while ($row = $res->fetch_assoc()) {
            $tipos_plantas[] = $row;
        }
    }

    echo json_encode([
        "success" => true,
        "product_types" => $tipos_productos,
        "plant_types" => $tipos_plantas
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
