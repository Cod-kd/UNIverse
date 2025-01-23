import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router) { }

  fetchLogin(loginUsername: string, loginPassword: string): Observable<any> {
    const username = "admin";
    const password = "oneOfMyBestPasswords";

    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json'
    });

    const body = {
      usernameIn: loginUsername,
      passwordIn: loginPassword,
    };

    return this.http.post('http://localhost:8080/user/login', body, {
      headers,
      responseType: 'text'
    }).pipe(
      catchError(err => {
        let errorMessage = "Szerveroldali hiba";
        if (err.status === 409) {
          errorMessage = "Hibás felhasználónév vagy jelszó!";
        }

        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  handleLoginResponse(response: any, credentials: any) {
    console.log('Login successful', response);
    this.router.navigate(["/main-site"], {
      state: { credentials }
    });
  }

  handleError(err: any) {
    console.error(err.message);
  }
}
