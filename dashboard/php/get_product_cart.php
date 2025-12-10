<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "../../conexion.php"; // Asegúrate de que la ruta sea correcta

$response = [];

// Solo manejar GET para obtener detalles del producto
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $product_id = (int)($_GET['product_id'] ?? 0);

    if ($product_id) {
        $sql = "SELECT 
            p.*,
            pt.name AS plant_type_name,
            prt.name AS product_type_name
        FROM products p
        LEFT JOIN plant_types pt ON p.plant_types = pt.id
        LEFT JOIN product_types prt ON p.product_types = prt.id
        WHERE p.id = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param("i", $product_id);
        $stmt->execute();
        $result = $stmt->get_result();

        // Reemplazar los IDs por los nombres
$product['plant_type'] = $product['plant_type_name'] ?? null;
$product['product_type'] = $product['product_type_name'] ?? null;

        if ($result->num_rows > 0) {
            $response = ['status' => 'success', 'product' => $result->fetch_assoc()];
        } else {
            $response = ['status' => 'error', 'message' => 'Producto no encontrado.'];
        }
    } else {
        $response = ['status' => 'error', 'message' => 'ID de producto no válido.'];
    }
} else {
    $response = ['status' => 'error', 'message' => 'Método no permitido.'];
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
$conexion->close();
?>
