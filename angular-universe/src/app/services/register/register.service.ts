import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoadingService } from '../loading/loading.service';
import { FetchService } from '../fetch/fetch.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(
    private fetchService: FetchService,
    private router: Router,
    private loadingService: LoadingService
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
      responseType: 'text',
      showError: true,
      customErrorMessage: 'Szerveroldali hiba'
    }).pipe(
      tap(() => localStorage.removeItem('registrationFormData')),
      tap({ finalize: () => this.loadingService.hide() })
    );
  }

  async handleRegisterResponse(registrationData: any) {
    this.router.navigate(['/get-unicard'], {
      state: { userData: registrationData },
    });
  }
}