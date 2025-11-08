<?php
header('Content-Type: application/json');
require_once "../../conexion.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
    $title = $_POST['title'] ?? '';
    $content = $_POST['content'] ?? ''; 

    if (!$id || !$title || !$content) {
        echo json_encode(['success' => false, 'message' => 'Faltan campos obligatorios.']);
        exit;
    }

    // Obtener imagen actual
    $stmt = $conexion->prepare("SELECT image_url FROM blog_posts WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($currentImage);
    $stmt->fetch();
    $stmt->close();

    // Mantener la imagen actual por defecto
    $image_url = $currentImage ?? "";

    // Si hay nueva imagen
    if (!empty($_FILES['image']['name'])) {
        $upload_dir = "../../uploads/blog/";
        if (!file_exists($upload_dir)) mkdir($upload_dir, 0777, true);

        $fileName = time() . "_" . basename($_FILES['image']['name']);
        $targetPath = $upload_dir . $fileName;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
            $image_url = $fileName;

            // Eliminar imagen anterior
            if ($currentImage && file_exists("../../" . $currentImage)) {
                unlink("../../" . $currentImage);
            }
        }
    }

    // Actualizar título, contenido e imagen
    $stmt = $conexion->prepare("
        UPDATE blog_posts
        SET title = ?, content = ?, image_url = ?, updated_at = NOW()
        WHERE id = ?
    ");
    
    // bind_param espera 4 valores, todos definidos
    $stmt->bind_param("sssi", $title, $content, $image_url, $id);

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
