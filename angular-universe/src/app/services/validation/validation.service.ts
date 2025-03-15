import { Injectable } from '@angular/core';
import { PopupService } from '../popup-message/popup-message.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ContactType } from '../../models/constants/constants.model';
import { ContactInput } from '../../models/self-profile/self-profile.model';

@Injectable({
    providedIn: 'root'
})
export class ValidationService {
    emailValid: boolean = false;
    usernameValid: boolean = false;
    fullNameValid: boolean = false;
    birthDateValid: boolean = false;
    passwordValid: boolean = false;
    universityValid: boolean = false;
    facultyValid: boolean = false;

    constructor(private popupService: PopupService) { }

    validateEmail(email: string): boolean {
        this.emailValid = true;
        if (!email || email.trim() === "") {
            this.popupService.showError("Hiányzó e-mail cím");
            this.emailValid = false;
        } else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                this.popupService.showError("Helytelen e-mail formátum");
                this.emailValid = false;
            }
        }
        return this.emailValid;
    }

    validateUsername(username: string): boolean {
        this.usernameValid = true;
        if (!username || username.trim() === "") {
            this.popupService.showError("Hiányzó felhasználónév");
            this.usernameValid = false;
        } else if (username.length < 6) {
            this.popupService.showError("Legalább 6 karakter");
            this.usernameValid = false;
        } else if (username.length > 12) {
            this.popupService.showError("Legfeljebb 12 karakter");
            this.usernameValid = false;
        } else {
            const usernamePattern = /^[A-Za-z0-9_-]+$/;
            if (!usernamePattern.test(username)) {
                this.popupService.showError("Tartalmazhat (szám, betű, -, _)");
                this.usernameValid = false;
            }
        }
        return this.usernameValid;
    }

    validateFullName(fullName: string): boolean {
        this.fullNameValid = true;

        if (!fullName || fullName.trim() === "") {
            this.popupService.showError("Hiányzó teljes név");
            this.fullNameValid = false;
        } else if (fullName.length < 1) {
            this.popupService.showError("Legalább 1 karakter");
            this.fullNameValid = false;
        } else if (fullName.length > 80) {
            this.popupService.showError("Legfeljebb 80 karakter");
            this.fullNameValid = false;
        } else {
            const fullNamePattern = /^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű ]+$/;
            if (!fullNamePattern.test(fullName)) {
                this.popupService.showError("Csak betűket tartalmazhat");
                this.fullNameValid = false;
            }
        }
        return this.fullNameValid;
    }

    validateBirthDate(birthDate: string): boolean {
        this.birthDateValid = true;
        if (!birthDate || birthDate.trim() === "") {
            this.popupService.showError("Hiányzó születési dátum");
            this.birthDateValid = false;
        } else {
            const cleanDate = birthDate.replace(/-/g, '');
            if (cleanDate.length !== 8) {
                this.popupService.showError("Helytelen dátumformátum (ÉÉÉÉ-HH-NN)");
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
                    this.popupService.showError("Hibás dátum az adott hónapban");
                    this.birthDateValid = false;
                }
            }
        }
        return this.birthDateValid;
    }

    validatePassword(password: string): boolean {
        this.passwordValid = true;
        if (!password || password.trim() === "") {
            this.popupService.showError("Hiányzó jelszó");
            this.passwordValid = false;
        } else if (password.length < 8) {
            this.popupService.showError("Legalább 8 karakter");
            this.passwordValid = false;
        } else {
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*(),.?":{}|<>]*$/;
            if (!passwordPattern.test(password)) {
                this.popupService.showError("Minimum 1 nagybetű, 1 kisbetű, és 1 szám");
                this.passwordValid = false;
            }
        }
        return this.passwordValid;
    }

    validateUniversity(university: string): boolean {
        this.universityValid = true;
        if (!university || university.trim() === "") {
            this.popupService.showError("Válassz egy egyetemet!");
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
            this.popupService.showError("Válassz egy kart!");
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

    dateRangeValidator(control: AbstractControl): ValidationErrors | null {
        const startDate = control.get('startDate')?.value;
        const endDate = control.get('endDate')?.value;

        if (!startDate || !endDate) {
            return null;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        return end <= start ? { endDateBeforeStartDate: true } : null;
    }

    validateContact(contactInput: ContactInput, contactTypes: ContactType[]): boolean {
        if (!contactInput.value) {
            this.popupService.showError('Kérjük, add meg az elérhetőség értékét!');
            return false;
        }

        if (!contactInput.type) {
            this.popupService.showError('Kérjük, válassz elérhetőség típust!');
            return false;
        }

        const selectedContact = contactTypes.find(c => c.name === contactInput.type);

        if (selectedContact) {
            const escapedDomain = selectedContact.domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const linkPattern = new RegExp(`^${selectedContact.protocol}://${escapedDomain}/[\\w-_.~/?#[\\]@!$&'()*+,;=]*$`);

            if (!linkPattern.test(contactInput.value)) {
                this.popupService.showError(`Hibás ${selectedContact.name} link formátum!`);
                return false;
            }
        } else {
            this.popupService.showError('Kérjük, válassz elérhetőség típust!');
            return false;
        }
        return true;
    }
}
