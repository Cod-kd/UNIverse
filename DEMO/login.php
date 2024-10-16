<?php

require_once "Config.php";
require_once "Validations.php";

header('Content-Type: application/json');

$conn = Config::getConnection();

if (empty($_POST["email"]) && empty($_POST["passwd"])) {
    echo json_encode(["error" => "No email and password provided!"]);
    exit();
}

$email = htmlspecialchars($_POST["email"]);
$passwd = htmlspecialchars($_POST["passwd"]);

$emailErrors = validateEmail($email);
$passwordErrors = validatePassword($passwd);

$allErrors = array_merge($emailErrors, $passwordErrors);

if (!empty($allErrors)) {
    echo json_encode(["error" => implode(" ", $allErrors)]);
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