<?php

$token = $_POST["token"];

$token_hash = hash("sha256", $token);

$conn = new mysqli($servername, $username, $password, $dbname);

$sql = "SELECT * FROM users WHERE reset_token_hash = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param("s", $token_hash);

$stmt->execute();

$result = $stmt->get_result();

$user = $result->fetch_assoc();

if ($user === null) {
    die("Token not found");
}

if (strtotime($user["reset_token_expires_at"]) <= time()) {
    die("Token has expired");
}

// Validations here

$sql = "UPDATE users SET password_hash = ?, reset_token_hash = NULL, reset_token_expiry = NULL WHERE id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $password_hash, $user["id"]);
$stmt->execute();

echo "Password updated you can now log in";
