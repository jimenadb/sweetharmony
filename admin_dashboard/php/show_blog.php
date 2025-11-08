<?php
require_once "../../conexion.php";

$sql = "SELECT id, title, content, image_url, created_at FROM blog_posts ORDER BY created_at DESC";
$result = $conexion->query($sql);

$posts = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Asegúrate que la ruta de la imagen sea accesible desde el HTML
        $row['image_url'] = !empty($row['image_url']) 
            ? '../../uploads/blog/' . $row['image_url'] 
            : 'http://localhost/sweetharmony/sweetharmony/assets/default.jpg';

        // Opcional: truncar contenido para mostrar solo 20 caracteres
        $row['content'] = mb_strimwidth($row['content'], 0, 20, "...");

        $posts[] = $row;
    }
}

header("Content-Type: application/json");
echo json_encode($posts);
exit;
?>
