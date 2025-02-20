import { Injectable } from '@angular/core';
import { PopupService } from '../popup-message/popup-message.service';

@Injectable({
    providedIn: 'root'
})
export class ValidationService {
    emailValid: boolean = false;
    usernameValid: boolean = false;
    birthDateValid: boolean = false;
    passwordValid: boolean = false;
    universityValid: boolean = false;
    facultyValid: boolean = false;

    constructor(private popupService: PopupService) { }

    validateEmail(email: string): boolean {
        this.emailValid = true;
        if (!email || email.trim() === "") {
            this.popupService.show("Hiányzó e-mail cím");
            this.emailValid = false;
        } else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                this.popupService.show("Helytelen e-mail formátum");
                this.emailValid = false;
            }
        }
        return this.emailValid;
    }

    validateUsername(username: string): boolean {
        this.usernameValid = true;
        if (!username || username.trim() === "") {
            this.popupService.show("Hiányzó felhasználónév");
            this.usernameValid = false;
        } else if (username.length < 6) {
            this.popupService.show("Legalább 6 karakter");
            this.usernameValid = false;
        } else if (username.length > 12) {
            this.popupService.show("Legfeljebb 12 karakter");
            this.usernameValid = false;
        } else {
            const usernamePattern = /^[A-Za-z0-9_-]+$/;
            if (!usernamePattern.test(username)) {
                this.popupService.show("Tartalmazhat (szám, betű, -, _)");
                this.usernameValid = false;
            }
        }
        return this.usernameValid;
    }

    validateBirthDate(birthDate: string): boolean {
        this.birthDateValid = true;
        if (!birthDate || birthDate.trim() === "") {
            this.popupService.show("Hiányzó születési dátum");
            this.birthDateValid = false;
        } else {
            const cleanDate = birthDate.replace(/-/g, '');
            if (cleanDate.length !== 8) {
                this.popupService.show("Helytelen dátumformátum (ÉÉÉÉ-HH-NN)");
                this.birthDateValid = false;
            } else {
                const year = parseInt(cleanDate.slice(0, 4), 10);
                const month = parseInt(cleanDate.slice(4, 6), 10);
                const day = parseInt(cleanDate.slice(6, 8), 10);
                const daysInMonth = [
                    31,
                    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28,
                    31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
                ];
                if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
                    this.popupService.show("Hibás dátum az adott hónapban");
                    this.birthDateValid = false;
                }
            }
        }
        return this.birthDateValid;
    }

    validatePassword(password: string): boolean {
        this.passwordValid = true;
        if (!password || password.trim() === "") {
            this.popupService.show("Hiányzó jelszó");
            this.passwordValid = false;
        } else if (password.length < 8) {
            this.popupService.show("Legalább 8 karakter");
            this.passwordValid = false;
        } else {
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*(),.?":{}|<>]*$/;
            if (!passwordPattern.test(password)) {
                this.popupService.show("Minimum 1 nagybetű, 1 kisbetű, és 1 szám");
                this.passwordValid = false;
            }
        }
        return this.passwordValid;
    }

    validateUniversity(university: string): boolean {
        this.universityValid = true;
        if (!university || university.trim() === "") {
            this.popupService.show("Válassz egy egyetemet!");
            this.universityValid = false;
            this.facultyValid = true;
        }
        return this.universityValid;
    }

    validateFaculty(faculty: string): boolean {
        if (!this.universityValid) {
            return true;
        }

        this.facultyValid = true;
        if (!faculty || faculty.trim() === "") {
            this.popupService.show("Válassz egy kart!");
            this.facultyValid = false;
        }
        return this.facultyValid;
    }

    isFormValid(): boolean {
        return (
            this.emailValid &&
            this.usernameValid &&
            this.birthDateValid &&
            this.passwordValid &&
            this.universityValid &&
            this.facultyValid
        );
    }
}
