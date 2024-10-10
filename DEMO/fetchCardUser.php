<?php
header('Content-Type: application/json');

require_once "connection.php";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Database connection failed");
    }

    if (!isset($_GET['email'])) {
        http_response_code(400);
        echo json_encode(["error" => "Email parameter is missing"]);
        exit;
    }

    $email = trim($_GET['email']);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid email format"]);
        exit;
    }

    $sql = "SELECT imgPasswd FROM users WHERE email = ? AND deleted_at IS NULL";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Prepare statement failed");
    }

    $stmt->bind_param("s", $email);

    if (!$stmt->execute()) {
        throw new Exception("Execute statement failed");
    }

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $userData = $result->fetch_assoc();
        echo json_encode(["data" => $userData]);
    } else {
        echo json_encode(["data" => null, "message" => "No user found"]);
    }

} catch (Exception $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "An unexpected error occurred"]);
} finally {
    if (isset($stmt) && $stmt instanceof mysqli_stmt) {
        $stmt->close();
    }
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
?>
