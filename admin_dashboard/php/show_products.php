<?php
require_once "../../conexion.php";

$sql = "SELECT 
    id, 
    product_name, 
    product_type,
    plant_type,
    price, 
    discount, 
    plant_height, 
    plant_width, 
    pot_height, 
    pot_width, 
    pot_color, 
    units,
    description,
    weight, 
    image_url
FROM products";

$result = $conexion->query($sql);

$productos = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Asegurarte que la ruta de la imagen sea accesible desde el HTML
        $row['image_url'] = !empty($row['image_url']) ? '../../uploads/' . $row['image_url'] : '../assets/default.jpg';
        $productos[] = $row;
    }
}

header("Content-Type: application/json");
echo json_encode($productos, JSON_UNESCAPED_SLASHES);
exit;
?>
