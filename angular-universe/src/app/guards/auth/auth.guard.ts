import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { LoginService } from '../../services/login/login.service';
import { catchError, of } from 'rxjs';

export const authGuard = () => {
  const authService = inject(AuthService);
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (!authService.getLoginStatus()) {
    return router.navigate(['/UNIcard-login']);
  }

  return loginService.fetchLogin(
    authService.getStoredCredentials()?.username || '',
    authService.getStoredCredentials()?.password || '',
    false
  ).pipe(
    catchError(() => {
      authService.logout();
      return of(router.navigate(['/UNIcard-login']));
    })
  );
};