<?php

require_once "Config.php";
require_once "Validations.php";

$conn = Config::getConnection();

$email = $_GET['email'];

$emailErrors = validateEmail($email);

if (!empty($emailErrors)) {
    echo json_encode(["error" => implode(" ", $emailErrors)]);
    exit();
}

$sql = "SELECT imgPasswd FROM users WHERE email = ? AND deleted_at IS NULL";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $userData = $result->fetch_assoc();
    echo json_encode($userData);
} else {
    echo json_encode([]);
}

$stmt->close();
Config::close();