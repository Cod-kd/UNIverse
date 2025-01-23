import { Injectable } from '@angular/core';
import { PopupService } from './popup-message.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private popupService: PopupService) { }

   validateEmail(email: string) {
    if (!email || email.trim() === "") {
        this.popupService.show("Hiányzó email cím");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        this.popupService.show("Helytelen email formátum");
    }
  }

  validateUsername(username: string) {
    if (!username || username.trim() === "") {
        this.popupService.show("Hiányzó felhasználónév");
    }

    if (username.length < 6) {
        this.popupService.show("Legalább 6 karakter");
    }

    if (username.length > 12) {
        this.popupService.show("Legfeljebb 12 karakter");
    }

    const usernamePattern = /^[A-Za-z0-9_-]+$/;
    if (!usernamePattern.test(username)) {
        this.popupService.show("Tartalmazhat (szám, betű, -, _)");
    }
  }

  validateBirthDate(birthDate: string) {
    if (!birthDate || birthDate.trim() === "") {
        this.popupService.show("Hiányzó születési dátum");
    }

    const cleanDate = birthDate.replace(/-/g, '');

    if (cleanDate.length !== 8) {
        this.popupService.show("Helytelen dátumformátum (ÉÉÉÉ-HH-NN)");
    }

    const year = parseInt(cleanDate.slice(0, 4), 10);
    const month = parseInt(cleanDate.slice(4, 6), 10);
    const day = parseInt(cleanDate.slice(6, 8), 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        this.popupService.show("Helytelen dátumformátum (ÉÉÉÉ-HH-NN)");
    }

    const daysInMonth = [
        31,
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28,
        31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ];

    if (month < 1 || month > 12) {
        this.popupService.show("Hibás hónap");
    }

    if (day < 1 || day > daysInMonth[month - 1]) {
        this.popupService.show("Hibás nap az adott hónapban");
    }
  }

  validatePassword(password: string) {
    if (!password || password.trim() === "") {
        this.popupService.show("Hiányzó jelszó");
    }

    if (password.length < 8) {
        this.popupService.show("Legalább 8 karakter");
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*(),.?":{}|<>]*$/;
    if (!passwordPattern.test(password)) {
        this.popupService.show("Minimum 1 nagybetű, 1 kisbetű, és 1 szám");
    }
  }
}
