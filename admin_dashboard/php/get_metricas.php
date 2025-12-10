<?php
header('Content-Type: application/json');
require_once '../../conexion.php';

$totalUsers = $totalProducts = $totalOrders = 0;

$sql = "SELECT COUNT(*) AS totalUsers FROM users";
if ($result = $conexion->query($sql)) {
    $row = $result->fetch_assoc();
    $totalUsers = $row['totalUsers'];
}

$sql = "SELECT COUNT(*) AS totalProducts FROM products";
if ($result = $conexion->query($sql)) {
    $row = $result->fetch_assoc();
    $totalProducts = $row['totalProducts'];
}

$sql = "SELECT COUNT(*) AS totalOrders FROM orders";
if ($result = $conexion->query($sql)) {
    $row = $result->fetch_assoc();
    $totalOrders = $row['totalOrders'];
}




/* ===== Productos más vistos ===== */
$mostViewed = [];
$sql = "SELECT product_name, views, image_url 
        FROM products 
        ORDER BY views DESC;
       ";
if ($result = $conexion->query($sql)) {
    while ($row = $result->fetch_assoc()) {
        $mostViewed[] = [
            'name'  => $row['product_name'],
            'views' => $row['views'],
            'image' => !empty($row['image_url'])
                ? '../../uploads/' . $row['image_url']
                : '../assets/default.jpg'
        ];
    }
}


/* ===== Productos más vendidos ===== */
$mostSold = [];
$sql = "
    SELECT p.product_name, p.image_url, SUM(oi.quantity) AS total_sold
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    GROUP BY oi.product_id
    ORDER BY total_sold DESC;

";
if ($result = $conexion->query($sql)) {
    while ($row = $result->fetch_assoc()) {
        $mostSold[] = [
            'name'  => $row['product_name'],
            'sold'  => (int)$row['total_sold'],
            'image' => !empty($row['image_url'])
                ? '../../uploads/' . $row['image_url']
                : '../assets/default.jpg'
        ];
    }
}


/* ===== Pedidos recientes (últimos 15 días) ===== */
$days = 15;
$newOrders = [];
$sql = "SELECT id, status, created_at 
        FROM orders
        WHERE created_at >= NOW() - INTERVAL $days DAY
        ORDER BY created_at DESC";
if ($result = $conexion->query($sql)) {
    while ($row = $result->fetch_assoc()) {
        $newOrders[] = [
            'id'     => $row['id'],
            'status' => $row['status']
        ];
    }
}


/* ===== Productos agotados (todos los que tienen units = 0) ===== */
$outOfStock = [];
$sql = "SELECT product_name, image_url 
        FROM products 
        WHERE units = 0";
if ($result = $conexion->query($sql)) {
    while ($row = $result->fetch_assoc()) {
        $outOfStock[] = [
            'name'  => $row['product_name'],
            'image' => !empty($row['image_url'])
                ? '../../uploads/' . $row['image_url']
                : '../assets/default.jpg'
        ];
    }
}





/* ===== SALIDA FINAL ===== */
echo json_encode([
    'totalUsers'        => $totalUsers,
    'totalProducts'     => $totalProducts,
    'totalOrders'       => $totalOrders,
    'mostViewed'        => $mostViewed,
    'mostSold'          => $mostSold,
    'newOrders'         => $newOrders,
    'outOfStock'        => $outOfStock,        // todos
]);
