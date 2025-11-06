<?php
header('Content-Type: application/json');
require '../../conexion.php';

// Primero obtenemos productos con descuento
$query = "SELECT * FROM products WHERE discount > 0 ORDER BY discount DESC";
$result = mysqli_query($conexion, $query);
$products = mysqli_fetch_all($result, MYSQLI_ASSOC);

if (count($products) === 0) {
    // Si no hay descuentos, obtenemos productos más baratos
    $query = "SELECT * FROM products ORDER BY price ASC";
    $result = mysqli_query($conn, $query);
    $products = mysqli_fetch_all($result, MYSQLI_ASSOC);
}

echo json_encode($products);
