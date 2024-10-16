<?php

function validateEmail($email) {
    $conditions = [];

    if (strpos($email, '@') === false) {
        $conditions['atSymbol'] = '-Tartalmaz @-ot';
    }

    if (strlen(explode('@', $email)[0]) === 0) {
        $conditions['prefix'] = '-Tartalmaz szöveget @ előtt';
    }

    $domainPattern = '/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';
    $domain = explode('@', $email)[1] ?? '';
    if (empty($domain) || !preg_match($domainPattern, $domain)) {
        $conditions['domain'] = '-Tartalmaz domain-t';
    }

    return $conditions;
}

function validateUsername($username) {
    $conditions = [];

    if (strlen($username) < 8) {
        $conditions['length'] = '-Minimum 8 karakter hosszú';
    } elseif (strlen($username) > 20) {
        $conditions['length'] = '-Maximum 20 karakter hosszú';
    }

    $usernamePattern = '/^[A-Za-z0-9_-]+$/';
    if (!preg_match($usernamePattern, $username)) {
        $conditions['invalidChars'] = '-Tartalmazhat (szám, betű, -, _)';
    }

    return $conditions;
}

function validateBirthDate($birthDate) {
    $conditions = [];

    if (empty($birthDate)) {
        $conditions['empty'] = '-Kötelező mező';
        return $conditions;
    }

    if (strlen($birthDate) !== 8) {
        $conditions['length'] = '-8 karakter hosszú';
        return $conditions;
    }

    $year = (int)substr($birthDate, 0, 4);
    $month = (int)substr($birthDate, 4, 2);
    $day = (int)substr($birthDate, 6, 2);

    if (is_nan($year) || $month < 1 || $month > 12 || $day < 1 || $day > 31) {
        $conditions['validDate'] = '-Nem megfelelő formátum (ÉÉÉÉHHNN)';
        return $conditions;
    }

    $daysInMonth = [31, ($year % 4 === 0 && $year % 100 !== 0 || $year % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if ($day > $daysInMonth[$month - 1]) {
        $conditions['validDay'] = '-Hibás nap az adott hónapban';
    }

    $today = new DateTime();
    $birthDateObj = DateTime::createFromFormat('Ymd', $birthDate);

    if ($birthDateObj > $today) {
        $conditions['futureDate'] = '-Nem jövőbeli dátum';
    }

    $age = $today->diff($birthDateObj)->y;

    if ($age < 18 || $age > 100) {
        $conditions['age'] = '-Életkor 18 és 100 közötti';
    }

    return $conditions;
}

function validatePassword($password) {
    $conditions = [];
    $minLength = 8;
    $maxLength = 26;

    if (strlen($password) < $minLength) {
        $conditions['length'] = "-Minimum $minLength karakter hosszú";
    } elseif (strlen($password) > $maxLength) {
        $conditions['length'] = "-Maximum $maxLength karakter hosszú";
    }

    if (!preg_match('/[0-9]/', $password)) {
        $conditions['hasNumber'] = '-Legalább egy számjegy';
    }

    if (!preg_match('/[!@#$%^&*()\-_=+]/', $password)) {
        $conditions['hasSpecialChar'] = '-Legalább egy speciális karakter';
    }

    return $conditions;
}