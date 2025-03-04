import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, finalize } from 'rxjs';
import { PopupService } from '../popup-message/popup-message.service';
import { AuthService } from '../auth/auth.service';
import { FetchService } from '../fetch/fetch.service';
import { LoadingService } from '../loading/loading.service';
import { ThemeService } from '../theme/theme.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnDestroy {
  private authSubscription: Subscription;

  constructor(
    private fetchService: FetchService,
    private router: Router,
    private popupService: PopupService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private themeService: ThemeService
  ) {
    this.tryAutoLogin();
    this.authSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.validateStoredCredentials();
      }
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
        next: () => {
          const userId = localStorage.getItem('userId');
          if (userId) this.themeService.setUser(userId);
        },
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

    if (showErrors) this.loadingService.show();

    return this.fetchService.post<string>('/user/login', body, {
      responseType: 'text',
      showError: showErrors
    }).pipe(
      finalize(() => {
        if (showErrors) this.loadingService.hide();
      })
    );
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
      next: (userId) => {
        localStorage.setItem("userId", userId);
        this.themeService.setUser(userId);
      },
      error: () => { }
    });

    this.router.navigate(["/main-site"], { state: { credentials } });
  }

  handleError(err: any) {
    this.loadingService.hide();
    this.popupService.show(err.message);
  }
}