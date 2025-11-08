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

    // 🔹 Insertar en products
    $stmt = $conexion->prepare("INSERT INTO products (product_type, plant_type) VALUES (?, ?)");
    if(!$stmt){
        echo json_encode(['success' => false, 'message' => 'Error en prepare: '.$conexion->error]);
        exit;
    }
    $stmt->bind_param("ss", $product_type, $plant_type);
    $stmt->execute();

    // 🔹 Insertar tipo de producto si se envió
    if (!empty($product_type)) {
        $stmt2 = $conexion->prepare("INSERT INTO product_types (name) VALUES (?)");
        $stmt2->bind_param("s", $product_type);
        $stmt2->execute();
        $stmt2->close();
    }

    // 🔹 Insertar tipo de planta si se envió
    if (!empty($plant_type)) {
        $stmt3 = $conexion->prepare("INSERT INTO plant_types (name) VALUES (?)");
        $stmt3->bind_param("s", $plant_type);
        $stmt3->execute();
        $stmt3->close();
    }


    echo json_encode(['success' => true, 'message' => 'Producto guardado correctamente']);

} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>
