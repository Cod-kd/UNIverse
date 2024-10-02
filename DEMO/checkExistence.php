<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "universeDB";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$userdata = json_decode(file_get_contents("php://input"), true);

$type = $userdata['type'];
$value = $userdata['value'];

$stmt = $conn->prepare("SELECT $type FROM users WHERE $type = ? LIMIT 1");
$stmt->bind_param("s", $value);
$stmt->execute();
$result = $stmt->get_result();

$response = ["exists" => $result->num_rows > 0];

$stmt->close();
$conn->close();

echo json_encode($response);
