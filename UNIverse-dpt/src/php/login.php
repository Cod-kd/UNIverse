<?php

require_once "Config.php";
require_once "Validations.php";

header('Content-Type: application/json');

$conn = Config::getConnection();

$email = htmlspecialchars($_POST["email"] ?? '');
$passwd = htmlspecialchars($_POST["passwd"] ?? '');

if (empty($email) && empty($passwd)) {
    echo json_encode(["error" => "No email and password provided!"]);
    exit();
}

if (!validateEmail($email)) {
    echo json_encode(["error" => "Invalid email format!"]);
    exit();
}

if (!validatePassword($passwd)) {
    echo json_encode(["error" => "Invalid password!"]);
    exit();
}

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();

    if (password_verify($passwd, $row["passwd"])) {
        echo json_encode(["success" => "Successful login!"]);
    } else {
        echo json_encode(["error" => "Incorrect password!"]);
    }
} else {
    echo json_encode(["error" => "No user found with this email!"]);
}

$stmt->close();
Config::close();
