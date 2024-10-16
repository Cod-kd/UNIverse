<?php

require_once "Config.php";
require_once "Validations.php";

$conn = Config::getConnection();

if ($conn->connect_error) {
    die("Connection failed: $conn->connect_error");
}

$userdata = json_decode(file_get_contents("php://input"), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["error" => "Invalid JSON input"]);
    exit;
}

if (!isset($userdata['email']) || !isset($userdata['birthDate']) || !isset($userdata['gender']) || !isset($userdata['username']) || !isset($userdata['passwd']) || !isset($userdata['imgPasswd'])) {
    echo json_encode(["error" => "Missing data"]);
    exit;
}

$email = $userdata['email'];
$birthDate = $userdata['birthDate'];
$gender = $userdata['gender'];
$username = $userdata['username'];
$passwd = $userdata['passwd'];
$imgPasswd = $userdata['imgPasswd'];

$emailErrors = validateEmail($email);
$birthDateErrors = validateBirthDate($birthDate);
$usernameErrors = validateUsername($username);
$passwordErrors = validatePassword($passwd);

$allErrors = array_merge($emailErrors, $birthDateErrors, $usernameErrors, $passwordErrors);

if (!empty($allErrors)) {
    echo json_encode(["error" => implode(" ", $allErrors)]);
    exit();
}

$hashedPassword = hashPassword($passwd);

$stmt = $conn->prepare("INSERT INTO users (email, birthDate, gender, username, passwd, imgPasswd, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
$stmt->bind_param("ssssss", $email, $birthDate, $gender, $username, $hashedPassword, $imgPasswd);

if ($stmt->execute()) {
    echo json_encode(["success" => "Successful registration"]);
} else {
    echo json_encode(["error" => "Error: $stmt->error"]);
}

$stmt->close();
Config::close();

function hashPassword($password)
{
    return password_hash($password, PASSWORD_BCRYPT);
}