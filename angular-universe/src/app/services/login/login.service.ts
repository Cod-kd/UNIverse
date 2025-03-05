import { Injectable, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError, filter, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { FetchService } from '../fetch/fetch.service';
import { LoadingService } from '../loading/loading.service';

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
  ) {
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart && event.url === '/main-site')
      )
      .subscribe(() => this.validateServerAuthentication());

    this.authSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
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
          switchMap(() => this.fetchUserId(credentials.username)),
          finalize(() => this.loadingService.hide()),
          catchError(() => {
            this.authService.logout();
            this.router.navigate(['/UNIcard-login']);
            return throwError(() => new Error('Server authentication failed'));
          })
        )
        .subscribe({
          next: (userId) => {
            localStorage.setItem("userId", userId);
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
      },
      error: () => { }
    });
    this.router.navigate(["/main-site"], { state: { credentials } });
  }
}