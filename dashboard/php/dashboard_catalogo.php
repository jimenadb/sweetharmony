<?php
require_once "../../conexion.php";

// Obtener filtros desde GET
$product_type = $_GET['product_type'] ?? '';
$plant_type   = $_GET['plant_type'] ?? '';
$price_order  = $_GET['price_order'] ?? '';

// Base de la consulta (empieza con WHERE 1 para poder concatenar fácilmente)
$sql = "SELECT id, product_name, price, discount, image_url FROM products WHERE units > 0 AND active = 1";

// Agregar filtros dinámicos
if ($product_type !== '') {
    $sql .= " AND product_types = " . intval($product_type);
}

if ($plant_type !== '') {
    $sql .= " AND plant_types = " . intval($plant_type);
}

// Ordenar por precio si corresponde
if ($price_order === 'asc') {
    $sql .= " ORDER BY price ASC";
} elseif ($price_order === 'desc') {
    $sql .= " ORDER BY price DESC";
}

$result = $conexion->query($sql);

$productos = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Ajustar ruta de imagen
        $row['image_url'] = !empty($row['image_url'])
            ? '../../uploads/' . $row['image_url']
            : '../dashboard/assets/product-01.jpg';
        $productos[] = $row;
    }
}

header("Content-Type: application/json");
echo json_encode($productos);
