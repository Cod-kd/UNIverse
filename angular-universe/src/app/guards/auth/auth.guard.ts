import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { from, catchError, of, switchMap } from 'rxjs'; // Add switchMap here
import { AuthService } from '../../services/auth/auth.service';
import { LoginService } from '../../services/login/login.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const loginService = inject(LoginService);
  const router = inject(Router);

  return from(authService.getLoginStatus()).pipe(
    switchMap((isLoggedIn: boolean) => { // Explicitly define type
      if (!isLoggedIn) {
        return from(router.navigate(['/UNIcard-login']));
      }

      return from(authService.getStoredCredentials()).pipe(
        switchMap((credentials) => {
          if (!credentials) {
            return from(router.navigate(['/UNIcard-login']));
          }

          return loginService.fetchLogin(
            credentials.username,
            credentials.password,
            false
          ).pipe(
            catchError(() => {
              authService.logout();
              return from(router.navigate(['/UNIcard-login']));
            })
          );
        })
      );
    })
  );
};
