<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "universeDB";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed $conn->connect_error");
}

// Get JSON input from the request body
$userdata = json_decode(file_get_contents("php://input"), true);

// Set parameters and execute
$email = $_POST['email'];
$birthDate = $_POST['birthDate'];
$gender = $_POST['gender'];
$username = $_POST['username'];
$passwd = $_POST['passwd'];
$imgPasswd = $_POST['imgPasswd'];

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
