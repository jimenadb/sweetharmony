<?php
require_once "../../conexion.php";



// Obtener filtros desde GET
$product_type = $_GET['product_type'] ?? '';
$plant_type   = $_GET['plant_type'] ?? '';
$price_order  = $_GET['price_order'] ?? '';


$sql = "SELECT id, product_name, price, discount, image_url FROM products";



if($product_type !== '') {
    $sql .= " AND product_types = ".intval($product_type);
}

if($plant_type !== '') {
    $sql .= " AND plant_types = ".intval($plant_type);
}

if($price_order === 'asc') {
    $sql .= " ORDER BY price ASC";
} elseif($price_order === 'desc') {
    $sql .= " ORDER BY price DESC";
}


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
