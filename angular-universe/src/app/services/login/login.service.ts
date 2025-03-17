import { Injectable, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { catchError, filter, finalize, timeout } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { FetchService, AuthType } from '../fetch/fetch.service';
import { LoadingService } from '../loading/loading.service';
import { PopupService } from '../popup-message/popup-message.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnDestroy {
  private authSubscription: Subscription;
  private routerSubscription: Subscription;

  constructor(
    private fetchService: FetchService,
    private router: Router,
    private authService: AuthService,
    private loadingService: LoadingService,
    private popupService: PopupService
  ) {
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart && event.url === '/main-site')
      )
      .subscribe(() => this.validateLocalAuthentication());

    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.validateLocalAuthentication();
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
    this.authService.stopPolling();
  }

  private validateLocalAuthentication(): void {
    const username = this.authService.getUsername();
    const token = this.authService.getToken();
    const userId = this.authService.getUserId();

    if (!username || !token || !userId) {
      this.authService.logout();
      this.router.navigate(['/UNIcard-login']);
      this.popupService.showError('Hiányzó bejelentkezési adatok!');
      return;
    }
  }

  fetchLogin(loginUsername: string, loginPassword: string, showErrors = true): Observable<string> {
    const body = {
      usernameIn: loginUsername,
      passwordIn: loginPassword,
    };

    if (showErrors) this.loadingService.show();

    return this.fetchService.post<string>('/auth/login', body, {
      responseType: 'text',
      showError: showErrors,
      authType: AuthType.NONE
    }).pipe(
      finalize(() => {
        if (showErrors) this.loadingService.hide();
      })
    );
  }

  fetchUserId(username: string): Observable<string> {
    return this.fetchService.get<string>(`/user/id`, {
      responseType: 'text',
      params: { username },
      authType: AuthType.NONE
    });
  }

  handleLoginResponse(credentials: any, token: string) {
    try {
      this.loadingService.show();

      this.fetchUserId(credentials.username)
        .pipe(
          timeout(10000),
          catchError(() => {
            this.popupService.showError('Érvénytelen azonosító!');
            return of('');
          }),
          finalize(() => this.loadingService.hide())
        )
        .subscribe({
          next: (userId) => {
            if (userId) {
              this.authService.login(credentials.username, token, userId);
              this.router.navigate(["/main-site"]);
            } else {
              this.popupService.showError('Hiányzó felhasználói azonosító!');
            }
          }
        });
    } catch {
      this.popupService.showError('Sikertelen bejelentkezés!');
      this.loadingService.hide();
    }
  }
}