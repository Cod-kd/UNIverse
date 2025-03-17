import { Injectable, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subscription, throwError, of } from 'rxjs';
import { catchError, filter, finalize, timeout, retry, tap } from 'rxjs/operators';
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
      .subscribe(() => this.validateServerAuthentication());

    this.authSubscription = this.authService.hasToken$.subscribe(hasToken => {
      if (hasToken) {
        this.validateServerAuthentication();
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
    this.authService.stopPolling();
  }

  private validateServerAuthentication(): void {
    const credentials = this.authService.getStoredCredentials();
    if (credentials) {
      this.loadingService.show();
      this.fetchLogin(credentials.username, credentials.password, false)
        .pipe(
          timeout(15000),
          retry(1),
          finalize(() => this.loadingService.hide()),
          catchError(() => {
            this.authService.logout();
            this.router.navigate(['/UNIcard-login']);
            this.popupService.showError('Sikertelen autentikáció!');
            return throwError(() => new Error('Sikertelen szerver autentikáció!'));
          })
        )
        .subscribe({
          next: (token: string) => {
            localStorage.setItem("token", token);

            this.fetchUserId(credentials.username).subscribe({
              next: (userId) => {
                localStorage.setItem("userId", userId);
              }
            });
          }
        });
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
      tap(token => {
        if (token) {
          localStorage.setItem('token', token);
        }
      }),
      finalize(() => {
        if (showErrors) this.loadingService.hide();
      })
    );
  }

  fetchUserId(username: string): Observable<string> {
    return this.fetchService.get<string>(`/user/id`, {
      responseType: 'text',
      params: { username },
      authType: AuthType.JWT
    });
  }

  async handleLoginResponse(credentials: any) {
    try {
      this.authService.login(credentials.username, credentials.password);
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
              localStorage.setItem("userId", userId);
            }
            this.router.navigate(["/main-site"], { state: { credentials } });
          }
        });
    } catch {
      this.popupService.showError('Sikertelen bejelentkezés!');
      this.loadingService.hide();
    }
  }
}