import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PopupService } from '../popup-message/popup-message.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private popupService: PopupService
  ) { }

  fetchRegister(
    email: string,
    username: string,
    fullName: string,
    password: string,
    gender: string,
    birthDate: string,
    university: string,
    faculty: string
  ): Observable<any> {
    const body = {
      emailIn: email,
      usernameIn: username,
      passwordIn: password,
      nameIn: fullName,
      genderIn: gender === '1' ? true : gender === '0' ? false : null,
      birthDateIn: birthDate,
      facultyIn: faculty,
      universityNameIn: university,
      profilePictureExtensionIn: 'jpg',
    };

    return this.http
      .post(`${this.baseUrl}/user/registration`, body, {
        responseType: 'text',
      })
      .pipe(
        tap(() => {
          localStorage.removeItem('registrationFormData');
        }),
        catchError((err) => {
          let errorMessage = 'Szerveroldali hiba';
          if (err.status === 409) {
            errorMessage = 'Foglalt felhasználónév vagy e-mail!';
          }
          this.popupService.show(errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  async handleRegisterResponse(registrationData: any) {
    this.router.navigate(['/get-unicard'], {
      state: { userData: registrationData },
    });
  }

  handleError(err: any) {
    this.popupService.show(err.message);
  }
}