<?php

require 'conexion.php';

$sql = "SELECT id, product_name, price, discount, image_url FROM products";
$result = $conn->query($sql);

$productos = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

?>