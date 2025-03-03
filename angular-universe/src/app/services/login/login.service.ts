import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { PopupService } from '../popup-message/popup-message.service';
import { AuthService } from '../auth/auth.service';
import { FetchService } from '../fetch/fetch.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnDestroy {
  private authSubscription: Subscription;
  
  constructor(
    private fetchService: FetchService,
    private router: Router,
    private popupService: PopupService,
    private authService: AuthService
  ) {
    this.tryAutoLogin();
    
    this.authSubscription = this.authService.isLoggedIn$.subscribe(() => {
      this.validateStoredCredentials();
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
    this.authService.stopPolling();
  }

  private validateStoredCredentials(): void {
    const credentials = this.authService.getStoredCredentials();
    
    if (credentials) {
      this.fetchLogin(credentials.username, credentials.password, false).subscribe({
        next: () => {},
        error: () => this.authService.logout()
      });
    }
  }

  private tryAutoLogin(): void {
    const credentials = this.authService.getStoredCredentials();
    
    if (credentials && localStorage.getItem('isLoggedIn') === 'true') {
      this.fetchLogin(credentials.username, credentials.password, false).subscribe({
        next: () => this.handleLoginResponse({ username: credentials.username }),
        error: () => this.authService.logout()
      });
    }
  }

  fetchLogin(loginUsername: string, loginPassword: string, showErrors = true): Observable<string> {
    const body = {
      usernameIn: loginUsername,
      passwordIn: loginPassword,
    };

    return this.fetchService.post<string>('/user/login', body, {
      responseType: 'text',
      showError: showErrors
    });
  }

  fetchUserId(username: string): Observable<string> {
    return this.fetchService.get<string>(`/user/id`, {
      responseType: 'text',
      params: { username }
    });
  }

  async handleLoginResponse(credentials: any) {
    this.authService.login(credentials.username, credentials.password);
    
    this.fetchUserId(credentials.username).subscribe({
      next: (userId) => localStorage.setItem("userId", userId),
      error: () => {}
    });

    this.router.navigate(["/main-site"], { state: { credentials } });
  }

  handleError(err: any) {
    this.popupService.show(err.message);
  }
}