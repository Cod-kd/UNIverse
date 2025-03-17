import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check auth status first
  if (!authService.getAuthStatus()) {
    return router.navigate(['/UNIcard-login']);
  }

  // Check if token exists in localStorage
  const token = localStorage.getItem('token');
  if (!token) {
    authService.logout();
    return router.navigate(['/UNIcard-login']);
  }

  // Token exists, allow navigation
  return true;
};