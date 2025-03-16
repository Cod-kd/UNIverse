import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription} from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { FetchService } from '../fetch/fetch.service';
import { LoadingService } from '../loading/loading.service';
import { PopupService } from '../popup-message/popup-message.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnDestroy {
  private authSubscription: Subscription;

  constructor(
    private fetchService: FetchService,
    private router: Router,
    private authService: AuthService,
    private loadingService: LoadingService,
    private popupService: PopupService
  ) {
    this.authSubscription = this.authService.isLoggedIn$.subscribe();
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  // login.service.ts - simplified fix
  // login.service.ts
  fetchLogin(username: string, password: string, showErrors = true): Observable<string> {
    const body = { usernameIn: username, passwordIn: password };
    if (showErrors) this.loadingService.show();

    return this.fetchService.post<string>('/auth/login', body, {
      responseType: 'text', // Get raw JWT token as text
      showError: showErrors
    }).pipe(
      finalize(() => showErrors && this.loadingService.hide())
    );
  }

  async handleLoginResponse(credentials: { username: string, password: string }) {
    try {
      this.loadingService.show();
      this.authService.storeCredentialsTemporarily(credentials.username, credentials.password);

      this.fetchLogin(credentials.username, credentials.password)
        .subscribe({
          next: (token: string) => {
            // Extract userId from token payload
            const payload = JSON.parse(atob(token.split('.')[1]));
            // Just store the token and userId
            this.authService.login(token, payload.userId.toString());
            this.router.navigate(["/main-site"]);
          },
          error: () => {
            this.popupService.showError('Sikertelen bejelentkezés!');
            this.authService.clearStoredCredentials();
          },
          complete: () => this.loadingService.hide()
        });
    } catch (error) {
      this.popupService.showError('Sikertelen bejelentkezés!');
      this.authService.clearStoredCredentials();
      this.loadingService.hide();
    }
  }
}