<?php
require_once "../../conexion.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? null;
    if (!$id) exit(json_encode(['success' => false, 'message' => 'ID no enviado']));

    $product_name = $_POST['product_name'] ?? '';
    $product_type = $_POST['product_type'] ?: null;
    $plant_type = $_POST['plant_type'] ?: null;
    $price = $_POST['price'] !== '' ? floatval($_POST['price']) : null;
    $discount = $_POST['discount'] !== '' ? floatval($_POST['discount']) : 0;
    $plant_height = $_POST['plant_height'] !== '' ? floatval($_POST['plant_height']) : null;
    $plant_width = $_POST['plant_width'] !== '' ? floatval($_POST['plant_width']) : null;
    $pot_height = $_POST['pot_height'] !== '' ? floatval($_POST['pot_height']) : null;
    $pot_width = $_POST['pot_width'] !== '' ? floatval($_POST['pot_width']) : null;
    $pot_color = $_POST['pot_color'] ?: null;
    $weight = $_POST['weight'] !== '' ? floatval($_POST['weight']) : null;
    $units = $_POST['units'] !== '' ? intval($_POST['units']) : 0;

    // Imagen (opcional)
    $image_url = null;
    if (!empty($_FILES['image_url']['name'])) {
        $upload_dir = "../../uploads/";
        if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);

        $file_name = basename($_FILES['image_url']['name']);
        $target_file = $upload_dir . $file_name;

        if (move_uploaded_file($_FILES['image_url']['tmp_name'], $target_file)) {
            $image_url = $file_name;
        }
    }

    // UPDATE
    $sql = "UPDATE products SET 
            product_name=?, product_type=?, plant_type=?, price=?, discount=?,
            plant_height=?, plant_width=?, pot_height=?, pot_width=?, pot_color=?,
            weight=?, units=?".($image_url ? ", image_url=?" : "")." WHERE id=?";

    $stmt = $conexion->prepare($sql);
    if ($image_url) {
        $stmt->bind_param("sssdddddssdiis",
            $product_name, $product_type, $plant_type, $price, $discount,
            $plant_height, $plant_width, $pot_height, $pot_width, $pot_color,
            $weight, $units, $image_url, $id);
    } else {
        $stmt->bind_param("sssdddddsssii",
            $product_name, $product_type, $plant_type, $price, $discount,
            $plant_height, $plant_width, $pot_height, $pot_width, $pot_color,
            $weight, $units, $id);
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Producto actualizado']);
    } else {
        echo json_encode(['success' => false, 'message' => $stmt->error]);
    }
}
?>
