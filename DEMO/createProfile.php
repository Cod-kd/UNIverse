<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "universeDB";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: $conn->connect_error");
}

$userdata = json_decode(file_get_contents("php://input"), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo "Invalid JSON input";
    exit;
}

if (!isset($userdata['email']) || !isset($userdata['birthDate']) || !isset($userdata['gender']) || !isset($userdata['username']) || !isset($userdata['passwd']) || !isset($userdata['imgPasswd'])) {
    echo "Missing data";
    exit;
}

$email = $userdata['email'];
$birthDate = $userdata['birthDate'];
$gender = $userdata['gender'];
$username = $userdata['username'];
$passwd = hashPassword($userdata['passwd']);
$imgPasswd = $userdata['imgPasswd'];

$stmt = $conn->prepare("INSERT INTO users (email, birthDate, gender, username, passwd, imgPasswd, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
$stmt->bind_param("ssssss", $email, $birthDate, $gender, $username, $passwd, $imgPasswd);

if ($stmt->execute()) {
    echo "Successful registration";
} else {
    echo "Error: $stmt->error";
}

$stmt->close();
$conn->close();

function hashPassword($password)
{
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    return $hashedPassword;
}
