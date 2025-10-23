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
    weight, 
    image_url
FROM products";

$result = $conexion->query($sql);

$productos = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
}

header("Content-Type: application/json");
echo json_encode($productos);
exit;
?>
