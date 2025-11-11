<?php
require_once "../../conexion.php"; // Conexión DB

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $product_type = trim($_POST['product_type'] ?? '');
    $plant_type   = trim($_POST['plant_type'] ?? '');

    if (empty($product_type) && empty($plant_type)) {
        echo json_encode(['success' => false, 'message' => 'No se recibió tipo de producto ni de planta']);
        exit;
    }

    // --------------------
    // Insertar tipo de producto si se envió
    $product_type_id = null;
    if (!empty($product_type)) {
        $stmt_check = $conexion->prepare("SELECT id FROM product_types WHERE name=?");
        $stmt_check->bind_param("s", $product_type);
        $stmt_check->execute();
        $stmt_check->bind_result($existing_id);
        if ($stmt_check->fetch()) {
            $product_type_id = $existing_id;
        } else {
            $stmt_insert = $conexion->prepare("INSERT INTO product_types (name) VALUES (?)");
            $stmt_insert->bind_param("s", $product_type);
            $stmt_insert->execute();
            $product_type_id = $stmt_insert->insert_id;
            $stmt_insert->close();
        }
        $stmt_check->close();
    }

    // --------------------
    // Insertar tipo de planta si se envió
    $plant_type_id = null;
    if (!empty($plant_type)) {
        $stmt_check = $conexion->prepare("SELECT id FROM plant_types WHERE name=?");
        $stmt_check->bind_param("s", $plant_type);
        $stmt_check->execute();
        $stmt_check->bind_result($existing_id);
        if ($stmt_check->fetch()) {
            $plant_type_id = $existing_id;
        } else {
            $stmt_insert = $conexion->prepare("INSERT INTO plant_types (name) VALUES (?)");
            $stmt_insert->bind_param("s", $plant_type);
            $stmt_insert->execute();
            $plant_type_id = $stmt_insert->insert_id;
            $stmt_insert->close();
        }
        $stmt_check->close();
    }

    // --------------------
    // Insertar en products usando los IDs
    $stmt = $conexion->prepare("INSERT INTO products (product_types, plant_types) VALUES (?, ?)");
    if(!$stmt){
        echo json_encode(['success'=>false,'message'=>'Error al preparar statement: '.$conexion->error]);
        exit;
    }
    $stmt->bind_param("ii", $product_type_id, $plant_type_id);
    $stmt->execute();
    $stmt->close();

    echo json_encode(['success' => true, 'message' => 'Producto guardado correctamente']);

} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
