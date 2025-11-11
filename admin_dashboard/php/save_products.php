<?php
require_once "../../conexion.php";
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Nombre obligatorio
    $product_name = trim($_POST['product_name'] ?? '');
    if ($product_name === '') {
        echo json_encode(["success" => false, "message" => "El nombre del producto es obligatorio."]);
        exit;
    }

    // Campos opcionales
    $product_type  = !empty($_POST['product_type']) ? intval($_POST['product_type']) : null;
    $plant_type    = !empty($_POST['plant_type']) ? intval($_POST['plant_type']) : null;
    $price         = isset($_POST['price']) && $_POST['price'] !== '' ? floatval($_POST['price']) : null;
    $discount      = isset($_POST['discount']) && $_POST['discount'] !== '' ? floatval($_POST['discount']) : 0.00;
    $plant_height  = isset($_POST['plant_height']) && $_POST['plant_height'] !== '' ? floatval($_POST['plant_height']) : null;
    $plant_width   = isset($_POST['plant_width']) && $_POST['plant_width'] !== '' ? floatval($_POST['plant_width']) : null;
    $pot_height    = isset($_POST['pot_height']) && $_POST['pot_height'] !== '' ? floatval($_POST['pot_height']) : null;
    $pot_width     = isset($_POST['pot_width']) && $_POST['pot_width'] !== '' ? floatval($_POST['pot_width']) : null;
    $pot_color     = $_POST['pot_color'] ?? null;
    $weight        = isset($_POST['weight']) && $_POST['weight'] !== '' ? floatval($_POST['weight']) : null;
    $units = $_POST['units'] ?? null;
    $description = $_POST['description'] ?? null;

    // Imagen opcional
    $image_url = null;
    if (!empty($_FILES['image_url']['name'])) {
        $upload_dir = "../../uploads/";
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $file_name = basename($_FILES['image_url']['name']);
        $target_file = $upload_dir . $file_name;

        if (move_uploaded_file($_FILES['image_url']['tmp_name'], $target_file)) {
            $image_url = $file_name;
        }
    }

    // SQL con nombres de columna correctos
    $sql = "INSERT INTO products (
        product_name, product_types, plant_types, price, discount,
        plant_height, plant_width, pot_height, pot_width, pot_color,
        weight, units, image_url, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    // Preparamos el statement
    $stmt = $conexion->prepare($sql);
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Error en prepare: " . $conexion->error]);
        exit;
    }

    // i = int, d = double, s = string
    $stmt->bind_param(
        "siiddddddsidss",
        $product_name,   // s
        $product_type,   // i
        $plant_type,     // i
        $price,          // d
        $discount,       // d
        $plant_height,   // d
        $plant_width,    // d
        $pot_height,     // d
        $pot_width,      // d
        $pot_color,      // s
        $weight,         // d
        $units,          // i <-- agregado
        $image_url,       // s
        $description
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Producto guardado correctamente."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al guardar: " . $stmt->error]);
    }

    $stmt->close();

} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
}
?>
