<?php

function validateEmail($email) {
    if (empty($email)) {
        return false;
    }

    if (strpos($email, '@') === false) {
        return false;
    }

    if (strlen(explode('@', $email)[0]) === 0) {
        return false;
    }

    $domainPattern = '/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';
    $domain = explode('@', $email)[1] ?? '';
    if (empty($domain) || !preg_match($domainPattern, $domain)) {
        return false;
    }

    return true;
}

function validateUsername($username) {
    if (empty($username)) {
        return false;
    }

    if (strlen($username) < 8 || strlen($username) > 20) {
        return false;
    }

    $usernamePattern = '/^[A-Za-z0-9_-]+$/';
    if (!preg_match($usernamePattern, $username)) {
        return false;
    }

    return true;
}

function validateBirthDate($birthDate) {
    if (empty($birthDate)) {
        return false;
    }

    if (strlen($birthDate) !== 8) {
        return false;
    }

    $year = (int)substr($birthDate, 0, 4);
    $month = (int)substr($birthDate, 4, 2);
    $day = (int)substr($birthDate, 6, 2);

    if ($year < 1000 || $month < 1 || $month > 12 || $day < 1 || $day > 31) {
        return false;
    }

    $daysInMonth = [31, ($year % 4 === 0 && $year % 100 !== 0 || $year % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if ($day > $daysInMonth[$month - 1]) {
        return false;
    }

    $today = new DateTime();
    $birthDateObj = DateTime::createFromFormat('Ymd', $birthDate);

    if ($birthDateObj > $today) {
        return false;
    }

    $age = $today->diff($birthDateObj)->y;

    if ($age < 18 || $age > 100) {
        return false;
    }

    return true;
}

function validatePassword($password) {
    if (empty($password)) {
        return false;
    }

    $minLength = 8;
    $maxLength = 26;

    if (strlen($password) < $minLength || strlen($password) > $maxLength) {
        return false;
    }

    if (!preg_match('/[0-9]/', $password)) {
        return false;
    }

    if (!preg_match('/[!@#$%^&*()\-_=+]/', $password)) {
        return false;
    }

    return true;
}
