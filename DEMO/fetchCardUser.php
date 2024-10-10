<?php

require_once "connection.php";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: $conn->connect_error");
}

$email = $_GET['email'];

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
$conn->close();