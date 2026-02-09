<?php
header('Content-Type: application/json'); // muy importante

// Recibir datos desde JS
$input = json_decode(file_get_contents('php://input'), true);
$nombre = $input['nombre'] ?? '';

if (!$nombre) {
    echo json_encode(['descripcion' => '']);
    exit;
}

$prompt = "Escribe una descripción atractiva y breve para un producto llamado: $nombre.";

// Datos para Hugging Face
$data = [
    "model" => "openai/gpt-oss-120b:groq",
    "messages" => [
        ["role" => "user", "content" => $prompt]
    ],
    "stream" => false
];
//CONECTAR A HUGING FACE POR CURL
$ch = curl_init("https://router.huggingface.co/v1/chat/completions");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $apiKey",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
curl_close($ch);

// Decodificar JSON
$result = json_decode($response, true);
$descripcion = $result['choices'][0]['message']['content'] ?? '';

// Devolver JSON A JS
echo json_encode(['descripcion' => $descripcion]);
