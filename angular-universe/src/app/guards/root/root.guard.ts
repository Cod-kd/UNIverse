import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

export const rootGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return await authService.getLoginStatus() ? router.navigate(['/main-site']) : true;
};