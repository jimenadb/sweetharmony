<?php


// Destruir la sesión actual
session_unset();
session_destroy();

// 🚫 Evitar que el navegador guarde en caché esta página
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: 0");

// Responder en formato JSON
header("Content-Type: application/json");
echo json_encode(["message" => "Sesión cerrada correctamente"]);
exit;
?>
