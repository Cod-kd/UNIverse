<?php

$token = $_GET["token"];

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

if(strtotime($user["reset_token_expires_at"]) <= time()){
    die("Token has expired");
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Reset password</h1>
    <form method="post" action="process-reset-password.php">
        <input type="hidden" name="token" value="<?=htmlspecialchars($token) ?>">

        <label for="password">New password</label>
        <input type="password" id="password" name="password">

        <label for="password_confirmation">Repeat Password</label>
        <input type="password" id="password_confirmation" name="password_confirmation">

        <button>Send</button>
    </form>
</body>
</html>