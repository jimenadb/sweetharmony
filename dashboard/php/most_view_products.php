<?php
require '../../conexion.php';
header('Content-Type: application/json');

// Obtener los productos más vistos (orden descendente por views, máximo 10)
$query = "SELECT id, product_name, image_url, price, discount 
          FROM products 
          ORDER BY views DESC 
          LIMIT 10";

$result = mysqli_query($conexion, $query);
$productos = mysqli_fetch_all($result, MYSQLI_ASSOC);

// Devolver JSON
echo json_encode($productos);
