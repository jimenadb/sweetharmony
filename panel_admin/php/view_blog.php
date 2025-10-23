<?php
header('Content-Type: application/json');
require_once "../../conexion.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'] ?? '';
    $content = $_POST['content'] ?? '';

    if (!$title || !$content) {
        echo json_encode(['success' => false, 'message' => 'Título y contenido son obligatorios']);
        exit;
    }

    $image_url = null;
    if (!empty($_FILES['images']['name'][0])) {
        $upload_dir = "../../uploads/blog/";
        if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);

        $fileName = time() . "_" . basename($_FILES['images']['name'][0]);
        $targetPath = $upload_dir . $fileName;

        if (move_uploaded_file($_FILES['images']['tmp_name'][0], $targetPath)) {
            $image_url = "uploads/blog/" . $fileName;
        }
    }

    $stmt = $conexion->prepare("INSERT INTO blog_posts (title, content, image_url) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $title, $content, $image_url);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Entrada guardada correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al guardar: ' . $stmt->error]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
