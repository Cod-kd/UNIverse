// guards/non-auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const rootGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Redirect to main-site if already logged in
  return authService.getLoginStatus() ? router.navigate(['/main-site']) : true;
};