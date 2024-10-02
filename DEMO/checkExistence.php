<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "universeDB";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get JSON input from the request body
$userdata = json_decode(file_get_contents("php://input"), true);

// Initialize response array
$response = [];

// Check if email and username are provided
$email = $userdata["email"];
$username = $userdata["username"];

// Prepare the SQL query to check for email
$stmtEmail = $conn->prepare("SELECT email FROM users WHERE email = ? LIMIT 1");
$stmtEmail->bind_param("s", $email);
$stmtEmail->execute();
$resultEmail = $stmtEmail->get_result();

// Set the email existence flag
$response["email_exists"] = $resultEmail->num_rows > 0;

// Close the email statement
$stmtEmail->close();

// Prepare the SQL query to check for username
$stmtUsername = $conn->prepare("SELECT username FROM users WHERE username = ? LIMIT 1");
$stmtUsername->bind_param("s", $username);
$stmtUsername->execute();
$resultUsername = $stmtUsername->get_result();

// Set the username existence flag
$response["username_exists"] = $resultUsername->num_rows > 0;

// Close the username statement
$stmtUsername->close();

// Return the response as JSON
echo json_encode($response);

// Close the connection
$conn->close();
