<?php
require_once "../../conexion.php";

$sql = "SELECT id, product_name, price, discount, image_url FROM products";
$result = $conexion->query($sql);

$productos = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) { 
        // Ajustar la ruta de la imagen para que sea accesible desde el navegador
        $row['image_url'] = !empty($row['image_url']) 
            ? '../../uploads/' . $row['image_url']  // ajusta según tu ruta real
            : '../dashboard/assets/product-01.jpg';
        
        $productos[] = $row;
    }
}

header("Content-Type: application/json");
echo json_encode($productos);
