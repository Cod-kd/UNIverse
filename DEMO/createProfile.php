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
$userdata = json_decode(file_get_contents("php://input"), true);

// Extract values from the userdata array
$email = $userdata['email'];
$birthDate = $userdata['birthDate'];
$gender = $userdata['gender'];
$username = $userdata['username'];
$passwd = $userdata['passwd'];
$imgPasswd = $userdata['imgPasswd'];

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO users (email, birthDate, gender, username, passwd, imgPasswd) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $email, $birthDate, $gender, $username, $passwd, $imgPasswd);

if ($stmt->execute()) {
    echo "Successful registration";
} else {
    echo "Error: $stmt->error";
}

$stmt->close();
$conn->close();

/* DEBUGGING CODE
// Get JSON input from the request body
$userdata = json_decode(file_get_contents("php://input"), true);

// Check if the JSON data was received properly
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["error" => "Invalid JSON input"]);
    exit;
}

// Prepare an array to store the response
$response = [
    "email" => $userdata['email'] ?? null,
    "birthDate" => $userdata['birthDate'] ?? null,
    "gender" => $userdata['gender'] ?? null,
    "username" => $userdata['username'] ?? null,
    "passwd" => $userdata['passwd'] ?? null,
    "imgPasswd" => $userdata['imgPasswd'] ?? null,
];

// Set the content type to application/json
header('Content-Type: application/json');

// Echo the response as JSON
echo json_encode($response);
*/