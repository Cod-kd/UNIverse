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

  fetchUserId(url: string) {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.adminUsername + ':' + this.adminPassword),
      'Content-Type': 'application/json'
    });

    return this.http.get(url, {
      headers,
      responseType: 'text'
    }).pipe(
      catchError(() => {
        let errorMessage = "Szerveroldali hiba";
        this.popupService.show(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  async handleLoginResponse(credentials: any) {
    localStorage.setItem("username", credentials.username);

    this.fetchUserId(`http://localhost:8080/user/id?username=${credentials.username}`).subscribe({
      next: (userId) => {
        localStorage.setItem("userId", userId);
      },
      error: (err) => {
        this.popupService.show("Error fetching user ID:", err);
      }
    });

    this.authService.login();
    this.router.navigate(["/main-site"], { state: { credentials } });
  }


  handleError(err: any) {
    this.popupService.show(err.message);
  }
}