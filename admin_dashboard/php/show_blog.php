<?php
require_once "../../conexion.php";

$sql = "SELECT id, title, status, created_at FROM blog_posts ORDER BY created_at DESC";
$result = $conexion->query($sql);

$posts = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }
}

header("Content-Type: application/json");
echo json_encode($posts);
exit;
?>
