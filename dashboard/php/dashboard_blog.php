<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "../../conexion.php";

// Consulta todos los posts
$sql = "
    SELECT 
        id, user_id, title, content, image_url, created_at, updated_at
    FROM blog_posts
    ORDER BY created_at DESC
";

$result = $conexion->query($sql);

$posts = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $posts[] = [
            "id" => (int) $row["id"],
            "user_id" => (int) $row["user_id"],
            "title" => $row["title"],
            "content" => $row["content"],
            "image_url" => $row["image_url"],
            "created_at" => $row["created_at"],
            "updated_at" => $row["updated_at"]
        ];
    }
}

// Devuelve JSON (aunque no haya resultados)
echo json_encode($posts, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

$conexion->close();
