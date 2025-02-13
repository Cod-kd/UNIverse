import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PopupService } from './popup-message.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private readonly adminUsername = 'admin';
  private readonly adminPassword = 'oneOfMyBestPasswords';

  constructor(
    private http: HttpClient,
    private router: Router,
    private popupService: PopupService
  ) { }

  fetchRegister(
    email: string,
    username: string,
    password: string,
    gender: string,
    birthDate: string,
    university: string,
    faculty: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(this.adminUsername + ':' + this.adminPassword),
      'Content-Type': 'application/json',
    });

    const nameIn = email.split('@')[0];

    const body = {
      emailIn: email,
      usernameIn: username,
      passwordIn: password,
      nameIn: nameIn,
      genderIn: gender === '1' ? true : false,
      birthDateIn: birthDate,
      facultyIn: faculty,
      universityNameIn: university,
      profilePictureExtensionIn: 'jpg',
    };

    return this.http
      .post('http://localhost:8080/user/registration', body, {
        headers,
        responseType: 'text',
      })
      .pipe(
        catchError((err) => {
          let errorMessage = 'Szerveroldali hiba';
          if (err.status === 409) {
            errorMessage = 'Foglalt felhasználónév vagy email!';
          }
          this.popupService.show(errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  handleRegisterResponse(response: any, registrationData: any) {
    console.log('Registration successful', response);
    this.router.navigate(['/get-unicard'], {
      state: { userData: registrationData },
    });
  }

  handleError(err: any) {
    this.popupService.show(err.message);
  }
}
