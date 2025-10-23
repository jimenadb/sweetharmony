<?php
require_once "../../conexion.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Nombre obligatorio
    $product_name = trim($_POST['product_name'] ?? '');
    if ($product_name === '') {
        echo "El nombre del producto es obligatorio.";
        exit;
    }

    // Campos opcionales
    $product_type  = $_POST['product_type'] ?: null;
    $plant_type    = $_POST['plant_type'] ?: null;
    $price         = $_POST['price'] !== '' ? floatval($_POST['price']) : null;
    $discount      = $_POST['discount'] !== '' ? floatval($_POST['discount']) : 0.00;
    $plant_height  = $_POST['plant_height'] !== '' ? floatval($_POST['plant_height']) : null;
    $plant_width   = $_POST['plant_width'] !== '' ? floatval($_POST['plant_width']) : null;
    $pot_height    = $_POST['pot_height'] !== '' ? floatval($_POST['pot_height']) : null;
    $pot_width     = $_POST['pot_width'] !== '' ? floatval($_POST['pot_width']) : null;
    $pot_color     = $_POST['pot_color'] ?: null;
    $weight        = $_POST['weight'] !== '' ? floatval($_POST['weight']) : null;
    

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

    // Insertar en la BD
    $sql = "INSERT INTO products (
                product_name, product_type, plant_type, price, discount,
                plant_height, plant_width, pot_height, pot_width, pot_color,
                weight, image_url
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param(
        "sssdddddssss",
        $product_name, $product_type, $plant_type, $price, $discount,
        $plant_height, $plant_width, $pot_height, $pot_width,
        $pot_color, $weight, $image_url
    );

    if ($stmt->execute()) {
        echo "Producto guardado correctamente.";
    } else {
        echo "Error al guardar: " . $stmt->error;
    }

    $stmt->close();
    
} else {
    http_response_code(405);
    echo "Método no permitido";
}
?>
