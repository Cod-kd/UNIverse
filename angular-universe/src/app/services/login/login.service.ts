import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PopupService } from '../popup-message/popup-message.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly adminUsername = "admin";
  private readonly adminPassword = "oneOfMyBestPasswords";

  constructor(
    private http: HttpClient,
    private router: Router,
    private popupService: PopupService,
    private authService: AuthService
  ) { }

  fetchLogin(loginUsername: string, loginPassword: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.adminUsername + ':' + this.adminPassword),
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
        this.popupService.show(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  async handleLoginResponse(credentials: any) {
    this.authService.login();
    localStorage.setItem("username", credentials.username);
    localStorage.setItem("password", credentials.password);

    const animationDiv = document.querySelector('#animationDiv');
    animationDiv?.classList.add('active-animation');
    await new Promise(resolve => setTimeout(resolve, 5000));
    animationDiv?.classList.remove('active-animation');
    this.router.navigate(["/main-site"], { state: { credentials } });
  }

  handleError(err: any) {
    this.popupService.show(err.message);
  }
}