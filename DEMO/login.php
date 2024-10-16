<?php

require_once "Config.php";

$conn = Config::getConnection();

$email = htmlspecialchars($_POST["email"]);
$passwd = htmlspecialchars($_POST["passwd"]);

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();

    if (password_verify($passwd, $row["passwd"])) {
        echo "Successful login!";
    } else {
        echo "Incorrect email or password!";
    }
} else {
    echo "No user found!";
}

$stmt->close();
Config::close();