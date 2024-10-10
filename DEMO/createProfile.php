<?php
header('Content-Type: application/json');

require_once "connection.php";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(["error" => "Connection failed"]);
        exit;
    }

    $userdata = json_decode(file_get_contents("php://input"), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON input"]);
        exit;
    }

    if (!isset($userdata['email'], $userdata['birthDate'], $userdata['gender'], $userdata['username'], $userdata['passwd'], $userdata['imgPasswd'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }

    $email = $userdata['email'];
    $birthDate = $userdata['birthDate'];
    $gender = $userdata['gender'];
    $username = $userdata['username'];
    $passwd = hashPassword($userdata['passwd']);
    $imgPasswd = $userdata['imgPasswd'];

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid email format"]);
        exit;
    }

    if (!validateDate($birthDate, 'Y-m-d')) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid birthdate format"]);
        exit;
    }

    $allowedGenders = ['Male', 'Female', 'Other'];
    if (!in_array($gender, $allowedGenders)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid gender"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO users (email, birthDate, gender, username, passwd, imgPasswd, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param("ssssss", $email, $birthDate, $gender, $username, $passwd, $imgPasswd);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Successful registration"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => $stmt->error]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error"]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
}

function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

function validateDate($date, $format = 'Y-m-d') {
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) === $date;
}