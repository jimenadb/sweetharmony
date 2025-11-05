<?php
// Incluimos la conexión a la base de datos
require_once '../../conexion.php';

// Consulta SQL con filtro condicional
$sql = "
SELECT *
FROM products
ORDER BY 
  CASE WHEN discount > 0 THEN 0 ELSE 1 END,
  CASE WHEN discount > 0 THEN views DESC ELSE price ASC END,
  product_name ASC
";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo '<div id="accionesProducto">';
    echo '<span id="productoSeleccionado">Productos destacados</span>';

    while($row = $result->fetch_assoc()) {
        $name = htmlspecialchars($row['product_name']);
        $price = number_format($row['price'], 2);
        $discount = number_format($row['discount'], 2);

        // Muestra botón para cada producto
        echo '<button>';
        echo $name;
        if ($discount > 0) {
            echo " - Oferta: $discount%";
        } else {
            echo " - $ $price";
        }
        echo '</button>';
    }

    echo '</div>';
} else {
    echo "No hay productos disponibles.";
}

// Cerramos la conexión

?>
