<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "universeDB";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: $conn->connect_error");
}

// Get JSON input from the request body
//$userdata = json_decode(file_get_contents("php://input"), true);

// Extract values from the userdata array
$email = json_decode(file_get_contents("php://input"), true);

// Prepare and bind
$stmt = $conn->prepare("SELECT 1 FROM users WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["exists" => true]);
} else {
    echo json_encode(["exists" => false]);
}

$stmt->close();
$conn->close();
