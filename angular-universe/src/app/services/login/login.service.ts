import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PopupService } from '../popup-message/popup-message.service';
import { AuthService } from '../auth/auth.service';
import { FetchService } from '../fetch/fetch.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private fetchService: FetchService,
    private router: Router,
    private popupService: PopupService,
    private authService: AuthService
  ) { }

  fetchLogin(loginUsername: string, loginPassword: string): Observable<string> {
    const body = {
      usernameIn: loginUsername,
      passwordIn: loginPassword,
    };

    return this.fetchService.post<string>('/user/login', body, {
      responseType: 'text'
    });
  }

  fetchUserId(username: string): Observable<string> {
    return this.fetchService.get<string>(`/user/id`, {
      responseType: 'text',
      params: { username }
    });
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