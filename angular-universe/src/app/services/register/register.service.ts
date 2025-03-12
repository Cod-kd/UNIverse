import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, timeout, finalize } from 'rxjs/operators';
import { LoadingService } from '../loading/loading.service';
import { FetchService } from '../fetch/fetch.service';
import { PopupService } from '../popup-message/popup-message.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(
    private fetchService: FetchService,
    private router: Router,
    private loadingService: LoadingService,
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

    this.loadingService.show();

    return this.fetchService.post('/user/registration', body, {
      responseType: 'text'
    }).pipe(
      timeout(20000),
      tap(response => {
        this.popupService.showSuccess(response as string);
      }),
      catchError(error => {
        return throwError(() => error);
      }),
      tap(() => localStorage.removeItem('registrationFormData')),
      finalize(() => this.loadingService.hide())
    );
  }

  async handleRegisterResponse(response: string, registrationData: any) {
    try {
      this.router.navigate(['/get-unicard'], {
        state: {
          message: response,
          userData: registrationData
        },
      });
    } catch (error) {
      this.popupService.showError('Sikeres regisztráció, sikertelen átirányítás!');
      this.router.navigate(['/UNIcard-login']);
    }
  }
}