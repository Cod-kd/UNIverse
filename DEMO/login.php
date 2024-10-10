<?php
header('Content-Type: application/json');

require_once "connection.php";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Database connection failed");
    }

    if (!isset($_POST["email"]) || !isset($_POST["passwd"])) {
        http_response_code(400);
        echo json_encode(["error" => "Email and password are required"]);
        exit;
    }

    $email = trim($_POST["email"]);
    $passwd = trim($_POST["passwd"]);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid email format"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    if (!$stmt) {
        throw new Exception("Failed to prepare statement");
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();

        if (password_verify($passwd, $row["passwd"])) {
            echo json_encode(["message" => "Successful login!"]);
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Invalid credentials"]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid credentials"]);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Internal server error"]);
}
