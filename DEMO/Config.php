<?php

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

class Config
{
    private static $dbCon;

    public static function init()
    {
        if (!self::$dbCon) {
            self::$dbCon = mysqli_connect(
                $_ENV["DB_SERVER"],
                $_ENV["DB_USERNAME"],
                $_ENV["DB_PASSWORD"],
                $_ENV["DB_NAME"]
            );

            if (!self::$dbCon) {
                die("Connection failed: " . mysqli_connect_error());
            }
        }
    }

    public static function getConnection()
    {
        return self::$dbCon;
    }

    public static function close()
    {
        if (self::$dbCon) {
            mysqli_close(self::$dbCon);
            self::$dbCon = null;
        }
    }
}