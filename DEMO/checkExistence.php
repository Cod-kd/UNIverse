<?php
header('Content-Type: application/json');

require_once "connection.php";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: $conn->connect_error");
    }

    $userdata = json_decode(file_get_contents("php://input"), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON input");
    }

    if (!isset($userdata['type'], $userdata['value'])) {
        throw new Exception("Missing type or value parameter");
    }

    $type = $userdata['type'];
    $value = $userdata['value'];

    $allowedTypes = ['email', 'username'];
    if (!in_array($type, $allowedTypes)) {
        throw new Exception("Invalid type parameter");
    }

    $stmt = $conn->prepare("SELECT `$type` FROM users WHERE `$type` = ? AND deleted_at IS NULL LIMIT 1");
    if (!$stmt) {
        throw new Exception("Prepare failed: $conn->error");
    }

    $stmt->bind_param("s", $value);

    $stmt->execute();

    $result = $stmt->get_result();

    $response = ["exists" => $result->num_rows > 0];

    $stmt->close();
    $conn->close();

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
    if (isset($stmt) && $stmt instanceof mysqli_stmt) {
        $stmt->close();
    }
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}