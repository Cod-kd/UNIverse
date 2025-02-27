import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PopupService } from '../popup-message/popup-message.service';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private popupService: PopupService,
    private authService: AuthService
  ) { }

  fetchLogin(loginUsername: string, loginPassword: string): Observable<any> {
    const body = {
      usernameIn: loginUsername,
      passwordIn: loginPassword,
    };

    return this.http.post(`${this.baseUrl}/user/login`, body, {
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

  fetchUserId(username: string) {
    return this.http.get(`${this.baseUrl}/user/id?username=${username}`, {
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

    this.fetchUserId(credentials.username).subscribe({
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