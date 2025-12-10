<?php
require_once "../../conexion.php";


$sql = "SELECT 
    p.id,
    p.product_name,
    p.product_types AS product_type_id,
    pt.name AS product_type_name,
    p.plant_types AS plant_type_id,
    plt.name AS plant_type_name,
    p.price,
    p.discount,
    p.plant_height,
    p.plant_width,
    p.pot_height,
    p.pot_width,
    p.pot_color,
    p.units,
    p.description,
    p.weight,
    p.image_url,
    p.active
FROM products p
LEFT JOIN product_types pt ON p.product_types = pt.id
LEFT JOIN plant_types plt ON p.plant_types = plt.id";


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
