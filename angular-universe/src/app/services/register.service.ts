import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient, private router: Router) { }

  fetchRegister(
    email: string, 
    username: string, 
    password: string, 
    gender: string, 
    birthDate: string, 
    university: string, 
    faculty: string
  ): Observable<any> {
    const adminUsername = "admin";
    const adminPassword = "oneOfMyBestPasswords";

    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(adminUsername + ':' + adminPassword),
      'Content-Type': 'application/json'
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
      profilePictureExtensionIn: "jpg"
    };

    return this.http.post('http://localhost:8080/user/registration', body, {
      headers,
      responseType: 'text'
    }).pipe(
      catchError(err => {
        if (err.status === 409) {
          return throwError(() => new Error("Foglalt felhasználónév vagy email!"));
        } else {
          return throwError(() => new Error("Szerveroldali hiba"));
        }
      })
    );
  }

  handleRegisterResponse(response: any, registrationData: any) {
    console.log('Registration successful', response);
    this.router.navigate(['/get-unicard'], {
      state: { userData: registrationData }
    });
  }

  handleError(err: any) {
    console.error(err.message);
  }
}
