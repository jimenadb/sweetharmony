<?php
header('Content-Type: application/json');
require_once "../../conexion.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    $title = $_POST['title'] ?? '';
    $content = $_POST['content'] ?? '';
    $status = $_POST['status'] ?? '';

    if (!$id || !$title || !$content) {
        echo json_encode(['success' => false, 'message' => 'Faltan campos obligatorios.']);
        exit;
    }

    // Obtener imagen actual por si no se reemplaza
    $stmt = $conexion->prepare("SELECT image_url FROM blog_posts WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($currentImage);
    $stmt->fetch();
    $stmt->close();

    $image_url = $currentImage; // mantener imagen anterior

    // Si el usuario sube una nueva imagen
    if (!empty($_FILES['images']['name'])) {
        $upload_dir = "../../uploads/blog/";
        if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);

        $fileName = time() . "_" . basename($_FILES['images']['name']);
        $targetPath = $upload_dir . $fileName;

        if (move_uploaded_file($_FILES['images']['tmp_name'], $targetPath)) {
            $image_url = "uploads/blog/" . $fileName;

            // (Opcional) eliminar imagen anterior del servidor
            if ($currentImage && file_exists("../../" . $currentImage)) {
                unlink("../../" . $currentImage);
            }
        }
    }

    // Actualizar los datos
    $stmt = $conexion->prepare("
        UPDATE blog_posts
        SET title = ?, content = ?, status = ?, image_url = ?
        WHERE id = ?
    ");
    $stmt->bind_param("ssssi", $title, $content, $status, $image_url, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Entrada actualizada correctamente.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar: ' . $stmt->error]);
    }

    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}
?>
