import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { LoginService } from '../../services/login/login.service';
import { catchError, of } from 'rxjs';

export const authGuard = () => {
  const authService = inject(AuthService);
  const loginService = inject(LoginService);
  const router = inject(Router);

  // Check stored login status first
  if (!authService.getLoginStatus()) {
    return router.navigate(['/UNIcard-login']);
  }

  // Additional server-side validation
  return loginService.fetchLogin(
    authService.getStoredCredentials()?.username || '',
    authService.getStoredCredentials()?.password || '',
    false
  ).pipe(
    // If login validation succeeds, allow access
    catchError(() => {
      // Force logout on validation failure
      authService.logout();
      return of(router.navigate(['/UNIcard-login']));
    })
  );
};