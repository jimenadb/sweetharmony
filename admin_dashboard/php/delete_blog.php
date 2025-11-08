<?php
require_once "../../conexion.php";

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = isset($_POST["id"]) ? intval($_POST["id"]) : 0;

    if ($id > 0) {
        $stmt = $conexion->prepare("DELETE FROM blog_posts WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Entrada eliminada correctamente."]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al eliminar la entrada."]);
        }

       
    } else {
        echo json_encode(["success" => false, "message" => "ID inválido."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
}
?>