<?php

$email = $_POST["email"];

$token = bin2hex(random_bytes(16));

$token_hash = hash("sha256", $token);

$expiry = date("Y-m-d H:i:s", time() + 60 * 5);

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "universeDB";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: $conn->connect_error");
}

$sql = "UPDATE users SET reset_token_hash = ?, reset_token_expiry = ? WHERE email = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param("sss", $token_hash, $expiry, $email);

$stmt->execute();

if ($conn->affected_rows) {
    $content = "Click <a href='https://universe-dpt.life/resetPassword.php?token=$token'>here</a> to reset your password.";
    $subject = "Password Reset";

    $command = "echo $content | mail -s $subject -r 'serverPOP@universe-dpt.life' $email 2>&1";

    $output = shell_exec($command);

    echo $output;
}

echo "Message sent, please check your inbox";